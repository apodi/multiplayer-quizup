import io from 'socket.io-client';
import C from '../store/constants';
import store from '../store/redux-store';
import FirebaseDBOpeations from '../firebase/firebase-db.service'
let firebaseDBOperations = new FirebaseDBOpeations();
const getUrlVars = () => {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}


function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};


module.exports = (token, userName, userPhotoURL) => {
    //for production 
    store.dispatch({
        type: C.ACTIVE_USER,
        payload: userName,
        userPhotoURL: userPhotoURL
    });
    //Production
    //const socket = getUrlVars()['type'] == 'challenge' ? io('/challenge') : io('/multiplayer');

    //for development
   const socket = getUrlVars()['type'] == 'challenge'?io('http://localhost:8081/challenge'):io('http://localhost:8081/multiplayer');
    socket.on('connect', function () {
        socket.emit('authenticate', {
            token: token,
            userName: userName,
            userPhotoURL: userPhotoURL
        });
        socket.on('authenticated', function (data) {
            //console.log(data);
            if (getUrlVars()['type'] === "challenge") {
                socket.emit('sendTopicId', {
                    topicId: getUrlVars()['challengeId']
                });
            } else {
                socket.emit('sendTopicId', {
                    topicId: getUrlVars()['topicId']
                });
            }
            socket.on('startGame', function (data) {
              // console.log(data);
               // socket.emit('dequeueMe', {});
                socket.gameId = data.gameData.gameId;
                setTimeout(function () {
                    store.dispatch({
                        type: C.START_GAME,
                        Queslist: data.gameData.questionList,
                        socketCustom: socket,
                        userPhotoURL: userPhotoURL
                    });
                }, 3000);

            });
            socket.on('sendPlayerAddedInfo', function (data) {
               // console.log(data);
                store.dispatch({
                    type: C.START_WAIT,
                    payload: data,
                    userPhotoURL: userPhotoURL
                });
                socket.emit('testEvent', {
                    userName: userName
                });
            });
            socket.on('sendAllScores', function (data) {
               // console.log(data);
                store.dispatch({
                    type: C.GET_LIVE_SCORE,
                    payload: data
                });
            });
        })
    });
}