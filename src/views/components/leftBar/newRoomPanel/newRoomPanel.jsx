import React from 'react';
import { connect } from 'react-redux'

import network from "client-network/client-network";
import * as Actions from "store/actions";

import "./newRoomPanel.scss";


export default connect(
  (state) => { return { profile: state.profile } },
  (dispatch) => ({})
)(class NewRoomPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newRoomName: "",
      ephemeral: false
    }
  }

  render() {
    return (
      <div className="new-room-panel">
        <div className="header">New Room</div>
        <div className="creation-display">
          <input className="input" placeholder="room name" onChange={(event) => { this.setState({ newRoomName: event.target.value }) }} />

          <label className="checkbox" onClick={(event) => { this.setState({ ephemeral: event.target.checked }) }}>
            <input type="checkbox" />
            <div />
            Ephemeral
          </label>

          <button
            className="button"
            onClick={() => {
              console.log(this.state.newRoomName);
              console.log(this.state.ephemeral);
              network.dispatch(Actions.REQUEST_CREATE_ROOM({
                roomName: this.state.newRoomName,
                ephemeral: this.state.ephemeral
              }));
            }}
          >Create room</button>



        </div>

      </div>
    )
  }
})
