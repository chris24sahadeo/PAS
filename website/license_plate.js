var db = firebase.firestore();

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
                content = '<tr><td>NOTHING FOUND</td></tr>';
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
}

function del(row) {
    console.log("Row:" + row.closest('tr').rowIndex);
}