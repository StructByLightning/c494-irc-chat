//request/finished pairs
//notify for one-way communication

export const REQUEST_CONNECTION = (payload = {}, error = false, meta = {}) => {
  return {
    type: "REQUEST_CONNECTION",
    error,
    meta,
    payload
  }
};

export const REQUEST_CONNECTION_FINISHED = (payload = {}, error = false, meta = {}) => {
  return {
    type: "REQUEST_CONNECTION_FINISHED",
    error,
    meta,
    payload
  }
};


export const REQUEST_JOIN_ROOM = (payload = {}, error = false, meta = {}) => {
  return {
    type: "REQUEST_JOIN_ROOM",
    error,
    meta,
    payload
  }
};
export const REQUEST_JOIN_ROOM_FINISHED = (payload = {}, error = false, meta = {}) => {
  return {
    type: "REQUEST_JOIN_ROOM_FINISHED",
    error,
    meta,
    payload
  }
};


export const REQUEST_LEAVE_ROOM = (payload = {}, error = false, meta = {}) => {
  return {
    type: "REQUEST_LEAVE_ROOM",
    error,
    meta,
    payload
  }
};

export const REQUEST_LEAVE_ROOM_FINISHED = (payload = {}, error = false, meta = {}) => {
  return {
    type: "REQUEST_LEAVE_ROOM_FINISHED",
    error,
    meta,
    payload
  }
};

export const REQUEST_SELECT_ROOM = (payload = {}, error = false, meta = {}) => {
  return {
    type: "REQUEST_SELECT_ROOM",
    error,
    meta,
    payload
  }
};


export const REQUEST_SEND_MESSAGE = (payload = {}, error = false, meta = {}) => {
  return {
    type: "REQUEST_SEND_MESSAGE",
    error,
    meta,
    payload
  }
};


export const REQUEST_SEND_MESSAGE_FINISHED = (payload = {}, error = false, meta = {}) => {
  return {
    type: "REQUEST_SEND_MESSAGE_FINISHED",
    error,
    meta,
    payload
  }
};

export const REQUEST_CLIENT_JOINED_ROOM = (payload = {}, error = false, meta = {}) => {
  return {
    type: "REQUEST_CLIENT_JOINED_ROOM",
    error,
    meta,
    payload
  }
};
export const REQUEST_CLIENT_LEFT_ROOM = (payload = {}, error = false, meta = {}) => {
  return {
    type: "REQUEST_CLIENT_LEFT_ROOM",
    error,
    meta,
    payload
  }
};

export const REQUEST_CREATE_ROOM = (payload = {}, error = false, meta = {}) => {
  return {
    type: "REQUEST_CREATE_ROOM",
    error,
    meta,
    payload
  }
};

export const REQUEST_CREATE_ROOM_FINISHED = (payload = {}, error = false, meta = {}) => {
  return {
    type: "REQUEST_CREATE_ROOM_FINISHED",
    error,
    meta,
    payload
  }
};


export const map = {
  "REQUEST_CONNECTION_FINISHED": REQUEST_CONNECTION_FINISHED,
  "REQUEST_JOIN_ROOM_FINISHED": REQUEST_JOIN_ROOM_FINISHED,
  "REQUEST_LEAVE_ROOM_FINISHED": REQUEST_LEAVE_ROOM_FINISHED,

  "REQUEST_CLIENT_JOINED_ROOM": REQUEST_CLIENT_JOINED_ROOM,
  "REQUEST_CLIENT_LEFT_ROOM": REQUEST_CLIENT_LEFT_ROOM,

  "REQUEST_CREATE_ROOM_FINISHED": REQUEST_CREATE_ROOM_FINISHED,
  "REQUEST_SEND_MESSAGE_FINISHED": REQUEST_SEND_MESSAGE_FINISHED
}