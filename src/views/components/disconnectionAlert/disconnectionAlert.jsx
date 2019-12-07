import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

import network from "client-network/client-network";
import * as Actions from "store/actions";

import "./disconnectionAlert.scss";


export default connect(
  (state) => {
    return {
      server: state.server
    }
  },
  (dispatch) => ({})
)(class DisconnectedAlert extends React.Component {
  render() {
    return (
      <div className={this.props.server.connected ? "disconnected-alert" : "disconnected-alert active"}>
        <div className="message-large">Connecting to server</div>
        <div className="message-small">Please wait...</div>
      </div>
    )
  }
})
