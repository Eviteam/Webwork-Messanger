function connectToSocket(io) {
  io.on('connection', socket => {

    socket.emit('message', 'welcome to chat'); // emits for single client

    socket.broadcast.emit('message', "A user has joined"); // emits to all of clients with exception

    // io.emit(); // for all clients

    socket.on('disconnect', () => {
      io.emit('message', 'A user has left the chat');
    });

    socket.on('chatMessage', message => {
      console.log(message);
      // io.emit('message', message);
      // if (!message.isSeen) {
      //   io.emit(`${message.receiver}`, message)
      // }
      io.sockets.emit(`${message.receiver_id}`, message);
    });
  });
}
module.exports = {
  connectToSocket
}