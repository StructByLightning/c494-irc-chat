import { combineReducers } from "redux";
import CurrentRoomReducer from "./reducers/currentRoom";
import RoomsReducer from "./reducers/rooms";
import ProfileReducer from "./reducers/profile";
import ServerReducer from "./reducers/server";

export default combineReducers({
  currentRoom: new CurrentRoomReducer().reducer,
  rooms: new RoomsReducer().reducer,
  profile: new ProfileReducer().reducer,
  server: new ServerReducer().reducer,
});

//todo: move data transformation into selectors in the store folder