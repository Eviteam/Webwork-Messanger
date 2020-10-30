const express = require("express");
const path = require("path");
// const http = require("http");
const https = require('https')
const socketio = require("socket.io");
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const server = https.createServer(app);
const io = socketio(server);
const rooms = ["global", "javascript"];
app.use(cors());

//database connection
const ChatSchema = require("./models/ChatSchema");
const connect = require("./models/db");
const UserSchema = require("./models/UserSchema");
const TeamSchema = require("./models/teamSchema");
const ChannelSchema = require("./models/ChannelSchema");

// PORT
const PORT = 3000 || process.env.PORT;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
let teamId;

// GET ALL MESSAGES
app.get('/all-messages', (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.statusCode = 200;
  connect.then(db => {
    ChatSchema.find({}).then(chat => {
      chat ? res.send(chat) : res.status(404).send('Not found');
    });
  });
});

// GET SINGLE TEAM
app.get(`/team/${teamId}`, (req, res) => {
  const id = req.params.id;
  connect.then(db => {
    UserSchema.find({}).then(users => {
      const allUsers = users.filter(user => user.teamId === id);
      TeamSchema.findById(id).then(team =>  {
        team.user = allUsers;
        team.save();
        res.send(team)
      })
    });
  })
});

// GET CHANNELS 
app.get(`/channel/${teamId}`, (req, res) => {
  const teamId = req.params.teamId;
  const userId = req.params.userId;
  console.log(teamId, userId, "4444")
  connect.then(db => {
    ChannelSchema.find({teamId}).then(channel => {
      channel = channel.filter(item => item.isGlobal);
      console.log(channel)
      channel ? res.send(channel) : res.status(404).send('Not found');
    });
  });
});

// GET SINGLE CHANNEL
app.get(`/channel/${teamId}/:userId`, (req, res) => {
  const userId = req.params.userId;
  const teamId = req.params.teamId;
  const data = {};
  connect.then(db => {
    UserSchema.findById(userId).populate('channels').then(users => {
      data.privateChannels = users.channels.filter(item => {
        if(item.teamId === teamId && item.isGlobal === false){
          return item
        }
      });
      data.globalCHannels = users.channels.filter(item => {
        if(item.isGlobal && item.teamId === teamId) {
          return item
        }
      })
      data ? res.send(data) : res.status(404).send('Not found');
    })
  })
});

// CREATE USER
app.post(`/create-user`, (req, res) => {
  const user = req.body;
  connect.then(db => {
    const newUser = new UserSchema({user});
    newUser.save()
  })
  res.json({user});
});

// CREATE TEAM
app.post(`/create-team`, (req, res) => {
  const data = req.body;
  connect.then(db => {
    const newTeam = new TeamSchema(data);
    newTeam.save();
  });
  res.json({data});
});

// CREATE CHANNEL
app.post(`/create-channel`, (req, res) => {
  const data = req.body;
  connect.then(db => {
    const newChannel = new ChannelSchema(data);
    newChannel.save();
  });
  res.json({data});
});

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
      const sender = UserSchema.find()
      const chatMessage = new ChatSchema({ message: message, sender: 'test' });
      chatMessage.save();
    });
  });
  io.emit('rooms', rooms);
});

server.listen(PORT, () =>  {
  console.log(`Server runing on port ${PORT}`);
  https.get('https://www.webwork-tracker.com/chat-api/users?user_id=71', (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });
  
    res.on('end', () => {
      teamId = JSON.parse(data).team_id;      
    });
  })
});
module.exports.rooms = rooms;