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
    
    db.collection("parking_lots").doc(queries[0]).get().then(function (doc) {
        console.log("Adding data to form fields.");
        document.forms["edit_user_form"]["name"].value = doc.id;
        document.forms["edit_user_form"]["loc"].value = doc.data().location;
        document.forms["edit_user_form"]["cmaxoccup"].value = doc.data().max_occupancy;
        document.forms["edit_user_form"]["officer_id"].value = doc.data().security_officer_id;
    });

})()


function validate(security_officer_id){
    console.log("In validate()");
    db.collection("staff").get().then(function(querySnapshot) {
        console.log(querySnapshot);
        querySnapshot.forEach(function(doc) {
        if (doc.id == security_officer_id){
            //security officer id exists
            console.log("Doc id: ", doc.id);
            console.log("Officer id: ", security_officer_id);
            return true;
        }
            
        });
        //console.log("Record: ",data);
    });
    return false;
}

function update() {
    let queryString = decodeURIComponent(window.location.search);
    queryString = queryString.substring(1);
    var queries = queryString.split("&");

    var name = document.getElementById("name").value;
    var loc = document.getElementById("loc").value;
    var max_occupancy = document.getElementById("cmaxoccup").value;
    var security_officer_id = document.getElementById("officer_id").value;

    //!!!!!!!!!!!!!!!!!!TO DO: Validate security officer ID!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


    if (name == "" || loc == "" || max_occupancy == "" || security_officer_id == "") {
        var message = 'Please enter the following fields:\n';
        if (name == "") {
            message += 'Name\n';
        }
        if (loc == "") {
            message += 'Location\n';
        }
        if (max_occupancy == "") {
            message += 'Max Occupancy\n';
        }
        if (security_officer_id == "") {
            message += 'Security Officer ID\n';
        }
        alert(message);
        return;
    }

    var FLAG = -1;
    //check to ensure security officer exists
    if(security_officer_id != ""){
        db.collection("staff").get().then(function(querySnapshot) {
            console.log(querySnapshot);
            querySnapshot.forEach(function(doc) {
            if (doc.id == security_officer_id){
                //security officer id exists
                console.log("Doc id: ", doc.id);
                console.log("Officer id: ", security_officer_id);
                FLAG = 1;

                //update
                db.collection("parking_lots").doc(queries[0]).update({
                    name: name,
                    location: loc,
                    max_occupancy: max_occupancy,
                    security_officer_id: security_officer_id
                }).then(function() {
                    console.log("Successfully updated parking lot information!");
                    alert("Successfully updated parking lot.\n\nYou will now be redirected to the search page.")
                    window.location.href="search-parking-lot.html";
                }).catch(function(error) {
                    // The document probably doesn't exist.
                    console.error("Error updating document: ", error);
                    return;
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

/*
    db.collection("parking_lots").doc(queries[0]).update({
        name: name,
        location: loc,
        max_occupancy: max_occupancy,
        security_officer_id: security_officer_id
    }).then(function() {
        console.log("Successfully updated parking lot information!");
        alert("Successfully updated parking lot.\n\nYou will now be redirected to the search page.")
        window.location.href="search-parking-lot.html";
    }).catch(function(error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
        return;
    });*/
}