//documented
//user request: change parking slot of the blocking car
//input: Parking slot number and ID of the blocked car
//output: update in DB the request details, return string "Hello"
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
        //change parking slots between the blocked car and the blocking car, update in DB
        slot.exitT = blockingexitTime;
        slot.userID = blockingUserID;
        setSlot(inputSlot, slot);
        slot.exitT = blockedexitTime;
        slot.userID = blockedid;
        setSlot(blockingRow * 10 + tempColNum, slot);

        //update in DB the flags of the blocked car and the blocking car:
        var driver = await getDriver(blockingUserID); 
        driver.parkingNumber = inputSlot; 
        driver.isBlock = true;
        updateDriver(blockingUserID, driver);

        var driver = await getDriver(blockedid);
        driver.parkingNumber = (blockingRow * 10 + tempColNum);
        driver.isBlock = false;
        updateDriver(blockedid, driver);

        //set output and return output:
        var outPutRequest = {
            carNumber: driver.carNumber, //car number of the car that the valet has to move
            current: inputSlot, //parking slot number of the car that the valet has to move
            future: (blockingRow * 10 + tempColNum) //parking slot number of the blocking car
        };
        setOutPutRequest(outPutRequest);
        return "Hello";

    }
    else {//else- if not full
        var resEntrance = await entranceCar(blockingUserID, blockingexitTime); //find parking slot for the blocking car

        //update empty slot in DB:
        slot.exitT = -1;
        slot.userID = -1;
        setSlot(blockingRow * 10 + tempColNum, slot);

        //update in DB the flag of the blocked car(no blocked now)
        var driver = await getDriver(inputID);
        driver.isBlock = false;
        updateDriver(inputID, driver);

        //set output and return output:
        var driver = await getDriver(blockingUserID);
        var outPutRequest = {
            carNumber: driver.carNumber, //car number of the car that the valet has to move
            current: (blockingRow * 10 + tempColNum),//parking slot number of the car that the valet has to move
            future: resEntrance //the empty parking slot number that the algo' found
        };
        setOutPutRequest(outPutRequest);
        return "Hello";
    }
}//end of function userRequest

