

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


//fill the parking lot:
var countMoves = 0; //count moves of cars in one simulation/day- for loop
var counter = 0;//count the car entrance and park(for debugging)
var flagBlocking1 = 0; // flag==1 when the cars start blocking- DB
var flagBlocking2; // flag==1 when the cars start blocking in check2 phase- DB
var flagUserReq = 0; //flag==1 if there is user request
var i = 0;//will deleted
var exitTime;//will deleted
var outputSlotNum;//output of Fill()- parking slot number
var s= {
    userId: '',
    timeExit: ''
};

//call to dataBaseApi functions:
async function getIDDB(slotNumber) {
    var tempid = await getIDDriverSlot(slotNumber);
    return tempid;
}
async function setSlotDB(slotNumber, slot1) {
    await setSlot(slotNumber,slot1);
}
async function getexitTDB(slotNumber) {
    var tempexitT = await getExitTDriverSlot(slotNumber);
    return tempexitT;
}

async function isParkingSlotsFull() //check if isParking slots now full(blue)
{
    for (k = 0; k < Config.x; k++) {
        for (p = 0; p < Config.y; p++) {
            if (k == 0 || k == 4 || k == 5 || k == 9) {
                var tempid = await getIDDB(k * Config.x + p);
                if (tempid == -1) return false;
                //if (mainarr[k * 10 + p].userID == null) return false;

            }
        }
    }
    return true;
}

async function Fill(inputDriverID, inputExitTime)
{
    var flagEndParking = 0; //flag==1 when the algoritem find parking slot

    while (1) {

            switch (1) {//the value in switch is the choosen alg'
                case 1:
                    flagEndParking = 0;

                    var resParkingSfull = await isParkingSlotsFull();
                    if (resParkingSfull==true) flagBlocking1 = 1;
                    if (flagBlocking1 == 1) blockingFunc1();

                    else {
                        for (k = 0; k < Config.x; k++) {
                            for (p = 0; p < Config.y; p++)
                            {
                                var result = await getIDDB(k * Config.x + p);
                                if (result == -1)//if the parking is empty
                                {
                                    for (var n = 0; n < Config.IsParking.length; n++) {
                                        if ((Config.IsParking[n][0] == k) && (Config.IsParking[n][1] ==p )) {                                            
                                            outputSlotNum = k * Config.x + p;
                                            counter++;

                                            var slot1 = {
                                                userID: inputDriverID,
                                                exitT: inputExitTime
                                            };
                                          
                                            await setSlotDB(k * Config.x + p, slot1);//update slot in DB

                                            flagEndParking = 1;
                                            if (Config.IsParking[n][0] == 9 && Config.IsParking[n][1] == 9) {//need?
                                                flagBlocking1 = 1;
                                            }
                                            break;
                                        }
                                    }
                                }
                                if (flagEndParking == 1) break;
                            }
                            if (flagEndParking == 1) break;
                        }
                    }

                    //if we here- the driver need to block
                    async function blockingFunc1() {
                        flagEndParking = 0;
                        for (var k2 = 0; k2 < Config.x; k2++) {
                            for (var p2 = 0; p2 < Config.y; p2++) {
                                if (p2 == 10) break;
                                var result = await getIDDB(k2 * Config.x + p2);
                                    if (result == -1) {//check if parking slot is empty
                                    //check if exit time of this car>= exit time of the blocked car:
                                    if (k2 == 1) blockedRow = 0;
                                    else if (k2 == 3) blockedRow = 4;
                                    else if (k2 == 6) blockedRow = 5;
                                    else if (k2 == 8) blockedRow = 9;
                                    
                                    var exitTBlocked = await getexitTDB(blockedRow * 10 + p2);
                                    
                                        if (inputExitTime <= exitTBlocked) {
                                        for (var n2 = 0; n2 < Config.isBlockingParking.length; n2++) {
                                            if ((Config.isBlockingParking[n2][0] == k2) && (Config.isBlockingParking[n2][1] == p2)) {
                                                outputSlotNum = k2 * Config.x + p2;
                                                counter++;
                                                var slot1 = {
                                                    userID: inputDriverID,
                                                    exitT: inputExitTime
                                                };
                                              
                                                await setSlotDB(k2 * Config.x + p2, slot1);//update slot in DB
                                                flagEndParking = 1;
                                                //noticeBlocked(blockedRow * 10 + p2);
                                                break;
                                            }
                                        }
                                    }
                                }
                                if (flagEndParking == 1) break;
                            }
                            if (flagEndParking == 1) break;
                        }
                        

                        //check2: (when car1 blocking car2 that car1's exitT>car2's exitT)
                        if (k2 == 10) flagBlocking2 = 1;
                        if (flagBlocking2 == 1) {
                            for (var k2 = 0; k2 < Config.x; k2++) {
                                for (var p2 = 0; p2 < Config.y; p2++) {
                                    
                                    //check if parking slot is empty:
                                  
                                    var result = await getIDDB(k2 * Config.x + p2);
                                    if (result == -1) {
                                        for (var n2 = 0; n2 < Config.isBlockingParking.length; n2++) {
                                            if ((Config.isBlockingParking[n2][0] == k2)
                                                && (Config.isBlockingParking[n2][1] == p2)) {
                                                outputSlotNum = k2 * Config.x + p2;
                                                counter++;
                                                var slot1 = {
                                                    userID: inputDriverID,
                                                    exitT: inputExitTime
                                                };
                                                await setSlotDB(k2 * Config.x + p2, slot1);//update slot in DB
                                                flagEndParking = 1;

                                                //for notice:
                                                if (k2 == 1) blockedRow = 0;
                                                else if (k2 == 3) blockedRow = 4;
                                                else if (k2 == 6) blockedRow = 5;
                                                else if (k2 == 8) blockedRow = 9;
                                                 //noticeBlocked(blockedRow * 10 + p2);
                                                break;
                                            }
                                        }
                                    }
                                    if (flagEndParking == 1) break;
                                }
                                if (flagEndParking == 1) break;
                            }

                        }//end of check2  
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
                            u.user = getIDDriverSlot(k * Config.x + p);//not writen
                            if (u.user == -1) {
                            //if (mainarr[k * 10 + p].userID == null) {
                                for (var n = 0; n < Config.IsParking.length; n++) {
                                    if ((Config.IsParking[n][0] == k)
                                        && (Config.IsParking[n][1] == p)) {
                                        
                                       // $("#parking").find("tr").eq(k).find("td").eq(p).addClass("isParking");
                                        outputSlotNum.push(k);
                                        outputSlotNum.push(p);
                                        counter++;
                                        var slot1 = {
                                            userID: inputDriverID,
                                            exitT: inputExitTime
                                        };
                                        setSlot(k * Config.x + p, slot1)//update slot in DB
                                        
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
                                //if (mainarr[blockingRow * 10 + p2].userID == null) {//check if parking slot is empty:
                                    u.user = getIDDriverSlot(blockingRow * Config.x + p2);//not writen
                            if (u.user == -1) {
                                //if (exitTime <= mainarr[k * 10 + p2].exitT) {//check if exit time of this car>= exit time of the blocked car:
                                    var exitTBlocked = getExitTDriverSlot(k * 10 + p2);
                                    if (inputExitTime <= exitTBlocked) {
                                        for (var n2 = 0; n2 < Config.isBlockingParking.length; n2++) {
                                            if ((Config.isBlockingParking[n2][0] == blockingRow)
                                                && (Config.isBlockingParking[n2][1] == p2)) {
                                                //mainarr[blockingRow * 10 + p2].exitT = exitTime;
                                                //$("#parking").find("tr").eq(blockingRow).find("td").eq(p2).addClass("isBlockingParking");
                                                //mainarr[blockingRow * 10 + p2].userID = 30;
                                                outputSlotNum.push(blockingRow );
                                                outputSlotNum.push(p2);
                                                counter++;
                                                var slot1 = {
                                                    userID: inputDriverID,
                                                    exitT: inputExitTime
                                                };
                                                setSlot(blockingRow  * Config.x + p2, slot1)//update slot in DB
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
                                    //if (mainarr[blockingRow * 10 + p2].userID == null) {//check if exit time of this car>= exit time of the blocked car:
                                        u.user = getIDDriverSlot(blockingRow * Config.x + p2);//not writen
                                        if (u.user == -1) {
                                        for (var n2 = 0; n2 < Config.isBlockingParking.length; n2++) {
                                            if ((Config.isBlockingParking[n2][0] == blockingRow)
                                                && (Config.isBlockingParking[n2][1] == p2)) {
                                                //mainarr[blockingRow * 10 + p2].exitT = exitTime;
                                                //$("#parking").find("tr").eq(blockingRow).find("td").eq(p2).addClass("isBlockingParking");
                                                outputSlotNum.push(blockingRow );
                                                outputSlotNum.push(p2);
                                                counter++;
                                                var slot1 = {
                                                    userID: inputDriverID,
                                                    exitT: inputExitTime
                                                };
                                                setSlot(blockingRow  * Config.x + p2, slot1)//update slot in DB
                                                //mainarr[blockingRow * 10 + p2].userID = 30;
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
                            for (var n = 0; n < Config.IsParking.length; n++) {
                                if ((Config.IsParking[n][0] == k)
                                    && (Config.IsParking[n][1] == p)) {
                                    //if (mainarr[k * 10 + p].userID == null) {//if 'isParking' is empty- regular parking
                                        u.user = getIDDriverSlot(k * Config.x + p);//not writen
                                        if (u.user == -1) {//if 'isParking' is empty- regular parking
                                        //mainarr[k * 10 + p].exitT = exitTime;
                                        //$("#parking").find("tr").eq(k).find("td").eq(p).addClass("isParking");
                                            outputSlotNum.push(k);
                                            outputSlotNum.push(p);
                                            counter++;
                                            var slot1 = {
                                                userID: inputDriverID,
                                                exitT: inputExitTime
                                            };
                                            setSlot(k * Config.x + p, slot1)//update slot in DB
                                        //mainarr[k * 10 + p].userID = 40; 
                                        if (flagUserReq == 0) { if (arrCars[i] > 0) arrCars[i]--; }
                                        flagEndParking = 1;
                                        break;
                                    }
                                    else {//if 'isParking' is not empty-check two options:
                                        if (k == 0) blockingRow = 1;
                                        else if (k == 4) blockingRow = 3;
                                        else if (k == 5) blockingRow = 6;
                                        else if (k == 9) blockingRow = 8;
                                        //if (mainarr[blockingRow * 10 + p].userID == null) {//if there is no blocking car- go to blockingFunc(). else- keep on this loop
                                            u.user = getIDDriverSlot(blockingRow * Config.x + p);//not writen
                                            if (u.user == -1) {//if there is no blocking car- go to blockingFunc(). else- keep on this loop
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
                                //if (mainarr[k2 * 10 + p2].userID == null) {
                                    u.user = getIDDriverSlot(k2 * Config.x + p2);//not writen
                                    if (u.user == -1) {
                                    for (var n2 = 0; n2 < Config.isBlockingParking.length; n2++) {
                                        if ((Config.isBlockingParking[n2][0] == k2)
                                            && (Config.isBlockingParking[n2][1] == p2)) {
                                            //mainarr[k2 * 10 + p2].exitT = exitTime;
                                            //$("#parking").find("tr").eq(k2).find("td").eq(p2).addClass("isBlockingParking");
                                            outputSlotNum.push(k2);
                                            outputSlotNum.push(p2);
                                            counter++;
                                            var slot1 = {
                                                userID: inputDriverID,
                                                exitT: inputExitTime
                                            };
                                            setSlot(k2 * Config.x + p2, slot1)//update slot in DB
                                            //mainarr[k2 * 10 + p2].userID = 30;
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

                        
                    }// end blockingFunc function


                //end of 3 cases       
            } //end switch
            var resFull = await isLotFull();
            //if (resFull) { window.alert("lot is full"); };
        
        if (flagEndParking == 1) break; //break fill (end of entrance of specific car)
    }//end of while
    return outputSlotNum;
}//end of Fill function




//functions of all the 3 algoritems:

async function isLotFull() //check if all lot is full(parking+blocking)
{
    for (k = 0; k < Config.x; k++) {
        for (p = 0; p < Config.y; p++) {
            if (k != 2 && k != 7) {
                var resulotfull = await getIDDB(k * Config.x + p);
                if (resulotfull == -1) return false;
            }
        }
    }
    return true;
}


//output: parking slot number of the blocking car that need to move or false(if there is need to move)
function checkScheduleReq(slotNum, newExitTime)
{
    var tempParkingSNum = slotNum;
    var tempRowNum = Math.floor(tempParkingSNum / 10);
    var tempColNum = tempParkingSNum % 10;
    
    setexitT(slotNum, newExitTime); //update new exit time in db
    //when the row is 'isParking' row:
    if (tempRowNum == 0) blockingRow = 1;
    else if (tempRowNum == 4) blockingRow = 3;
    else if (tempRowNum == 5) blockingRow = 6;
    else if (tempRowNum == 9) blockingRow = 8;
    //when the row is 'isBlockingParking' row:
    else if (tempRowNum == 1) blockedRow = 0;
    else if (tempRowNum == 3) blockedRow = 4;
    else if (tempRowNum == 6) blockedRow = 5;
    else if (tempRowNum == 8) blockedRow = 9;

    if (tempRowNum == 0 || tempRowNum == 4 || tempRowNum == 5 || tempRowNum == 9)
    {
            var res10 = get10();
            async function get10() {
                var tempid = getIDDriverSlot(blockingRow * Config.x + tempColNum);
                return tempid;
            }
                if (res10 != -1) {// if there is a blocking car
            var exitTBlocking = getExitTDriverSlot(blockingRow * Config.x + tempColNum)
            if (exitTBlocking > newExitTime) return (blockingRow * Config.x + tempColNum);
            else return false;
        }
        else return false;
    }
    else if ((tempRowNum == 1 || tempRowNum == 3 || tempRowNum == 6 || tempRowNum == 8)) {
        u.user = getIDDriverSlot(blockedRow * Config.x + tempColNum);//not writen
        if (u.user != -1) {// if there is a blocked car
            var exitTBlocked = getExitTDriverSlot(blockedRow * Config.x + tempColNum)
            if (exitTBlocked < newExitTime) return slotNum;
            else return false;
        }
        else return false;
    }
}

//no checked in simulation
function ScheduleReq(slotNum, DriverID, ExitTime) {
    flagBlocking1 = 0; flagBlocking2 = 0;
    Fill(DriverID, ExitTime); //find parking slot for the blocking car
    var slot1 = {
        userID: -1,
        exitT: -1
    };
    setSlot(slotNum, slot1)//update empty slot in DB
}
/*
//no need- in real: the driver send user request
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
                            
                        }
                    }
                }
            }
        }
    }
}//end of funcIsCarBlocked*/


//no checked on DB
//user request: change parking slot of the blocking car
//input: slot of the blocked car
function userRequest(inputSlot) {
    flagUserReq = 1;
    var blockingRow;

    var tempParkingSNum = inputSlot;
    var tempRowNum = Math.floor(tempParkingSNum / 10);
    var tempColNum = tempParkingSNum % 10;

    //find the blocking car 's parking slot:
    if (tempRowNum == 0) blockingRow = 1;
    else if (tempRowNum == 4) blockingRow = 3;
    else if (tempRowNum == 5) blockingRow = 6;
    else if (tempRowNum == 9) blockingRow = 8;
                
    //change parking slot of the blocking car:
    //save for Fill() function:
    var blockingexitTime = getExitTDriverSlot(blockingRow * 10 + tempColNum);
     //blockingexitTime = mainarr[blockingRow * 10 + p].exitT; //save for Fill() function
    var blockingUserID = getIDDriverSlot(blockingRow * 10 + tempColNum);
     
     //$("#parking").find("tr").eq(blockingRow).find("td").eq(p).removeClass("isBlockingParking");
    flagBlocking1 = 0; flagBlocking2 = 0;
    Fill(blockingUserID, blockingexitTime); //find parking slot for the blocking car with the saved exitTime

    //update empty slot in DB:
    //mainarr[blockingRow * 10 + p].exitT = null;
     //mainarr[blockingRow * 10 + p].userID = null;
    var slot1 = {
        userID: -1,
        exitT: -1
    };
    setSlot(blockingRow * 10 + p, slot1)   

}//end of function userRequest



//change: input: parkingSlot number
function exitCars(k2) {
    var blockingRow;
    var resCheck = [];//the output of checkSystemRequest function;
    //for (var k2 = 0; k2 < Config.x; k2++) {
        //for (var p2 = 0; p2 < Config.y; p2++) {
            //if (mainarr[k2 * 10 + p2].userID != null && mainarr[k2 * 10 + p2].exitT == i) {//check if the parking slot is'nt empty and if the exit hour is i

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
                    //if (mainarr[blockingRow * 10 + p2].userID = null)//if there is not a blocking car
                    //{
                        //if there is not a blocking car
                        //mainarr[k2 * 10 + p2].exitT = null;
                        //mainarr[k2 * 10 + p2].userID = null;
                        var slot1 = {
                            userID: -1,
                            exitT: -1
                        };
                        setSlot(k2 * 10 + p2, slot1);//update at db that the slot is empty
                        //$("#parking").find("tr").eq(k2).find("td").eq(p2).removeClass("isParking");
                        flagBlocking1 = 0; flagBlocking2 = 0;
                        resCheck= checkSystemRequest(null, k2, p2);// check if to add a system request to DB
                    //}
                }
                else {//when the row is 'isBlockingParking' row
                    var slot1 = {
                        userID: -1,
                        exitT: -1
                    };
                    setSlot(k2 * 10 + p2, slot1);//update at db that the slot is empty
                    //$("#parking").find("tr").eq(k2).find("td").eq(p2).removeClass("isBlockingParking");
                    flagBlocking1 = 0; flagBlocking2 = 0;
                    //var tempExitT2 = mainarr[blockedRow * 10 + p2].exitT;
                    var tempExitT2 = getExitTDriverSlot(blockedRow * 10 + p2)
                    resCheck =checkSystemRequest(tempExitT2, k2, p2);// check if to add a system request to DB
                }
            //}

        //}
    //}
    return resCheck;
} //end of exitCars function


//call by exitCars function
function checkSystemRequest(exitTCompare, kEmpty, pEmpty) {//kEmpty,pEmpty: is the empty parking slot
    var blockedRow;
    var flagSystemReq;
    var outPutCheckSystemReq = [];
    for (var k = 0; k < Config.x; k++) {
        for (var p = 0; p < Config.y; p++) {
            if (k == 1 || k == 3 || k == 6 || k == 8) {//if is a blocking row
                if (k == 1) blockedRow = 0;
                else if (k == 3) blockedRow = 4;
                else if (k == 6) blockedRow = 5;
                else if (k == 8) blockedRow = 9;

                var iddriver = getIDDriverSlot(k * 10 + p);
                var exitTdriver = getExitTDriverSlot(k * 10 + p);
                var exitTblocked = getExitTDriverSlot(blockedRow * 10 + p);
                if (iddriver != -1 && exitTdriver > exitTblocked)  //if the parking slot is not empty, and blockingcar's exitT > blockedcar's exitT
                    if ((exitTCompare != null && exitTdriver <= exitTCompare) || exitTCompare == null) { //if blockingcar's exitTime<=exitTCompare
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
    if (flagSystemReq != 1) return null; //no systemRequest
    else {
        outPutCheckSystemReq.push[iddriver];//the driver we want to moving to the empty slot
        outPutCheckSystemReq.push[exitTdriver];//the slot of the car we want to move
        outPutCheckSystemReq.push[kEmpty*10 + pEmpty];//the empty slot
        return outPutCheckSystemReq;
    }
}

function systemRequest(slotFrom, slotEmpty, IDofFrom) //called when valet select this task
{
    var resCheck2 = [];
    var tempParkingSNum = slotFrom;
    var kFrom = Math.floor(tempParkingSNum / 10);
    var pFrom = tempParkingSNum % 10;
    var tempParkingSNum2 = slotEmpty;
    var kEmpty = Math.floor(tempParkingSNum2 / 10);
    var pEmpty = tempParkingSNum2 % 10;
    //check if the car in the FromSlot is still there:
    var upToDateIdOfFrom = getIDDriverSlot(kFrom * Config.x + pFrom);
    if (upToDateIdOfFrom == IDofFrom) {//if still there:
        //save details of the user we move from
        //var tempUserID = mainarr[kFrom * 10 + pFrom].userID;
        var tempUserID = getIDDriverSlot(kFrom * 10 + pFrom);
        //var tempExitT = mainarr[kFrom * 10 + pFrom].exitT;
        var tempExitT = getExitTDriverSlot(kFrom * 10 + pFrom);
        //remove the car:
        //mainarr[kFrom * 10 + pFrom].exitT = null;
        //mainarr[kFrom * 10 + pFrom].userID = null;
        var slot1 = {
            userID: -1,
            exitT: -1
        };
        setSlot(kFrom * 10 + pFrom, slot1);//update at db that the slot is empty
        //$("#parking").find("tr").eq(kFrom).find("td").eq(pFrom).removeClass("isBlockingParking");
        //move to the empty parking slot:
        //mainarr[kEmpty * 10 + pEmpty].exitT = tempExitT;
        //mainarr[kEmpty * 10 + pEmpty].userID = tempUserID;
        var slot1 = {
            userID: tempUserID,
            exitT: tempExitT
        };
        setSlot(kEmpty * 10 + pEmpty, slot1)
        //if (kEmpty == 0 || kEmpty == 4 || kEmpty == 5 || kEmpty == 9) $("#parking").find("tr").eq(kEmpty).find("td").eq(pEmpty).addClass("isParking");
        //else $("#parking").find("tr").eq(kEmpty).find("td").eq(pEmpty).addClass("isBlockingParking");
    }
    else {//if not still there:
        (resCheck2 = checkSystemRequest(exitTCompare, kEmpty, pEmpty));//check again
        if (resCheck2 == false) return false; //return false= the car is not still there and there is not another car
        else {
            systemRequest(resCheck2[1], resCheck2[2], resCheck2[0])
        }
    }//end of systemRequest func
}


    async function getTotalEmpty() {
        var countEmpty = 0;
        for (k = 0; k < Config.x; k++) {
            for (p = 0; p < Config.y; p++) {
                if (k != 2 && k != 7) {
                    var resultotal = await getIDDB(k * Config.x + p);
                    if (resultotal == -1) countEmpty++;
                }
                    
            }
        }
        return countEmpty;
}

    async function getTotalBlocking() {
        var countBlocking = 0;
        for (k = 0; k < Config.x; k++) {
            for (p = 0; p < Config.y; p++) {
                if (k == 1 || k == 3 || k == 6 || k == 8) {
                    var resultblocking= await getIDDB(k * Config.x + p);
                    if (resultblocking != -1) countBlocking++;
                }
                    
            }
        }
        return countBlocking;
    }
