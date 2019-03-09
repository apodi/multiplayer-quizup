import C from '../store/constants';
import store from '../store/redux-store';
import FirebaseDBOpeations from '../firebase/firebase-db.service';

var selectedval, secstrack, secsclicked;;

const populateWaitingPage = (data) => {
    document.getElementById("waitingPage").classList.remove("d-none");
    let waitingPageHTML = "";
    let playerCount = 0;
    data.forEach((player) => {
        playerCount++;
        waitingPageHTML += `<div class="card col-sm-3">
                                <img class="card-img-top rounded-circle" src=${player.userPhotoURL} alt="Card image cap">
                                <div class="card-body">
                                    <h5 class="card-title">${player.userName}</h5>
                                </div>
                            </div>`;
    });
    document.getElementById("waitingPageRow").innerHTML = waitingPageHTML;
    dynamicProgressBarWaiting(playerCount);
}

const populateScoreInGamePage = (playerScoreData) => {
    playerScoreData.sort(compareUsersForLiveScore);
    if (document.getElementsByClassName("userLiveScore").length != 0) {
        let userScoresDivList = document.getElementsByClassName("userLiveScore");
        let i = 0;
        playerScoreData.forEach((player) => {
            userScoresDivList[i].innerHTML = player.score;
            i++;
        });
    }
}

const populateGamePage = (socketCustom) => {
    document.getElementById("waitingPage").classList.add("d-none");
    const gamePageHTML = `<div class="container container-game">
		<div class="row clearfix">
		  <div class="col-sm-12"><div id="myProgress"><div id="myBar"></div></div></div>
        </div>
        <p class="d-none">Score: <span id="answerscore" style="color:#DF691A">0</span></p>
        <div class="container">
            <div class="row flex-item-center" id="playerScoreInfo">
            </div>
        </div>
        <div class="row col-sm-12 quesSec">
            <div class="questab rextent"><input type="hidden" id="quesst" value=0 > <p><span id="quesnumber">1. </span><span id="question"> Which cricketer had scored highest individual score in first-class cricket? </span></p></div>
		</div>
		<div class="row col-sm-12">      
            <div class="quesOptions anscont rextent"><button id="opt1">Don Bradman</button></div>
        </div> 
        <div class="row col-sm-12"> 
            <div class="quesOptions anscont rextent"><button id="opt2">Brain Lara</button></div>
        </div> 
        <div class="row col-sm-12"> 
            <div class="quesOptions anscont rextent"><button id="opt3">Sachin tendulkar</button></div>
        </div> 
        <div class="row col-sm-12"> 
            <div class="quesOptions anscont rextent"><button id="opt4">rahul dravid</button></div>
        </div> 
		 
      </div>`;
    document.getElementById("gamePage").innerHTML = gamePageHTML;
    let scorePageHTML = "";
    if (store.getState().gameType == "multiUserQuiz") {
        let usersData = store.getState().players.users;
        usersData.sort(compareUsers);
        usersData.forEach((player) => {
            scorePageHTML += `<div class="card col-sm-2 card-user-ques-page">
                            <img class="card-img-top card-img-top-question rounded-circle" src=${player.userPhotoURL} alt="Card image cap">
                            <div class="">
                            <div class="card-text">${player.userName} </div>
                            <div class="card-text userLiveScore"></div>
                            </div>
                        </div>`;
        });
    } else {
        let userScore = store.getState().score;
        scorePageHTML = `<div class="card col-sm-2 card-user-ques-page">
                            <div class="card-text userLiveScoreChallenge"></div>
                            </div>
                        </div>`;
    }
    document.getElementById("playerScoreInfo").innerHTML = scorePageHTML;
    updateQues(0);
    dynamicProgressBarQuestion(socketCustom);
    optionclickEvents();
}

const dynamicProgressBarQuestion = (socketCustom) => {
    var elem = document.getElementById("myBar");
    var width = 1;
    secstrack = width;
    var id = setInterval(frame, 100);

    function frame() {
        if (width >= 100) {
            clearInterval(id);
            changequestion(socketCustom);
            if(store.getState().gameType == "challenge"){
                document.getElementsByClassName("userLiveScoreChallenge")[0].innerHTML = "Your Score : "+ store.getState().score;
            }
        } else {
            width++;
            secstrack = width;
            elem.style.width = width + '%';
        }
    }
}


const changequestion = (socketCustom) => {

    let Canswer = store.getState();
    let quesst = parseInt(document.getElementById("quesst").value, 10);
    let nextques = parseInt(quesst) + 1;
    $("button").css("visibility","hidden");
    saveUpdatedScore();
    if (nextques < 7) {
        socketCustom.emit('gameUserData', {
            player: Canswer.activeUser,
            score: $("#answerscore").html(),
            gameId: socketCustom.gameId
        });
    }
    if (nextques == 7) {
        savedatatoState();
        socketCustom.emit('saveUserGameData', {
            player: Canswer.activeUser,
            score: Canswer.score,
            gameId: socketCustom.gameId
        });
        return;
    }

    updateQues(nextques);

    dynamicProgressBarQuestion(socketCustom);

}

const updateQues = (nextques) => {

    $("#quesst").val(nextques);
    $("#quesnumber").html((parseInt(nextques) + 1) + ". ");
    let arrdata = store.getState().quesList[nextques];
    let OptionList = Object.values(arrdata.options);
    let OptionListRandom= shuffle(OptionList);
    
    document.getElementById("question").innerHTML=arrdata.question;
    
    document.getElementById("opt1").innerHTML=OptionListRandom[0];
    document.getElementById("opt2").innerHTML=OptionListRandom[1];
    document.getElementById("opt3").innerHTML=OptionListRandom[2];
    document.getElementById("opt4").innerHTML=OptionListRandom[3]; 
    
    setTimeout(function() {
        $("button").css("visibility","visible");
      }, 1000);

    $("button").removeClass("Highlightbtn").removeAttr('disabled').css("background","buttonface");
}


const shuffle = (array) => {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

const optionclickEvents = () => {
    $("button").on("click", function () {
        let activeBtn = $(this).attr("id")
        addClassToBtn(activeBtn);
        selectedval = $(this).text();
        let quesst = parseInt(document.getElementById("quesst").value, 10);
        let currectans = CorrectAnswer(quesst);
        if (selectedval == currectans) {
            $("button:not(.Highlightbtn)").css("background", "green");
            // let scoreUI = parseInt(store.getState().score);
            // let updatedScr = UpdateScore(scoreUI);
            // $("#answerscore").html(updatedScr);
            secsclicked = secstrack;
        } else {
            $("button:not(.Highlightbtn)").css("background", "red");
        }

    });
}


const saveUpdatedScore = () => {

    let quesst = parseInt(document.getElementById("quesst").value, 10);
    let currectans = CorrectAnswer(quesst);
    let updatedScr = store.getState().score;
    if (selectedval == currectans) {

        updatedScr = UpdateScore(updatedScr);
        store.dispatch({
            type: C.SCORE,
            payload: updatedScr
        });
    }
    if (!selectedval) {
        selectedval = null;
    }

    store.dispatch({
        type: C.ANSWER,
        payload: selectedval
    });
    selectedval = null;

    $("#answerscore").html(updatedScr);


}


const CorrectAnswer = (curques) => {

    let Canswer = store.getState();
    let arrdata = Canswer.quesList[curques];
    let AnswerObj = arrdata.answer;
    let ansopt = arrdata.options;
    let CorrectAnswer = ansopt[AnswerObj];
    return CorrectAnswer;
}

const UpdateScore = (cscore) => {

    let addpoints = 1 * (10 - (Math.round(secsclicked / 10)));
    let updatedScore = cscore + addpoints;
    secsclicked = 0;
    return updatedScore;
}


const savedatatoState = () => {

    console.log(store.getState());


    store.dispatch({
        type: C.GAME_OVER,
        payload: "gameOver"
    });

    const getUrlVars = () => {
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
            vars[key] = value;
        });
        return vars;
    }


}

const addClassToBtn = (btnCtrl) => {

    $("button").addClass("Highlightbtn").attr('disabled', 'disabled');

    $("#" + btnCtrl).removeClass("Highlightbtn").removeAttr('disabled');

}

const dynamicProgressBarWaiting = (playerCount) => {
    let current_progress = playerCount * 33.3;
    $("#dynamicProgressBar")
        .css("width", current_progress + "%")
        .attr("aria-valuenow", current_progress);

    if (playerCount > 2) {
        document.getElementById("waitingText").classList.add("d-none");
    }
}

const compareUsers = (a, b) => {
    if (a.userName.toLowerCase() < b.userName.toLowerCase())
        return -1;
    if (a.userName.toLowerCase() > b.userName.toLowerCase())
        return 1;
    return 0;
}

const compareUsersForLiveScore = (a, b) => {
    if (a.player.toLowerCase() < b.player.toLowerCase())
        return -1;
    if (a.player.toLowerCase() > b.player.toLowerCase())
        return 1;
    return 0;
}

module.exports = {
    populateWaitingPage: populateWaitingPage,
    populateGamePage: populateGamePage,
    populateScoreInGamePage: populateScoreInGamePage
}