var db = firebase.firestore();

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
                        content += '<td><div class="btn-group"><a class="btn btn-primary" onclick="handlePass(this, 1)" data-toggle="tooltip" title="Renew Parking Pass"><i class="icon_plus"></i></a><a class="btn btn-danger" onclick="handlePass(this, 2)" data-toggle="tooltip" title="Revoke Parking Pass"><i class="icon_close_alt2"></i></a></div></td>';
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
                                    content += '<td><div class="btn-group"><a class="btn btn-primary" onclick="handlePass(this, 1)" data-toggle="tooltip" title="Renew Parking Pass"><i class="icon_plus"></i></a><a class="btn btn-danger" onclick="handlePass(this, 2)" data-toggle="tooltip" title="Revoke Parking Pass"><i class="icon_close_alt2"></i></a></div></td>';
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
                        content += '<td colspan=3>NO PLATES FOUND FOR THIS USER</td>';
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

function handlePass(row, renew_revoke) {
    // console.log("Row:" + row.closest('tr').rowIndex);
    var myTable = document.getElementById("searchResults");
    var myCells = myTable.rows.item(row.closest('tr').rowIndex).cells;
    var cellLength = myCells.length;

    // 1 == license plate - going to use this index to get owner id if necessary
    var plate_id = myCells.item(1).innerHTML.toLowerCase();
    
    // Renew
    if (renew_revoke == 1) {
        db.collection("license_plates").doc(plate_id).get().then(function (data) {
            window.location.href = "renew_pass_edit.html?" + data.owner_id + "&" + plate_id;
        });
    // Revoke
    } else if (renew_revoke == 2) {

    }
}

function update() {
    let queryString = decodeURIComponent(window.location.search);
    queryString = queryString.substring(1);
    var queries = queryString.split("&");

    if (queries.length != 2) {
        alert("Query Error. Returning to Search Screen.")
        window.location.href = "renew_parking_pass.html";
    }

    var plate = queries[1];
    var pass_type = document.forms["renew_pass_form"]["pass_type"].value;
    var date = document.forms["renew_pass_form"]["dp1"].value;

    if (date == "") {
        var message = 'Please enter the following fields:\n';
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

    db.collection("license_plates").doc(plate).update({
        registered_date: date,
        expiry_date: expiry_date
    }).then(function() {
        console.log("Successfully renewed pass!");
        alert("Successfully renewed pass.\n\nYou will now be redirected to the search page.")
        window.location.href="renew_parking_pass.html";
    }).catch(function(error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
        return;
    });
}