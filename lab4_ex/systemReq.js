//when an employee exits the parking lot, the exitCar() function is called and that call to checkSystemRequest function
//input: parking Slot number of the employee that exits, Request number
//output: update in DB the empty parking slot
async function exitCar(inputSlotNum, employeeNum, requestNum)
{
    var resCheck1;//output of checkSystemRequest function

    //update empty slot in DB:
    slot.exitT = -1;
    slot.userID = -1;
    setSlot(inputSlotNum, slot);

    var tempParkingSNum = inputSlotNum;
    var tempRowNum = Math.floor(tempParkingSNum / 10);
    var tempColNum = tempParkingSNum % 10;

    if (tempRowNum == 0 || tempRowNum == 4 || tempRowNum == 5 || tempRowNum == 9)//when the row is 'isParking' row
        resCheck1 = await checkSystemRequest(null, inputSlotNum);// check if to add a system request to valet's tasks table
    else if (tempRowNum == 1 || tempRowNum == 3 || tempRowNum == 6 || tempRowNum == 8) //when the row is 'isBlockingParking' row
    {
        if (tempRowNum == 1) blockedRow = 0;
        else if (tempRowNum == 3) blockedRow = 4;
        else if (tempRowNum == 6) blockedRow = 5;
        else if (tempRowNum == 8) blockedRow = 9;

        //update in DB the flag of the blocked car:
        var resIDBlocked = await getIDDB(blockedRow * 10 + tempColNum);
        var driver = getDriver(resIDBlocked);
        driver.isBlock = false;
        updateDriver(resIDBlocked, driver);

        var ExitTisParking = await getExitTDriverSlot(blockedRow * 10 + tempColNum);//get exit time of the blocked row
        resCheck1 = await checkSystemRequest(ExitTisParking, inputSlotNum);// check if to add a system request to valet's tasks table
    }
    if (resCheck1 != false) {//if find car to move to the empty parking slot
        //add requst to valet's tasks table
        var request = await getRequest(employeeNum, requestNum);
        request.requestNumber = requestNum;
        request.flagPriority = true;
        updateRequest(employeeNum, request);

} //end of exitCars function


//checkSystemRequest function checks if the valet should move a blocking car to the empty parking slot of the employee that exited
async function checkSystemRequest(exitTCompare,emptyS) {
    var blockedRow;
    var flagSystemReq;
    var outPutCheckSystemReq=[];

    for (var k = 0; k < Config.x; k++) {
        for (var p = 0; p < Config.y; p++) {
            if (k == 1 || k == 3 || k == 6 || k == 8) {//just if it is a blocking row
                if (k == 1) blockedRow = 0;
                else if (k == 3) blockedRow = 4;
                else if (k == 6) blockedRow = 5;
                else if (k == 8) blockedRow = 9;

                var idblocking = await getIDDB(k * 10 + p);
                var exitTblocking = await getexitTDB(k * 10 + p);
                var exitTblocked = await getexitTDB(blockedRow * 10 + p);

                if (idblocking != -1 && exitTblocking > exitTblocked)  //if parking slot is not empty, and blockingcar's exitT > blockedcar's exitT
                    if ((exitTCompare != null && exitTblocking <= exitTCompare) || exitTCompare == null)  //if blockingcar's exitTime<=exitTCompare
                        flagSystemReq = 1;   
            }
            if (flagSystemReq == 1) break;
        }
        if (flagSystemReq == 1) break;
    }
    //the output is only used in systemRequest function
    if (flagSystemReq != 1) return false;//no need system request
    else {//need system request
        outPutCheckSystemReq.push(idblocking);//the driver we want to moving to the empty slot
        outPutCheckSystemReq.push(k * 10 + p); //the slot of the car we want to move
        outPutCheckSystemReq.push(emptyS);//the empty slot
        return outPutCheckSystemReq;
    }
}

//async function systemRequest(IDFrom, slotFrom, slotEmpty, exitTCompare, requestNum) //called when valet select this task
//input: parking slot number of the employee that exited
async function systemRequest(slotEmpty)
{
    var exitTCompare;
    var flagEmptyIsBlocking = 0;
    var resCheck = [];

    var tempParkingSNum2 = slotEmpty;
    var kEmpty = Math.floor(tempParkingSNum2 / 10);
    var pEmpty = tempParkingSNum2 % 10;

    //call to checkSystemRequest function:
    //find exitT to compare:
    if (kEmpty == 0 || kEmpty == 4 || kEmpty == 5 || kEmpty == 9)//when the row is 'isParking' row
        exitTCompare = null; 
    else if (kEmpty == 1 || kEmpty == 3 || kEmpty == 6 || kEmpty == 8) {//if it is a blocking row
        flagEmptyIsBlocking = 1;
        if (kEmpty == 1) blockedRow = 0;
        else if (kEmpty == 3) blockedRow = 4;
        else if (kEmpty == 6) blockedRow = 5;
        else if (kEmpty == 8) blockedRow = 9;
        exitTCompare = await getexitTDB(blockedRow * 10 + pEmpty);
       
    }
    resCheck = await checkSystemRequest(exitTCompare, slotEmpty);
    var rowResFrom = Math.floor(resCheck[1] / 10);
    var colResFrom = resCheck[1] % 10;

    if (resCheck!=false) //if the valet need to move car to the empty parking slot
    {
        //save details of the user we move from
        var tempUserID = await getIDDB(resCheck[1]);
        var tempExitT = await getexitTDB(resCheck[1]);
        //update at db that the slot is empty:
        slot.exitT = -1;
        slot.userID = -1;
        setSlot(resCheck[1], slot);
        //update in DB the flag of the blocked car:
        if (rowResFrom == 1) blockedRow2 = 0;
        else if (rowResFrom == 3) blockedRow2 = 4;
        else if (rowResFrom == 6) blockedRow2 = 5;
        else if (rowResFrom == 8) blockedRow2 = 9;
        activeDriver.isBlock = false;
        updateDriver(blockedRow2 * 10 + colResFrom, activeDriver);

        //move to the empty parking slot:
        slot.exitT = tempExitT;
        slot.userID = tempUserID;
        setSlot(resCheck[2], slot);

        var tempUserID = await getIDDB(slotEmpty);
        var driver = await getDriver(tempUserID);
        var outPutRequest = {
            carNumber: driver.carNumber,
            current: resCheck[1],
            future: resCheck[2]
        };
        setOutPutRequest(outPutRequest);
    }
    else if (resCheck == false) return false; //return false=there is not car to move to the empty parking slot
}//end of systemRequest func

