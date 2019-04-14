var firebase = app_firebase;
var db = firebase.firestore(); 

var ADMIN_ROLE = 3;
var SECURITY_ROLE = 4;


(function (){
    console.log("In validate()")
    db.collection("staff").get().then(function(querySnapshot) {
      var data = -1;
      var isAdmin = -1;
      querySnapshot.forEach(function(doc) {
        
          //if email exists in staff collection
          if(doc.data().email == userEmail){
            console.log("Found email...");
            data = 1;
            //if user is admin
            if(doc.data().role == ADMIN_ROLE || doc.data().role == SECURITY_ROLE){
              console.log("Login rights for: ", userEmail);
              isAdmin = 1;
            }
          }
  
      });
          if(isAdmin == -1){
            //alert("You are not an ADMIN");
            window.location.replace("index.html");
          }
            
          if(data == -1)
            console.log("Did not find email in DB...");
  });
})()