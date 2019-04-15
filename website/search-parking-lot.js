//initialise firebase database
var firebase = app_firebase;
var db = firebase.firestore(); 

function search() {
    //let searchTable = document.getElementById("searchCriteria").selectedIndex;
    let searchContent = document.getElementById("searchContent").value;

    var parkingLotRef = db.collection('parking_lots').doc(searchContent);
    var content = '';

    var getDoc = parkingLotRef.get()
        .then(doc => {
            if (!doc.exists) {
                console.log('No such document!');
                content = '<tr><td>NOTHING FOUND</td></tr>';
                document.getElementById("parking_lots").innerHTML = "";
                $('#parking_lots').append(content);

            } else {
                console.log('Document data:', doc.data());
                //console.log(doc.data().max_occupancy);
                const name = doc.id;
                content += '<tr>';
                content += '<td>' + name +'</td>';
                content += '<td>' + doc.data().max_occupancy +'</td>';
                content += '<td>' + doc.data().current_occupancy +'</td>';
                content += '<td>' + doc.data().security_officer_id +'</td>';

                content += '<td><div class="btn-group"><a class="btn btn-success" onclick="edit(this)"><i class="icon_pencil-edit_alt"></i></a><a class="btn btn-danger" onclick="del(this)"><i class="icon_close_alt2"></i></a></div></td>';
                content += '</tr>';
                var remaining = doc.data().max_occupancy - doc.data().current_occupancy;
                if(remaining < 5)
                    alert("Nearly FULL!");

                document.getElementById("parking_lots").innerHTML = "";
                $('#parking_lots').append(content);

            }
        })
        .catch(err => {
            console.log('Error getting document', err);
        });
    
}

function edit(row) {
    console.log("Row:" + row.closest('tr').rowIndex);

    var myTable = document.getElementById("searchResults");
    var myCells = myTable.rows.item(row.closest('tr').rowIndex).cells;
    var cellLength = myCells.length;

    // 1 == license plate - going to use this index to get owner id if necessary
    var parking_lot_id = myCells.item(0).innerHTML;
    console.log("Parking lot id: ", parking_lot_id);

    db.collection("parking_lots").doc(parking_lot_id).get().then(function (doc) {
        window.location.href="edit-parking-lot.html?" + doc.id;
    });
}

function del(row) {
    console.log("In delete...");
    var myTable = document.getElementById("searchResults");
    console.log("My table: ", myTable);
    var myCells = myTable.rows.item(row.closest('tr').rowIndex).cells;
    console.log("My cells: ", myCells);
    var cellLength = myCells.length;
    console.log("Cell length: ", cellLength);
    var parking_lot_id = myCells.item(0).innerHTML;
    console.log("Parking lot: ",parking_lot_id);

    //delete
    db.collection("parking_lots").doc(parking_lot_id).delete().then(function() {
        console.log("Document successfully deleted!");
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });

}