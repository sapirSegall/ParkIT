
//user request: change parking slot of the blocking car
//input: slot numnber of the blocked car
async function userRequest(inputSlot, inputID) {
    var blockingRow;
    outPutUserReq = [];

    var tempParkingSNum = inputSlot;
    var tempRowNum = Math.floor(tempParkingSNum / 10);
    var tempColNum = tempParkingSNum % 10;

    //find the blocking car 's parking slot:
    if (tempRowNum == 0) blockingRow = 1;
    else if (tempRowNum == 4) blockingRow = 3;
    else if (tempRowNum == 5) blockingRow = 6;
    else if (tempRowNum == 9) blockingRow = 8;

    //save for entranceCar() function:
    var blockingexitTime = await getexitTDB(blockingRow * 10 + tempColNum);
    var blockingUserID = await getIDDB(blockingRow * 10 + tempColNum);
    var resEntrance= await entranceCar(blockingUserID, blockingexitTime); //find parking slot for the blocking car

    //update empty slot in DB:
    slot.exitT = -1;
    slot.userID = -1;
    await setSlotDB(blockingRow * 10 + tempColNum, slot);//update new exit time in db

    //update in DB the flag of the blocked car(no blocked now)
    activeDriver.isBlock = false;
    await updateDriver(inputID, activeDriver);

    outPutUserReq.push(blockingUserID);//the driver we want to moving to the empty slot
    outPutUserReq.push(blockingRow * 10 + tempColNum); //the slot of the car we want to move
    outPutUserReq.push(resEntrance);//the empty slot
    return outPutUserReq;

}//end of function userRequest

