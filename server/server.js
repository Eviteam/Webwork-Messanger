const express = require("express");
const path = require("path");
const https = require('https');
const http = require('http');
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
const globalUserController = require('./app/controllers/globalUser.controller');
const userController = require('./app/controllers/user.controller');
const teamController = require('./app/controllers/team.controller');
const channelController = require('./app/controllers/channel.controller');
const chatController = require('./app/controllers/chat.controller');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

// PORT
const PORT = process.env.PORT || 3000 ;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend/dist/frontend')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get(`/`, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/frontend/index.html'))
});

const server = https.createServer(
  {
    key: fs.readFileSync(process.env.KEY, 'utf8'),
    cert: fs.readFileSync(process.env.CERT, 'utf8')
  },
  app
);

server.listen(PORT, () => {
  // webWorkService.getTeamData().then(() => {
    app.use('/api/current_user', globalUserController);
    app.use('/api/team', teamController);
    app.use('/api/users', userController);
    app.use('/api/channel', channelController);
    app.use('/api/chat', chatController);
    console.log(`Server runing on port ${PORT}`);
  // });
});

// Connect to socket
const io = socketio(server);
socketService.connectToSocket(io);
