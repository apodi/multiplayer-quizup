const {
    OAuth2Client
} = require('google-auth-library');
const _ = require('lodash');
const {
    storeGameDetails,
    readAllQuestionsByTopicId
} = require("../firebase/firebase-server-db.service");
const QuizPlayService = require('../quiz-play/quiz-play.service');
let quizPlayServiceObj = new QuizPlayService();
let gameData = {};
let players = {};
let clients = [];
let socketlist = [];
let joinedUsers = {};
let gameDetails = {};
let arr = {};
let arr1 = {};
let playersInGame = {};
let playerCount = 3;
module.exports = {
    multiplayerGameStart: socket => {
        socket.on('authenticate', function (data) {
            const client = new OAuth2Client('1028253181186-sfpcbo9naq369bpqd9c37asocop8lj2h.apps.googleusercontent.com');
            async function verify() {
                const ticket = await client.verifyIdToken({
                    idToken: data.token,
                    audience: '1028253181186-sfpcbo9naq369bpqd9c37asocop8lj2h.apps.googleusercontent.com', // Specify the CLIENT_ID of the app that accesses the backend
                    // Or, if multiple clients access the backend:
                    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
                });
                const payload = ticket.getPayload();
                const userid = payload['sub'];
                payload.userName = data.userName;
                payload.userPhotoURL = data.userPhotoURL;
                return payload;
            }
            verify().then(function (data) {
                //console.log(data);
                socket.emit('authenticated', {
                    str: "successfully authenticated!"
                });
                socket.userName = data.userName;
                socket.userPhotoURL = data.userPhotoURL;
                //this socket is authenticated, we are good to handle more events from it.
                socketlist.push(socket);
                // console.log('hello! ' + socket.userName);
                socket.on('end', function () {
                    console.log("server disconnected....");
                });
                socket.on('close', function () {
                    console.log("closed event fired");
                });

                socket.on('sendTopicId', function (data) {
                    console.log('topicid: ' + data.topicId);
                    if (!data.topicId) {
                        //will disconnect if not found topic id
                        socket.disconnect();
                    } else {
                        if (players[data.topicId]) {
                            if (players[data.topicId].length < playerCount) {
                                if (!(_.includes(players[data.topicId], socket.userName))) {
                                    clients[socket.userName] = {
                                        "socket": socket.id
                                    };
                                    joinedUsers.users.push({
                                        userName: socket.userName,
                                        userPhotoURL: socket.userPhotoURL
                                    });
                                    players[data.topicId].push(socket.userName);
                                    for (let value in clients) {
                                        if (_.includes(players[data.topicId], value)) {
                                            socket.nsp.connected[clients[value].socket].emit('sendPlayerAddedInfo', joinedUsers);
                                        }
                                        //  console.log(socket.nsp); 
                                    }
                                }
                                if (players[data.topicId].length === playerCount) {
                                    let gameId = _.random(0, 1000000000);
                                    playersInGame[gameId] = players[data.topicId];
                                    delete players[data.topicId];
                                    arr[gameId] = [];
                                    arr1[gameId] = [];
                                    gameDetails[gameId] = {};
                                    gameDetails[gameId].players = [];
                                    readAllQuestionsByTopicId(data.topicId).then(function (qlist) {
                                        gameData = {
                                            topicId: data.topicId,
                                            players: playersInGame[gameId],
                                            gameId: gameId,
                                            questionList: qlist
                                        };
                                        for (let value in clients) {
                                            if (_.includes(playersInGame[gameId], value)) {
                                                //console.log(socket.nsp);
                                                socket.nsp.connected[clients[value].socket].gameId = gameId;
                                                socket.nsp.connected[clients[value].socket].emit('startGame', {
                                                    str: "start the game",
                                                    "gameData": gameData
                                                });
                                            }
                                        }
                                    });

                                }
                            }

                        } else {
                            joinedUsers.users = [];
                            players[data.topicId] = [];
                            clients[socket.userName] = {
                                "socket": socket.id
                            };
                            players[data.topicId].push(socket.userName);
                            joinedUsers.users.push({
                                userName: socket.userName,
                                userPhotoURL: socket.userPhotoURL
                            });
                            for (let value in clients) {
                                if (_.includes(players[data.topicId], value)) {
                                    socket.nsp.connected[clients[value].socket].emit('sendPlayerAddedInfo', joinedUsers);
                                }
                            }
                        }
                        socket.on('testEvent', function (data) {
                            //console.log(data);
                        });
                        socket.on('gameUserData', function (data) {
                            arr[data.gameId].push(data);
                            arr1[data.gameId].push(data.player);

                            // console.log(data);
                            //console.log(socketlist);
                            if (arr[data.gameId].length === playersInGame[data.gameId].length) {
                                for (let value of socketlist) {
                                    if (_.includes(arr1[data.gameId], value.userName)) {
                                        console.log(value.id);
                                        //console.log(socket.nsp.connected);
                                        socket.nsp.connected[value.id].emit('sendAllScores', arr[data.gameId]);
                                    }
                                }
                                arr[data.gameId] = [];
                                arr1[data.gameId] = [];
                            }
                        });
                        socket.on('saveUserGameData', function (obj) {
                            // console.log(obj);
                            gameDetails[obj.gameId].id = obj.gameId;
                            gameDetails[obj.gameId].topicId = data.topicId;
                            gameDetails[obj.gameId].heldOn = new Date().toString();
                            gameDetails[obj.gameId].type = 'game';

                            gameDetails[obj.gameId].players.push({
                                name: obj.player,
                                score: obj.score
                            });
                            arr1[obj.gameId].push(obj.player);
                            // console.log(gameDetails);
                            if (gameDetails[obj.gameId].players.length === playersInGame[obj.gameId].length) {
                                console.log(gameDetails[obj.gameId]);
                                storeGameDetails(gameDetails[obj.gameId]).then(function (data) {
                                    console.log('game data stored!');
                                    // console.log(socketlist);
                                    // console.log(arr1);
                                    for (let value of socketlist) {
                                        if (_.includes(arr1[obj.gameId], value.userName)) {
                                            socket.nsp.connected[value.id].emit('gameEnded', {
                                                gameId: gameDetails[obj.gameId].id,
                                                type:'game'
                                            });
                                            value.disconnect();
                                        }
                                    }
                                    // console.log(socketlist);
                                    //game end and clear socketlist with corresponding players
                                    for (let val of gameDetails[obj.gameId].players) {
                                        delete clients[val.name];
                                        socketlist = socketlist.filter(function (obj) {
                                            return obj.userName != val.name;
                                        });
                                    }
                                    delete gameDetails[obj.gameId];
                                    delete arr[obj.gameId];
                                    delete arr1[obj.gameId];
                                    delete playersInGame[obj.gameId];
                                    console.log(arr);
                                    console.log(arr1);
                                    console.log(clients);
                                    console.log(gameDetails);
                                }).catch(function (error) {
                                    console.log(error);
                                })
                            }
                        });
                        console.log('joined users ' + joinedUsers);

                        console.log(players);
                        // console.log(clients);
                        socket.on('error', function (error) {
                            console.log('something wrong happened here');
                            //connection.end('socket can send more data but it will be ended');
                        });
                        // when the user disconnects.. perform this
                        socket.on('disconnect', function () {
                            console.log('disconnected');
                            console.log(players[data.topicId]);
                            if (players[data.topicId]) {
                                for (let val of players[data.topicId]) {
                                    players[data.topicId] = players[data.topicId].filter(function (obj) {
                                        return obj != socket.userName;
                                    });
                                }
                            }
                            if (playersInGame[socket.gameId]) {
                                for (let val of playersInGame[socket.gameId]) {
                                    playersInGame[socket.gameId] = playersInGame[socket.gameId].filter(function (obj) {
                                        return obj != socket.userName;
                                    });
                                }
                            }
                            delete clients[socket.userName];
                            socketlist = socketlist.filter(function (obj) {
                                return obj.userName != socket.userName;
                            });
                            joinedUsers.users = joinedUsers.users.filter(function (obj) {
                                return obj.userName != socket.userName;
                            });
                            //gameDetails = {};
                            //gameDetails.players = [];
                            //socket.disconnect();
                        });
                    }
                });
            })
            verify().catch(function (error) {
                //unauthencated access
                console.log("this is error " + error);
                socket.disconnect();
                // io.close()
            });
        });
    },
    challengeStart: (socket) => {
        let gameData = {};
        let players = {};
        let clients = [];
        let socketlist = [];
        let joinedUsers = {};
        let gameDetails = {};
        gameDetails.players = [];
        //let arr = [];
        //let arr1 = [];
        socket.on('authenticate', function (data) {
            const client = new OAuth2Client('1028253181186-sfpcbo9naq369bpqd9c37asocop8lj2h.apps.googleusercontent.com');
            async function verify() {
                const ticket = await client.verifyIdToken({
                    idToken: data.token,
                    audience: '1028253181186-sfpcbo9naq369bpqd9c37asocop8lj2h.apps.googleusercontent.com', // Specify the CLIENT_ID of the app that accesses the backend
                    // Or, if multiple clients access the backend:
                    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
                });
                const payload = ticket.getPayload();
                // console.log(payload);
                const userid = payload['sub'];
                payload.userName = data.userName;
                payload.userPhotoURL = data.userPhotoURL;
                return payload;
            }
            verify().then(function (data) {
                //console.log(data);
                socket.emit('authenticated', {
                    str: "successfully authenticated!"
                });
                socket.userName = data.userName;
                socket.userPhotoURL = data.userPhotoURL;
                //this socket is authenticated, we are good to handle more events from it.
                socketlist.push(socket);
                // console.log('hello! ' + socket.userName);
                socket.on('end', function () {
                    console.log("server disconnected....");
                });
                socket.on('close', function () {
                    console.log("closed event fired");
                });

                socket.on('sendTopicId', function (data) {
                    console.log('topicid: ' + data.topicId);
                    if (!data.topicId) {
                        //will disconnect if not found topic id
                        socket.disconnect();
                    } else {
                        players[data.topicId] = [];
                        clients[socket.userName] = {
                            "socket": socket.id
                        };
                        joinedUsers.users = [];
                        joinedUsers.users.push({
                            userName: socket.userName,
                            userPhotoURL: socket.userPhotoURL
                        });
                        players[data.topicId].push(socket.userName);
                        if (players[data.topicId].length === 1) {

                            quizPlayServiceObj.fetchChallengeByIdFromSocial(data.topicId).then(function (qObj) {
                                let chaQues = [];
                                let gameId = _.random(0, 1000000000);
                                for(let key in JSON.parse(qObj)[data.topicId].questions){
                                    chaQues.push(JSON.parse(JSON.parse(qObj)[data.topicId].questions[key]));
                                }
                                gameData = {
                                    topicId: data.topicId,
                                    players: players[data.topicId],
                                    gameId: gameId,
                                    questionList: chaQues
                                };
                                for (let value in clients) {
                                    if (_.includes(players[data.topicId], value)) {
                                        // console.log(socket.nsp);
                                        socket.nsp.connected[clients[value].socket].emit('startGame', {
                                            str: "start the game",
                                            "gameData": gameData
                                        });
                                    }
                                }

                            });

                        }
                        socket.on('saveUserGameData', function (obj) {
                            console.log(obj);
                            gameDetails.id = obj.gameId;
                            gameDetails.topicId = data.topicId;
                            gameDetails.heldOn = new Date().toString();
                            gameDetails.type = 'challenge'

                            gameDetails.players.push({
                                name: obj.player,
                                score: obj.score
                            });
                            console.log(gameDetails);
                            if (gameDetails.players.length === 1) {
                                quizPlayServiceObj.savePlayedChallengeInfo(gameDetails).then(function (data) {
                                    console.log('game data stored!');
                                    for (let value of socketlist) {
                                        //  console.log(gameDetails.players[0].name);
                                        //  console.log(value.userName);
                                        if (gameDetails.players[0].name == value.userName) {
                                            socket.nsp.connected[value.id].emit('gameEnded',{
                                                gameId: gameDetails.id,
                                                type:'challenge'
                                            });
                                            value.disconnect();
                                        }
                                    }
                                    // console.log(socketlist);
                                    //game end and clear socketlist with corresponding players
                                    for (let val of gameDetails.players) {
                                        socketlist = socketlist.filter(function (obj) {
                                            return obj.userName != val.name;
                                        })
                                    }
                                    gameDetails.players = [];
                                    //console.log(socketlist);
                                }).catch(function (error) {
                                    console.log(error);
                                })
                            }
                        });
                        socket.on('testEvent', function (data) {
                            //console.log(data);
                        });
                        console.log(players);
                        console.log(clients);
                    }
                });

                socket.on('error', function (error) {
                    console.log('something wrong happened here');
                    //connection.end('socket can send more data but it will be ended');
                });
                // when the user disconnects.. perform this
                socket.on('disconnect', function () {
                    console.log('disconnected');
                    players = {};
                    clients = [];
                });


            })
            verify().catch(function (error) {
                //unauthencated access
                console.log("this is error " + error);
                socket.disconnect();
                // io.close()
            });
        });
    },
    socketlist: socketlist
}