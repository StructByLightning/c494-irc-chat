const sqlite3 = require("sqlite3").verbose();

class Database {
  constructor() {
    this.dbconnection = new sqlite3.Database("./server/data.db");
  }

  addClient = (clientId, clientName) => {
    return new Promise((resolve, reject) => {
      this.dbconnection.all(`
        INSERT INTO 
          clients (clientId, clientName) 
        VALUES 
          (?, ?) 
      `, [clientId, clientName], (error, rows) => {
        this.handleResult(error, rows, resolve, reject)
      });
    });
  }

  getAllRooms = () => {
    return new Promise((resolve, reject) => {
      this.dbconnection.all(`
        SELECT 
          *  
        FROM 
          rooms 
      `, [], (error, rows) => {
        this.handleResult(error, rows, resolve, reject);
      });
    });
  }


  getRoomsByClientId = (clientId) => {
    return new Promise((resolve, reject) => {
      this.dbconnection.all(`
      SELECT 
        *  
      FROM 
        clientInRoom
      WHERE
        clientId = ? 
    `, [clientId], (error, rows) => {
        this.handleResult(error, rows, resolve, reject);
      });
    });
  }
  getClientsById = (clientId) => {
    return new Promise((resolve, reject) => {
      this.dbconnection.all(`
      SELECT
        *
      FROM
        clients
      WHERE
        clientId = ?
    `, [clientId], (error, rows) => {
        this.handleResult(error, rows, resolve, reject);
      });
    });
  }


  getClientsByRoomId = (roomId) => {
    return new Promise((resolve, reject) => {
      this.dbconnection.all(`
      SELECT
        c.clientId,
        c.clientName
      FROM
        clientInRoom cir,
        clients c
      WHERE
        c.clientId = cir.clientId
        AND cir.roomId = ?
    `, [roomId], (error, rows) => {
        this.handleResult(error, rows, resolve, reject);
      });
    });
  }

  addClientToRoom = (clientId, roomId) => {
    return new Promise((resolve, reject) => {
      this.dbconnection.all(`
      INSERT INTO 
        clientInRoom (clientId, roomId)
      VALUES (?, ?)
    `, [clientId, roomId], (error, rows) => {
        this.handleResult(error, rows, resolve, reject);
      })
    });
  }

  deleteAllClients = () => {
    return new Promise((resolve, reject) => {
      this.truncateClients().then(() => {
        this.truncateClientInRoom();
      }).then(() => {
        resolve();
      });
    });

  }

  deleteClient = (clientId) => {
    return new Promise((resolve, reject) => {
      this.deleteFromClientsByClientId(clientId).then(() => {
        this.deleteFromClientInRoomByClientId(clientId);
      }).then(() => {
        resolve();
      });
    });
  }

  deleteFromClientsByClientId = (clientId) => {
    return new Promise((resolve, reject) => {
      this.dbconnection.all(`
      DELETE FROM 
        clients
      WHERE
        clientId = ?
    `, [clientId], (error, rows) => {
        this.handleResult(error, rows, resolve, reject);
      });
    });
  }
  truncateClients = () => {
    return new Promise((resolve, reject) => {
      this.dbconnection.all(`
      DELETE FROM 
        clients
    `, [], (error, rows) => {
        this.handleResult(error, rows, resolve, reject);
      });
    });
  }

  deleteFromClientInRoomByClientId = (clientId) => {
    return new Promise((resolve, reject) => {
      this.dbconnection.all(`
      DELETE FROM 
        clientInRoom
      WHERE
        clientId = ?
    `, [clientId], (error, rows) => {
        this.handleResult(error, rows, resolve, reject);
      });
    });
  }
  truncateClientInRoom = () => {
    return new Promise((resolve, reject) => {
      this.dbconnection.all(`
      DELETE FROM 
        clientInRoom
    `, [], (error, rows) => {
        this.handleResult(error, rows, resolve, reject);
      });
    });
  }



  addRoom = (room) => {
    return new Promise((resolve, reject) => {
      this.dbconnection.all(`
      INSERT INTO 
        rooms (roomId, roomName, ephemeral)
      VALUES (?, ?, ?)
    `, [room.roomId, room.roomName, "" + room.ephemeral], (error, rows) => {
        this.handleResult(error, rows, resolve, reject);
      });
    });
  }
  addMessage = (message) => {
    return new Promise((resolve, reject) => {
      this.dbconnection.all(`
        INSERT INTO 
          messages (messageId, roomId, ownerId, ownerName, content, timestamp)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [
        message.messageId,
        message.roomId,
        message.ownerId,
        message.ownerName,
        message.content,
        message.timestamp
      ], (error, rows) => {
        this.handleResult(error, rows, resolve, reject);
      });
    });
  }

  getMessagesInRoom = (roomId) => {
    return new Promise((resolve, reject) => {
      this.dbconnection.all(`
      SELECT
        * 
      FROM
        messages
      WHERE
        roomId = ?
    `, [roomId], (error, rows) => {
        this.handleResult(error, rows, resolve, reject);
      });
    });

  }

  getRoomByRoomId = (roomId) => {
    return new Promise((resolve, reject) => {
      this.dbconnection.all(`
      SELECT
        * 
      FROM
        rooms
      WHERE
        roomId = ?
    `, [roomId], (error, rows) => {
        this.handleResult(error, rows, resolve, reject);
      });
    });

  }
  removeClientFromRoom = (clientId, roomId) => {
    return new Promise((resolve, reject) => {
      this.dbconnection.all(`
      DELETE FROM
        clientInRoom
      WHERE
        clientId = ?
        AND roomId = ?
    `, [clientId, roomId], (error, rows) => {
        this.handleResult(error, rows, resolve, reject);
      });
    });
  }


  getClientsInRoom = (roomId) => {
    return new Promise((resolve, reject) => {
      this.dbconnection.all(`   
      SELECT DISTINCT
        c.clientId,
        c.clientName
      FROM
        clientInRoom cr,
        clients c
      WHERE
        cr.roomId=?
        AND c.clientId = cr.clientId
      `, [roomId], (error, rows) => {
        this.handleResult(error, rows, resolve, reject);
      });
    });

  }

  handleResult(error, rows, resolve, reject) {
    if (error) {
      console.log(error);
      reject(error);
    } else {
      resolve(rows);
    }
  }
}

const db = new Database();

module.exports = db;
