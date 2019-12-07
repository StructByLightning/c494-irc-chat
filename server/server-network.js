const uuid = require("./uuid");
const database = require("./database")
const https = require('https');
const fs = require('fs');


module.exports = class ServerNetwork {
  constructor() {
    this.actions = {
      REQUEST_CONNECTION: this.handleRequestConnection,
      REQUEST_JOIN_ROOM: this.handleJoinRoom,
      REQUEST_LEAVE_ROOM: this.handleLeaveRoom,
      REQUEST_CREATE_ROOM: this.handleCreateRoom,
      REQUEST_SEND_MESSAGE: this.handleSendMessage,
    };

    this.responses = {
      REQUEST_CONNECTION_FINISHED: (clientId, payload) => { return { clientId, payload, type: "REQUEST_CONNECTION_FINISHED" } },
      REQUEST_JOIN_ROOM_FINISHED: (clientId, payload) => { return { clientId, payload, type: "REQUEST_JOIN_ROOM_FINISHED" } },
      REQUEST_LEAVE_ROOM_FINISHED: (clientId, payload) => { return { clientId, payload, type: "REQUEST_LEAVE_ROOM_FINISHED" } },
      REQUEST_CLIENT_JOINED_ROOM: (clientId, payload) => { return { clientId, payload, type: "REQUEST_CLIENT_JOINED_ROOM" } },
      REQUEST_CLIENT_LEFT_ROOM: (clientId, payload) => { return { clientId, payload, type: "REQUEST_CLIENT_LEFT_ROOM" } },
      REQUEST_CREATE_ROOM_FINISHED: (clientId, payload) => { return { clientId, payload, type: "REQUEST_CREATE_ROOM_FINISHED" } },
      REQUEST_SEND_MESSAGE_FINISHED: (clientId, payload) => { return { clientId, payload, type: "REQUEST_SEND_MESSAGE_FINISHED" } }
    };

    this.sockets = {};
  }

  listen = () => {
    //hack to maintain synchronization between restarts
    database.deleteAllClients();

    const server = https.createServer({
      cert: fs.readFileSync('/etc/letsencrypt/live/inscriptionserial.com/cert.pem'),
      key: fs.readFileSync('/etc/letsencrypt/live/inscriptionserial.com/privkey.pem')
    });
    //const certificate = fs.readFileSync('/etc/letsencrypt/live/inscriptionserial.com/cert.pem', 'utf8');

    const WebSocket = require("ws");
    const wss = new WebSocket.Server({ server });

    //for all connections, hash into the actions object and execute the appropriate function
    wss.on("connection", socket => {
      socket.on("message", message => {
        const data = JSON.parse(message);

        if (!data.clientId) {
          data.clientId = uuid();
        }
        this.sockets[data.clientId] = socket;

        if (this.actions[data.type]) {
          console.log("Received", data.type);
          this.actions[data.type](data.clientId, data.payload);
        } else {
          console.log("Unknown message of type", data.type);
        }
      });
      socket.on("error", error => {
        console.log(error);
      })
      socket.on("close", message => {
        for (const [key, value] of Object.entries(this.sockets)) {
          if (value === socket) {
            this.deleteClient(key);
          }
        }
      })
    });

    server.listen(8080, () => {
      console.log("IRC server started (port 8080)");
    });
  }

  deleteClient(clientId) {
    let socket = this.sockets[clientId];

    database.getRoomsByClientId(clientId).then((rooms) => {
      for (let i = 0; i < rooms.length; i++) {
        database.getClientsByRoomId(rooms[i].roomId).then((clients) => {
          for (let j = 0; j < clients.length; j++) {
            this.send(this.responses.REQUEST_CLIENT_LEFT_ROOM(clients[j].clientId, {
              roomId: rooms[i].roomId,
              client: {
                clientId
              }
            }));
          }
        }).then(() => {
          database.deleteClient(clientId);
          console.log("Disconnected from", clientId)
        })
      }
    })


  }

  handleRequestConnection = (clientId, payload) => {
    return new Promise((resolve, reject) => {
      let name = "Anon#" + clientId.slice(0, 4);
      database.addClient(clientId, name).then(() => {
        return database.getAllRooms();
      }).then((rooms) => {
        this.send(this.responses.REQUEST_CONNECTION_FINISHED(clientId, {
          clientName: name,
          rooms
        }))
      }).then(() => {
        resolve();
      })
    });
  }

  handleJoinRoom = (clientId, payload) => {
    return new Promise((resolve, reject) => {
      database.addClientToRoom(clientId, payload.roomId).then(() => {
        return database.getClientsById(clientId);
      }).then((joinedClients) => {
        database.getMessagesInRoom(payload.roomId).then((messages) => {
          database.getClientsInRoom(payload.roomId).then((clientsInRoom) => {
            this.send(this.responses.REQUEST_JOIN_ROOM_FINISHED(clientId, {
              roomId: payload.roomId,
              clients: clientsInRoom,
              messages
            }));

            //notify all the clients currently in the room that a new one joined
            for (let i = 0; i < clientsInRoom.length; i++) {
              if (clientsInRoom[i].clientId != clientId) {
                this.send(this.responses.REQUEST_CLIENT_JOINED_ROOM(clientsInRoom[i].clientId, {
                  roomId: payload.roomId,
                  client: {
                    clientId,
                    clientName: joinedClients[0].clientName
                  }
                }));
              }
            }
          })
        });
      }).then(() => {
        resolve();
      })
    });
  }

  handleCreateRoom = (clientId, payload) => {
    return new Promise((resolve, reject) => {
      let newRoom = {
        roomId: uuid(),
        roomName: payload.roomName,
        ephemeral: payload.ephemeral
      }

      database.addRoom(newRoom).then(() => {
        this.sendAll(this.responses.REQUEST_CREATE_ROOM_FINISHED(clientId, { newRoom }))
      }).then(() => {
        resolve();
      });
    })
  }

  handleLeaveRoom = (clientId, payload) => {
    return new Promise((resolve, reject) => {
      database.removeClientFromRoom(clientId, payload.roomId).then(() => {
        database.getClientsInRoom(payload.roomId).then((clientsInRoom) => {
          this.send(this.responses.REQUEST_LEAVE_ROOM_FINISHED(clientId, {
            roomId: payload.roomId
          })).then(() => {

            //notify all the clients currently in the room that the client left
            for (let i = 0; i < clientsInRoom.length; i++) {
              if (clientsInRoom[i].clientId != clientId) {
                this.send(this.responses.REQUEST_CLIENT_LEFT_ROOM(clientsInRoom[i].clientId, {
                  roomId: payload.roomId,
                  client: {
                    clientId
                  }
                }));
              }
            }

            resolve();
          });
        });
      });
    });
  }

  handleSendMessage = (clientId, payload) => {
    return new Promise((resolve, reject) => {
      let newMessage = {
        roomId: payload.message.roomId,
        ownerId: payload.message.ownerId,
        ownerName: payload.message.ownerName,
        messageId: uuid(),
        content: payload.message.content,
        timestamp: new Date().getTime()
      }

      database.getRoomByRoomId(newMessage.roomId).then((rooms) => {
        console.log(rooms);
        if (rooms[0].ephemeral === "true") {
          console.log("ephemeral");
          database.getClientsInRoom(newMessage.roomId).then((clientsInRoom) => {
            for (let i = 0; i < clientsInRoom.length; i++) {
              this.send(this.responses.REQUEST_SEND_MESSAGE_FINISHED(clientsInRoom[i].clientId, {
                message: newMessage
              }));
            }
          }).then(() => {
            resolve();
          });
        } else {
          console.log("persistent");
          database.addMessage(newMessage).then(() => {
            database.getClientsInRoom(newMessage.roomId).then((clientsInRoom) => {
              for (let i = 0; i < clientsInRoom.length; i++) {
                this.send(this.responses.REQUEST_SEND_MESSAGE_FINISHED(clientsInRoom[i].clientId, {
                  message: newMessage
                }));
              }
            }).then(() => {
              resolve();
            });
          })
        }
      })

    });
  }

  send = (response) => {
    return new Promise((resolve, reject) => {
      let socket = this.sockets[response.clientId];
      if ((socket) && (socket.readyState === socket.OPEN)) {
        socket.send(JSON.stringify({
          error: null,
          meta: { clientId: response.clientId },
          type: response.type,
          payload: response.payload
        }));
      } else if (this.sockets[response.clientId]) {
        delete this.sockets[response.clientId];
      }
      resolve();
    })
  }
  sendAll = (response) => {
    return new Promise((resolve, reject) => {
      for (const [clientId, socket] of Object.entries(this.sockets)) {
        if ((socket) && (socket.readyState === socket.OPEN)) {
          socket.send(JSON.stringify({
            error: null,
            meta: { clientId: response.clientId },
            type: response.type,
            payload: response.payload
          }));
        } else if (socket) {
          this.deleteClient(clientId);
        }
      }
      resolve();
    })
  }
};
