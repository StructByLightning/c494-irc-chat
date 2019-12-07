import React from 'react';
import "./specification.scss";
import Code from "views/components/Code/Code";
import Section from "views/components/Section/Section";
import HomeworkHeader from "views/components/HomeworkHeader/HomeworkHeader";

function Specification() {
  return (
    <div className="specification" role="main">
      <HomeworkHeader
        studentName="Resheet Schultz"
        course="CS494"
        dueDate="12/6/2019"
        title="IRC Project Spec"
        subtitle=""
        prof="Nirupama Bulusu"
        ta=""
        crn="10947"
      />
      <Section title="Introduction">
        <p>
          This document describes an IRC app which allows clients to communicate with each other. Each client connects to a central server and joins an arbitrary number of rooms. Clients can send messages to rooms, which will then be sent to all clients in the room.
        </p>
      </Section>

      <Section title="Conventions">
        <p>
          I didn't use any specific jargon. All words use their common definitions.
        </p>
      </Section>

      <Section title="Basic Information">
        <p>
          Communication takes place over TCP with WebSockets, which are a native feature in the browser and provided in Node via the <a href="https://www.npmjs.com/package/ws">ws</a> package. There are actually two servers present. The first one runs on port 3000 and acts as a typical Express webserver to serve the client webapp. The second one is the IRC server, which runs on port port 8080 and handles all of the messaging.
        </p>
        <p>
          Both servers run on Node, which automatically uses multithreading to handle async execution. Thus, while my server code appears single-threaded, it's actually highly concurrent. My client code is true single-threaded, which isn't a problem because the client never does any heavy work.
        </p>
        <p>
          Clients are expected to request the webapp from the webserver, which will then connect to the IRC server. If a connection cannot be established, the client will continue attempting to connect until it succeeds. Once the connection is opened, both the client and server can send messages through it at any time.
        </p>
      </Section>


      <Section title="Message infrastructure">
        <p>
          Messages are JSON objects that follow the Flux Standard Action design pattern. When the client receives a message, it immediately dispatches the Redux action associated with them. The actions then trigger reducers which modify the global app state, causing rerendering of the UI. All of this happens automatically, which makes it very easy to add new messages/actions. All messages have the following keys, and only these keys:
        </p>
        <ul>
          <li><b>type:</b> A string indicating what kind of message this is. Types come in the form of REQUEST_THING and REQUEST_THING_FINISHED.</li>
          <li><b>meta:</b> Contains any non-payload data, such as an id.</li>
          <li><b>error:</b> Set to true if the message represents an error.</li>
          <li><b>payload:</b> Contains any data.</li>
        </ul>

        <div class="message-type-grid">
          <div class="mt-subheader">REQUEST_CONNECTION / REQUEST_CONNECTION_FINISHED</div>
          <div class="mt-text">
            <p>
              A REQUEST_CONNECTION message is the first message sent to the server when the client loads. It indicates that the client wishes to connect to the server. After the server receives a REQUEST_CONNECTION message, it responds with REQUEST_CONNECTION_FINISHED. Meta must have a clientId and the payload must have a clientName and a list of rooms. The clientId is a unique identifier for the client, and the clientName is a human-readable username for the client. The list of rooms is an array of objects, where each object has the following keys: ephemeral, roomId, and roomName.
            </p>
          </div>
          <div class="mt-code">
            <Code>{`
              {
                type: "REQUEST_CONNECTION",
                meta: undefined,
                payload: undefined,
                error: false
              }
            `}</Code>
            <Code>{`
              {
                type: "REQUEST_CONNECTION_FINISHED",
                meta: {clientId},
                payload: {
                  clientName,
                  rooms:[
                    {
                      ephemeral,
                      roomId,
                      roomName
                    }
                  ]
                },
                error: false
              }
            `}</Code>
          </div>



          <div class="mt-subheader">REQUEST_JOIN_ROOM / REQUEST_JOIN_ROOM_FINISHED / REQUEST_CLIENT_JOINED_ROOM</div>
          <div class="mt-text">
            <p>
              A REQUEST_JOIN_ROOM is sent to the server to indicate that a client wishes to join a room. Its payload must contain the roomId to be joined. Then the server responds to the joining client with REQUEST_JOIN_ROOM_FINISHED and to all other clients in the room with REQUEST_CLIENT_JOINED_ROOM.
            </p>

            <p>
              The REQUEST_JOIN_ROOM_FINISHED meta must have the clientId and its payload must have a list of the clients in the room and a list of the messages in the room. Each client object should have a clientId and a clientName. Each message object should have a content, messageId, ownerId, ownerName, roomId, and timestamp. The content key contains the text of the message. The messageId is a guid. The ownerId is the guid of the client that sent the message. The ownerName is the username of the client that sent the message. The roomId is the guid of the room the message is visible in. The timestamp is when the message was sent.
            </p>
            <p>
              The REQUEST_CLIENT_JOINED_ROOM meta must have the clientId. Its payload should have a roomId and a client object. The client object must have the clientId and the clientName.
            </p>
          </div>
          <div class="mt-code">
            <Code>{`
              {
                type: "REQUEST_JOIN_ROOM",
                meta: undefined,
                payload: {roomId},
                error: false
              }
            `}</Code>
            <Code>{`
              {
                type: "REQUEST_JOIN_ROOM_FINISHED",
                meta: {clientId},
                payload: {
                  clients: [
                    {
                      clientId,
                      clientName
                    }
                  ],
                  messages: [
                    {
                      content,
                      messageId,
                      ownerId,
                      ownerName,
                      roomId,
                      timestamp
                    }
                  ]
                },
                error: false
              }
            `}</Code>
            <Code>{`
              {
                type: "REQUEST_CLIENT_JOINED_ROOM",
                meta: {clientId},
                payload: {
                  client: {
                    clientId,
                    clientName
                  },
                  roomId: 
                },
                error: false
              }
            `}</Code>
          </div>



          <div class="mt-subheader">REQUEST_LEAVE_ROOM / REQUEST_LEAVE_ROOM_FINISHED / REQUEST_CLIENT_LEFT_ROOM</div>
          <div class="mt-text">
            <p>
              A REQUEST_LEAVE_ROOM is sent to the server to indicate that a client wishes to leave a room. Its payload must contain the roomId to be left. Then the server responds to the leaving client with REQUEST_LEAVE_ROOM_FINISHED and to all other clients in the room with REQUEST_CLIENT_LEFT_ROOM.
            </p>

            <p>
              The REQUEST_LEAVE_ROOM_FINISHED meta must have the clientId and its payload must be the roomId of the room left.
            </p>
            <p>
              The REQUEST_CLIENT_LEFT_ROOM meta must have the clientId. Its payload should have a roomId and a client object. The client object must have the clientId.
            </p>
          </div>
          <div class="mt-code">
            <Code>{`
              {
                type: "REQUEST_LEAVE_ROOM",
                meta: undefined,
                payload: {roomId},
                error: false
              }
            `}</Code>
            <Code>{`
              {
                type: "REQUEST_LEAVE_ROOM_FINISHED",
                meta: {clientId},
                payload: {roomId},
                error: false
              }
            `}</Code>
            <Code>{`
              {
                type: "REQUEST_CLIENT_LEFT_ROOM",
                meta: {clientId},
                payload: {
                  client: {
                    clientId
                  },
                  roomId: 
                },
                error: false
              }
            `}</Code>
          </div>



          <div class="mt-subheader">REQUEST_CREATE_ROOM / REQUEST_CREATE_ROOM_FINISHED</div>
          <div class="mt-text">
            <p>
              A REQUEST_CREATE_ROOM is sent to the server to indicate that a client wishes to create a new room. Its payload must contain the roomName and the ephemeral boolean. Then the server responds to all clients with REQUEST_CREATE_ROOM_FINISHED.
            </p>

            <p>
              The REQUEST_CREATE_ROOM_FINISHED meta must have the clientId and its payload must contain the a newRoom object with the ephemeral boolean, the roomId, and the roomName.
            </p>
          </div>
          <div class="mt-code">
            <Code>{`
              {
                type: "REQUEST_CREATE_ROOM",
                meta: undefined,
                payload: {
                  ephemeral,
                  roomName
                },
                error: false
              }
            `}</Code>
            <Code>{`
              {
                type: "REQUEST_CREATE_ROOM_FINISHED",
                meta: {clientId},
                payload: {
                  newRoom: {
                    roomId,
                    ephemeral,
                    roomName
                  }
                },
                error: false
              }
            `}</Code>
          </div>



          <div class="mt-subheader">REQUEST_SEND_MESSAGE / REQUEST_SEND_MESSAGE_FINISHED</div>
          <div class="mt-text">
            <p>
              A REQUEST_SEND_MESSAGE is sent to the server to indicate that a client wishes to add a message to a room. Its payload must contain a message object, which has the following keys: content, ownerId, ownerName, and roomId. Content is the text content of the message. OwnerId is the guid of the client sending the message. OwnerName is the human-readable username of the client sending the message. RoomId is the guid of the room the message is being sent to.
          </p>

            <p>
              The server must then sent a REQUEST_SEND_MESSAGE_FINISHED to all clients in the room. REQUEST_SEND_MESSAGE_FINISHED has a meta with the clientId and a payload with a message object. This message object has the following keys: content, messageId, ownerId, ownerName, roomId, and timestamp. MessageId is a guid for the message. Timestamp is the time that the message was sent.
          </p>
          </div>
          <div class="mt-code">
            <Code>{`
            {
              type: "REQUEST_SEND_MESSAGE",
              meta: undefined,
              payload: {
                message: {
                  content,
                  ownerId,
                  ownerName,
                  roomId
                }
              },
              error: false
            }
          `}</Code>
            <Code>{`
            {
              type: "REQUEST_SEND_MESSAGE_FINISHED",
              meta: {clientId},
              payload: {
                message: {
                  content,
                  ownerId,
                  ownerName,
                  roomId,
                  timestamp,
                  messageId
                }
              },
              error: false
            }
          `}</Code>
          </div>
        </div>
      </Section>


      <Section title="Error handling">
        <p>
          While FSA messages have an error field, they are only present here for future extendability. My app doesn't use them. However, basic error handling is still present, just not through FSA messages. Instead, both the server and client add a callback to the socket that's called when the socket closes.
        </p>
        <p>
          When the client detects that the socket closed, it will notify the user and repeatedly attempt to reconnect. After reconnection, the user is disconnected from all rooms. This is because the server stores this data in volatile memory and, depending on what happened, may no longer remember where the client is supposed to be. If the client didn't reset, then the client/server would be out of sync.
        </p>
        <p>
          If the server detects that the client has disconnected, it assumes that the disconnection was intentional and immediately removes the client from all rooms and recycles the resources. Note that the server cannot attempt to re-establish a connection (any attempt to do so would be blocked by the user's router/network/firewall).
        </p>
      </Section>

      <Section title="Extra credit">
        <div class="subheader">Ephemeral messaging</div>
        <p>
          Ephemeral messaging is supported on a per-room basis. Ticking the "ephemeral" checkbox when creating a room will cause the server to not store messages sent in that room in the database.
        </p>

        <div class="subheader">Secure messaging</div>
        <p>
          Secure messaging is done with HTTPS and LetsEncrypt.
        </p>

        <div class="subheader">File transfer</div>
        <p>
          File transfer is not supported.
        </p>

        <div class="subheader">Cloud integration</div>
        <p>
          I happened to already have an AWS server and domain, so I put the app on there.
        </p>
      </Section>


      <Section title="Security">
        <p>
          No consideration was given to security. Off the top of my head, I can think of at least several avenues of attack, but this is by no means an exhaustive list. However, it should give you an idea how severe the vulnerabilities are.
        </p>
        <ul>
          <li>The server has zero spam protection/rate limiting</li>
          <li>SQL injection</li>
          <li>Ephemeral messages can be copied (unfixable but still a flaw)</li>
          <li>Users can send messages that mimic other users (allows impersonation, kicking, etc)</li>
        </ul>
      </Section>


      <Section title="Acknowledgements">
        <p>
          This document was created with web tech: React, Redux, and Webpack, among several dozen other packages.
        </p>
      </Section>
    </div >
  );
}

export default Specification;
