import "bootstrap";
import '../assets/scss/index.scss';
import store from '../store/redux-store';


import FirebaseDBOpeations from '../firebase/firebase-db.service.js';

let firebaseDBOperations = new FirebaseDBOpeations();



const populatesocreboardPage = (socketCustom) => {
    const ScoreBoardHTML = `
       <section class="leaderboard">
       <p class="h4" style="margin-top: 50px;">ScoreBoard</p>
           <table class="table-fill">
               <thead>
                   <tr>
                       <th class="rank__title">Rank</th>
                       <th class="user__image">User</th>
                       <th class="Name__title">Name</th>
                       <th class="score__title">Score</th>
                   </tr>
               </thead>
               <tbody id="leaderboard">
               </tbody>
           </table>
           <button type="button" id="backToSocial" class="btn"><a href="https://quizrtsocial.herokuapp.com/">Quiz Social</a></button>
       </section>`;
    document.getElementById("gamePage").innerHTML = ScoreBoardHTML;
    $("button").removeClass("Highlightbtn").removeAttr('disabled').removeAttr('style');
    socreboardRender(socketCustom);
}

function socreboardRender(socketCustom) {
    socketCustom.on('gameEnded', function (data) {
        console.log("game id is: " + data.gameId);
        firebaseDBOperations.readAllGamesById(data.gameId,data.type).then(function (data) {
            for (let key in data) {
                var a = data[key];
            }
            a.players.sort(function (ply1, ply2) {
                return ply2.score - ply1.score
            })
           
            let usersImage = store.getState().players.users;
            var tableRef = document.querySelector('.table-fill').getElementsByTagName('tbody')[0];
            for (var i = 0; i < a.players.length; i++) {
                let userImage = "";
                if(store.getState().gameType == "multiUserQuiz"){
                    let usersImage = store.getState().players.users;
                    userImage = usersImage.filter((user) => { 
                        return user.userName == a.players[i].name;
                    });
                    userImage = userImage[0].userPhotoURL;
                }else{
                    userImage = store.getState().userPhotoURL;
                }
                var tr = document.createElement('tr');
                for (var j = 0; j < 4; j++) {
                    if (j == 0) {
                        var td = document.createElement('td');
                        td.appendChild(document.createTextNode(i + 1));
                        tr.appendChild(td)
                    } else if (j == 1) {
                        var td = document.createElement('td');
                        let img = document.createElement('img');
                        img.setAttribute("src", userImage);
                        img.className = "card-img-top card-img-scoreboard rounded-circle";
                        td.appendChild(img);
                        tr.appendChild(td)
                    }else if (j == 2) {
                        var td = document.createElement('td');
                        td.appendChild(document.createTextNode(a.players[i].name));
                        tr.appendChild(td)
                    } else {
                        var td = document.createElement('td');
                        td.appendChild(document.createTextNode(a.players[i].score));
                        tr.appendChild(td)
                    }
                }
                tableRef.appendChild(tr);
            }
        });
    });

}

module.exports = {
    populatesocreboardPage: populatesocreboardPage
}