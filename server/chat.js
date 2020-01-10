let socketio = undefined;
let messageID = 0;
const chatHistory = [];

const initialise = (io) => {
  socketio = io;
}

const run = (socket) => {
  // new socket connected, send chat history
  socket.emit('chatHistory', chatHistory);

  // listen for 'chatMessage' events
  socket.on('chatMessage', chatMessage => {
    // attach a message id, add the message to the chat history
    chatMessage.id = getMessageID();
    chatHistory.push(chatMessage);

    // send the message to all connected sockets
    socketio.emit('chatMessage', chatMessage);
  });
}

const getMessageID = () => {
  const newMessageID = messageID;
  messageID += 1;

  return newMessageID;
}

module.exports = { initialise, run };
