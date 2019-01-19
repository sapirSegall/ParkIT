var drivers = {};
function deleteDriverRow(obj){
    var row = obj.parentNode.parentNode;
    var employeeNumber = row.getElementsByTagName("td")[2].innerText;
    deleteRow(obj);
    deleteDriver(employeeNumber);
}
function deleteRow(obj) {
    var index = obj.parentNode.parentNode.rowIndex;
    var table = document.getElementById("driversTable");
    table.deleteRow(index);
}

function addNewDriver(){
    ShowPage(1);
}

function editDriverDetails(){
    ShowPage(2);
}

function addTable() {
    var table = document.getElementById("driversTable");
    table.border = '1';

    var tableBody = document.createElement('TBODY');
    table.appendChild(tableBody);

    // print headers line
    var tr = document.createElement('TR');
    tableBody.appendChild(tr);
    for (var j = 0; j < 5; j++) {
        var td = document.createElement('TD');
        td.width = '200';
        var text = '';
        switch (j) {
            case 0:
                td.width = 20;
                td.innerHTML = '<input type="button" value ="+" onClick="Javacsript:addNewDriver(this)">';
                break;
            case 1:
                td.width = 20;
                break;
            case 2:
                text = "Employee Number";
                td.appendChild(document.createTextNode(text));
                break;
            case 3:
                text = "First Name";
                td.appendChild(document.createTextNode(text));
                break;
            case 4:
                text = "Last Name";
                td.appendChild(document.createTextNode(text));
                break;
            default:
        }
        
        tr.appendChild(td);
    }

    //drivers for
    for (const [employeeNumber, driver] of Object.entries(drivers)) {
        var tr = document.createElement('TR');
        tableBody.appendChild(tr);
        //details for
        for (var j = 0; j < 5; j++) {
            var text = '';
            switch (j) {
                case 2:
                    text = employeeNumber;
                    break;
                case 3:
                    text = driver.firstName;
                    break;
                case 4:
                    text = driver.lastName;
                    break;
                default:
                // code block
            }
            var td = document.createElement('TD');
            if (j == 0) {
                td.width = '20';
                td.innerHTML = '<input type="button" value ="x" onClick="Javacsript:deleteDriverRow(this)">';
            } else if (j == 1) {
                td.width = '20';
                td.innerHTML = '<input type="image" onClick="Javacsript:editDriverDetails(this)" src="edit.png">';
    
            } else {
                td.width = '200';
                td.appendChild(document.createTextNode(text));
            }
            tr.appendChild(td);
        }
    }
}
