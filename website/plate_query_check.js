var db = firebase.firestore();

(function() {
    console.log("Checking queries.");
    let queryString = decodeURIComponent(window.location.search);
    queryString = queryString.substring(1);
    var queries = queryString.split("&");
    var letterNumber = "^[0-9a-zA-Z]+$";
    if (queryString != "" && queries[0].match(letterNumber)) {
        db.collection("license_plates").doc(queries[0]).get().then(function(data) {
            if (data.exists) {
                var name = data.id;
                console.log(data.id);
                var splitName = name.split(" ");
                console.log(splitName);
                splitName[0] = splitName[0].charAt(0).toUpperCase() + splitName[0].split(1);
                splitName[1] = splitName[1].charAt(0).toUpperCase() + splitName[1].split(1);
                document.getElementById("plateHeader").innerHTML = "New Plate Information for " + splitName[0] + " " + splitName[1];
            } else {
                alert("Plate not found. Weird. This shouldn't happen.\n\nTry searching for a plate instead. You will now be redirected to the search page.")
                window.location.href="license_plate_search.html";
            }
        });
    } else {
        alert("License Plate was not specified.\n\nTry searching for a license plate instead. You will now be redirected to the search page.");
        window.location.href="license_plate_search.html";
    }

    db.collection("parking_lots").get().then(function (querySnapshot) {
        var content = '';
        querySnapshot.forEach(function (doc) {
            if (doc.exists) {
                content = '<option value="' + doc.id + '">' + doc.id + '</option>';
                $('#lot_id').append(content);
            }
        });
        db.collection("license_plates").doc(queries[0]).get().then(function (doc) {
            console.log("Adding data to form fields.");
            document.forms["edit_plate_form"]["plate"].value = doc.id;
            document.forms["edit_plate_form"]["description"].value = doc.data().vehicle_description;
            $("#lot_id").val(doc.data().parking_lot_id);
        });
    });

})()

function update() {
    let queryString = decodeURIComponent(window.location.search);
    queryString = queryString.substring(1);
    var queries = queryString.split("&");

    var plate = document.getElementById("plate").value.toLowerCase();
    var description = document.getElementById("description").value.toLowerCase();
    var lot_id = document.getElementById("lot_id").value.toLowerCase();

    if (plate == "" || description == "") {
        var message = 'Please enter the following fields:\n';
        if (plate == "") {
            message += 'License Plate\n';
        }
        if (description == "") {
            message += 'Car Description\n';
        }
        alert(message);
        return;
    }

    console.log("License Plate Data");
    console.log(plate);
    console.log(description);
    console.log(lot_id);

    const old_plate_id = queries[0];

    if (plate == old_plate_id) {
        // Didn't change primary key. Easy stuff
        db.collection("license_plates").doc(plate).update({
            vehicle_description: description,
            parking_lot_id: lot_id
        }).then(function() {
            console.log("Successfully updated License Plate information!");
            alert("Successfully updated License Plate data.\n\nYou will now be redirected to the search page.")
            window.location.href="license_plate_search.html";
        }).catch(function(error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
            return;
        });
    } else {
        // Changed primary key of data so I need to delete and add new one
        // Need these values from old plate
        var owner_id;
        var registered;
        var expiry;
        // registered and expiry date too
        db.collection("license_plates").doc(old_plate_id).get().then(function (plate_doc) {
            // Store old values
            owner_id = plate_doc.data().owner_id;
            registered = plate_doc.data().registered_date;
            expiry = plate_doc.data().expiry_date;
            // Remove plate from plates array in user
            db.collection("users").doc(owner_id).get().then(function (doc2) {
                if (typeof(doc2.data().plates) !== undefined) {
                    var plate_arr = doc2.data().plates;
                    if (doc2.data().plates.length > 0) {
                        plate_arr = plate_arr.filter(plate => plate != old_plate_id);
                        db.collection("users").doc(owner_id).update({
                            plates: plate_arr
                        }).then(function() {
                            // Removed from plates array in user
                            console.log("Successfully removed plate from user!");
                            // Now, Remove old plate from license_plates document
                            db.collection("license_plates").doc(old_plate_id).delete().then(function() {
                                console.log("License Plate successfully deleted!");
                                // Now make new plate doc and add new plate to user
                                db.collection("license_plates").doc(plate).set({
                                    vehicle_description: description,
                                    owner_id: owner_id,
                                    parking_lot_id: lot_id,
                                    registered_date: registered,
                                    expiry_date: expiry
                                }).then(function() {
                                    db.collection("users").doc(owner_id).update({
                                        plates: firebase.firestore.FieldValue.arrayUnion(plate)
                                    });
                                    alert("License Plate updated successfully.\n\nYou will now be redirected to the search page.");
                                }).catch(function(error) {
                                    console.error("Error writing user to document: ", error);
                                    return;
                                });
                            }).catch(function(error) {
                                console.error("Error removing document: ", error);
                                return;
                            });
                        }).catch(function(error) {
                            console.error("Error updating document: ", error);
                            return;
                        });
                    }
                }
            });
        });

    }
}