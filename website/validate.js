var firebase = app_firebase;
var db = firebase.firestore(); 

var ADMIN_ROLE = 3;


(function (){
    console.log("In validate()")
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
            }
          }
  
      });
          if(isAdmin == -1){
            //alert("You are not an ADMIN");
            window.location.replace("home.html");
          }
            
          if(data == -1)
            console.log("Did not find email in DB...");
  });
})()