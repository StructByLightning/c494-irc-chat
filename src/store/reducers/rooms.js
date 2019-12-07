import { bindActionCreators } from "redux";
import * as Actions from "../actions";
import BaseReducer from "./baseReducer";

export default class RoomsReducer extends BaseReducer {
  initialState = [];

  [Actions.REQUEST_CONNECTION_FINISHED().type](state, action) {
    return [...action.payload.rooms].map(room => {
      return {
        roomName: room.roomName,
        roomId: room.roomId,
        ephemeral: room.ephemeral === "true" || room.ephemeral === true,
        joined: room.joined === "true" || room.joined === true,
        messages: [],
        clients: room.clients ? room.clients : []
      }
    });
  }

  [Actions.REQUEST_LEAVE_ROOM_FINISHED().type](state, action) {
    let index = state.findIndex(room => {
      return room.roomId === action.payload.roomId;
    });

    if (state[index]) {
      return [
        ...state.slice(0, index),
        {
          ...state[index],
          joined: false
        },
        ...state.slice(index + 1)
      ];
    } else {
      return state;
    }
  }

  [Actions.REQUEST_CLIENT_JOINED_ROOM().type](state, action) {
    let index = state.findIndex(room => {
      return room.roomId === action.payload.roomId;
    });

    if (state[index]) {
      return [
        ...state.slice(0, index),
        {
          ...state[index],
          clients: [
            ...state[index].clients,
            action.payload.client
          ]
        },
        ...state.slice(index + 1)
      ];
    } else {
      return state;
    }
  }

  [Actions.REQUEST_CLIENT_LEFT_ROOM().type](state, action) {
    let roomIndex = state.findIndex(room => {
      return room.roomId === action.payload.roomId;
    });

    if (state[roomIndex]) {
      let clientIndex = state[roomIndex].clients.findIndex(client => { return client.clientId === action.payload.client.clientId });

      if (state[roomIndex].clients[clientIndex]) {
        return [
          ...state.slice(0, roomIndex),
          {
            ...state[roomIndex],
            clients: [
              ...state[roomIndex].clients.slice(0, clientIndex),
              ...state[roomIndex].clients.slice(clientIndex + 1),
            ]
          },
          ...state.slice(roomIndex + 1)
        ];
      }
    }
    return state;
  }

  [Actions.REQUEST_SEND_MESSAGE_FINISHED().type](state, action) {
    let index = state.findIndex(room => {
      return room.roomId === action.payload.message.roomId;
    });

    if (state[index]) {
      return [
        ...state.slice(0, index),
        {
          ...state[index],
          messages: [
            ...state[index].messages,
            action.payload.message
          ]
        },
        ...state.slice(index + 1)
      ];
    }

    return state;
  }

  [Actions.REQUEST_CREATE_ROOM_FINISHED().type](state, action) {
    return [
      ...state,
      action.payload.newRoom
    ];
  }

  [Actions.REQUEST_JOIN_ROOM_FINISHED().type](state, action) {
    let index = state.findIndex(room => {
      return room.roomId === action.payload.roomId;
    });

    if (state[index]) {
      return [
        ...state.slice(0, index),
        {
          ...state[index],
          joined: true,
          messages: action.payload.messages,
          clients: action.payload.clients,
        },
        ...state.slice(index + 1)
      ];
    } else {
      return state;
    }
  }


}
