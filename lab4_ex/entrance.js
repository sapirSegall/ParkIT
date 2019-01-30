
var outputSlotNum;

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




//if we here- the driver need to block
async function blockingFunc1(inputDriverID, inputExitTime) {
    flagEndParking = 0;
    for (var k2 = 0; k2 < Config.x; k2++) {
        for (var p2 = 0; p2 < Config.y; p2++) {
            
            if (p2 == 10) break;
            if (k2 != 2 && k2 != 7) {//if is not a pass
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

                                //update in DB the flag of the blocked car:
                                var resIDBlocked = await getIDDB(blockedRow * 10 + p2);
                                activeDriver.isBlock = true;
                                updateDriver(resIDBlocked, activeDriver);

                                break;
                            }
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

                            //update in DB the flag of the blocked car:
                            var resIDBlocked = await getIDDB(blockedRow * 10 + p2);
                            activeDriver.isBlock = true;
                            updateDriver(resIDBlocked, activeDriver);

                            break;
                        }
                    }
                }
                if (flagEndParking == 1) break;
            }
            if (flagEndParking == 1) break;
        }

    }//end of check2  
    return outputSlotNum;
}// end blockingFunc function


async function entranceCar(inputDriverID, inputExitTime) {
    var flagEndParking = 0; //flag==1 when the algoritem find parking slot

    //check if lot is full:
    var resfull = await isLotFull();
    if (resfull == true) return false;

    var resParkingSfull = await isParkingSlotsFull();
    if (resParkingSfull == true) flagBlocking1 = 1;
    if (flagBlocking1 == 1) await blockingFunc1(inputDriverID, inputExitTime);

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
        //var resFull = await isLotFull();
        //if (resFull) { window.alert("lot is full"); };
    return outputSlotNum;
}//end of entrance function


