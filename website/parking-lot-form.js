//window.alert("HELLO");

//initialise firebase database
var firebase = app_firebase;
var db = firebase.firestore();    

var emaill = userEmail;
console.log("Email address in form: ",emaill);

//console.log("hello");

function showData(){
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
        submitHandler: function() { console.log("Processing..."); }
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

    var plotname = pname.toLowerCase();
    plocation = plocation.toLowerCase();
    psecurity_officer_id = psecurity_officer_id.toLowerCase();
    pmax_occupancy = parseInt(pmax_occupancy);

    var FLAG = -1;

    if(plotname != ""){
        db.collection("parking_lots").get().then(function(querySnapshot) {
            console.log(querySnapshot);
            querySnapshot.forEach(function(doc) {
            if (doc.id == plotname){
                //parking lot id exists
                console.log("Doc id: ", doc.id);
                console.log("Parking lot id: ", plotname);
                FLAG = 1;
                alert("Parking lot exists..\nRe-enter parking lot name");
                return;
            }

            });
            //parking lot id does not exist; can ADD
            if (FLAG == -1){
                
                //check to ensure security officer exists
                if(psecurity_officer_id != ""){
                        db.collection("staff").get().then(function(querySnapshot) {
                            console.log(querySnapshot);
                            querySnapshot.forEach(function(doc) {
                            if (doc.id == psecurity_officer_id){
                                //security officer id exists
                                console.log("Doc id: ", doc.id);
                                console.log("Officer id: ", psecurity_officer_id);
                                FLAG = 1;

                                //add
                                db.collection("parking_lots").doc(plotname).set({
                                    //name: pname,
                                    location: plocation,
                                    max_occupancy: pmax_occupancy,
                                    security_officer_id: psecurity_officer_id,
                                    current_occupancy: pcurrent_occupancy
                                })
                                .then(function() {
                                    console.log("Document successfully written!");
                                    alert("Successfully added parking lot");
                                    window.location.replace("add-parking-lot.html");
                                })
                                .catch(function(error) {
                                    console.error("Error writing document: ", error);
                                });
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

            }
        });
        //security officer id is
    }

}

function display(){
    window.location.replace("display-parking-lots.html");
}



            /*
            if (FLAG == -1){
                console.log("FLAG = -1")
                //parking lot does not exists
                //add to db
                db.collection("parking_lots").doc(plotname).set({
                    //name: pname,
                    location: plocation,
                    max_occupancy: pmax_occupancy,
                    security_officer_id: psecurity_officer_id,
                    current_occupancy: pcurrent_occupancy
                })
                .then(function() {
                    console.log("Document successfully written!");
                    window.location.replace("add-parking-lot.html");
                })
                .catch(function(error) {
                    console.error("Error writing document: ", error);
                });
            }*/