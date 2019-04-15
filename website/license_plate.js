var db = firebase.firestore();

function submitUser(){
    var fname = document.forms["user_form"]["fname"].value.toLowerCase(); 
    var lname = document.forms["user_form"]["lname"].value.toLowerCase(); 
    var email = document.forms["user_form"]["email"].value.toLowerCase();
    var pnumber = document.forms["user_form"]["pnumber"].value;

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

    db.collection("users").add({
        first_name: fname,
        last_name: lname,
        email: email,
        phone_number: pnumber,
        plates: [],
        role: 2
    })
    .then(function(ref) {
        console.log("User successfully written with ID: " + ref.id);
        window.location.href="license_plate_add_plate.html?" + ref.id;
    })
    .catch(function(error) {
        console.error("Error writing user to document: ", error);
    });
}

function submitPlate(){

    let queryString = decodeURIComponent(window.location.search);
    queryString = queryString.substring(1);
    var queries = queryString.split("&");

    var plate = document.forms["plate_form"]["plate"].value.toLowerCase(); 
    var description = document.forms["plate_form"]["description"].value.toLowerCase(); 
    var lot_id = document.forms["plate_form"]["lot_id"].value.toLowerCase();
    var pass_type = document.forms["plate_form"]["pass_type"].value;
    var date = document.forms["plate_form"]["dp1"].value;

    if (plate == "" || description == "" || date == "") {
        var message = 'Please enter the following fields:\n';
        if (plate == "") {
            message += 'License Plate\n';
        }
        if (description == "") {
            message += 'Car Description\n';
        }
        if (date == "") {
            message += 'Date Issued\n';
        }
        alert(message);
        return;
    }

    try {
        var expiry_date = new Date(date);

        if (pass_type == "Full Time") {
            expiry_date.setMonth(expiry_date.getMonth()+4);
            expiry_date = (expiry_date.getMonth()+1 < 10 ? '0' : '') + (expiry_date.getMonth()+1) + "/" + (expiry_date.getDate() < 10 ? '0' : '') + expiry_date.getDate() + "/" + expiry_date.getFullYear();
        } else if (pass_type == "Temporary") {
            expiry_date.setDate(expiry_date.getDate()+3);
            expiry_date = (expiry_date.getMonth()+1 < 10 ? '0' : '') + (expiry_date.getMonth()+1) + "/" + (expiry_date.getDate() < 10 ? '0' : '') + expiry_date.getDate() + "/" + expiry_date.getFullYear();
        }
    } catch (error) {
        console.log("Error parsing date: " + error);
        return;
    }
    
    date = date.split("-").join("/");

    db.collection("license_plates").doc(plate).set({
        vehicle_description: description,
        owner_id: queries[0],
        parking_lot_id: lot_id,
        registered_date: date,
        expiry_date: expiry_date
    })
    .then(function() {
        db.collection("users").doc(queries[0]).update({
            plates: firebase.firestore.FieldValue.arrayUnion(plate)
        });
    })
    .catch(function(error) {
        console.error("Error writing user to document: ", error);
    });

    alert("Plate added to database: " + plate + ".\n\nRefill the form to add another plate.");
    document.forms["plate_form"].reset();
}

function search() {
    let searchTable = document.getElementById("searchCriteria").selectedIndex;
    let searchContent = document.getElementById("searchContent").value.toLowerCase();

    if (searchTable == 0) {
        db.collection("license_plates").doc(searchContent).get().then(function (data) {
            var content = '';
            document.getElementById("license_plates").innerHTML = "";
            if (data.exists) {
                db.collection("users").doc(data.data().owner_id).get().then(function (data2) {
                    if (data2.exists) {
                        const owner = data2.data().first_name.charAt(0).toUpperCase() + data2.data().first_name.slice(1) + " " 
                                    + data2.data().last_name.charAt(0).toUpperCase() + data2.data().last_name.slice(1);
                        content += '<tr>';
                        content += '<td>' + owner +'</td>';
                        content += '<td>' + searchContent +'</td>';
                        content += '<td>' + data.data().vehicle_description +'</td>';
                        content += '<td><div class="btn-group"><a class="btn btn-success" onclick="edit(this, 1)" data-toggle="tooltip" title="Edit User"><i class="icon_pencil-edit_alt"></i></a><a class="btn btn-danger" onclick="del(this, 1)" data-toggle="tooltip" title="Delete User"><i class="icon_close_alt2"></i></a></div></td>';
                        content += '<td><div class="btn-group"><a class="btn btn-primary" onclick="addNew(this)" data-toggle="tooltip" title="Add New License Plate"><i class="icon_plus"></i></a><a class="btn btn-success" onclick="edit(this, 2)" data-toggle="tooltip" title="Edit License Plate"><i class="icon_pencil-edit_alt"></i></a><a class="btn btn-danger" onclick="del(this, 2)" data-toggle="tooltip" title="Delete License Plate"><i class="icon_close_alt2"></i></a></div></td>';
                        content += '</tr>';
                        $('#license_plates').append(content);
                    }
                });
            } else {
                console.log("Didn't find license plate in DB.");
                content = '<tr><td colspan=5>NOTHING FOUND</td></tr>';
                document.getElementById("license_plates").innerHTML = "";
                $('#license_plates').append(content);
            }
        });
    } else if (searchTable == 1 || searchTable == 2) {
        var searchName = '';
        if (searchTable == 1) {
            searchName = "first_name";
        } else if (searchTable == 2) {
            searchName = "last_name";
        }
        db.collection("users").where(searchName, "==", searchContent).get().then(function(querySnapshot) {
            var content = '';
            document.getElementById("license_plates").innerHTML = "";
            if (!(querySnapshot.empty)) {
                querySnapshot.forEach(function (data) {
                    if (data.data().plates.length > 0) {
                        data.data().plates.forEach(element => {
                            db.collection("license_plates").doc(element).get().then(function(data2) {
                                if (data2.exists) {
                                    const owner = data.data().first_name.charAt(0).toUpperCase() + data.data().first_name.slice(1) + " " 
                                                + data.data().last_name.charAt(0).toUpperCase() + data.data().last_name.slice(1);
                                    content = '<tr>';
                                    content += '<td>' + owner +'</td>';
                                    content += '<td>' + element +'</td>';
                                    content += '<td>' + data2.data().vehicle_description +'</td>';
                                    content += '<td><div class="btn-group"><a class="btn btn-success" onclick="edit(this, 1)" data-toggle="tooltip" title="Edit User"><i class="icon_pencil-edit_alt"></i></a><a class="btn btn-danger" onclick="del(this, 1)" data-toggle="tooltip" title="Delete User"><i class="icon_close_alt2"></i></a></div></td>';
                                    content += '<td><div class="btn-group"><a class="btn btn-primary" onclick="addNew(this)" data-toggle="tooltip" title="Add New License Plate"><i class="icon_plus"></i></a><a class="btn btn-success" onclick="edit(this, 2)" data-toggle="tooltip" title="Edit License Plate"><i class="icon_pencil-edit_alt"></i></a><a class="btn btn-danger" onclick="del(this, 2)" data-toggle="tooltip" title="Delete License Plate"><i class="icon_close_alt2"></i></a></div></td>';
                                    content += '</tr>';
                                    $('#license_plates').append(content);
                                }
                            });
                        });
                    } else {
                        const owner = data.data().first_name.charAt(0).toUpperCase() + data.data().first_name.slice(1) + " " 
                                    + data.data().last_name.charAt(0).toUpperCase() + data.data().last_name.slice(1);
                        content = '<tr>';
                        content += '<td>' + owner +'</td>';
                        content += '<td colspan=2>NO PLATES FOUND FOR THIS USER</td>';
                        content += '<td><div class="btn-group"><a class="btn btn-success" onclick="edit(this, 1)" data-toggle="tooltip" title="Edit User"><i class="icon_pencil-edit_alt"></i></a><a class="btn btn-danger" onclick="del(this, 1)" data-toggle="tooltip" title="Delete User"><i class="icon_close_alt2"></i></a></div></td>';
                        content += '<td><div class="btn-group"><a class="btn btn-primary" onclick="addNew(this)" data-toggle="tooltip" title="Add New License Plate"><i class="icon_plus"></i></a></td>';
                        content += '</tr>';
                        $('#license_plates').append(content);
                    }
                });
            } else {
                console.log("Didn't find User in DB.");
                content = '<tr><td colspan=5>NOTHING FOUND</td></tr>';
                document.getElementById("license_plates").innerHTML = "";
                $('#license_plates').append(content);
            }
        });
    } 
}

function addNew(row) {
    // console.log("Row:" + row.closest('tr').rowIndex);
    var myTable = document.getElementById("searchResults");
    var myCells = myTable.rows.item(row.closest('tr').rowIndex).cells;
    var cellLength = myCells.length;

    // 1 == license plate - going to use this index to get owner id if necessary
    var plate_id = myCells.item(1).innerHTML.toLowerCase();

    if (plate_id != "NO PLATES FOUND FOR THIS USER".toLowerCase()) {
        // get user id and then redirect window
        db.collection("license_plates").doc(plate_id).get().then(function (doc) {
            window.location.href="license_plate_add_plate.html?" + doc.data().owner_id;
        });
    } else {
        // No Plates Found
        let name = myCells.item(0).innerHTML.split(" ");
        let first_name = name[0].toLowerCase();
        let last_name = name[1].toLowerCase();

        db.collection("users").where("first_name", "==", first_name).where("last_name", "==", last_name).get().then(function (querySnapshot) {
            if (!(querySnapshot.empty)) {
                querySnapshot.forEach(data => {
                    if (!(data.data().plates.length > 0)) {
                        var owner_id = data.id;
                        window.location.href="license_plate_add_plate.html?" + owner_id;
                        return;
                    }
                });
            } else {
                console.log("no existo");
            }
        });
    }
}

function edit(row, user_or_plate) {
    // console.log("Row:" + row.closest('tr').rowIndex);
    var myTable = document.getElementById("searchResults");
    var myCells = myTable.rows.item(row.closest('tr').rowIndex).cells;
    var cellLength = myCells.length;

    // 1 == license plate - going to use this index to get owner id if necessary
    var plate_id = myCells.item(1).innerHTML.toLowerCase();
    
    if (user_or_plate == 1) {
        // User
        // get user id and then redirect window
        db.collection("license_plates").doc(plate_id).get().then(function (doc) {
            window.location.href="license_plate_edit_user.html?" + doc.data().owner_id;
        });
    } else if (user_or_plate == 2) {
        // License Plate
        if (plate_id != "NO PLATES FOUND FOR THIS USER".toLowerCase()) {
            // redirect window with plate id
            window.location.href="license_plate_edit_plate.html?" + plate_id;
        } else {
            alert("There are no license plates to edit.");
        }
    }
}

function del(row, user_or_plate) {
    var myTable = document.getElementById("searchResults");
    var myCells = myTable.rows.item(row.closest('tr').rowIndex).cells;
    var cellLength = myCells.length;

    // 1 == license plate - going to use this index to get owner id if necessary
    var plate_id = myCells.item(1).innerHTML.toLowerCase();

    if (user_or_plate == 1) {
        // User
        if (plate_id != "NO PLATES FOUND FOR THIS USER".toLowerCase()) {
            var confirmation = confirm("Are you sure?\n\nDeleting a user will remove all of their respective license plates as well.");
            if (confirmation) {
                console.log("Deleting User");
            } else {
                console.log("Not deleting user.");
                return;
            }
        } else {
            // No license plates to use to find user to delete user
            let name = myCells.item(0).innerHTML.split(" ");
            let first_name = name[0].toLowerCase();
            let last_name = name[1].toLowerCase();
            db.collection("users").where("first_name", "==", first_name).where("last_name", "==", last_name).get().then(function (querySnapshot) {
                if (!(querySnapshot.empty)) {
                    querySnapshot.forEach(data => {
                        if (!(data.data().plates.length > 0)) {
                            var owner_id = data.id;
                            db.collection("users").doc(owner_id).delete().then(function() {
                                console.log("User successfully deleted!");
                                return;
                            }).catch(function(error) {
                                console.error("Error removing document: ", error);
                                return;
                            });
                        }
                    });
                }
            });
            return;
        }
        db.collection("license_plates").doc(plate_id).get().then(function (doc) {
            var ownerRef = db.collection("users").doc(doc.data().owner_id);
            // Remove all license plates
            ownerRef.get().then(function (doc) {
                if (typeof(doc.data().plates) !== undefined) {
                    var plate_arr = doc.data().plates;
                    plate_arr.forEach(function (element) {
                        db.collection("license_plates").doc(element).delete().then(function() {
                            console.log("License Plate successfully deleted!");
                        }).catch(function(error) {
                            console.error("Error removing document: ", error);
                            return;
                        });
                    });
                    // Remove owner
                    ownerRef.delete().then(function() {
                        console.log("User successfully deleted!");
                    }).catch(function(error) {
                        console.error("Error removing document: ", error);
                        return;
                    });
                }
            });
        });
    } else if (user_or_plate == 2) {
        // License Plate
        if (plate_id != "NO PLATES FOUND FOR THIS USER".toLowerCase()) {
            var confirmation = confirm("Are you sure you want to delete the license plate from the user?");
            if (confirmation) {
                console.log("Deleting License Plate.");
            } else {
                console.log("Not deleting License Plate.");
                return;
            }
        } else {
            alert("No license plate specified for deletion.");
            return;
        }
        db.collection("license_plates").doc(plate_id).get().then(function (doc) {
            // Remove plate from plates array in user
            db.collection("users").doc(doc.data().owner_id).get().then(function (doc2) {
                if (typeof(doc2.data().plates) !== undefined) {
                    var plate_arr = doc2.data().plates;
                    if (doc2.data().plates.length > 0) {
                        plate_arr = plate_arr.filter(plate => plate != plate_id);
                        db.collection("users").doc(doc.data().owner_id).update({
                            plates: plate_arr
                        }).then(function() {
                            console.log("Successfully removed plate from user!");
                            // Remove plate from license_plates document
                            db.collection("license_plates").doc(plate_id).delete().then(function() {
                                console.log("License Plate successfully deleted!");
                            }).catch(function(error) {
                                console.error("Error removing document: ", error);
                                return;
                            });
                        }).catch(function(error) {
                            // The document probably doesn't exist.
                            console.error("Error updating document: ", error);
                            return;
                        });
                    }
                }
            });
        });
    }
    alert("Deletion completed successfully!");
}