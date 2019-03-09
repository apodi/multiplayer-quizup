function getRndmFromSet(questionsList) {
            //var rndm = Math.floor(Math.random() * questionsList.length);
            let min = 0;
            let max = questionsList.length;
            var rndm = Math.floor(Math.random() * (max - min + 1)) + min;
            return questionsList[rndm];
}

function  readRamdomQuestions(questionsArray) {
       
      var filteredQuestions = [];
            for(let i=0; i < 7 ;i++){

                    // Get a random number from predefined list
                    var randNum = getRndmFromSet(questionsArray); 
                    var previousNum = null;
                    
                    // Get another random number if number was the last chosen number in the set 
                    while(previousNum == randNum){
                    randNum = getRndmFromSet(questionsArray); 
                    }

                    // record the previously chosen number
                    previousNum = randNum;    

                    var arrayElementIndex = questionsArray.indexOf(randNum)
                    
                    if(questionsArray.length > 0){
                        questionsArray.splice(arrayElementIndex, 1); 
                        console.log(randNum); 
                    } else {
                        // Reset the set          
                        randNum = getRndmFromSet(questionsArray);
                        
                        // Get another random number if number was the last chosen number in the set before reset 
                        while(previousNum == randNum){
                            randNum = getRndmFromSet(questionsArray);                                        
                        }

                        previousNum = randNum;  
                        arrayElementIndex = questionsArray.indexOf(randNum)
                        questionsArray.splice(arrayElementIndex, 1);     
                        console.log(randNum);              
                    } 

                    filteredQuestions.push(randNum);

                }

                return filteredQuestions;

}

module.exports = {readRamdomQuestions};
