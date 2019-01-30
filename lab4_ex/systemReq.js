
//change: input: parkingSlot number
async function exitCar(inputSlotNum, requestNum)
{
    var resCheck = [];//the output of checkSystemRequest function;

    //update empty slot in DB 
    slot.exitT = -1;
    slot.userID = -1;
    setSlot(inputSlotNum, slot);

    var tempParkingSNum = inputSlotNum;
    var tempRowNum = Math.floor(tempParkingSNum / 10);
    var tempColNum = tempParkingSNum % 10;

    if (tempRowNum == 0 || tempRowNum == 4 || tempRowNum == 5 || tempRowNum == 9)//when the row is 'isParking' row
        resCheck = await checkSystemRequest(null, tempRowNum, tempColNum, requestNum);// check if to add a system request to DB
    else if (tempRowNum == 1 || tempRowNum == 3 || tempRowNum == 6 || tempRowNum == 8) //when the row is 'isBlockingParking' row
    {
        if (tempRowNum == 1) blockedRow = 0;
        else if (tempRowNum == 3) blockedRow = 4;
        else if (tempRowNum == 6) blockedRow = 5;
        else if (tempRowNum == 8) blockedRow = 9;

        //update in DB the flag of the blocked car:
        activeDriver.isBlock = false;
        updateDriver(blockedRow * 10 + tempColNum, activeDriver);

        var ExitTisParking = await getExitTDriverSlot(blockedRow * 10 + tempColNum)
        resCheck = await checkSystemRequest(ExitTisParking, tempRowNum, tempColNum, requestNum);// check if to add a system request to DB
     }
    return resCheck;
} //end of exitCars function



async function checkSystemRequest(exitTCompare, kEmpty, pEmpty, requestNum) {//kEmpty,pEmpty: is the empty parking slot
    var blockedRow;
    var flagSystemReq;
    var outPutCheckSystemReq = [];

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

                if (idblocking != -1 && exitTblocking > exitTblocked)  //if slot is not empty, and blockingcar's exitT > blockedcar's exitT
                    if ((exitTCompare != null && exitTblocking <= exitTCompare) || exitTCompare == null) { //if blockingcar's exitTime<=exitTCompare
                        flagSystemReq = 1;
                request.requestNumber = requestNum;
                request.flagPriority = true;
                await updateRequest(employeeNum, request);
                    }
            }
            if (flagSystemReq == 1) break;
        }
        if (flagSystemReq == 1) break;
    }
    if (flagSystemReq != 1)  //no need systemRequest
    {
        request.requestNumber = requestNum;
        request.flagPriority = false;
        await updateRequest(employeeNum, request);
        outPutCheckSystemReq = false;
    }
    else {//need system request
        outPutCheckSystemReq.push(idblocking);//the driver we want to moving to the empty slot
        outPutCheckSystemReq.push(k * 10 + p); //the slot of the car we want to move
        outPutCheckSystemReq.push(kEmpty * 10 + pEmpty);//the empty slot
        outPutCheckSystemReq.push(exitTCompare);
        return outPutCheckSystemReq;
    }
}

async function systemRequest(IDFrom, slotFrom, slotEmpty, exitTCompare, requestNum) //called when valet select this task
{
    var resCheck2 = [];
    var resSysReq = [];

    var tempParkingSNum = slotFrom;
    var kFrom = Math.floor(tempParkingSNum / 10);
    var pFrom = tempParkingSNum % 10;
    var tempParkingSNum2 = slotEmpty;
    var kEmpty = Math.floor(tempParkingSNum2 / 10);
    var pEmpty = tempParkingSNum2 % 10;

    //check if the car in the slotFrom is still there:
    var upToDateIdFrom = await getIDDB(kFrom * Config.x + pFrom);
    if (upToDateIdFrom == IDFrom) //if still there:
    {
        //save details of the user we move from
        var tempUserID = await getIDDB(kFrom * 10 + pFrom);//idFrom?delete?
        var tempExitT = await getexitTDB(kFrom * 10 + pFrom);

        //update at db that the slot is empty:
        slot.exitT = -1;
        slot.userID = -1;
        setSlot(kFrom * 10 + pFrom, slot);
        //update in DB the flag of the blocked car:
        if (kFrom == 1) blockedRow = 0;
        else if (kFrom == 3) blockedRow = 4;
        else if (kFrom == 6) blockedRow = 5;
        else if (kFrom == 8) blockedRow = 9;
        activeDriver.isBlock = true;
        updateDriver(blockedRow * 10 + pFrom, activeDriver);

        //move to the empty parking slot:
        slot.exitT = tempExitT;
        slot.userID = tempUserID;
        setSlot(kEmpty * 10 + pEmpty, slot);
        //update in DB the flag of the blocked car:
        if (kEmpty == 1) blockedRow = 0;
        else if (kEmpty == 3) blockedRow = 4;
        else if (kEmpty == 6) blockedRow = 5;
        else if (kEmpty == 8) blockedRow = 9;
        activeDriver.isBlock = true;
        updateDriver(blockedRow * 10 + pEmpty, activeDriver);
    }
    else {//if not still there:
        (resCheck2 = await checkSystemRequest(exitTCompare, kEmpty, pEmpty, requestNum));//check again
        if (resCheck2 == false) return false; //return false= the car is not still there and there is not another car
        else {
            resSysReq= await systemRequest(resCheck2[0], resCheck2[1], resCheck2[2], resCheck2[3], requestNum);
        }
    }
}//end of systemRequest func

