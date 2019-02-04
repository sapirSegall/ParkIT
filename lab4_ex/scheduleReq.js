
//output: update in Db(Lot) the new exitT, update in Db
async function checkScheduleReq(slotNum,employeeNum, newExitTime, requestNum)
{
    //check if lot is full:
    var resfull = await isLotFull();
    if (resfull == false) {//if not full

        var tempParkingSNum = slotNum;
        var tempRowNum = Math.floor(tempParkingSNum / 10);
        var tempColNum = tempParkingSNum % 10;

        slot.exitT = newExitTime;
        slot.userID = employeeNum;
        setSlot(slotNum, slot);//update new exit time in db

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

        if (tempRowNum == 0 || tempRowNum == 4 || tempRowNum == 5 || tempRowNum == 9)//if blocked row
        {
            var result1 = await getIDDB(blockingRow * Config.x + tempColNum);
            if (result1 != -1) {// if there is a blocking car
                //var tempexitTt = await getExitTDriverSlot(slotNum);
                var exitTBlocking = await getexitTDB(blockingRow * Config.x + tempColNum);
                if (exitTBlocking > newExitTime) {
                    var request = await getRequest(employeeNum, requestNum);
                    request.requestNumber = requestNum;
                    request.flagPriority = true;
                    updateRequest(employeeNum, request);
                }
            }
        }
        else if ((tempRowNum == 1 || tempRowNum == 3 || tempRowNum == 6 || tempRowNum == 8)) {//if blocking row
            var result2 = await getIDDB(blockedRow * Config.x + tempColNum);
            if (result2 != -1) {// if there is a blocked car//delete?
                var exitTBlocked = await getexitTDB(blockedRow * Config.x + tempColNum);
                if (exitTBlocked < newExitTime) {
                    var request = await getRequest(employeeNum, requestNum);
                    request.requestNumber = requestNum;
                    request.flagPriority = true;
                    updateRequest(employeeNum, request);
                }
            }
        }
    }
}


async function scheduleReq(slotNum, DriverID) {
    var tempParkingSNum = slotNum;
    var tempRowNum = Math.floor(tempParkingSNum / 10);
    var tempColNum = tempParkingSNum % 10;
    var outPutScheduleReq = [];

    //check if lot is full:
    var resfull = await isLotFull();
    if (resfull == true) return false;

    //find parking slot for the blocking car:
    if (tempRowNum == 0 || tempRowNum == 4 || tempRowNum == 5 || tempRowNum == 9)//if blocked row
    {//when the row is 'isParking' row:
        if (tempRowNum == 0) blockingRow = 1;
        else if (tempRowNum == 4) blockingRow = 3;
        else if (tempRowNum == 5) blockingRow = 6;
        else if (tempRowNum == 9) blockingRow = 8;
        var exitTBlocking = await getexitTDB(blockingRow * Config.x + tempColNum);
        var idBlocking = await getIDDB(blockingRow * Config.x + tempColNum);
        var resEntrance = await entranceCar(idBlocking, exitTBlocking);

        slot.exitT = -1;
        slot.userID = -1;
        setSlot(blockingRow * Config.x + tempColNum, slot);//update empty slot in DB

        //update in DB the flag of the blocked car:
        var driver = await getDriver(DriverID);
        driver.isBlock = false;
        updateDriver(DriverID, driver);

        var outPutRequest = {
            carNumber: idBlocking,
            current: (blockingRow * Config.x + tempColNum),
            future: resEntrance
        };
        setOutPutRequest(outPutRequest);
        //outPutScheduleReq.push(idBlocking);//the driver we want to moving to the empty slot
        //outPutScheduleReq.push(blockingRow * Config.x + tempColNum); //the slot of the car we want to move
        //outPutScheduleReq.push(resEntrance);//the empty slot
    }
    else if ((tempRowNum == 1 || tempRowNum == 3 || tempRowNum == 6 || tempRowNum == 8)) {//if blocking row

        var exitTBlocking = await getexitTDB(slotNum);
        var resEntranc = await entranceCar(DriverID, exitTBlocking);

        slot.exitT = -1;
        slot.userID = -1;
        setSlot(slotNum, slot);//update empty slot in DB

        //update in DB the flag of the blocked car:
        if (tempRowNum == 1) blockedRow = 0;
        else if (tempRowNum == 3) blockedRow = 4;
        else if (tempRowNum == 6) blockedRow = 5;
        else if (tempRowNum == 8) blockedRow = 9;

        var resIDBlocked = await getIDDB(blockedRow * 10 + tempColNum);

        var driver = await getDriver(resIDBlocked);
        driver.isBlock = false;
        updateDriver(resIDBlocked, driver);

        var outPutRequest = {
            carNumber: DriverID,
            current: slotNum,
            future: resEntranc
        };
        setOutPutRequest(outPutRequest);
        //outPutScheduleReq.push(DriverID);//the driver we want to moving to the empty slot
        //outPutScheduleReq.push(slotNum); //the slot of the car we want to move
        //outPutScheduleReq.push(resEntranc);//the empty slot  
    }
    return "hallo";
}



