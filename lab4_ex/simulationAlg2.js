

//fill the parking lot:
var countMoves; //count moves of cars in one simulation/day
var counter = 0;//count the car entrance and park(for debugging)
var flagBlocking1 = 0; // flag==1 when the cars start blocking
var flagBlocking2; // flag==1 when the cars start blocking in check2 phase
var flagUserReq = 0; //flag==1 if there is user request
var i = 0;
var exitTime;
var outputExitT = [];



function simulationAlg2() {
    countMoves = 0;
    var arrCars = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; //24 hours
    for (var i = 0; i < 100; i++) {
        var timeGroup = getRandom(0, 100);
        if (timeGroup < 90) arrCars[8]++;
        else if (90 <= timeGroup < 90.1) arrCars[6]++;
        else if (90.1 <= timeGroup < 90.2) arrCars[7]++;
        else if (90.2 <= timeGroup < 90.3) arrCars[9]++;
        else if (90.3 <= timeGroup < 90.4) arrCars[10]++;
        else if (90.4 <= timeGroup < 90.5) arrCars[11]++;
        else if (90.5 <= timeGroup < 90.6) arrCars[12]++;
        else if (90.6 <= timeGroup < 90.7) arrCars[13]++;
        else if (90.7 <= timeGroup < 90.8) arrCars[14]++;
    }

    init();
    i = 0;

    var flagEndParking = 0; //flag==1 when the algoritem find parking slot
    flagUserReq = 0;
    while (i < 24) {
        if (arrCars[i] > 0 || flagUserReq == 1) { //if there is more car in this hour
            if (flagUserReq == 0) {
                if (i == 8) { exitTime = 17; }
                else if (i == 6) { exitTime = 15; }
                else if (i == 7) { exitTime = 16; }
                else if (i == 9) { exitTime = 18; }
                else if (i == 10) { exitTime = 19; }
                else if (i == 11) { exitTime = 20; }
                else if (i == 12) { exitTime = 21; }
                else if (i == 13) { exitTime = 22; }
                else if (i == 14) { exitTime = 23; }
                else exitTime = 17;
            }

            flagEndParking = 0;
            for (k = 0; k < Config.x; k++) {
                for (p = 0; p < Config.y; p++) {
                    if (mainarr[k * 10 + p].userID == null) {
                        for (var n = 0; n < Config.IsParking.length; n++) {
                            if ((Config.IsParking[n][0] == mainarr[k * 10 + p].ParkingSlotNum[0])
                                && (Config.IsParking[n][1] == mainarr[k * 10 + p].ParkingSlotNum[1])) {
                                mainarr[k * 10 + p].exitT = exitTime;
                                counter++;
                                mainarr[k * 10 + p].userID = 40;
                                if (flagUserReq == 0) { if (arrCars[i] > 0) arrCars[i]--; }
                                flagEndParking = 1;
                                break; //break for of n
                            }
                        }
                    }
                    if (flagEndParking == 1) break; //break for of p
                    if (p == 9) { flagBlocking1 = 1; if (flagBlocking1 == 1) blockingFunc(); } //break for of p, if end of this row
                }
                function blockingFunc() {
                    flagEndParking = 0;
                    //find the current row (blocking row)
                    if (k == 0) blockingRow = 1;
                    else if (k == 4) blockingRow = 3;
                    else if (k == 5) blockingRow = 6;
                    else if (k == 9) blockingRow = 8;
                    for (var p2 = 0; p2 < Config.y; p2++) {
                        if (mainarr[blockingRow * 10 + p2].userID == null) {//check if parking slot is empty:
                            if (exitTime <= mainarr[k * 10 + p2].exitT) {//check if exit time of this car>= exit time of the blocked car:
                                for (var n2 = 0; n2 < Config.isBlockingParking.length; n2++) {
                                    if ((Config.isBlockingParking[n2][0] == mainarr[blockingRow * 10 + p2].ParkingSlotNum[0])
                                        && (Config.isBlockingParking[n2][1] == mainarr[blockingRow * 10 + p2].ParkingSlotNum[1])) {
                                        mainarr[blockingRow * 10 + p2].exitT = exitTime;
                                        counter++;
                                        mainarr[blockingRow * 10 + p2].userID = 30;
                                        if (flagUserReq == 0) { if (arrCars[i] > 0) arrCars[i]--; }
                                        flagEndParking = 1;
                                        break;
                                    }
                                }
                            }
                        }
                        if (flagEndParking == 1) break;
                    }//end for p
                    //check2: (when car1 blocking car2 that car1's exitT>car2's exitT)
                    if (p2 == 10) flagBlocking2 = 1;
                    if (flagBlocking2 == 1) {
                        for (var p2 = 0; p2 < Config.y; p2++) {
                            //check if parking slot is empty:
                            if (mainarr[blockingRow * 10 + p2].userID == null) {//check if exit time of this car>= exit time of the blocked car:
                                for (var n2 = 0; n2 < Config.isBlockingParking.length; n2++) {
                                    if ((Config.isBlockingParking[n2][0] == mainarr[blockingRow * 10 + p2].ParkingSlotNum[0])
                                        && (Config.isBlockingParking[n2][1] == mainarr[blockingRow * 10 + p2].ParkingSlotNum[1])) {
                                        mainarr[blockingRow * 10 + p2].exitT = exitTime;
                                        counter++;
                                        mainarr[blockingRow * 10 + p2].userID = 30;
                                        if (flagUserReq == 0) { if (arrCars[i] > 0) arrCars[i]--; }
                                        flagEndParking = 1;
                                        break;
                                    }
                                }
                            }
                            if (flagEndParking == 1) break;
                        }
                    }//end of if

                }// end blockingFunc function
                if (flagEndParking == 1) break;
            }//end for of k



            var res2 = isLotFull();
            if (res2) { i++; exitCars(i); funcIsCarBlocked(i); };
        }
        else if (flagUserReq == 0) { i++; exitCars(i); funcIsCarBlocked(i) }; //go here if arrCars[i]== 0 (no more cars in this hour), so i++ is the next hour

    }//end of while

    return countMoves;
}//end of fill function









