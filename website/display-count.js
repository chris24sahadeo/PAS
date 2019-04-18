//initialise firebase database
var firebase = app_firebase;
var db = firebase.firestore();    

var GOAL = "fst";

db.collection("parking_lots").get().then(function(querySnapshot) {

    querySnapshot.forEach(function(doc) {
      var data = -1;
        console.log(doc.id, " => ", doc.data());
        //if email exists in staff collection
        if(doc.id == GOAL){
          data = 1;
          document.getElementById("p_lot_name").innerHTML = "FST";
          document.getElementById("p_lot_count").innerHTML = doc.data().current_occupancy;
        }

    });   
      
});  