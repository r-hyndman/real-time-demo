import io from 'socket.io-client';

let socket = undefined;
const listeners = [];
// const url = 'http://localhost:3030';
const url = 'http://192.168.1.106:3030';

function initialiseSocket() {
  if (!socket) {
    socket = io(url);
  }
}

export function registerCallback(params) {
  initialiseSocket();

  if (!listeners.includes(params.messageType)) {
    socket.on(params.messageType, params.messageCallback);
    listeners.push(params.messageType);
  }
}

export function sendMessage(params) {
  if (params.hasOwnProperty('messageData')) {
    socket.emit(params.messageType, params.messageData);
    return;
  }

  socket.emit(params.messageType);
}
