import * as Actions from "store/actions/index.js";
import store from "store/store.js"


class ClientNetwork {
  constructor() {
    this.server = undefined;
    this.clientId = undefined;
  }

  listen() {
    setInterval(() => {
      if (!store.getState().server.connected) {
        this.server = new WebSocket(store.getState().server.serverUrl);
        this.server.onopen = () => {
          this.dispatch(Actions.REQUEST_CONNECTION({}));
        };

        this.server.onmessage = event => {
          const message = JSON.parse(event.data);

          console.log("Received message:", message)
          if (Actions.map[message.type]) {
            store.dispatch(Actions.map[message.type](message.payload, message.error, message.meta));
          }
          console.log("New store:", store.getState());
        };

        this.server.onclose = () => {
          this.server.close();
          store.dispatch(Actions.REQUEST_CONNECTION());
        }
      }
    }, 1000);
  }

  dispatch(action) {
    console.log("Sent message:", action, "Current store:", store.getState());
    this.server.send(
      JSON.stringify({ clientId: store.getState().profile.clientId, type: action.type, payload: action.payload })
    );
  }
}

const network = new ClientNetwork();
network.listen();
export default network;
