// Firebase App is always required and must be first
var firebase = require("firebase/app");

// Add additional services that you want to use
require("firebase/auth");
require("firebase/database");
require("firebase/firestore");
require("firebase/messaging");
require("firebase/functions");

function firebaseConfig(){

            var config = {

            apiKey: "AIzaSyDpIj8fiDddZtfujM9ID4tmsaAzdnyy7aA",
            authDomain: "quiz-engine-258de.firebaseapp.com",
            databaseURL: "https://quiz-engine-258de.firebaseio.com",
            projectId: "quiz-engine-258de",
            storageBucket: "quiz-engine-258de.appspot.com",
            messagingSenderId: "78801561134"

             };
            firebase.initializeApp(config);
            //console.log("Firebase database :", firebase);
            return firebase;
}

module.exports = {firebaseConfig};

