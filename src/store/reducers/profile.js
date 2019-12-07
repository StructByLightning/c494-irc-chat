import { bindActionCreators } from "redux";
import * as Actions from "../actions";
import BaseReducer from "./baseReducer";


export default class ProfileReducer extends BaseReducer {
  initialState = {
    clientId: "",
    clientName: ""
  };

  [Actions.REQUEST_CONNECTION_FINISHED().type](state, action) {
    return {
      ...state,
      clientId: action.meta.clientId,
      clientName: action.payload.clientName
    }
  }
}