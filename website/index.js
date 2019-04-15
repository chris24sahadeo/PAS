

//var app_firebase = {};

//(function(){
    /*
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
*/
  //app_firebase = firebase;
//})()

var firebase = app_firebase;
var db = firebase.firestore(); 

var ADMIN_ROLE = 3;

//control anonymous users
var mainApp = {};

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
      //alert("Invalid email address");
      window.location.replace("login.html");
    }

  });

  function logOut(){
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
      window.location.replace("index.html");
    }, function(error) {
      // An error happened.
    });
  }

  mainApp.logOut = logOut;

})()




var add_PL = "add_parking_lot";
var add_SO = "add_security_officer";


function authUser(clicked_id){
  //checkEmail(userEmail);
  //console.log("In authUser()");
  //console.log("User email: ",userEmail);

  console.log("Id btn: ",clicked_id);
  db.collection("staff").get().then(function(querySnapshot) {
    var data = -1;
    var isAdmin = -1;
    querySnapshot.forEach(function(doc) {
      
        console.log(doc.id, " => ", doc.data());
        //if email exists in staff collection
        if(doc.data().email == userEmail){
          console.log("Found email...");
          data = 1;
          //if user is admin
          if(doc.data().role == ADMIN_ROLE){
            console.log("Admin rights for: ", userEmail);
            isAdmin = 1;
            if(clicked_id == add_PL){
              //add parking lot page
              window.location.replace("add-parking-lot.html")
            }
            else if(clicked_id == add_SO){
              //add security officer
              window.location.replace("add-security-officer.html")
            }

          }
        }

    });
        if(isAdmin == -1){
          alert("You are not an ADMIN");
          //window.location.replace("index.html");
        }
          
        if(data == -1)
          console.log("Did not find email in DB...");
});
  
}

/*
//add/remove security officer
function authUser2(){
  //checkEmail(userEmail);
  console.log("In authUser()");
  console.log("User email: ",userEmail);

  db.collection("staff").get().then(function(querySnapshot) {
    var data = -1;
    var isAdmin = -1;
    querySnapshot.forEach(function(doc) {
      
        console.log(doc.id, " => ", doc.data());
        //if email exists in staff collection
        if(doc.data().email == userEmail){
          console.log("Found email...");
          data = 1;
          //if user is admin
          if(doc.data().role == ADMIN_ROLE){
            console.log("Admin rights for: ", userEmail);
            isAdmin = 1;
            window.location.replace("add-security-officer.html")

          }
        }

    });
        if(isAdmin == -1){
          alert("You are not an ADMIN");
          window.location.replace("index.html");
        }
          
        if(data == -1)
          console.log("Did not find email in DB...");
});
  
}
*/

