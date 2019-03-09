var express = require('express');
var router = express.Router();
const QuizPlayService = require('../src/quiz-play/quiz-play.service');

let quizPlayServiceObj = new QuizPlayService();
//quizPlayServiceObj.loadAllQuestions();
//quizPlayServiceObj.loadAllChallenges();

router.post("/", (req, res) => {
   console.log("Updating Quiz-engine questions data") + //JSON.stringify(req.body));
   quizPlayServiceObj.updateQuestions(req.body);
   res.send({
    status : "Successfully updated"
  })
});


router.get("/fetch", (req, res) => {
   console.log("Fetching questions data from Quiz-engine");
  
   res.send({
    status : "Fetching questions"
  })
});

module.exports = router;


 