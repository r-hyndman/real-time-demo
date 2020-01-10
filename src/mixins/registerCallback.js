import * as socketio from '../plugins/socketio';

export const registerCallback = {
  methods: {
    registerCallback(messageType, messageCallback) {
      socketio.registerCallback({
        messageType: messageType,
        messageCallback: messageCallback
      });
    }
  }
};
