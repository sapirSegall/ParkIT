
//user request: change parking slot of the blocking car
//input: slot numnber of the blocked car
async function userRequest(inputSlot, inputID) {
    var blockingRow;
    var tempParkingSNum = inputSlot;
    var tempRowNum = Math.floor(tempParkingSNum / 10);
    var tempColNum = tempParkingSNum % 10;

    //find the blocking car 's parking slot:
    if (tempRowNum == 0) blockingRow = 1;
    else if (tempRowNum == 4) blockingRow = 3;
    else if (tempRowNum == 5) blockingRow = 6;
    else if (tempRowNum == 9) blockingRow = 8;

    //save for if full:
    var blockedexitTime = await getexitTDB(inputSlot);
    var blockedid = await getIDDB(inputSlot);
    //save for entranceCar() function:
    var blockingexitTime = await getexitTDB(blockingRow * 10 + tempColNum);
    var blockingUserID = await getIDDB(blockingRow * 10 + tempColNum);

    //check if lot is full:
    var resfull = await isLotFull();
    if (resfull == true) //if full- replace beetween them
    {
        slot.exitT = blockingexitTime;
        slot.userID = blockingUserID;
        setSlot(inputSlot, slot);
        slot.exitT = blockedexitTime;
        slot.userID = blockedid;
        setSlot(blockingRow * 10 + tempColNum, slot);//update new exit time in db

        //update in DB the flag of the blocked car
        var driver = await getDriver(blockingUserID);
        driver.parkingNumber = inputSlot;
        driver.isBlock = true;
        updateDriver(blockingUserID, driver);

        var driver = await getDriver(blockedid);
        driver.parkingNumber = (blockingRow * 10 + tempColNum);
        driver.isBlock = false;
        updateDriver(blockedid, driver);

        var outPutRequest = {
            carNumber: blockedid,
            current: inputSlot,
            future: (blockingRow * 10 + tempColNum)
        };
        setOutPutRequest(outPutRequest);
        return "hallo";

    }
    else {
        var resEntrance = await entranceCar(blockingUserID, blockingexitTime); //find parking slot for the blocking car

        //update empty slot in DB:
        slot.exitT = -1;
        slot.userID = -1;
        setSlot(blockingRow * 10 + tempColNum, slot);//update new exit time in db

        //update in DB the flag of the blocked car(no blocked now)
        var driver = await getDriver(inputID);
        driver.isBlock = false;
        updateDriver(inputID, driver);

        var outPutRequest = {
            carNumber: blockingUserID,
            current: (blockingRow * 10 + tempColNum),
            future: resEntrance
        };
        setOutPutRequest(outPutRequest);
        return "hallo";
    }
}//end of function userRequest

