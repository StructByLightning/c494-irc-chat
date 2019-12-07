import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

import network from "client-network/client-network";
import * as Actions from "store/actions";

import "./current-room.scss";


export default connect(
  (state) => {
    let room = state.rooms.reduce((acc, cur) => {
      if (cur.roomId === state.currentRoom) {
        return cur;
      } else {
        return acc;
      }
    }, "");

    let aggregatedMessages = [];
    let messages = room.messages;
    if (messages && messages.length > 0) {
      messages = messages.sort((a, b) => { return a.timestamp > b.timestamp });
      let temp = [];
      let ownerId = messages[0].ownerId;
      for (let i = 0; i < messages.length; i++) {
        if (messages[i].ownerId !== ownerId) {
          aggregatedMessages.push(temp);
          temp = []
          ownerId = messages[i].ownerId
        }

        temp.push(messages[i]);
      }
      aggregatedMessages.push(temp);
    }


    return {
      profile: state.profile,
      aggregatedMessages,
      room
    }
  },
  (dispatch) => ({})
)(class CurrentRoom extends React.Component {
  render() {
    return (
      <div className="current-room">
        <div className="main">
          <div className="messager">
            <div className="header">{this.props.room.roomName || "No selected room"}</div>
            <div className="messages">
              {this.renderAggregates(this.props.aggregatedMessages)}
            </div>
            {this.props.room.roomName && (
              <div className="message-sender">
                <input
                  className="input"
                  aria-label={"message @" + (this.props.room.roomName || "")}
                  placeholder={"message @" + (this.props.room.roomName || "")}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      network.dispatch(Actions.REQUEST_SEND_MESSAGE({
                        message: {
                          roomId: this.props.room.roomId,
                          ownerName: this.props.profile.clientName,
                          ownerId: this.props.profile.clientId,
                          content: event.target.value
                        }
                      }));
                      event.target.value = "";
                    }
                  }}
                />
              </div>
            )}
          </div>
          <div className="clients">
            <div className="header">Members</div>
            {this.renderClients(this.props.room.clients)}
            {this.props.room.roomName && (
              <button className="button danger" onClick={() => {
                network.dispatch(Actions.REQUEST_LEAVE_ROOM({ roomId: this.props.room.roomId }));
              }}>Leave</button>
            )}
          </div>
        </div>
      </div>
    )
  }

  renderClients = (clients) => {
    if (clients) {
      return clients.sort((a, b) => {
        return a.clientName.localeCompare(b.clientName);
      }).map((client) => {
        return (
          <div key={client.clientId} className="entry">{client.clientName}</div>
        );
      });
    }
  }

  renderAggregates = (aggregates) => {
    if (aggregates) {
      return aggregates.map((aggregate) => {
        return (
          <div key={aggregate[0].messageId} className="message-aggregate">
            <div className="title">
              <div className="owner-name">{aggregate[0].ownerName}</div>
              <div className="timestamp">{new Date(parseInt(aggregate[0].timestamp)).toLocaleString()}</div>
            </div>
            {aggregate.map((message) => {
              return (
                <div className="message-individual" key={message.messageId}>{message.content}</div>
              )
            })}
          </div>
        );
      });
    }
  }
})
