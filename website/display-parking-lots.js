//initialise firebase database
var firebase = app_firebase;
var db = firebase.firestore(); 



function chunkArray(myArray, chunk_size){
    var index = 0;
    var arrayLength = myArray.length;
    var tempArray = [];
    
    for (index = 0; index < arrayLength; index += chunk_size) {
        myChunk = myArray.slice(index, index+chunk_size);
        // Do something if you want with the group
        tempArray.push(myChunk);
    }

    return tempArray;
}


function doSomething(){
    //var tableRef = document.getElementById('parking_lots_table').getElementsByTagName('tbody')[0];
    
    //insert row
    //var newRow = tableRef.insertRow(tableRef.rows.length);
    
    //insert cell
    //var newCell = newRow.insertCell(0);

    db.collection("parking_lots").get().then(function(querySnapshot) {
        var data = [];
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            //console.log(doc.id, " => ", doc.data());
            data.push(doc.id);
            data.push(doc.data().current_occupancy);
            data.push(doc.data().location);
            data.push(doc.data().max_occupancy);
            data.push(doc.data().security_officer_id);
            

            //var text = document.createTextNode(doc.id);
            //newCell.appendChild(text);
        });
        
        console.log("Record: ",data);
        // Split in group of 3 items
        var record = chunkArray(data, 5);
        //console.log(result); //all records in [ [],[],[] ]
        //console.log("Test:",record[0][0]); //1 record []
        console.log("Num Records: ",record.length);

        
        for(var i = 0; i < record.length; i++){
            //get input values
            
            var id = record[i][0];
            var current_occupancy = record[i][1];
            var max_occupancy = record[i][3];
            var security_offier_id = record[i][4];

            // get the html table
            var table = document.getElementById('parking_lots_table').getElementsByTagName('tbody')[0];

            var btnsArr = [];

            var newRow = table.insertRow(table.rows.length);
            
            // add cells to the row
            var cel1 = newRow.insertCell(0);
            var cel2 = newRow.insertCell(1);
            var cel3 = newRow.insertCell(2);
            var cel4 = newRow.insertCell(3);
            
            // add values to the cells
            cel1.innerHTML = id;
            cel2.innerHTML = max_occupancy;
            cel3.innerHTML = current_occupancy;
            cel4.innerHTML = security_offier_id;

        }//end for 

    });
        
}



doSomething()

