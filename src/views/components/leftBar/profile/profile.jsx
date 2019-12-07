import React from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';

import "./profile.scss";


export default connect(
  (state) => {
    return {
      profile: state.profile
    }
  },
  (dispatch) => ({})
)(class Profile extends React.Component {
  render() {
    return (
      <div>
        <div className="misc-links">
          <Link to="/specification" className="link">View Specification</Link>
        </div>
        <div className="profile">
          <div className="username">{this.props.profile.clientName || "null"}</div>
          <div className="id">{this.props.profile.clientId}</div>
        </div>
      </div>
    )
  }
})
