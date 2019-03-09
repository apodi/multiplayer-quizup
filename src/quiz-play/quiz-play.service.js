const request = require('superagent')
let firebaseDBService = require('../firebase/firebase-server-db.service');

module.exports = class QuizPlayService {

    constructor() {
        console.log("Inside QuizPlayService Layer");
    }

    loadAllQuestions() {

       console.log("Inside loadAllQuestions method");  
            request
            .get('https://quizgenx.herokuapp.com/firebase/api/questions'
            ).end(function (err, res) {
                if (err) {
                console.log(err)
                } else {
                console.log(res.text)
                firebaseDBService.storeQuestions(res.text);
                }
            })
    };

    loadAllChallenges() {

       console.log("Inside loadAllChallenges method");  
            request
            .get('https://quizrtsocial.herokuapp.com/api/allChallenges'
            ).end(function (err, res) {
                if (err) {
                console.log(err)
                } else {
                //console.log(res.text)
                firebaseDBService.storeChallenges(res.text);
                }
            })
    };

    fetchChallengeByIdFromSocial(id) {

        console.log("Inside fetchChallengeByIdFromSocial method"); 
        return new Promise(function (resolve, reject) { 
             request
             .get('https://quizrtsocial.herokuapp.com/api/getParticularChallenge?challengeId='+id
             ).end(function (err, res) {
                 if (err) {
                 console.log(err)
                 reject(err);
                 } else {
                // console.log(res.text)
                 firebaseDBService.storeChallengeQuestions(res.text);
                 resolve(res.text);
                 }
             })
        });
     }

    fetchAllChallenges(id){
         return firebaseDBService.fetchChallengesById(id);
    }

    savePlayedChallengeInfo(challengeInfo){
        return firebaseDBService.savePlayedChallengeInfo(challengeInfo);
    }
    updateQuestions(questions) {
        firebaseDBService.updateQuestions(questions);
    };

    fetchGamesByTopicId(topicId){
       return firebaseDBService.fetchGamesByTopicId(topicId);
    }

    fetchChallengesById(topicId){
       return firebaseDBService.fetchChallengesById(topicId);
    }
}



