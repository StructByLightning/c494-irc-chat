import React from 'react';
import { connect } from 'react-redux'

import network from "client-network/client-network";
import * as Actions from "store/actions";

import "./leftBar.scss";
import NewRoomPanel from "./newRoomPanel/newRoomPanel";
import Profile from "./profile/profile";


export default connect(
  (state) => {
    const compareName = (a, b) => {
      return a.roomName.localeCompare(b.roomName);
    }

    return {
      joinedRooms: state.rooms.filter((room) => { return room.joined }).sort(compareName),
      otherRooms: state.rooms.filter((room) => { return !room.joined }).sort(compareName),
      currentRoom: state.currentRoom,
    }
  },
  (dispatch) => ({
    onEntryClick: (roomId) => {
      dispatch(Actions.REQUEST_SELECT_ROOM({ roomId }))
    }
  })
)(class LeftBar extends React.Component {
  render() {
    return (
      <div className="left-bar">
        <div className="lists">
          <div className="list">
            <div className="header">Joined Rooms</div>
            <div className="entries">
              {this.renderEntries(this.props.joinedRooms)}

            </div>
          </div>
          <div className="list">
            <div className="header">Other Rooms</div>
            <div className="entries">
              {this.renderEntries(this.props.otherRooms)}
            </div>
          </div>
          <NewRoomPanel />
        </div>
        <Profile />
      </div >
    )
  }

  renderEntries = (rooms) => {
    return rooms.map((room) => {
      return (
        <div
          className={room.roomId === this.props.currentRoom ? "entry selected" : "entry"}
          key={room.roomId}
          onClick={(event) => {
            if (!room.joined) {
              network.dispatch(Actions.REQUEST_JOIN_ROOM({ roomId: room.roomId }));
            } else {
              this.props.onEntryClick(room.roomId);
            }
          }}
        >
          {room.roomName}
        </div>
      );
    });
  }
})
