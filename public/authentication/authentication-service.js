const gameManager = require('../game-manager/game-manager');

// Initialize Firebase
var config = {
    apiKey: "AIzaSyAbnYLJNr40sI8-xSzlHe_kp1YxKG1PRKg",
    authDomain: "quiz-engine-7530b.firebaseapp.com",
    databaseURL: "https://quiz-engine-7530b.firebaseio.com",
    projectId: "quiz-engine-7530b",
    storageBucket: "quiz-engine-7530b.appspot.com",
    messagingSenderId: "1012392434323"
};
firebase.initializeApp(config);

const provider = new firebase.auth.GoogleAuthProvider();
//provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
firebase.auth().signInWithPopup(provider).then(function (result) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    //console.log("full user details =");
    //console.log(user);
    var idToken = result.credential.idToken;
    gameManager(idToken,user.displayName,user.photoURL);
    
    //console.log('Authenticated User is:', user.displayName);
    // ...
}).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
});