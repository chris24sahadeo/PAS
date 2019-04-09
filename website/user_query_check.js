var db = firebase.firestore();

(function() {
    console.log("Checking queries.");
    let queryString = decodeURIComponent(window.location.search);
    queryString = queryString.substring(1);
    var queries = queryString.split("&");
    var letterNumber = "^[0-9a-zA-Z]+$";
    if (queryString != "" && queries[0].match(letterNumber)) {
        db.collection("users").doc(queries[0]).get().then(function(data) {
            if (data.exists) {
                document.getElementById("plateHeader").innerHTML = "Add Plate Information for " 
                                        + data.data().first_name + " " + data.data().last_name;
            } else {
                alert("User not found. Weird. This shouldn't happen.\n\nTry searching for a user instead. You will now be redirected to the search page.")
                window.location.href="license_plate_search.html";
            }
        });
    } else {
        alert("User was not specified.\n\nTry searching for a user instead. You will now be redirected to the search page.");
        window.location.href="license_plate_search.html";
    }

    db.collection("parking_lots").get().then(function (querySnapshot) {
        var content = '';
        querySnapshot.forEach(function (doc) {
            if (doc.exists) {
                content = '<option>' + doc.id + '</option>';
                $('#lot_id').append(content);
            }
        });
    });
})()