
////structure of the parking lot
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

var counter = 0;//count the car entrance and park(for debugging)
var flagBlocking1 = 0; // flag==1 when the cars start blocking- DB
var flagBlocking2; // flag==1 when the cars start blocking in check2 phase- DB
var flagUserReq = 0; //flag==1 if there is user request
var outputSlotNum;//output of enranceCar()- parking slot number
var s= {//slot
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
    var tempexitTt = await getExitTDriverSlot(slotNumber);
    return tempexitTt;
}


//pie chart functions:
async function getTotalEmpty() {
    var countEmpty = 0;
    for (var k3 = 0; k3 < Config.x; k3++) {
        for (var p3 = 0; p3 < Config.y; p3++) {
            if (k3 != 2 && k3 != 7) {
                var resultotal = await getIDDB(k3 * Config.x + p3);
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
