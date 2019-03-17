var db = firebase.firestore();

function submitUser(){
    var fname = document.forms["user_form"]["fname"].value; 
    var lname = document.forms["user_form"]["lname"].value; 
    var email = document.forms["user_form"]["email"].value;
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

    var plate = document.forms["plate_form"]["plate"].value; 
    var description = document.forms["plate_form"]["description"].value; 
    var lot_id = document.forms["plate_form"]["lot_id"].value;
    var pass_type = document.forms["plate_form"]["pass_type"].value;
    var date_range = document.forms["plate_form"]["reservation"].value;

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

    var dates = date_range.split(" - ");

    var expiry_date = new Date();

    if (pass_type == "Full Time") {
        expiry_date.setMonth(expiry_date.getMonth()+4);
        expiry_date = (expiry_date.getMonth()+1 < 10 ? '0' : '') + (expiry_date.getMonth()+1) + "/" + (expiry_date.getDate() < 10 ? '0' : '') + expiry_date.getDate() + "/" + expiry_date.getFullYear();
    } else if (pass_type == "Temporary") {
        expiry_date = dates[1];
    }

    db.collection("license_plates").doc(plate).set({
        vehicle_description: description,
        owner_id: queries[0],
        parking_lot_id: lot_id,
        registered_date: dates[0],
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

    alert("Plate added to database: " + plate);
    document.forms["plate_form"].reset();
}



function search() {
    let searchTable = document.getElementById("searchCriteria").selectedIndex;
    let searchContent = document.getElementById("searchContent").value;

    if (searchTable == 0) {
        db.collection("license_plates").doc(searchContent).get().then(function (data) {
            var content = '';
            if (data.exists) { 
                db.collection("users").doc(data.data().owner_id).get().then(function (data2) {
                    if (data2.exists) {
                        const owner = data2.data().first_name + " " + data2.data().last_name;
                        content += '<tr>';
                        content += '<td>' + owner +'</td>';
                        content += '<td>' + searchContent +'</td>';
                        content += '<td>' + data.data().vehicle_description +'</td>';
                        content += '<td><div class="btn-group"><a class="btn btn-success" onclick="edit(0)"><i class="icon_pencil-edit_alt"></i></a><a class="btn btn-danger" onclick="del(0)"><i class="icon_close_alt2"></i></a></div></td>';
                        content += '</tr>';
                        document.getElementById("license_plates").innerHTML = "";
                        $('#license_plates').append(content);
                    }
                });
            } else {
                console.log("Didn't find license plate in DB.");
                content = '<tr><td colspan=4>NOTHING FOUND</td></tr>';
                document.getElementById("license_plates").innerHTML = "";
                $('#license_plates').append(content);
            }
        });
    } else if (searchTable == 1) {
        db.collection("users").where("first_name", "==", searchContent).get().then(function(querySnapshot) {
            var content = '';
            document.getElementById("license_plates").innerHTML = "";
            querySnapshot.forEach(function(data) {
                data.data().plates.forEach(element => {
                    db.collection("license_plates").doc(element).get().then(function(data2) {
                        if (data2.exists) {
                            content = '<tr>';
                            content += '<td>' + data.data().first_name + " " + data.data().last_name +'</td>';
                            content += '<td>' + element +'</td>';
                            content += '<td>' + data2.data().vehicle_description +'</td>';
                            content += '<td><div class="btn-group"><a class="btn btn-success" onclick="edit(this)"><i class="icon_pencil-edit_alt"></i></a><a class="btn btn-danger" onclick="del(this)"><i class="icon_close_alt2"></i></a></div></td>';
                            content += '</tr>';
                            $('#license_plates').append(content);
                        }
                    });
                });
            });
        });
    } else if (searchTable == 2) {
        db.collection("users").where("last_name", "==", searchContent).get().then(function(querySnapshot) {
            var content = '';
            document.getElementById("license_plates").innerHTML = "";
            querySnapshot.forEach(function(data) {
                data.data().plates.forEach(element => {
                    db.collection("license_plates").doc(element).get().then(function(data2) {
                        if (data2.exists) {
                            content = '<tr>';
                            content += '<td>' + data.data().first_name + " " + data.data().last_name +'</td>';
                            content += '<td>' + element +'</td>';
                            content += '<td>' + data2.data().vehicle_description +'</td>';
                            content += '<td><div class="btn-group"><a class="btn btn-success" onclick="edit(this)"><i class="icon_pencil-edit_alt"></i></a><a class="btn btn-danger" onclick="del(this)"><i class="icon_close_alt2"></i></a></div></td>';
                            content += '</tr>';
                            $('#license_plates').append(content);
                        }
                    });
                });
            });
        });
    }
}

function edit(row) {
    console.log("Row:" + row.closest('tr').rowIndex);
    var myTable = document.getElementById("searchResults");
    var myCells = myTable.rows.item(row.closest('tr').rowIndex).cells;
    var cellLength = myCells.length;
    for (var i = 0; i < cellLength-1; i++) {
        var cellValue = myCells.item(i).innerHTML;
        console.log(cellValue);
    }
}

function del(row) {
    console.log("Row:" + row.closest('tr').rowIndex);
}