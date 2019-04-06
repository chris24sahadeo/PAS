function search() {
    let searchTable = document.getElementById("searchCriteria").selectedIndex;
    let searchContent = document.getElementById("searchContent").value;

    searchContent = searchContent.toLowerCase();

    var SECURITY_OFFICER_ROLE = 4;

    var found = -1;
    //ID
    if (searchTable == 0) {
        db.collection("staff").doc(searchContent).get().then(function (data) {
            var content = '';
            document.getElementById("security_officers").innerHTML = "";
            if (data.exists) {
                db.collection("staff").doc(searchContent).get().then(function (data2) {
                    if (data2.exists) {
                        found = 1;
                        const fname = data2.data().first_name;
                        const lname = data2.data().last_name;
                        content += '<tr>';
                        content += '<td>' + fname +'</td>';
                        content += '<td>' + lname +'</td>';
                        content += '<td>' + searchContent +'</td>'; //id
                        content += '<td>' + data2.data().email +'</td>';
                        content += '<td>' + data2.data().phone_number +'</td>';
                        content += '<td><div class="btn-group"><a class="btn btn-success" onclick="edit(this, 1)" data-toggle="tooltip" title="Edit Officer Info"><i class="icon_pencil-edit_alt"></i></a><a class="btn btn-danger" onclick="del(this, 1)" data-toggle="tooltip" title="Delete User"><i class="icon_close_alt2"></i></a></div></td>';
                        //content += '<td><div class="btn-group"><a class="btn btn-success" onclick="edit(this, 2)" data-toggle="tooltip" title="Edit License Plate"><i class="icon_pencil-edit_alt"></i></a><a class="btn btn-danger" onclick="del(this, 2)" data-toggle="tooltip" title="Delete License Plate"><i class="icon_close_alt2"></i></a></div></td>';
                        content += '</tr>';
                        $('#security_officers').append(content);
                    }
                });
            } else {
                console.log("Didn't find security officer in DB.");
                content = '<tr><td colspan=5>NOTHING FOUND</td></tr>';
                document.getElementById("security_officers").innerHTML = "";
                $('#security_officers').append(content);
            }
        });
    } 
    //first name
    else if (searchTable == 1) {
        db.collection("staff").get().then(function (querySnapshot) {
            var content = '';
            document.getElementById("security_officers").innerHTML = "";
            querySnapshot.forEach(function(doc){
                //console.log("Data: ", doc.data());
                //console.log("Query: ", searchContent);
                //console.log("Last name: ", doc.data().last_name);
                if(doc.data().first_name == searchContent && doc.data().role == SECURITY_OFFICER_ROLE){
                    //exists
                    console.log("FOUND");
                    found = 1;
                    const fname = doc.data().first_name;
                    const lname = doc.data().last_name;
                    content += '<tr>';
                    content += '<td>' + fname +'</td>';
                    content += '<td>' + lname +'</td>';
                    content += '<td>' + doc.id +'</td>';
                    content += '<td>' + doc.data().email +'</td>';
                    content += '<td>' + doc.data().phone_number +'</td>';
                    content += '<td><div class="btn-group"><a class="btn btn-success" onclick="edit(this, 1)" data-toggle="tooltip" title="Edit Officer Info"><i class="icon_pencil-edit_alt"></i></a><a class="btn btn-danger" onclick="del(this, 1)" data-toggle="tooltip" title="Delete User"><i class="icon_close_alt2"></i></a></div></td>';
                    //content += '<td><div class="btn-group"><a class="btn btn-success" onclick="edit(this, 2)" data-toggle="tooltip" title="Edit License Plate"><i class="icon_pencil-edit_alt"></i></a><a class="btn btn-danger" onclick="del(this, 2)" data-toggle="tooltip" title="Delete License Plate"><i class="icon_close_alt2"></i></a></div></td>';
                    content += '</tr>';
                    $('#security_officers').append(content);
                    return;
                }

            });
            if(found == -1){
                console.log("Didn't find security officer in DB.");
                content = '<tr><td colspan=5>NOTHING FOUND</td></tr>';
                document.getElementById("security_officers").innerHTML = "";
                $('#security_officers').append(content);
            }

        });
    } 
    //last name
    else if (searchTable == 2) {
        db.collection("staff").get().then(function (querySnapshot) {
            var content = '';
            document.getElementById("security_officers").innerHTML = "";
            querySnapshot.forEach(function(doc){
                //console.log("Data: ", doc.data());
                //console.log("Query: ", searchContent);
                //console.log("Last name: ", doc.data().last_name);
                if(doc.data().last_name == searchContent && doc.data().role == SECURITY_OFFICER_ROLE){
                    //exists
                    console.log("FOUND");
                    found = 1;
                    const fname = doc.data().first_name;
                    const lname = doc.data().last_name;
                    content += '<tr>';
                    content += '<td>' + fname +'</td>';
                    content += '<td>' + lname +'</td>';
                    content += '<td>' + doc.id +'</td>';
                    content += '<td>' + doc.data().email +'</td>';
                    content += '<td>' + doc.data().phone_number +'</td>';
                    content += '<td><div class="btn-group"><a class="btn btn-success" onclick="edit(this, 1)" data-toggle="tooltip" title="Edit Officer Info"><i class="icon_pencil-edit_alt"></i></a><a class="btn btn-danger" onclick="del(this, 1)" data-toggle="tooltip" title="Delete User"><i class="icon_close_alt2"></i></a></div></td>';
                    //content += '<td><div class="btn-group"><a class="btn btn-success" onclick="edit(this, 2)" data-toggle="tooltip" title="Edit License Plate"><i class="icon_pencil-edit_alt"></i></a><a class="btn btn-danger" onclick="del(this, 2)" data-toggle="tooltip" title="Delete License Plate"><i class="icon_close_alt2"></i></a></div></td>';
                    content += '</tr>';
                    $('#security_officers').append(content);
                    return;
                }

            });
            if(found == -1){
                console.log("Didn't find security officer in DB.");
                content = '<tr><td colspan=5>NOTHING FOUND</td></tr>';
                document.getElementById("security_officers").innerHTML = "";
                $('#security_officers').append(content);
            }

        });
    }
}

//edit security officer info
function edit(row) {
    // console.log("Row:" + row.closest('tr').rowIndex);
    var myTable = document.getElementById("searchResults");
    var myCells = myTable.rows.item(row.closest('tr').rowIndex).cells;
    var cellLength = myCells.length;

    // 1 == license plate - going to use this index to get owner id if necessary
    var security_officer_id = myCells.item(2).innerHTML;
    console.log("Officer id: ", security_officer_id);

    db.collection("staff").doc(security_officer_id).get().then(function (doc) {
        window.location.href="edit-security-officer.html?" + doc.id;
    });
    
}

//delete 
function del(row) {
    console.log("In delete...");
    var myTable = document.getElementById("searchResults");
    //console.log("My table: ", myTable);
    var myCells = myTable.rows.item(row.closest('tr').rowIndex).cells;
    //console.log("My cells: ", myCells);
    var cellLength = myCells.length;
    //console.log("Cell length: ", cellLength);
    var officer_id = myCells.item(2).innerHTML;
    console.log("Officer Id: ",officer_id);


    if (officer_id != "NOTHING FOUND") {
        var confirmation = confirm("Are you sure you want to remove this security officer?");
        if (confirmation) {
            console.log("Deleting Security Officer..");
        } else {
            console.log("Not deleting Security Officer.");
            return;
        }
    } else {
        alert("No security officer specified for deletion.");
        return;
    }

    //delete
    db.collection("staff").doc(officer_id).delete().then(function() {
        console.log("Document successfully deleted!");
        alert("Security Officer removed!");
        window.location.replace("search-security-officer.html");
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });

}
