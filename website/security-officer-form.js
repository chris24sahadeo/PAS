//window.alert("HELLO");

//initialise firebase database
var firebase = app_firebase;
var db = firebase.firestore();    

var ADMIN_ROLE = 3;

var emaill = userEmail;
console.log("Email address in form: ",emaill);


function validate(){
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
  }


var Script = function () {

    $.validator.setDefaults({
        submitHandler: function() { console.log("Processing..."); }
    });

    $().ready(function() {

        //validate form
        //$("#feedback_form").validate();

        // validate signup form on keyup and submit
        $("#feedback_form").validate({
            rules: {
                firstname: {
                    required: true,
                },
                lastname: {
                    required: true,
                },
                email: {
                    required: true,
                },
                phoneno: {
                    required: true,
                    minlength: 7
                },
                security_officer: {
                    required: true,
                    minlength: 2,
                    //equalTo: "#password"
                },
            },
            messages: {                
                firstname: {
                    required: "Please enter first name.",
                    //minlength: "Your Full Name must consist of at least 6 characters long."
                },
                lastname: {
                    required: "Please enter last name",
                    //minlength: "Your Address must consist of at least 10 characters long."
                },
                email: {
                    required: "Please provide an email address."
                },
                phoneno: {
                    required: "Please provide a phone number."
                },
                security_officer: {
                    required: "Please provide a security officer id.",
                    minlength: "Must be at least 2 characters long."
                },
            }
        });

    });

}();


function submitUser(){
    var fname = document.forms["feedback_form"]["firstname"].value; 
    var lname = document.forms["feedback_form"]["lastname"].value; 
    var email = document.forms["feedback_form"]["email"].value;
    var sid = document.forms["feedback_form"]["security_officer"].value;
    var cnumber = document.forms["feedback_form"]["phoneno"].value;

    fname = fname.toLowerCase();
    lname = lname.toLowerCase();
    email = email.toLowerCase();
    sid = sid.toLowerCase();

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
                 db.collection("staff").doc(sid).set({
                    first_name: fname,
                    last_name: lname,
                    email: email,
                    role: 4,
                    //security_officer_id: sid,
                    phone_number: cnumber
                })
                .then(function() {
                    console.log("Document successfully written!");
                    alert("Successfully added security officer!");
                    window.location.replace("add-security-officer.html");
                })
                .catch(function(error) {
                    console.error("Error writing document: ", error);
                });
                      /*      
            if (FLAG == -1){
                
                //check to ensure security officer exists
                if(sid != ""){
                        db.collection("staff").get().then(function(querySnapshot) {
                            console.log(querySnapshot);
                            querySnapshot.forEach(function(doc) {
                            if (doc.id == sid){
                                //security officer id exists
                                console.log("Doc id: ", doc.id);
                                console.log("Officer id: ", psecurity_officer_id);
                                FLAG = 1;

               
                            }

                            });

                            if (FLAG == -1){
                                //id does not exists
                                alert("Security officer does not exists..\nRe-enter security officer ID");
                                return;
                            }
                        });
                        //security officer id is
                    }

            }*/
        });
        //security officer id is
    }
    /*
    db.collection("staff").doc(sid).set({
        first_name: fname,
        last_name: lname,
        email: email,
        role: 4,
        //security_officer_id: sid,
        phone_number: cnumber
    })
    .then(function() {
        console.log("Document successfully written!");
        //alert("Successfully added security officer!");
        window.location.replace("add-security-officer.html");
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    });*/


}

    /*
    do {
        var message = 'Please enter the following fields:\n';
        if (fname == "") {
            message += 'First Name\n';
        }
        if (lname == "") {
            message += 'Last Name\n';
        }
        if (email == "") {
            message += 'Email address\n';
        }
        if (cnumber == "") {
            message += 'Phone Number\n';
        }
        if (sid == "") {
            message += 'Security officer ID\n';
        }
        alert(message);
    }while ((fname == "" || lname == "" || email == "" || cnumber == "" || sid == "" ));
*/