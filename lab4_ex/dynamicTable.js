var drivers = {};

function addRow() {

    var myName = document.getElementById("name");
    var age = document.getElementById("age");
    var table = document.getElementById("myTableData");

    var rowCount = table.rows.length;
    var row = table.insertRow(rowCount);

    row.insertCell(0).innerHTML = '<input type="button" value = "Delete" onClick="Javacsript:deleteRow(this)">';
    row.insertCell(1).innerHTML = myName.value;
    row.insertCell(2).innerHTML = age.value;

}

function deleteRow(obj) {

    var index = obj.parentNode.parentNode.rowIndex;
    var table = document.getElementById("myTableData");
    table.deleteRow(index);
}


function addTable() {

    var myTableDiv = document.getElementById("myDynamicTable");

    var table = document.createElement('TABLE');
    table.border = '1';

    var tableBody = document.createElement('TBODY');
    table.appendChild(tableBody);

    // print headers line
    var tr = document.createElement('TR');
    tableBody.appendChild(tr);
    for (var j = 0; j < 4; j++) {
        var text = '';
        switch (j) {
            case 0:
                text = "Employee Number";
                break;
            case 1:
                text = "First Name";
                break;
            case 2:
                text = "Last Name";
                i = 1;
                break;
            default:
            // code block
        }
        var td = document.createElement('TD');
        td.width = '75';
        td.appendChild(document.createTextNode(text));
        tr.appendChild(td);
    }

    //drivers for
    for (const [employeeNumber, driver] of Object.entries(drivers)) {
        var tr = document.createElement('TR');
        tableBody.appendChild(tr);
        //details for
        for (var j = 0; j < 4; j++) {
            var text = '';
            switch (j) {
                case 0:
                    text = employeeNumber;
                    break;
                case 1:
                    text = driver.firstName;
                    break;
                case 2:
                    text = driver.lastName;
                    break;
                default:
                // code block
            }
            var td = document.createElement('TD');
            td.width = '75';
            if (j == 3) {
                td.innerHTML = '<input type="button" value = "Delete" onClick="Javacsript:deleteRow(this)">';
            } else {
                td.appendChild(document.createTextNode(text));
            }
            tr.appendChild(td);
        }
    }
    myTableDiv.appendChild(table);

}

function load() {

    console.log("Page load finished");

}