//window.alert("HELLO");

//initialise firebase database
var firebase = app_firebase;
var db = firebase.firestore();    

var emaill = userEmail;
console.log("Email address in form: ",emaill);


/*
db.collection("cities").doc("LA").set({
    name: "Los Angeles",
    state: "CA",
    country: "USA"
})
.then(function() {
    console.log("Document successfully written!");
})
.catch(function(error) {
    console.error("Error writing document: ", error);
});
*/


var Script = function () {

    $.validator.setDefaults({
        submitHandler: function() { alert("Successfully added security officer!"); }
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
    });


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