import { bindActionCreators } from "redux";
import * as Actions from "store/actions";
import BaseReducer from "./baseReducer";


export default class CurrentRoomReducer extends BaseReducer {
  initialState = "";

  [Actions.REQUEST_CONNECTION_FINISHED().type](state, action) {
    return "";
  }

  [Actions.REQUEST_JOIN_ROOM_FINISHED().type](state, action) {
    return action.payload.roomId;
  }

  [Actions.REQUEST_SELECT_ROOM().type](state, action) {
    return action.payload.roomId;
  }

  [Actions.REQUEST_LEAVE_ROOM_FINISHED().type](state, action) {
    return "";
  }
}