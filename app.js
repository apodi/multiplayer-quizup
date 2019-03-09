import './public/assets/scss/index.scss';
import 'popper.js';
import "bootstrap";
import './public/assets/media/imgs/logo.png';
import './public/authentication/authentication-service';
import './public/game-manager/game-manager';
import subscribeStore from './public/store/subscribe';
import FirebaseDBOpeations from './public/firebase/firebase-db.service.js';

document.addEventListener('DOMContentLoaded', () => {
    //console.log('app initialized');
    subscribeStore();
});

let firebaseDBOperations = new FirebaseDBOpeations();

let topicId = "Politics";
//console.log(firebaseDBOperations.readAllQuestionsByTopicId(topicId));


//console.log(firebaseDBOperations.readAllGamesByTopicId(topicId));

let gameId = "g001"
//console.log(firebaseDBOperations.readAllGamesById(gameId));


let gameDetails = {
        id : "g002",
        topicId : 1,
        heldOn : new Date(),
        players :[
            {
                id: "p012",
                name: "saho1",
                score : 3
            }
        ]
       
}


