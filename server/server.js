const express = require("express");
const path = require("path");
const https = require('https');
const fs = require('fs');
const socketio = require("socket.io");
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
app.use(cors());
const dotenv = require('dotenv');
dotenv.config();
const webWorkService = require("./app/services/web-work.service");
const socketService = require("./app/services/socket.service");
const userController = require('./app/controllers/user.controller')
const teamController = require('./app/controllers/team.controller')
const channelController = require('./app/controllers/channel.controller')

// PORT
const PORT = 3000 || process.env.PORT;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get(`/`, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'))
});

const server = https.createServer(
  {
    key: fs.readFileSync(process.env.KEY, 'utf8'),
    cert: fs.readFileSync(process.env.CERT, 'utf8')
  }, app
);

server.listen(PORT, async () =>  {
  webWorkService.getTeamData().then(() => {
    app.use('/api/team', teamController);
    app.use('/api/users', userController);
    app.use('/api/channel', channelController);
    console.log(`Server runing on port ${PORT}`);
  });
});

// Connect to socket
const io = socketio(server);
socketService.connectToSocket(io);