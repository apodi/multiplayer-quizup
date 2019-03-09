const firebase = require('../../config/firebase.config.js');
const firebaseDB = firebase.firebaseConfig().database();
const request = require('superagent')
/**
 * storeQuestions - using to store questions in Quiz-engine database
 */
function storeQuestions(questions) {
    console.log("Inside storeQuestions method:");
    var questionsRef = firebaseDB.ref("questionsList/");
    let resultObj = JSON.parse(questions)
   // console.log(resultObj);
    return questionsRef.set(resultObj);

}

/**
 * updateQuestions - using to update the questions in Quiz-engine database
 */
function updateQuestions(questions) {
    //console.log("Inside updateQuestions method :"+ JSON.stringify(questions));
    let questionsList = firebaseDB.ref("questionsList/");
    for (let key in questions) {
        let obj = questions[key];
        //console.log(JSON.stringify(obj));
        let firebaseKey = questionsList.push().getKey();
        console.log("firebaseKey :", firebaseKey);
        //console.log("child ", questionsList.child(firebaseKey));
        questionsList.child(key).set(obj);
        //questionsList.set(obj);
    }

}

function storeChallenges(challenges){
    console.log("Inside storeChallenges method:");
    let challengesRef = firebaseDB.ref("challenges/");
    let resultObj = JSON.parse(challenges)
    //console.log(resultObj);
    challengesRef.set(resultObj);
}


function storeGameDetails(gameDetails) {
    console.log("Inside storeGameDetails method");
    let gamesList = firebaseDB.ref("games/");
    let key = gamesList.push().getKey();
    //console.log("Key :", key);
    // console.log("child ", gamesList.child(key));
    return gamesList.child(key).set(gameDetails);
};

function savePlayedChallengeInfo(challengeInfo){
        console.log("Inside savePlayedChallengeInfo method");
        let challengesList = firebaseDB.ref("playedChallenges/");
        let key = challengesList.push().getKey();
        console.log("Key :", key);
       // console.log("child ", challengesList.child(key));
        return challengesList.child(key).set(challengeInfo);
    }


function fetchGamesByTopicId(topicId) {
    console.log("Inside fetchGamesByTopicId method" + topicId);

    return new Promise(function (resolve, reject) {
        let gamesRef = firebaseDB.ref("games/").orderByChild("topicId").equalTo(topicId);
        gamesRef.on("value", function (games) {
           // console.log(JSON.stringify(games.val()) + games.numChildren());
            resolve(games.val());
        }, function (error) {
            console.log("Error: " + error.code);
            reject(error.code)
        });

    });
}


function fetchChallengesById(id) {
    console.log("Inside fetchChallengesById method" + id);

    return new Promise(function (resolve, reject) {
        let playedChallenges = firebaseDB.ref("playedChallenges/").orderByChild("topicId").equalTo(id);
        playedChallenges.on("value", function (challenges) {
           // console.log(JSON.stringify(challenges.val()) + challenges.numChildren());
            resolve(challenges.val());
        }, function (error) {
            console.log("Error: " + error.code);
            reject(error.code)
        });

    });
}

    function readAllQuestionsByTopicId(topicId) {
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
    }

    function storeChallengeQuestions(challengeQuesDetails){
        console.log("Inside storeChallengeQuestions method");
        let challengeInfo = firebaseDB.ref("challenges/");
        let key = challengeInfo.push().getKey();
        //console.log("Key :", key);
        //console.log("child ", challengeInfo.child(key));
        challengeInfo.child(key).set(challengeQuesDetails);
    }

    



module.exports = {
    storeQuestions,
    updateQuestions,
    storeGameDetails,
    fetchGamesByTopicId,
    readAllQuestionsByTopicId,
    storeChallenges,
    fetchChallengesById,
    savePlayedChallengeInfo,
    storeChallengeQuestions
};