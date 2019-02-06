var drivers = {};
var driverFromDB = {};

function deleteDriverRow(obj) {
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

function addNewDriver() {
        document.getElementById('firstName').value = '';
        document.getElementById('lastName').value = '';
        document.getElementById('email').value = '';
        document.getElementById('phoneNumber').value = '';
        document.getElementById('carNumber').value = '';
        document.getElementById('carType').value = '';
        document.getElementById('carSeries').value = '';
        document.getElementById('carColor').value = '';
        document.getElementById('carCode').value = '';
        ShowPage(1);
    
}

async function editDriverDetails(obj) {
    var row = obj.parentNode.parentNode;
    var employeeNumber = row.getElementsByTagName("td")[2].innerText;
    driverFromDB = await getDriver(employeeNumber);
    driverFromDB.employeeNumber = employeeNumber;
    console.log(`driverfromDB: ${JSON.stringify(driverFromDB)}`);
    document.getElementById('firstNameUpdate').value = driverFromDB.firstName;
    document.getElementById('lastNameUpdate').value = driverFromDB.lastName;
    document.getElementById('emailUpdate').value = driverFromDB.email;
    document.getElementById('phoneNumberUpdate').value = driverFromDB.phoneNumber;
    document.getElementById('carNumberUpdate').value = driverFromDB.carNumber;
    document.getElementById('carTypeUpdate').value = driverFromDB.carType;
    document.getElementById('carSeriesUpdate').value = driverFromDB.carSeries;
    document.getElementById('carColorUpdate').value = driverFromDB.carColor;
    document.getElementById('carCodeUpdate').value = driverFromDB.carCode;
    ShowPage(2);
}

function addDriversTable() {
    var table = document.getElementById("driversTable");
    table.border = '1';
    var tableBody = document.getElementById("driversTableBody");
    if (document.contains(tableBody)) {
        tableBody.innerHTML = "";
    }

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
        //evry row will be from thid type of class
        tr.setAttribute('class', 'driver-row');
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
                td.innerHTML = '<input type="image" onClick="Javacsript:editDriverDetails(this)" src="pencil.png" width="20" height="20">';
            } else {
                td.width = '200';
                td.appendChild(document.createTextNode(text));
            }
            tr.appendChild(td);
        }
    }

    $(document).ready(function ($) {
        $(".driver-row").click(async function () {
            var popuptext = 'bla bla';
            $('#pop').html(popuptext);
            $('#pop').dialog({
                buttons: {
                    'done': function () {
                        $(this).dialog('close');
                    }
                }
            });
        });
    });
}
