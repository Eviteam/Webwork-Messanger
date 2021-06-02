function connectToSocket(io) {
  const sockets = {};
  io.on('connection', socket => {

    socket.emit('message', 'welcome to chat'); // emits for single client

    socket.broadcast.emit('message', "A user has joined"); // emits to all of clients with exception
    // io.emit(); // for all clients

    socket.on('disconnect', () => {
      io.emit('message', 'A user has left the chat');
    });

    socket.on('register', userData => {
      sockets[`${userData.team_id}-${userData.user_id}`] = socket;
    })

    socket.on('chatMessage', message => {
      
      if (message.room == message.receiver_id) {

        //emit to the sender's socket
        if((sockets[`${message.team_id}-${message.sender_id}`]) && message.sender_id != message.receiver_id) {
          sockets[`${message.team_id}-${message.sender_id}`].emit(`privateChat`, message);
        } else {
          if (!sockets[`${message.team_id}-${message.sender_id}`]){
            // sender is not online;
          } else {
            // message to yourself;
          }
        }
  
        //emit to the receiver's socket
        if(sockets[`${message.team_id}-${message.receiver_id}`]) {
          sockets[`${message.team_id}-${message.receiver_id}`].emit(`privateChat`, message)
        } else {
         // receiver is not online;
        }
      }

    });

    socket.on('removeUser', userData => {
      delete sockets[`${userData.team_id}-${userData.selectedUser}`]
    })
  });
}

module.exports = {
  connectToSocket
}