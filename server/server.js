const express = require("express");
const path = require("path");
const https = require('https');
const fs = require('fs');
const socketio = require("socket.io");
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const rooms = ["global", "javascript"];
app.use(cors());

//database connection
const ChatSchema = require("./models/ChatSchema");
const connect = require("./models/db");
const UserSchema = require("./models/UserSchema");
const TeamSchema = require("./models/TeamSchema");
const ChannelSchema = require("./models/ChannelSchema");

// PORT
const PORT = 3000 || process.env.PORT;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend/build')));
  
let teamId;

app.get(`/`, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'))
});

// GET SINGLE TEAM
app.get(`/api/team/${teamId}`, (req, res) => {
  const id = req.params.id;
  connect.then(db => {
    UserSchema.find({}).then(users => {
      const allUsers = users.filter(user => user.teamId === id);
      TeamSchema.findById(id).then(team => {
        team.user = allUsers;
        team.save();
        res.send(team)
      })
    });
  })
});

// GET ALL USERS
app.get(`/api/users`, (req, res) => {
  connect.then(db => UserSchema.find({}).then(users => res.send(users)))
})

// GET SINGLE USER
app.get(`/api/users/:id`, (req, res) => {
  connect.then(db => {
    const id = req.params.id;
    UserSchema.find({ id }).then(user => res.send(user));
  })
})

// GET CHANNELS 
app.get(`/api/channel/${teamId}`, (req, res) => {
  const teamId = req.params.teamId;
  const userId = req.params.userId;
  connect.then(db => {
    ChannelSchema.find({ teamId }).then(channel => {
      channel = channel.filter(item => item.isGlobal);
      channel ? res.send(channel) : res.status(404).send('Not found');
    });
  });
});

// GET SINGLE CHANNEL
app.get(`/api/channel/${teamId}/:userId`, (req, res) => {
  const userId = req.params.userId;
  const teamId = req.params.teamId;
  const data = {};
  connect.then(db => {
    UserSchema.findById(userId).populate('channels').then(users => {
      data.privateChannels = users.channels.filter(item => {
        if (item.teamId === teamId && item.isGlobal === false) {
          return item
        }
      });
      data.globalCHannels = users.channels.filter(item => {
        if (item.isGlobal && item.teamId === teamId) {
          return item
        }
      })
      data ? res.send(data) : res.status(404).send('Not found');
    })
  })
});

// CREATE USER
app.post(`/api/create-user`, (req, res) => {
  const user = req.body;
  connect.then(db => {
    const newUser = new UserSchema({ user });
    newUser.save()
  })
  res.json({ user });
});

// CREATE TEAM
app.post(`/api/create-team`, (req, res) => {
  const data = req.body;
  connect.then(db => {
    const newTeam = new TeamSchema(data);
    newTeam.save();
  });
  res.json({ data });
});

// CREATE CHANNEL
app.post(`/api/create-channel`, (req, res) => {
  const data = req.body;
  connect.then(db => {
    const newChannel = new ChannelSchema(data);
    newChannel.save();
  });
  res.json({ data });
});

const server = https.createServer(
  {
    key: fs.readFileSync('/etc/letsencrypt/live/messenger.webwork-tracker.com/privkey.pem', 'utf8'),
    cert: fs.readFileSync('/etc/letsencrypt/live/messenger.webwork-tracker.com/fullchain.pem', 'utf8')
  }, app
);

server.listen(PORT, () =>  {
 console.log(`Server runing on port ${PORT}`);
 https.get('https://www.webwork-tracker.com/chat-api/users?user_id=71', (res) => {
   let data = '';

   res.on('data', (chunk) => {
     data += chunk;
   });

   res.on('end', () => {
     const newTeamData = JSON.parse(data)
     teamId = newTeamData.team_id;
     connect.then(db => {
       TeamSchema.find({team_id: teamId}).then(team => {
         if (!team.length) {
           const newTeam = new TeamSchema(newTeamData);
           newTeamData.users.map(user => {
             const newUsers = new UserSchema(user);
             newUsers.save();
           });

         }
         newTeamData.users.map(user => {
           UserSchema.find({id: user.id}).then(singleUser => {
            if (!singleUser) {
               const newUser = new UserSchema(user);
               newUser.save();
             }
           })
         })
         return team;
       });
     }).catch(err => console.log(err))
   });
 })
});

const io = socketio(server);
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

module.exports.rooms = rooms;