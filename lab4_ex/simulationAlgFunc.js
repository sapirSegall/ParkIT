//create the array of objects:
var mainarr = [];
for (var i = 0; i < 10; i++) {
    for (var j = 0; j < 10; j++) {
        var arr = [];
        arr.push(i, j);
        var obj = {
            'exitT': null, //exit time
            'userID': null, //user id. if null- the parking slot is empty
            'ParkingSlotNum': arr, //parking slot number
        };
        mainarr.push(obj);
    }
}

//structure of the parking lot
var Config = {
    x: 10, //number of rows
    y: 10, //number of cols
    IsParking: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8], [0, 9],
    [4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5], [4, 6], [4, 7], [4, 8], [4, 9],
    [5, 0], [5, 1], [5, 2], [5, 3], [5, 4], [5, 5], [5, 6], [5, 7], [5, 8], [5, 9],
    [9, 0], [9, 1], [9, 2], [9, 3], [9, 4], [9, 5], [9, 6], [9, 7], [9, 8], [9, 9]],
    isBlockingParking: [[1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [1, 7], [1, 8], [1, 9],
    [3, 0], [3, 1], [3, 2], [3, 3], [3, 4], [3, 5], [3, 6], [3, 7], [3, 8], [3, 9],
    [6, 0], [6, 1], [6, 2], [6, 3], [6, 4], [6, 5], [6, 6], [6, 7], [6, 8], [6, 9],
    [8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 6], [8, 7], [8, 8], [8, 9]],
    IsPassover: [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6], [2, 7], [2, 8], [2, 9],
    [7, 0], [7, 1], [7, 2], [7, 3], [7, 4], [7, 5], [7, 6], [7, 7], [7, 8], [7, 9]],
    IsNone: [[1, 4], [2, 4], [4, 4], [5, 4], [7, 4], [8, 4]]
};
//each var in the array present how much cars intrance in each hour during day
//var arrCars = [70, 1, 1, 1, 1, 1, 1, 10, 10, 10, 10, 10, 10, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]; //24 hours
var maxCars = 100;

//returm number between min to max
function getRandom(min, max) {
    return Math.floor(Math.random() * (1 + max - min)) + min;
}
function getRandomSp(min, max, ar) {
    return ar[Math.floor(Math.random() * (1 + max - min)) + min];
}
function init() {
    for (var r = 0; r < 10; r++) {
        for (var c = 0; c < 10; c++) {

            mainarr[r * 10 + c].userID = null;
            mainarr[r * 10 + c].exitT = null;
        }
    }
}


function isLotFull() //check if all lot is full
{
    for (k = 0; k < Config.x; k++) {
        for (p = 0; p < Config.y; p++) {
            if (k != 2 && k != 7)
                if (mainarr[k * 10 + p].userID == null) return false;
        }
    }
    return true;
}

//check if need to alert the driver to send a request to move the blocking car(user request)
function funcIsCarBlocked(i) {
    var blockingRow;
    for (var k = 0; k < Config.x; k++) {
        for (var p = 0; p < Config.y; p++) {
            if (mainarr[k * 10 + p].userID != null && mainarr[k * 10 + p].exitT == i + 1) {//check if the parking slot is'nt empty and if the exit hour is i+1
                //when the row is 'isParking' row:
                if (k == 0) blockingRow = 1;
                else if (k == 4) blockingRow = 3;
                else if (k == 5) blockingRow = 6;
                else if (k == 9) blockingRow = 8;
                //when the row is not 'isParking' row:
                else blockingRow == null;
                if (blockingRow != null)//when the row is 'isParking' row
                {
                    if (mainarr[blockingRow * 10 + p].userID != null)//check if there is a blocking car
                    {
                        if (mainarr[k * 10 + p].exitT < mainarr[blockingRow * 10 + p].exitT)//check if exit time of this car< exit time of the blocked car
                        {
                            //userRequest(k * 10 + p, mainarr[k * 10 + p].exitT); //call
                            countMoves++;
                            console.log('countermoves: ' + countMoves);

                        }
                    }
                }
            }
        }
    }
}//end of funcIsCarBlocked

//user request: change parking slot of the blocking car
function userRequest(blockedSlot, exitTblocked) {
    flagUserReq = 1;
    var blockingRow;
    var tempParkingSNum = blockedSlot;
    var tempRowNum = Math.floor(tempParkingSNum / 10);
    var tempColNum = tempParkingSNum % 10;

    //find the blocking car 's parking slot
    if (tempRowNum == 0) blockingRow = 1;
    else if (tempRowNum == 4) blockingRow = 3;
    else if (tempRowNum == 5) blockingRow = 6;
    else if (tempRowNum == 9) blockingRow = 8;
    //when the row is not 'isParking' row: 
    else blockingRow = null;
    //change parking slot of the blocking car
    if (mainarr[blockingRow * 10 + tempColNum].userID != null) {
        exitTime = mainarr[blockingRow * 10 + tempColNum].exitT; //save for insertBlocking() function
        mainarr[blockingRow * 10 + p].exitT = null;
        mainarr[blockingRow * 10 + p].userID = null;
        flagBlocking1 = 0; flagBlocking2 = 0;
        insertBlocking(blockedSlot, exitTblocked, blockingRow * 10 + p); //find parking slot for the blocking car with the saved exitTime  
    }
}


function insertBlocking(blockedslot, exitTblocked, blockingslot) {
    var flagEndParking = 0; //flag==1 when the algoritem find parking slot

    var resisfull = isLotFull();
    if (resisfull) {//change beetween them
        mainarr[blockingslot].exitT = exitTblocked;
        mainarr[blockingslot].userID = 40;
        mainarr[blockedslot].exitT = exitT;
        mainarr[blockedslot].userID = 40;
    }

    var res = isParkingSlotsFull();
    function isParkingSlotsFull() //check if isParking slots now full
    {
        for (k = 0; k < Config.x; k++) {
            for (p = 0; p < Config.y; p++) {
                if (k == 0 || k == 4 || k == 5 || k == 9) {
                    if (mainarr[k * 10 + p].userID == null) return false;
                }
            }
        }
        return true;
    }//end isParkingSlotsFull function
    if (res) flagBlocking1 = 1;
    if (flagBlocking1 == 1) blockingFunc1();
    else {
        for (k = 0; k < Config.x; k++) {
            for (p = 0; p < Config.y; p++) {
                if (mainarr[k * 10 + p].userID == null) {
                    for (var n = 0; n < Config.IsParking.length; n++) {
                        if ((Config.IsParking[n][0] == mainarr[k * 10 + p].ParkingSlotNum[0])
                            && (Config.IsParking[n][1] == mainarr[k * 10 + p].ParkingSlotNum[1])) {
                            mainarr[k * 10 + p].exitT = exitTime;
                            //$("#parking").find("tr").eq(k).find("td").eq(p).addClass("isParking");
                            outputExitT.push(k);
                            outputExitT.push(p);
                            counter++;
                            mainarr[k * 10 + p].userID = 66;
                            if (flagUserReq == 0) { if (arrCars[i] > 0) arrCars[i]--; }
                            flagEndParking = 1;
                            if (Config.IsParking[n][0] == 9 && Config.IsParking[n][1] == 9) {//���� �� ����
                                flagBlocking1 = 1;
                            }
                            var res = isParkingSlotsFull();
                            function isParkingSlotsFull() //check if isParking slots now full
                            {
                                for (k = 0; k < Config.x; k++) {
                                    for (p = 0; p < Config.y; p++) {
                                        if (k == 0 || k == 4 || k == 5 || k == 9) {
                                            if (mainarr[k * 10 + p].userID == null) return false;
                                        }
                                    }
                                }
                                return true;
                            }//end isParkingSlotsFull function
                            if (res) flagBlocking1 = 1;
                            break;
                        }
                    }
                }
                if (flagEndParking == 1) break;
            }
            if (flagEndParking == 1) break;
        }
    }
    function blockingFunc1() {
        flagEndParking = 0;
        var blockedRow;
        for (var k2 = 0; k2 < Config.x; k2++) {
            if (k2 == 1 || k2 == 3 || k2 == 6 || k2 == 8) {
                for (var p2 = 0; p2 < Config.y; p2++) {
                    //check if parking slot is empty:
                    if (mainarr[k2 * 10 + p2].userID == null) {//check if exit time of this car>= exit time of the blocked car:
                        if (k2 == 1) blockedRow = 0;
                        else if (k2 == 3) blockedRow = 4;
                        else if (k2 == 6) blockedRow = 5;
                        else if (k2 == 8) blockedRow = 9;
                        if (exitTime <= mainarr[blockedRow * 10 + p2].exitT) {
                            for (var n2 = 0; n2 < Config.isBlockingParking.length; n2++) {
                                if ((Config.isBlockingParking[n2][0] == mainarr[k2 * 10 + p2].ParkingSlotNum[0])
                                    && (Config.isBlockingParking[n2][1] == mainarr[k2 * 10 + p2].ParkingSlotNum[1])) {
                                    mainarr[k2 * 10 + p2].exitT = exitTime;
                                    //$("#parking").find("tr").eq(k2).find("td").eq(p2).addClass("isBlockingParking");
                                    counter++;
                                    mainarr[k2 * 10 + p2].userID = 66;
                                    if (flagUserReq == 0) { if (arrCars[i] > 0) arrCars[i]--; }
                                    flagEndParking = 1;
                                    break;
                                }
                            }
                        }
                    }
                    if (flagEndParking == 1) break;
                }
                if (flagEndParking == 1) break;
            }
        }
        //check2: (when car1 blocking car2 that car1's exitT>car2's exitT)
        if (k2 == 10) flagBlocking2 = 1;
        if (flagBlocking2 == 1) {
            for (var k2 = 0; k2 < Config.x; k2++) {
                for (var p2 = 0; p2 < Config.y; p2++) {
                    //check if parking slot is empty:
                    if (mainarr[k2 * 10 + p2].userID == null) {//check if exit time of this car>= exit time of the blocked car:
                        for (var n2 = 0; n2 < Config.isBlockingParking.length; n2++) {
                            if ((Config.isBlockingParking[n2][0] == mainarr[k2 * 10 + p2].ParkingSlotNum[0])
                                && (Config.isBlockingParking[n2][1] == mainarr[k2 * 10 + p2].ParkingSlotNum[1])) {
                                mainarr[k2 * 10 + p2].exitT = exitTime;
                                //$("#parking").find("tr").eq(k2).find("td").eq(p2).addClass("isBlockingParking");
                                counter++;
                                mainarr[k2 * 10 + p2].userID = 66;
                                if (flagUserReq == 0) { if (arrCars[i] > 0) arrCars[i]--; }
                                flagEndParking = 1;
                                break;
                            }
                        }
                    }
                    if (flagEndParking == 1) break;
                }
                if (flagEndParking == 1) break;
            }
        }//end of check2

        //}
    }// end blockingFunc function  
}//end of insertBlocking()



function exitCars(i) {
    var blockingRow;
    for (var k2 = 0; k2 < Config.x; k2++) {
        for (var p2 = 0; p2 < Config.y; p2++) {
            if (mainarr[k2 * 10 + p2].userID != null && mainarr[k2 * 10 + p2].exitT == i) {//check if the parking slot is'nt empty and if the exit hour is i
                //when the row is 'isParking' row:
                if (k2 == 0) blockingRow = 1;
                else if (k2 == 4) blockingRow = 3;
                else if (k2 == 5) blockingRow = 6;
                else if (k2 == 9) blockingRow = 8;
                //when the row is 'isBlockingParking' row:
                else blockingRow = null;
                //for checkSystemRequest function
                if (k2 == 1) blockedRow = 0;
                else if (k2 == 3) blockedRow = 4;
                else if (k2 == 6) blockedRow = 5;
                else if (k2 == 8) blockedRow = 9;
                if (blockingRow != null)//when the row is 'isParking' row
                {
                    if (mainarr[blockingRow * 10 + p2].userID != null)//if there is a blocking car (not supposed to happen)
                    {
                        if (mainarr[k2 * 10 + p2].exitT < mainarr[blockingRow * 10 + p2].exitT)//check if exit time of this car< exit time of the blocked car
                        {
                            //move blocking car to the parking slot of the car that exit now
                            var tempExitT = mainarr[blockingRow * 10 + p2].exitT;
                            var tempUserID = mainarr[blockingRow * 10 + p2].userID;
                            mainarr[blockingRow * 10 + p2].exitT = null;
                            mainarr[blockingRow * 10 + p2].userID = null;
                            mainarr[k2 * 10 + p2].exitT = tempExitT;
                            mainarr[k2 * 10 + p2].userID = tempUserID;
                            flagBlocking1 = 0; flagBlocking2 = 0;
                            checkSystemRequest(tempExitT, blockingRow, p2);// check if to add a system request to DB
                        }
                    }
                    else {//if there is not a blocking car
                        mainarr[k2 * 10 + p2].exitT = null;
                        mainarr[k2 * 10 + p2].userID = null;
                        flagBlocking1 = 0; flagBlocking2 = 0;
                        checkSystemRequest(null, k2, p2);// check if to add a system request to DB
                    }
                }
                else {//when the row is 'isBlockingParking' row
                    mainarr[k2 * 10 + p2].exitT = null;
                    mainarr[k2 * 10 + p2].userID = null;
                    flagBlocking1 = 0; flagBlocking2 = 0;
                    var tempExitT2 = mainarr[blockedRow * 10 + p2].exitT;
                    checkSystemRequest(tempExitT2, k2, p2);// check if to add a system request to DB
                }
            }
        }
    }
} //end of exitCars function

function checkSystemRequest(exitTCompare, kEmpty, pEmpty) {//kEmpty,pEmpty: is the empty parking slot
    var blockedRow;
    var flagSystemReq;
    for (var k = 0; k < Config.x; k++) {
        for (var p = 0; p < Config.y; p++) {
            if (k == 1 || k == 3 || k == 6 || k == 8) {//if is a blocking row
                if (k == 1) blockedRow = 0;
                else if (k == 3) blockedRow = 4;
                else if (k == 6) blockedRow = 5;
                else if (k == 8) blockedRow = 9;
                if (mainarr[k * 10 + p].userID != null && mainarr[k * 10 + p].exitT > mainarr[blockedRow * 10 + p].exitT)  //if the parking slot is not empty, and blockingcar's exitT < blockedcar's exitT
                    if ((exitTCompare != null && mainarr[k * 10 + p].exitT <= exitTCompare) || exitTCompare == null) { //if blockingcar's exitTime<=exitTCompare
                        flagSystemReq = 1;
                        countMoves++;
                        console.log('countermoves: ' + countMoves);
                        systemRequest(k, p, kEmpty, pEmpty)
                    }
            }
            if (flagSystemReq == 1) break;
        }
        if (flagSystemReq == 1) break;
    }
}

function systemRequest(kFrom, pFrom, kEmpty, pEmpty) 
{
    //save details of the user we move from
    var tempUserID = mainarr[kFrom * 10 + pFrom].userID;
    var tempExitT = mainarr[kFrom * 10 + pFrom].exitT;
    //remove the car
    mainarr[kFrom * 10 + pFrom].exitT = null;
    mainarr[kFrom * 10 + pFrom].userID = null;
    //move to the empty parking slot
    mainarr[kEmpty * 10 + pEmpty].exitT = tempExitT;
    mainarr[kEmpty * 10 + pEmpty].userID = tempUserID;

}