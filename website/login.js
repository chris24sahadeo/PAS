//import app_firebase from './firebase.js' 

var firebase = app_firebase;
var db = firebase.firestore(); 

var ADMIN_ROLE = 3;
var SECURITY_ROLE = 4;

(function(){
  var ui = new firebaseui.auth.AuthUI(firebase.auth());
  var uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: function(authResult, redirectUrl) {
        // User successfully signed in.
        // Return type determines whether we continue the redirect automatically
        // or whether we leave that to developer to handle.
        return true;
      },
      uiShown: function() {
        // The widget is rendered.
        // Hide the loader.
        document.getElementById('loader').style.display = 'none';
      }
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    signInSuccessUrl: 'test.html',
    signInOptions: [
      // Leave the lines as is for the providers you want to offer your users.
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      //firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      /*
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        firebase.auth.GithubAuthProvider.PROVIDER_ID,
        firebase.auth.PhoneAuthProvider.PROVIDER_ID
      */
    ],
    // Terms of service url.
    tosUrl: '<your-tos-url>',
    // Privacy policy url.
    privacyPolicyUrl: 'home.html'
  };

  ui.start('#firebaseui-auth-container', uiConfig);

  firebase.auth().onAuthStateChanged(function(user){
    if(user){
      console.log("Email: ",user.email);
      db.collection("staff").get().then(function(querySnapshot) {
        var data = -1;
        var isAdmin = -1;
        querySnapshot.forEach(function(doc) {
          
            //if email exists in staff collection
            if(doc.data().email == user.email){
              console.log("Found email...");
              data = 1;
              //if user is admin
              if(doc.data().role == ADMIN_ROLE || doc.data().role == SECURITY_ROLE){
                console.log("Login rights for: ", user.email);
                isAdmin = 1;
                window.location.replace("home.html");
              }
            }
    
        });
            if(isAdmin == -1){
              //alert("You are not an ADMIN");
              //window.location.replace("index.html");
              console.log("...");
            }
              
            if(data == -1)
              console.log("Did not find email in DB...");
    });
      
    }else{
      console.log("Not signed in");
    }

  });
  

})()


/*
var userEmail;

(function (){
  var firebase = app_firebase;
  var uid = null;
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      uid = user.uid;
      console.log("User id: ",uid);

      userEmail = user.email;
      console.log("Email log in: ", userEmail);
      //console.log("User record: ",user.toJSON());
    
    }else{
      //redirect to login page
      uid = null;
      window.location.replace("login.html");
    }

  });
  */
