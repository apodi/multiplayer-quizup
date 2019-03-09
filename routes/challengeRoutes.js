var express = require('express');
var router = express.Router();
const QuizPlayService = require('../src/quiz-play/quiz-play.service');

let quizPlayServiceObj = new QuizPlayService();

router.get("/:topicId", (req, res) => {
   console.log("Fetching All challenges information");
     quizPlayServiceObj.fetchChallengesById(req.params.topicId).then(function(response){
           // console.log(response , "Result ");
            res.send(response);
       },function(error){
            console.log(error);
            res.send(error);
       });;
  
});


module.exports = router;


 