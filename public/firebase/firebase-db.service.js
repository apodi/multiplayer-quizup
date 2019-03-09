const request = require('superagent')
const firebase = require('../../config/firebase.config');
const randomNumber = require('../utility/random-questions.service');

let firebaseDB = firebase.firebaseConfig().database();
let ref = firebaseDB.ref();


export default class FirebaseDBOpeations {

    constructor() {
        console.log("Inside FirebaseDBOpeations Layer");
    }


    readAllQuestionsByTopicId(topicId) {
        console.log("Inside readAllQuestions method : " + topicId);

        return new Promise(function (resolve, reject) {

            let questionsRef = firebaseDB.ref("questionsList/").child(topicId);

            questionsRef.on("value", function (questions) {

                const count = questions.numChildren();
                if (questions.val() && questions.val() !== null) {

                    //console.log(Object.values(questions.val()));
                    //let questionsArray = Object.entries(questions.val()).map(e => Object.assign(e, { 0: +e[0] }));
                    let questionsArray = Object.entries(questions.val()).map(([k, v]) => ([k, v]));

                    let startIndex = Math.round((Math.random() * count + 1));
                    let index = 1;
                    let inputIndex = "";

                    if (count >= startIndex + 7) {
                        inputIndex = questionsArray[startIndex];
                        // let str = '';
                        // let lastIndex = startIndex+7;
                        // let data = questions.val();
                        // let i = 0;
                        // for(const qKey in data) {
                        //     if(i == startIndex) {
                        //         str = qKey;
                        //         break;
                        //     }
                        //     i++;
                        // }
                        // let query = questionsRef.orderByKey().
                        // startAt(str).limitToFirst(7);

                    } else {
                        inputIndex = questionsArray[1];
                    }

                    index = inputIndex[0];

                    let query = questionsRef.orderByKey().startAt(index).limitToFirst(7);

                    query.on("value", function (filteredQuestions) {
                        //console.log("filteredQuestions :", JSON.stringify(filteredQuestions) + filteredQuestions.numChildren());
                        if (filteredQuestions) {
                            let temResult = Object.values(filteredQuestions.val());
                            resolve(temResult);
                        } else {
                            reject("Error While processing to fetch random questions")
                        }
                    });


                } else {
                    reject("No/Sufficient Questions Available in Database")
                }

            }, function (error) {
                console.log("Error: " + error.code);
                reject(error.code)
            });

        });
    };


    readAllGamesByTopicId(topicId) {
        console.log("Inside readAllGamesByTopicId method");

        return new Promise(function (resolve, reject) {
            let gamesRef = firebaseDB.ref("games/").orderByChild("topicId").equalTo(topicId);

            gamesRef.on("value", function (games) {
                //console.log(games.val());
                resolve(games.val());
            }, function (error) {
                console.log("Error: " + error.code);
                reject(error.code)
            });

        });
    };

    readAllGamesByTopicIdAndDate(currentDate, topicId) {
        console.log("Inside readAllGamesByTopicIdAndDate method");

        return new Promise(function (resolve, reject) {
            let gamesRef = firebaseDB.ref("games/").orderByChild("topicId").equalTo(topicId);

            gamesRef.on("value", function (games) {
                console.log(games.val());
                resolve(games.val());
            }, function (error) {
                console.log("Error: " + error.code);
                reject(error.code)
            });

        });
    };


    readAllGamesById(gameId, type) {
        console.log("Inside readAllGamesById method");

        return new Promise(function (resolve, reject) {
            let collection = type === "challenge" ? "playedChallenges" : "games";
            let gameDetails = firebaseDB.ref(collection + "/").orderByChild("id").equalTo(gameId);

            gameDetails.on("value", function (game) {
                console.log(game.val());
                resolve(game.val());
            }, function (error) {
                console.log("Error: " + error.code);
                reject(error.code)
            });

        });
    };


    readAllGames() {
        console.log("Inside readAllGames method");

        return new Promise(function (resolve, reject) {
            let gameDetails = firebaseDB.ref("games/");

            gameDetails.on("value", function (game) {
                console.log(game.val());
                resolve(game.val());
            }, function (error) {
                console.log("Error: " + error.code);
                reject(error.code)
            });

        });
    };

    fetchChallengeById(challengeId) {
        console.log("Inside fetchChallengeById method");

        return new Promise(function (resolve, reject) {
            let challengeDetails = firebaseDB.ref("challenges/");

            challengeDetails.on("value", function (challenge) {
                console.log(challenge.val());
                resolve(challenge.val());
            }, function (error) {
                console.log("Error: " + error.code);
                reject(error.code)
            });

        });
    };

    fetchChallengeByIdFromSocial(id) {

        console.log("Inside fetchChallengeByIdFromSocial method");
        return new Promise(function (resolve, reject) {
            request
                .get('https://quizrtsocial.herokuapp.com/api/getParticularChallenge?challengeId=' + id).end(function (err, res) {
                    if (err) {
                        console.log(err)
                        reject(err);
                    } else {
                        console.log(res.text)
                        firebaseDBService.storeChallengeQuestions(res.text);
                        resolve(res.text);
                    }
                })
        });
    };


    storeGameDetails(gameDetails) {
        console.log("Inside storeGameDetails method");
        let gamesList = firebaseDB.ref("games/");
        let key = gamesList.push().getKey();
        console.log("Key :", key);
        console.log("child ", gamesList.child(key));
        gamesList.child(key).set(gameDetails);
    };


}