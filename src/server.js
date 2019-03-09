const express = require("express");
const os = require("os");
const app = express();
const bodyParser = require('body-parser')
const {
  multiplayerGameStart,
  challengeStart,
  socketlist
} = require('./game-manager/game-manager');
const _ = require('lodash');
const helper = require('./lib/helper');
app.use(express.static("public/dist"));
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  //res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

let questionsRouter = require('../routes/questionRoutes');
app.use('/api/questions', questionsRouter);

let gamesRouter = require('../routes/gameRoutes');
app.use('/api/games', gamesRouter);

let challengesRouter = require('../routes/challengeRoutes');
app.use('/api/challenges', challengesRouter);

const server = app.listen(process.env.PORT || 8081);
const io = require('socket.io').listen(server);



io.of('/multiplayer').on('connection', multiplayerGameStart);

io.of('/challenge').on('connection', challengeStart);

//handling server consistency with data here
process.on('SIGINT', function () {
  console.log("Caught interrupt signal");
  //io.close();
  socketlist.forEach(function (socket) {
    socket.disconnect();
    _.remove(socketlist, function (el) {
      return _.isEqual(el, socket);
    });
  });
  if (i_should_exit)
    process.exit();
});
process.on('uncaughtException', function (err) {
  console.log('***Server Crashed with Uncaught Exception***', err);
  //errorHandler.logError(err);
  process.exit(1);
});