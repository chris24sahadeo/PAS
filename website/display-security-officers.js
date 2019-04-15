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

    db.collection("staff").get().then(function(querySnapshot) {
        var data = [];
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            //console.log(doc.id, " => ", doc.data());
            data.push(doc.id);
            data.push(doc.data().first_name);
            data.push(doc.data().last_name);
            data.push(doc.data().email);
            //data.push(doc.data().security_officer_id);
            data.push(doc.data().phone_number);
        });
        
        //console.log("Record: ",data);
        // Split in group of 3 items
        var record = chunkArray(data, 5);


        
        for(var i = 0; i < record.length; i++){
            //get input values
            
            var id = record[i][0];
            var fname= record[i][1];
            var lname = record[i][2];
            var email = record[i][3];
            var phoneno = record[i][4];

            // get the html table
            var table = document.getElementById('security_officers_table').getElementsByTagName('tbody')[0];

            var btnsArr = [];

            var newRow = table.insertRow(table.rows.length);
            
            // add cells to the row
            var cel1 = newRow.insertCell(0);
            var cel2 = newRow.insertCell(1);
            var cel3 = newRow.insertCell(2);
            var cel4 = newRow.insertCell(3);
            var cel5 = newRow.insertCell(4);
            
            // add values to the cells
            cel1.innerHTML = id;
            cel2.innerHTML = fname;
            cel3.innerHTML = lname;
            cel4.innerHTML = email;
            cel5.innerHTML = phoneno;

        }//end for 

    });
        
}



doSomething()
