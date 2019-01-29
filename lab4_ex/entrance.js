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
var countEmpty = 0;

//call to dataBaseApi functions:
async function getIDDB(slotNumber) {
    var tempid = await getIDDriverSlot(slotNumber);
    return tempid;
}
async function setSlotDB(slotNumber, slot1) {
    await setSlot(slotNumber, slot1);
}
async function getexitTDB(slotNumber) {
    var tempexitTt = await getExitTDriverSlot(slotNumber);
    return tempexitTt;
}
async function getallslots() {
    var tempslots = await getSlots();
    return tempslots;
}
async function isParkingSlotsFull() //check if isParking slots now full(blue)
{
    for (var k = 0; k < Config.x; k++) {
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


async function blockingFunc1(inputDriverID, inputExitTime) {
    flagEndParking = 0;
    for (var k2 = 0; k2 < Config.x; k2++) {
        for (var p2 = 0; p2 < Config.y; p2++) {
            //var empt = await getTotalEmpty();//debug
            // var exitTBlocked = await getexitTDB(10);//debug
            //var vari = await getallslots();//debug
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
                            activeDriver.parkingNumber = outputSlotNum;
                            updateDriver(inputDriverID, activeDriver);
                            counter++;
                            var slot1 = {
                                userID: inputDriverID,
                                exitT: inputExitTime
                            };

                            await setSlotDB(k2 * Config.x + p2, slot1);//update slot in DB


                            flagEndParking = 1;
                            //noticeBlocked(blockedRow * 10 + p2);
                            //activeDriver.isBlock = true;
                            //updateDriver(activeUser.user, activeDriver);
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
                            activeDriver.parkingNumber = outputSlotNum;
                            updateDriver(inputDriverID, activeDriver);
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

async function entranceCar(inputDriverID, inputExitTime) {
    var flagEndParking = 0; //flag==1 when the algoritem find parking slot
        var resParkingSfull = await isParkingSlotsFull();
        if (resParkingSfull == true) flagBlocking1 = 1;
    if (flagBlocking1 == 1) blockingFunc1(inputDriverID, inputExitTime);
        else {
            for (k = 0; k < Config.x; k++) {
                for (p = 0; p < Config.y; p++) {
                    var result = await getIDDB(k * Config.x + p);
                    if (result == -1)//if the parking is empty
                    {
                        for (var n = 0; n < Config.IsParking.length; n++) {
                            if ((Config.IsParking[n][0] == k) && (Config.IsParking[n][1] == p)) {
                                outputSlotNum = k * Config.x + p;
                                activeDriver.parkingNumber = outputSlotNum;
                                updateDriver(inputDriverID, activeDriver);
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
    //await blockingFunc1(inputDriverID, inputExitTime);
       
        //var resFull = await isLotFull();
        //if (resFull) { window.alert("lot is full"); };
    //return outputSlotNum;
}//end of Fill function


