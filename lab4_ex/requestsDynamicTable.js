var requests = {};

async function deleteRequestRow(obj) {
    var requestNumber = obj.getElementsByTagName("td")[0].innerText;
    var index = obj.rowIndex;
    var table = document.getElementById("requestsTable");
    table.deleteRow(index);

    requests = await getRequests();
    var employeeNum;
    var found = false;
    for (const [employeeNumber, employeeRequests] of Object.entries(requests)) {
        for (const [number, request] of Object.entries(employeeRequests)) {
            if (requestNumber == number){
                employeeNum = employeeNumber;
                found = true;
                break;
            }
        }  
        if (found){
            break;
        }
    }
    deleteRequest(employeeNum, requestNumber);
    // call algorithm
}

function sortTable() {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("requestsTable");
    switching = true;
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
        //start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /*Loop through all table rows (except the
        first, which contains table headers):*/
        for (i = 1; i < (rows.length - 1); i++) {
            //start by saying there should be no switching:
            shouldSwitch = false;
            /*Get the two elements you want to compare,
            one from current row and one from the next:*/
            x = rows[i].getElementsByTagName("TD")[2];
            y = rows[i + 1].getElementsByTagName("TD")[2];
            //check if the two rows should switch place:
            if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                //if so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            /*If a switch has been marked, make the switch
            and mark that a switch has been done:*/
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
}

function createPopUpText(current, future, carNumber) {
    return `Please move car number ${carNumber} \n from parking slot ${current} to empty parking slot ${future}`;
}

function createPopUpText2() {
    return 'There is no conflict for now, feel free to rest';
}

async function addRequestsTable() {
    var table = document.getElementById("requestsTable");
    table.border = '1';
    var tableBody = document.getElementById("requestsTableBody");
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
                text = "Request Number";
                td.appendChild(document.createTextNode(text));
                break;
            case 1:
                text = "Request Time";
                td.appendChild(document.createTextNode(text));
                break;
            case 2:
                text = "Priority";
                td.appendChild(document.createTextNode(text));
                break;
            default:
        }
        tr.appendChild(td);
    }

    //requests for
    for (const [employeeNumber, employeeRequests] of Object.entries(requests)) {
        for (const [requestNumber, request] of Object.entries(employeeRequests)) {
            if (request.flagPriority == true) {
                var tr = document.createElement('TR');
                tr.setAttribute('class', 'request-row');
                tableBody.appendChild(tr);
                //details for
                for (var j = 0; j < 3; j++) {
                    var text = '';
                    switch (j) {
                        case 0:
                            text = requestNumber;
                            break;
                        case 1:
                            text = request.requestTime;
                            break;
                        case 2:
                            text = request.priority;
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
    }
    sortTable();
    $(document).ready(function($) {
        $(".request-row").click(async function () {
            var row = this;
            var currentRequestNumber = this.getElementsByTagName("td")[0].innerText;
            var requestPriority = this.getElementsByTagName("td")[2].innerText;
            var flagParkingFound = 0;
            for (const [employeeNumber, employeeRequests] of Object.entries(requests)) {
                for (const [requestNumber, request] of Object.entries(employeeRequests)) {
                    if (requestNumber == currentRequestNumber) {
                        if (requestPriority == 1) {
                            var hello = await userRequest(request.parkingSlotNumber, employeeNumber);
                            var newOutPutRequest = await getOutPutRequest();
                            flagParkingFound = 1;
                            break;
                        } else if (requestPriority == 2) {
                            var hello = await scheduleReq(request.parkingSlotNumber, employeeNumber);
                            var newOutPutRequest = await getOutPutRequest();
                            flagParkingFound = 1;
                            break;
                        } else {
                            var conflict = await systemRequest(request.parkingSlotNumber);
                            var newOutPutRequest = await getOutPutRequest();
                            flagParkingFound = 1;
                            break;
                        }
                    }
                }
                if (flagParkingFound == 1) break;
            }
            if (conflict == false) {
                var popUpText = createPopUpText2();
                $('#pop').html(popUpText);
                $('#pop').dialog({
                    buttons: {
                        'Done': function () {
                            $(this).dialog('close');
                            deleteRequestRow(row);
                        }
                    }
                });
            } else {
                var popUpText = createPopUpText(newOutPutRequest.current, newOutPutRequest.future, newOutPutRequest.carNumber);
                $('#pop').html(popUpText);
                $('#pop').dialog({
                    buttons: {
                        'Done': function () {
                            $(this).dialog('close');
                            deleteRequestRow(row);
                        }
                    }
                });
            }
        });
    });
}

