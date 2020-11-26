const connect = require("../helpers/db");
const ChatSchema = require("../models/ChatSchema");

// TODO change hardcoded data
const rooms = ["global", "javascript"];

function connectToSocket(io) {
  io.on('connection', socket => {

    socket.emit('message', 'welcome to chat'); // emits for single client
  
    socket.broadcast.emit('message', "A user has joined"); // emits to all of clients with exception
  
    // io.emit(); // for all clients
  
    socket.on('disconnect', () => {
      io.emit('message', 'A user has left the chat');
    });
  
    socket.on('chatMessage', message => {
      io.emit('message', message);
      io.sockets.emit('chatMessage', message);
  
      //save chat to the database
      connect.then(db => {
        // TODO need userId
        // const sender = UserSchema.find({}).then(user => user) 
        const chatMessage = new ChatSchema({ message: message, sender: 'test' });
        chatMessage.save();
      });
    });
    io.emit('rooms', rooms);
  });
}

module.exports = {
  connectToSocket,
  rooms
}