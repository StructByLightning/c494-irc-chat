import { bindActionCreators } from "redux";
import * as Actions from "../actions";
import BaseReducer from "./baseReducer";


export default class ServerReducer extends BaseReducer {
  initialState = {
    serverUrl: "wss://inscriptionserial.com:8080",
    connected: false,
  };

  [Actions.REQUEST_CONNECTION().type](state, action) {
    return {
      ...state,
      connected: false
    }
  }
  [Actions.REQUEST_CONNECTION_FINISHED().type](state, action) {
    return {
      ...state,
      connected: true
    }
  }
}