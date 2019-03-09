import C from './constants';

const  UpdateQuesList = (qus) => {
    let newques=qus;
    qus.forEach(function(element,i) {
         let option =element.options;
         let newobj=objectfun(option);
         newques[i].options=newobj;
      });
      return newques;
}

const objectfun = (arr) =>{
    let result = {};
    for (let i=0; i<arr.length; i++) {
    let obj=arr[i];
    let key1=Object.keys(arr[i])[0];
    
    let value=obj[key1];
    result[key1]=value;
    }
    return result;
}

const getUrlVars = () => {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

export const allGames = (currentstate, action) => {
    let cstate = currentstate;
    switch (action.type) {
        case C.START_WAIT:
            cstate.players = action.payload;
            cstate.action = action.type;
            //cstate.userPhotoURL = action.userPhotoURL;
            return cstate;
        case C.START_GAME:
            cstate.quesList = action.Queslist;            
            cstate.action = action.type;
            cstate.userPhotoURL = action.userPhotoURL;
            if (getUrlVars()['type'] === "challenge") {
                cstate.quesList= UpdateQuesList(action.Queslist);
                cstate.gameType = "challenge";
            }else{
                cstate.gameType = "multiUserQuiz";
            }
            cstate.socketCustom = action.socketCustom;
            return cstate;
        case C.ACTIVE_USER:
            cstate.activeUser= action.payload;
            cstate.action= action.type;
            cstate.score=0;
            cstate.answersList=[];
            return cstate;
        case C.ANSWER:
            let ansarr=cstate.answersList.concat(action.payload);
            cstate.answersList= ansarr;
            cstate.action= action.type;
            return cstate;
        case C.SCORE:        
            cstate.score= action.payload;
            cstate.action= action.type;
            return cstate;
        case C.GAME_ID:        
            cstate.gameId= action.payload;
            cstate.action= action.type;
            return cstate;
        case C.GAME_OVER:        
            cstate.action= action.type;
            return cstate;  
        case C.GET_LIVE_SCORE:
            cstate.playerScore = action.payload;
            cstate.action= action.type;
            return cstate;          
        default:
            return cstate;
    }
};

export default allGames;

