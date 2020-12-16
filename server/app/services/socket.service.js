const connect = require("../helpers/db");
const ChatSchema = require("../models/ChatSchema");
const UserSchema = require("../models/UserSchema");
const { user_id } = require("../services/web-work.service");

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
      // connect.then(db => {
      //   console.log(message, "message")
      //   const user_id = message.sender;
      //   UserSchema.findById(user_id).then(user => {
      //     message.sender = user;
      //     const chatMessage = new ChatSchema(message);
      //     chatMessage.save();
      //   })
      // });
    });
    io.emit('rooms', rooms);
  });
}

module.exports = {
  connectToSocket,
  rooms
}