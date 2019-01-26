
var valetDrivers = {};


function addValetDriversTable() {
    var table = document.getElementById("valetDriversTable");
    table.border = '1';
    var tableBody = document.getElementById("valetDriversTableBody");
    if (document.contains(tableBody)) {
        tableBody.innerHTML = "";
    }

    // print headers line
    var tr = document.createElement('TR');
    tableBody.appendChild(tr);
    for (var j = 0; j < 3; j++) {
        var td = document.createElement('TD');
        td.width = '200';
        var text = '';
        switch (j) {
            case 0:
                text = "Employee Number";
                td.appendChild(document.createTextNode(text));
                break;
            case 1:
                text = "First Name";
                td.appendChild(document.createTextNode(text));
                break;
            case 2:
                text = "Last Name";
                td.appendChild(document.createTextNode(text));
                break;
            default:
        }
        tr.appendChild(td);
    }

    //drivers for
    for (const [employeeNumber, driver] of Object.entries(valetDrivers)) {
        var tr = document.createElement('TR');
        tableBody.appendChild(tr);
        //details for
        for (var j = 0; j < 3; j++) {
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
            td.width = '200';
            td.appendChild(document.createTextNode(text));
            tr.appendChild(td);
        }
    }
}