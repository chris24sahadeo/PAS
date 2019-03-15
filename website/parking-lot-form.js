//window.alert("HELLO");

//initialise firebase database
var firebase = app_firebase;
var db = firebase.firestore();    

//console.log("hello");

function cancelForm(){
  //display parking lots collection
  db.collection("parking_lots").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
    });
});

}


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
        submitHandler: function() { alert("submitted!"); }
    });

    $().ready(function() {
        // validate the comment form when it is submitted
        $("#feedback_form").validate();

        // validate signup form on keyup and submit
        $("#register_form").validate({
            rules: {
                fullname: {
                    required: true,
                    minlength: 6
                },
                address: {
                    required: true,
                    minlength: 10
                },
                username: {
                    required: true,
                    minlength: 5
                },
                password: {
                    required: true,
                    minlength: 5
                },
                security_officer: {
                    required: true,
                    minlength: 2,
                    //equalTo: "#password"
                },
                location: {
                    required: true,
                    //email: true
                },
                occupancy: {
                    required: true,
                    
                },
                topic: {
                    required: "#newsletter:checked",
                    minlength: 2
                },
                agree: "required"
            },
            messages: {                
                fullname: {
                    required: "Please enter a Name.",
                    //minlength: "Your Full Name must consist of at least 6 characters long."
                },
                occupancy: {
                    required: "Please enter Max Occupancy",
                    //minlength: "Your Address must consist of at least 10 characters long."
                },
                location: {
                    required: "Please provide a please provide a location."
                },
                security_officer: {
                    required: "Please provide a security officer id.",
                    minlength: "Must be at least 2 characters long."
                },
            }
        });

    });

}();

function submitParkingLot(){
    var pname = document.forms["feedback_form"]["fullname"].value; 
    var plocation = document.forms["feedback_form"]["location"].value;
    var pmax_occupancy = document.forms["feedback_form"]["occupancy"].value;
    var psecurity_officer_id = document.forms["feedback_form"]["security_officer"].value;
    var pcurrent_occupancy = 0;

    db.collection("parking_lots").doc(pname).set({
        //name: pname,
        location: plocation,
        max_occupancy: pmax_occupancy,
        security_officer_id: psecurity_officer_id,
        current_occupancy: pcurrent_occupancy
    })
    .then(function() {
        console.log("Document successfully written!");
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    });
}

