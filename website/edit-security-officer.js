//initialise firebase database
var firebase = app_firebase;
var db = firebase.firestore();    

(function() {
    console.log("Checking queries.");
    
    let queryString = decodeURIComponent(window.location.search);
    queryString = queryString.substring(1);
    console.log("Query string: ",queryString);
    var queries = queryString.split("&");
    console.log("Queries: ",queries);
    /*
    var letterNumber = "^[0-9a-zA-Z]+$";
    if (queryString != "" && queries[0].match(letterNumber)) {
        db.collection("users").doc(queries[0]).get().then(function(data) {
            if (data.exists) {
                document.getElementById("userHeader").innerHTML = "New Driver Information for " 
                                        + data.data().first_name + " " + data.data().last_name;
            } else {
                alert("User not found. Weird. This shouldn't happen.\n\nTry searching for a user instead. You will now be redirected to the search page.")
                window.location.href="license_plate_search.html";
            }
        });
    } else {
        alert("User was not specified.\n\nTry searching for a user instead. You will now be redirected to the search page.");
        window.location.href="license_plate_search.html";
    }*/
    
    db.collection("staff").doc(queries[0]).get().then(function (doc) {
        console.log("Adding data to form fields.");
        document.forms["edit_user_form"]["fname"].value = doc.data().first_name;
        document.forms["edit_user_form"]["lname"].value = doc.data().last_name;
        document.forms["edit_user_form"]["email"].value = doc.data().email;
        document.forms["edit_user_form"]["pnumber"].value = doc.data().phone_number;
    });

})()

function update() {
    let queryString = decodeURIComponent(window.location.search);
    queryString = queryString.substring(1);
    var queries = queryString.split("&");

    var fname = document.getElementById("fname").value;
    var lname = document.getElementById("lname").value;
    var email = document.getElementById("email").value;
    var pnumber = document.getElementById("pnumber").value;

    if (fname == "" || lname == "" || email == "" || pnumber == "") {
        var message = 'Please enter the following fields:\n';
        if (fname == "") {
            message += 'First Name\n';
        }
        if (lname == "") {
            message += 'Last Name\n';
        }
        if (email == "") {
            message += 'E-Mail\n';
        }
        if (pnumber == "") {
            message += 'Phone Number\n';
        }
        alert(message);
        return;
    }

    var FLAG = -1;

    if(sid != ""){
        db.collection("staff").get().then(function(querySnapshot) {
            console.log(querySnapshot);
            querySnapshot.forEach(function(doc) {
            if (doc.id == sid){
                //officer id exists
                console.log("Doc id: ", doc.id);
                console.log("Security officer id: ", sid);
                FLAG = 1;
                alert("Security officer exists..\nRe-enter security officer info");
                return;
            }

            });
            //parking lot id does not exist; can ADD
                 //add
                 db.collection("staff").doc(queries[0]).update({
                    first_name: fname,
                    last_name: lname,
                    email: email,
                    phone_number: pnumber
                }).then(function() {
                    console.log("Successfully updated security officer information!");
                    alert("Successfully updated security officer.\n\nYou will now be redirected to the search page.")
                    window.location.href="search-security-officer.html";
                }).catch(function(error) {
                    // The document probably doesn't exist.
                    console.error("Error updating document: ", error);
                    return;
                });     
        });
        //security officer id is
    }

}

var ADMIN_ROLE = 3;

function validate(){
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
            window.location.replace("index.html");
          }
            
          if(data == -1)
            console.log("Did not find email in DB...");
  });
  }