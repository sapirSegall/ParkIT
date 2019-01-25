﻿
   
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
var arrCars = [70, 1, 1, 1, 1, 1, 1, 10, 10, 10, 10, 10, 10, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]; //24 hours

var maxCars = 100;



$(function () {
    // create table
    for (var i = 0; i < Config.x; i++) {
        var tr = $("<tr/>");
        for (var j = 0; j < Config.y; j++) {
            var td = $("<td/>");
            $(tr).append(td);
        }
        $("#parking").append(tr);
    }
    // create passover and not parking area
    for (var l = 0; l < Config.IsPassover.length; l++)
        for (var i = 0; i < Config.x; i++)
            for (var j = 0; j < Config.y; j++) {
                if (Config.IsPassover[l][0] == i && Config.IsPassover[l][1] == j)
                    $("#parking").find("tr").eq(i).find("td").eq(j).addClass("isPass");
            }
    /*
    for (var l = 0; l < Config.IsNone.length; l++)
        for (var i = 0; i < Config.x; i++)
            for (var j = 0; j < Config.y; j++) {
                if (Config.IsNone[l][0] == i && Config.IsNone[l][1] == j)
                    $("#parking").find("tr").eq(i).find("td").eq(j).addClass("isNotParking");
            }*/
});



//returm number between min to max
function getRandom(min, max) {
    return Math.floor(Math.random() * (1 + max - min)) + min;
}

function getRandomSp(min, max, ar) {
    return ar[Math.floor(Math.random() * (1 + max - min)) + min];
}


//fill the parking lot:
var countMoves = 0; //count moves of cars in one simulation/day
var counter = 0;//count the car entrance and park(for debugging)
var flagBlocking1 = 0; // flag==1 when the cars start blocking
var flagBlocking2; // flag==1 when the cars start blocking in check2 phase
var flagUserReq = 0; //flag==1 if there is user request
var i = 0;
var exitTime;
var outputExitT=[];


function Fill() {
    var flagEndParking = 0; //flag==1 when the algoritem find parking slot


    while (1) {

        if (i == 23) window.alert("i==23");
        //window.alert(countMoves);
        if (arrCars[i] > 0 || flagUserReq == 1) { //if there is more car in this hour
            //var d = new Date();
            //var entranceTime = d.getHours();
            if (flagUserReq == 0) {
                var entranceTime = i;
                if (i >= 18) { exitTime = getRandom(i + 1, 23); }
                if (i < 18) { exitTime = getRandom(i + 5, 23); } //enforce exitTime>= entranceTime
            }
            //document.write(Config.IsParking.length);
            switch (1) {//the value in switch is the choosen alg'
                case 1:
                    flagEndParking = 0;
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

                    if (flagBlocking1 == 1) blockingFunc();

                    else {
                        for (k = 0; k < Config.x; k++) {
                            for (p = 0; p < Config.y; p++) {
                                
                                var y= getParkingSlot(k*Config.x+p);
                                if (mainarr[k * 10 + p].userID == null) {

                                    for (var n = 0; n < Config.IsParking.length; n++) {

                                        if ((Config.IsParking[n][0] == mainarr[k * 10 + p].ParkingSlotNum[0])
                                            && (Config.IsParking[n][1] == mainarr[k * 10 + p].ParkingSlotNum[1])) {
                                            mainarr[k * 10 + p].exitT = exitTime;
                                            $("#parking").find("tr").eq(k).find("td").eq(p).addClass("isParking");
                                            outputExitT.push(k);
                                            outputExitT.push(p);
                                            counter++;
                                            mainarr[k * 10 + p].userID = 40; //������
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

                    function blockingFunc() {
                        flagEndParking = 0;
                        //if (flagBlocking2 != 1) {
                        for (var k2 = 0; k2 < Config.x; k2++) {
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
                                                $("#parking").find("tr").eq(k2).find("td").eq(p2).addClass("isBlockingParking");
                                                outputExitT = p2;
                                                counter++;
                                                mainarr[k2 * 10 + p2].userID = 30;
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
                        //}

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
                                                $("#parking").find("tr").eq(k2).find("td").eq(p2).addClass("isBlockingParking");
                                                outputExitT = p2;
                                                counter++;
                                                mainarr[k2 * 10 + p2].userID = 30;
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

                        //userRequest(40); //just for check the func
                    }// end blockingFunc function

                    break;

                case 2://alg' 2:
                    flagEndParking = 0;
                    /*var res = isParkingSlotsFull();
                    function isParkingSlotsFull() //check if isParking slots now full
                    {
                        for (var p2 = 0; p2 < Config.y; p2++)
                            if (mainarr[k * 10 + p2].userID == null) return false;
                        return true;
                    }//end isParkingSlotsFull function
                    if (res) flagBlocking1 = 1;
                    if (flagBlocking1 == 1) blockingFunc(); */

                    // else {
                    for (k = 0; k < Config.x; k++) {
                        for (p = 0; p < Config.y; p++) {
                            if (mainarr[k * 10 + p].userID == null) {
                                for (var n = 0; n < Config.IsParking.length; n++) {
                                    if ((Config.IsParking[n][0] == mainarr[k * 10 + p].ParkingSlotNum[0])
                                        && (Config.IsParking[n][1] == mainarr[k * 10 + p].ParkingSlotNum[1])) {
                                        mainarr[k * 10 + p].exitT = exitTime;
                                        $("#parking").find("tr").eq(k).find("td").eq(p).addClass("isParking");
                                        counter++;
                                        mainarr[k * 10 + p].userID = 40; //������
                                        if (flagUserReq == 0) { if (arrCars[i] > 0) arrCars[i]--; }
                                        flagEndParking = 1;
                                        break; //break for of n
                                    }
                                }
                            }
                            if (flagEndParking == 1) break; //break for of p
                            if (p == 9) { flagBlocking1 = 1; if (flagBlocking1 == 1) blockingFunc(); } //break for of p, if end of this row
                        }


                        function blockingFunc() {
                            flagEndParking = 0;
                            //find the current row (blocking row)
                            if (k == 0) blockingRow = 1;
                            else if (k == 4) blockingRow = 3;
                            else if (k == 5) blockingRow = 6;
                            else if (k == 9) blockingRow = 8;

                            for (var p2 = 0; p2 < Config.y; p2++) {
                                if (mainarr[blockingRow * 10 + p2].userID == null) {//check if parking slot is empty:

                                    if (exitTime <= mainarr[k * 10 + p2].exitT) {//check if exit time of this car>= exit time of the blocked car:
                                        for (var n2 = 0; n2 < Config.isBlockingParking.length; n2++) {
                                            if ((Config.isBlockingParking[n2][0] == mainarr[blockingRow * 10 + p2].ParkingSlotNum[0])
                                                && (Config.isBlockingParking[n2][1] == mainarr[blockingRow * 10 + p2].ParkingSlotNum[1])) {
                                                mainarr[blockingRow * 10 + p2].exitT = exitTime;
                                                $("#parking").find("tr").eq(blockingRow).find("td").eq(p2).addClass("isBlockingParking");
                                                counter++;
                                                mainarr[blockingRow * 10 + p2].userID = 30;
                                                if (flagUserReq == 0) { if (arrCars[i] > 0) arrCars[i]--; }
                                                flagEndParking = 1;
                                                break;
                                            }
                                        }
                                    }
                                }
                                if (flagEndParking == 1) break;
                            }//end for p


                            //check2: (when car1 blocking car2 that car1's exitT>car2's exitT)
                            if (p2 == 10) flagBlocking2 = 1;
                            if (flagBlocking2 == 1) {
                                for (var p2 = 0; p2 < Config.y; p2++) {
                                    //check if parking slot is empty:
                                    if (mainarr[blockingRow * 10 + p2].userID == null) {//check if exit time of this car>= exit time of the blocked car:
                                        for (var n2 = 0; n2 < Config.isBlockingParking.length; n2++) {
                                            if ((Config.isBlockingParking[n2][0] == mainarr[blockingRow * 10 + p2].ParkingSlotNum[0])
                                                && (Config.isBlockingParking[n2][1] == mainarr[blockingRow * 10 + p2].ParkingSlotNum[1])) {
                                                mainarr[blockingRow * 10 + p2].exitT = exitTime;
                                                $("#parking").find("tr").eq(blockingRow).find("td").eq(p2).addClass("isBlockingParking");
                                                counter++;
                                                mainarr[blockingRow * 10 + p2].userID = 30;
                                                if (flagUserReq == 0) { if (arrCars[i] > 0) arrCars[i]--; }
                                                flagEndParking = 1;
                                                break;
                                            }
                                        }
                                    }
                                    if (flagEndParking == 1) break;
                                }
                            }//end of if

                            //userRequest(40); //just for check the func
                        }// end blockingFunc function
                        if (flagEndParking == 1) break;
                    }//end for of k
                    break;

                case 3://alg' 3:
                    flagEndParking = 0;

                    for (k = 0; k < Config.x; k++) {
                        for (p = 0; p < Config.y; p++) {
                            //if (mainarr[k * 10 + p].userID == null) {
                            for (var n = 0; n < Config.IsParking.length; n++) {
                                if ((Config.IsParking[n][0] == mainarr[k * 10 + p].ParkingSlotNum[0])
                                    && (Config.IsParking[n][1] == mainarr[k * 10 + p].ParkingSlotNum[1])) {
                                    if (mainarr[k * 10 + p].userID == null) {//if 'isParking' is empty- regular parking
                                        mainarr[k * 10 + p].exitT = exitTime;
                                        $("#parking").find("tr").eq(k).find("td").eq(p).addClass("isParking");
                                        counter++;
                                        mainarr[k * 10 + p].userID = 40; //������
                                        if (flagUserReq == 0) { if (arrCars[i] > 0) arrCars[i]--; }
                                        flagEndParking = 1;
                                        break;
                                    }
                                    else {//if 'isParking' is not empty-check two options:
                                        if (k == 0) blockingRow = 1;
                                        else if (k == 4) blockingRow = 3;
                                        else if (k == 5) blockingRow = 6;
                                        else if (k == 9) blockingRow = 8;
                                        if (mainarr[blockingRow * 10 + p].userID == null) {//if there is no blocking car- go to blockingFunc(). else- keep on this loop
                                            flagBlocking1 = 1;
                                            if (flagBlocking1 == 1) blockingFunc();
                                        }
                                    }
                                    //}
                                    //
                                }//end if of n
                                if (flagEndParking == 1) break;
                            }
                            if (flagEndParking == 1) break;
                        }
                        if (flagEndParking == 1) break;
                    }//end loop of k


                    function blockingFunc() {//all the blockings in alg' 3 is without consider in exit time
                        flagEndParking = 0;

                        for (var k2 = 0; k2 < Config.x; k2++) {
                            for (var p2 = 0; p2 < Config.y; p2++) {
                                //check if parking slot is empty:
                                if (mainarr[k2 * 10 + p2].userID == null) {
                                    for (var n2 = 0; n2 < Config.isBlockingParking.length; n2++) {
                                        if ((Config.isBlockingParking[n2][0] == mainarr[k2 * 10 + p2].ParkingSlotNum[0])
                                            && (Config.isBlockingParking[n2][1] == mainarr[k2 * 10 + p2].ParkingSlotNum[1])) {
                                            mainarr[k2 * 10 + p2].exitT = exitTime;
                                            $("#parking").find("tr").eq(k2).find("td").eq(p2).addClass("isBlockingParking");
                                            counter++;
                                            mainarr[k2 * 10 + p2].userID = 30;
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

                        //userRequest(40); //just for check the func
                    }// end blockingFunc function


                //end of 3 cases       
            } //end switch
            var res2 = isLotFull();
            if (res2) { window.alert("lot is full"); i++; exitCars(i); funcIsCarBlocked(i); };
        }
        else if (flagUserReq == 0) { i++; exitCars(i); funcIsCarBlocked(i) }; //go here if arrCars[i]== 0 (no more cars in this hour), so i++ is the next hour
        if (flagEndParking == 1) break; //break fill (end of entrance of specific car)
    }//end of while
    return outputExitT;
}//end of fill function




//functions of all the 3 algoritems:

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


//func_scheduleUserRequest(14, 23);//check
//���� ������ ����� ���� ��� ����� //������ �� �������� �� �������� ������
//�� ����� ���� ����� ����� ���� ���� ���- �� ����� �� ��������
function func_scheduleUserRequest(parkingSlotNum, newExitTime) {//implementation of schedule user request.
    var tempParkingSNum = parkingSlotNum;
    if (tempParkingSNum > (Config.x * Config.y)) return false; //if tempParkingSNum is not exist?
    var tempRowNum = Math.floor(tempParkingSNum / 10);
    var tempColNum = tempParkingSNum % 10;
    if ((mainarr[Math.floor(tempRowNum * 10 + tempColNum)].exitT) < i) return false; //if the user send exit time that earlier then this hour// ����� �� ����� ��������� ���
    mainarr[Math.floor(tempRowNum * 10 + tempColNum)].exitT = newExitTime;
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
                            //sendAlertToUserRequest(mainarr[k * 10 + p].userID); //���� �������
                            countMoves++;
                            //window.alert(k, p); //just for debugging
                        }
                    }
                }
            }
        }
    }
}//end of funcIsCarBlocked

//user request: change parking slot of the blocking car
function userRequest(blockedID) {
    flagUserReq = 1;
    //find the parking slot of the user who sent this user request
    var blockingRow;
    for (var k = 0; k < Config.x; k++) {
        for (var p = 0; p < Config.y; p++) {
            if (mainarr[k * 10 + p].userID == blockedID) {
                //find the blocking car 's parking slot
                if (k == 0) blockingRow = 1;
                else if (k == 4) blockingRow = 3;
                else if (k == 5) blockingRow = 6;
                else if (k == 9) blockingRow = 8;
                //when the row is not 'isParking' row: �� ���� ����� ���
                else blockingRow = null;

                //change parking slot of the blocking car
                exitTime = mainarr[blockingRow * 10 + p].exitT; //save for Fill() function

                mainarr[blockingRow * 10 + p].exitT = null;
                mainarr[blockingRow * 10 + p].userID = null;
                $("#parking").find("tr").eq(blockingRow).find("td").eq(p).removeClass("isBlockingParking");
                flagBlocking1 = 0; flagBlocking2 = 0;
                Fill(); //find parking slot for the blocking car with the saved exitTime
            }
        }
    }
}




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
                        if (mainarr[k2 * 10 + p2].exitT <= mainarr[blockingRow * 10 + p2].exitT)//check if exit time of this car< exit time of the blocked car
                        {
                            //move blocking car to the parking slot of the car that exit now
                            var tempExitT = mainarr[blockingRow * 10 + p2].exitT;
                            var tempUserID = mainarr[blockingRow * 10 + p2].userID;
                            mainarr[blockingRow * 10 + p2].exitT = null;
                            mainarr[blockingRow * 10 + p2].userID = null;
                            $("#parking").find("tr").eq(blockingRow).find("td").eq(p2).removeClass("isBlockingParking");
                            mainarr[k2 * 10 + p2].exitT = tempExitT;
                            mainarr[k2 * 10 + p2].userID = tempUserID;
                            flagBlocking1 = 0; flagBlocking2 = 0;
                            checkSystemRequest(tempExitT, blockingRow, p2);// check if to add a system request to DB
                        }
                    }
                    else {//if there is not a blocking car
                        mainarr[k2 * 10 + p2].exitT = null;
                        mainarr[k2 * 10 + p2].userID = null;
                        $("#parking").find("tr").eq(k2).find("td").eq(p2).removeClass("isParking");
                        flagBlocking1 = 0; flagBlocking2 = 0;
                        checkSystemRequest(null, k2, p2);// check if to add a system request to DB
                    }
                }
                else {//when the row is 'isBlockingParking' row
                    mainarr[k2 * 10 + p2].exitT = null;
                    mainarr[k2 * 10 + p2].userID = null;
                    $("#parking").find("tr").eq(k2).find("td").eq(p2).removeClass("isBlockingParking");
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
                        //systemRequest(k,p, kEmpty, pEmpty)// for debugging
                        //sendSystemReqToDB(mainarr[k * 10 + p].userID, kEmpty,pEmpty ); //����
                    }
            }
            if (flagSystemReq == 1) break;
        }
        if (flagSystemReq == 1) break;
    }
}

function systemRequest(kFrom, pFrom, kEmpty, pEmpty) //called when valet select this task
{
    //save details of the user we move from
    var tempUserID = mainarr[kFrom * 10 + pFrom].userID;
    var tempExitT = mainarr[kFrom * 10 + pFrom].exitT;
    //remove the car
    mainarr[kFrom * 10 + pFrom].exitT = null;
    mainarr[kFrom * 10 + pFrom].userID = null;
    $("#parking").find("tr").eq(kFrom).find("td").eq(pFrom).removeClass("isBlockingParking");
    //move to the empty parking slot
    mainarr[kEmpty * 10 + pEmpty].exitT = tempExitT;
    mainarr[kEmpty * 10 + pEmpty].userID = tempUserID;
    if (kEmpty == 0 || kEmpty == 4 || kEmpty == 5 || kEmpty == 9) $("#parking").find("tr").eq(kEmpty).find("td").eq(pEmpty).addClass("isParking");
    else $("#parking").find("tr").eq(kEmpty).find("td").eq(pEmpty).addClass("isBlockingParking");
}



//check if need
function Clear() {
    $.each($(".isParking"),
        function (i, o) {
            $(o).removeClass("isParking");
        });
}
    


    
        //clock
        function startTime() {
            var today = new Date();
        //var h = today.getHours();
        var h = i;
        //var m = today.getMinutes();
        var m = 00;
        var s = today.getSeconds();
        m = checkTime(m);
        s = checkTime(s);
        document.getElementById('txt').innerHTML =
            h + ":" + m + ":" + s;
        var t = setTimeout(startTime, 500);
    }
        function checkTime(i) {
            if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
        return i;
    }
    