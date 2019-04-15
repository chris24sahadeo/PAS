var firebase = app_firebase;
var db = firebase.firestore(); 

var userEmail;

var VALID = -1;

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
    
      db.collection("staff").get().then(function(querySnapshot) {

        querySnapshot.forEach(function(doc) {
          
            console.log(doc.id, " => ", doc.data());
            //if email exists in staff collection
            if(doc.data().email == userEmail){
              console.log("Found email...");
              VALID = 1;
              window.location.replace("home.html");
            }
        });

        if(VALID == -1){
            //invalid user
            window.location.replace("index.html");
            //alert("INVALID LOGIN");
        }
    });  


    }else{
      //redirect to login page
      uid = null;
      alert("Invalid email address");
      window.location.replace("index.html");
    }

  });

})()