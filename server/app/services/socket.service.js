function connectToSocket(io) {
  io.on('connection', socket => {

    socket.emit('message', 'welcome to chat'); // emits for single client

    socket.broadcast.emit('message', "A user has joined"); // emits to all of clients with exception

    // io.emit(); // for all clients

    socket.on('disconnect', () => {
      io.emit('message', 'A user has left the chat');
    });

    // socket.on('join', function (room) {
    //   console.log(room, "room")
    //   socket.join(room);
    //   socket.room = room;
      socket.on('chatMessage', message => {
        console.log(message, "44")
        if ((message.sender[0].id == message.room && message.receiver_id == message.sender_id)
             || (message.sender[0].id == message.sender_id && message.receiver_id == message.room)) {
          // io.sockets.in(message.room).emit('chatMessage', message);
          io.sockets.emit('chatMessage', message);
        }
        // io.emit('message', message);
        // if (!message.isSeen) {
        //   io.emit(`${message.receiver}`, message)
        // }
        // io.sockets.emit('chatMessage', message);
      });
    // })
  });
}

module.exports = {
  connectToSocket
}