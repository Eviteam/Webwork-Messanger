function connectToSocket(io) {
  io.on('connection', socket => {

    socket.emit('message', 'welcome to chat'); // emits for single client

    socket.broadcast.emit('message', "A user has joined"); // emits to all of clients with exception

    // io.emit(); // for all clients

    socket.on('disconnect', () => {
      io.emit('message', 'A user has left the chat');
    });
    socket.on('chatMessage', message => {
      const usersChannel = [message.sender_id.toString(), message.receiver_id.toString()];
      usersChannel.sort()
      socket.join(`chatNotifier-${usersChannel[0]}/${usersChannel[1]}`);
      io.emit(`chatNotifier-${usersChannel[0]}/${usersChannel[1]}`, message)
      // socket.join(`chatNotifier-${usersChannel[0]}/${usersChannel[1]}`).emit(message)
    });
  });
}

module.exports = {
  connectToSocket
}