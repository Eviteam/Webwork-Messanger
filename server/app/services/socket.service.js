function connectToSocket(io) {
  const sockets = {};
  const externalSockets = {};
  const messageCountSocket = {};
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

    socket.on('registerExternal', userData => {
      externalSockets[`${userData.team_id}-${userData.user_id}`] = socket;
    })

    socket.on('messageCount', userData => {
      messageCountSocket[`${userData.team_id}-${userData.user_id}`] = socket;
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
          sockets[`${message.team_id}-${message.receiver_id}`].emit(`privateChat`, message);
          if (externalSockets[`${message.team_id}-${message.receiver_id}`]) {
            const messageForWebwork = {};
            messageForWebwork.sender_id = message.sender_id;
            messageForWebwork.receiver_id = message.receiver_id;
            messageForWebwork.team_id = message.team_id;
            messageForWebwork.message = message.message;
            messageForWebwork.fullName = `${message.sender[0].firstname} ${message.sender[0].lastname}`;
            if (message.filePath && message.filePath.length) {
              const base64File = message.filePath.toString()
              const base64ContentArray = base64File.split(",");
              const mimeType = base64ContentArray[0].match(/[^:\s*]\w+\/[\w-+\d.]+(?=[;| ])/)[0];
              mimeType.includes('image') ? messageForWebwork.attachment = 'image' : messageForWebwork.attachment = 'file'
            }
            externalSockets[`${message.team_id}-${message.receiver_id}`].emit(`privateChat`, messageForWebwork);
          }
          messageCountSocket[`${message.team_id}-${message.receiver_id}`].on('msgCount', count => {
            messageCountSocket[`${message.team_id}-${message.receiver_id}`].emit(`chatCount`, count)
          })
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