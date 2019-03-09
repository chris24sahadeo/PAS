//import firebase from 'firebase';
//import 'firebase/firestore';

//const db = firebase.firestore();


var app_firebase = {};

(function(){
    
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAdTQUpXXV6BiKJ7PmW-6doswCo9qxvNQ0",
    authDomain: "parking-authorization-system.firebaseapp.com",
    databaseURL: "https://parking-authorization-system.firebaseio.com",
    projectId: "parking-authorization-system",
    storageBucket: "parking-authorization-system.appspot.com",
    messagingSenderId: "878965152449"
  };
  firebase.initializeApp(config);

  app_firebase = firebase;
})()
