//documented
//Schedule request functions called when an employee update his exit time
//input: parking slot number,employee number,newExitTime of the employee that updated his exit time, and request number
//output: update in DB(Lot) the new exitT and update in DB(Request) the flag of request
async function checkScheduleReq(slotNum,employeeNum, newExitTime, requestNum)
{
    //check if lot is full:
    var resfull = await isLotFull();
    if (resfull == false) {//if not full:

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
            var result1 = await getIDDB(blockingRow * Config.x + tempColNum);//get id of the blocking car
            if (result1 != -1) {// if there is a blocking car
                var exitTBlocking = await getexitTDB(blockingRow * Config.x + tempColNum);//get exit time of the blocking car
                if (exitTBlocking > newExitTime) {//if exitTBlocking > newExitTime there is a problem and schedule request will be added to valet's tasks
                    //update the flag of the request to be on (schedule request will be added to valet's tasks):
                    var request = await getRequest(employeeNum, requestNum);
                    request.requestNumber = requestNum;
                    request.flagPriority = true;
                    updateRequest(employeeNum, request);
                }
            }
        }
        else if ((tempRowNum == 1 || tempRowNum == 3 || tempRowNum == 6 || tempRowNum == 8)) {//if blocking row
            var result2 = await getIDDB(blockedRow * Config.x + tempColNum);//get id of the blocked car
            if (result2 != -1) {// if there is a blocked car
                var exitTBlocked = await getexitTDB(blockedRow * Config.x + tempColNum);//get exit time of the blocked car
                if (exitTBlocked < newExitTime) {//if exitTBlocking < newExitTime there is a problem and schedule request will be added to valet's tasks
                    //update the flag of the request to be on (schedule request will be added to valet's tasks):
                    var request = await getRequest(employeeNum, requestNum);
                    request.requestNumber = requestNum;
                    request.flagPriority = true;
                    updateRequest(employeeNum, request);
                }
            }
        }
    }
}

//input: parking slot number,employee number of the employee that updated his exit time
//output: update in DB(Lot), update in DB(Drivers), return string "Hello"
async function scheduleReq(slotNum, DriverID) {
    var tempParkingSNum = slotNum;
    var tempRowNum = Math.floor(tempParkingSNum / 10);
    var tempColNum = tempParkingSNum % 10;

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
        //get details of the blocking car:
        var exitTBlocking = await getexitTDB(blockingRow * Config.x + tempColNum);
        var idBlocking = await getIDDB(blockingRow * Config.x + tempColNum);
        //find empty parking slot
        var resEntrance = await entranceCar(idBlocking, exitTBlocking);

        //update empty slot in DB
        slot.exitT = -1;
        slot.userID = -1;
        setSlot(blockingRow * Config.x + tempColNum, slot);

        //update in DB the flag of the blocked car:
        var driver = await getDriver(DriverID);
        driver.isBlock = false;
        updateDriver(DriverID, driver);

        //update in DB the details of the driver that his car was moved
        var driver = await getDriver(idBlocking);
        var outPutRequest = {
            carNumber: driver.carNumber,
            current: (blockingRow * Config.x + tempColNum),
            future: resEntrance
        };
        setOutPutRequest(outPutRequest);
    }
    else if ((tempRowNum == 1 || tempRowNum == 3 || tempRowNum == 6 || tempRowNum == 8)) {//if blocking row

        var exitTBlocking = await getexitTDB(slotNum);
        var resEntranc = await entranceCar(DriverID, exitTBlocking); //find empty parking slot

        //update empty slot in DB:
        slot.exitT = -1;
        slot.userID = -1;
        setSlot(slotNum, slot);

        //update in DB the flag of the blocked car:
        if (tempRowNum == 1) blockedRow = 0;
        else if (tempRowNum == 3) blockedRow = 4;
        else if (tempRowNum == 6) blockedRow = 5;
        else if (tempRowNum == 8) blockedRow = 9;

        var resIDBlocked = await getIDDB(blockedRow * 10 + tempColNum);

        var driver = await getDriver(resIDBlocked);
        driver.isBlock = false;
        updateDriver(resIDBlocked, driver);

        //update in DB the details of the driver that his car was moved:
        var driver = await getDriver(DriverID);
        var outPutRequest = {
            carNumber: driver.carNumber,
            current: slotNum,
            future: resEntranc
        };
        setOutPutRequest(outPutRequest); 
    }
    return "Hello";
}



