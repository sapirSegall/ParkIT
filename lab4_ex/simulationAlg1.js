
       
        //fill the parking lot:
        var countMoves; //count moves of cars in one simulation/day
        var counter = 0;//count the car entrance and park(for debugging)
        var flagBlocking1 = 0; // flag==1 when the cars start blocking
        var flagBlocking2; // flag==1 when the cars start blocking in check2 phase
        var flagUserReq = 0; //flag==1 if there is user request
        var i = 0;
        var exitTime;
var outputExitT = [];



function simulationAlg1() {
    countMoves = 0;
    var arrCars = [70, 1, 1, 1, 1, 1, 1, 10, 10, 10, 10, 10, 10, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]; //24 hours
           
                //init to new day
                init();
                i = 0;
              
                    var flagEndParking = 0; //flag==1 when the algoritem find parking slot
                    flagUserReq = 0;
                    while (i<24) {
                        if (arrCars[i] > 0 || flagUserReq == 1) { //if there is more car in this hour
                            if (flagUserReq == 0) {
                                var entranceTime = i;
                                if (i >= 18) { exitTime = getRandom(i + 1, 23); }
                                if (i < 18) { exitTime = getRandom(i + 5, 23); } //enforce exitTime>= entranceTime
                            }

                                    flagEndParking = 0;
                                    var res = isParkingSlotsFull();
                                    function isParkingSlotsFull() //check if isParking slots now full
                                    {
                                        for (k = 0; k < Config.x; k++) {
                                            for (p = 0; p < Config.y; p++) {
                                                if (k == 0 || k == 4 || k == 5 || k == 9) {
                                                    if (mainarr[k * 10 + p].userID == null) return false;
                                                }
                                            }
                                        }
                                        return true;
                                    }//end isParkingSlotsFull function
                                    if (res) flagBlocking1 = 1;
                                    if (flagBlocking1 == 1) blockingFunc1();
                                    else {
                                        for (k = 0; k < Config.x; k++) {
                                            for (p = 0; p < Config.y; p++) {
                                                if (mainarr[k * 10 + p].userID == null) {
                                                    for (var n = 0; n < Config.IsParking.length; n++) {
                                                        if ((Config.IsParking[n][0] == mainarr[k * 10 + p].ParkingSlotNum[0])
                                                            && (Config.IsParking[n][1] == mainarr[k * 10 + p].ParkingSlotNum[1])) {
                                                            mainarr[k * 10 + p].exitT = exitTime;
                                                            //$("#parking").find("tr").eq(k).find("td").eq(p).addClass("isParking");
                                                            outputExitT.push(k);
                                                            outputExitT.push(p);
                                                            counter++;
                                                            mainarr[k * 10 + p].userID = 40; 
                                                            if (flagUserReq == 0) { if (arrCars[i] > 0) arrCars[i]--; }
                                                            flagEndParking = 1;
                                                            if (Config.IsParking[n][0] == 9 && Config.IsParking[n][1] == 9) {//���� �� ����
                                                                flagBlocking1 = 1;
                                                            }
                                                            var res = isParkingSlotsFull();
                                                            function isParkingSlotsFull() //check if isParking slots now full
                                                            {
                                                                for (k = 0; k < Config.x; k++) {
                                                                    for (p = 0; p < Config.y; p++) {
                                                                        if (k == 0 || k == 4 || k == 5 || k == 9) {
                                                                            if (mainarr[k * 10 + p].userID == null) return false;
                                                                        }
                                                                    }
                                                                }
                                                                return true;
                                                            }//end isParkingSlotsFull function
                                                            if (res) flagBlocking1 = 1;
                                                            break;
                                                        }
                                                    }
                                                }
                                                if (flagEndParking == 1) break;
                                            }
                                            if (flagEndParking == 1) break;
                                        }
                                    }
                            function blockingFunc1() {
                                flagEndParking = 0;
                                var blockedRow;
                                for (var k2 = 0; k2 < Config.x; k2++) {
                                    if (k2 == 1 || k2 == 3 || k2 == 6 || k2 == 8) {
                                        for (var p2 = 0; p2 < Config.y; p2++) {
                                            //check if parking slot is empty:
                                            if (mainarr[k2 * 10 + p2].userID == null) {//check if exit time of this car>= exit time of the blocked car:
                                                if (k2 == 1) blockedRow = 0;
                                                else if (k2 == 3) blockedRow = 4;
                                                else if (k2 == 6) blockedRow = 5;
                                                else if (k2 == 8) blockedRow = 9;
                                                if (exitTime <= mainarr[blockedRow * 10 + p2].exitT) {
                                                    for (var n2 = 0; n2 < Config.isBlockingParking.length; n2++) {
                                                        if ((Config.isBlockingParking[n2][0] == mainarr[k2 * 10 + p2].ParkingSlotNum[0])
                                                            && (Config.isBlockingParking[n2][1] == mainarr[k2 * 10 + p2].ParkingSlotNum[1])) {
                                                            mainarr[k2 * 10 + p2].exitT = exitTime;
                                                            
                                                            counter++;
                                                            mainarr[k2 * 10 + p2].userID = 30;
                                                            if (flagUserReq == 0) { if (arrCars[i] > 0) arrCars[i]--; }
                                                            flagEndParking = 1;
                                                            break;
                                                        }
                                                    }
                                                }
                                            }
                                            if (flagEndParking == 1) break;
                                        }
                                        if (flagEndParking == 1) break;
                                    }
                                    }
                                    //check2: (when car1 blocking car2 that car1's exitT>car2's exitT)
                                    if (k2 == 10) flagBlocking2 = 1;
                                    if (flagBlocking2 == 1) {
                                        for (var k2 = 0; k2 < Config.x; k2++) {
                                            for (var p2 = 0; p2 < Config.y; p2++) {
                                                //check if parking slot is empty:
                                                if (mainarr[k2 * 10 + p2].userID == null) {//check if exit time of this car>= exit time of the blocked car:
                                                    for (var n2 = 0; n2 < Config.isBlockingParking.length; n2++) {
                                                        if ((Config.isBlockingParking[n2][0] == mainarr[k2 * 10 + p2].ParkingSlotNum[0])
                                                            && (Config.isBlockingParking[n2][1] == mainarr[k2 * 10 + p2].ParkingSlotNum[1])) {
                                                            mainarr[k2 * 10 + p2].exitT = exitTime;
                                                            
                                                            counter++;
                                                            mainarr[k2 * 10 + p2].userID = 30;
                                                            if (flagUserReq == 0) { if (arrCars[i] > 0) arrCars[i]--; }
                                                            flagEndParking = 1;
                                                            break;
                                                        }
                                                    }
                                                }
                                                if (flagEndParking == 1) break;
                                            }
                                            if (flagEndParking == 1) break;
                                        }
                                    }//end of check2
                                    
                                
                            }// end blockingFunc function
                                    
                                
                            var res2 = isLotFull();
                            if (res2) {  i++; exitCars(i); funcIsCarBlocked(i); };
                        }
                        else if (flagUserReq == 0) { i++; exitCars(i); funcIsCarBlocked(i) }; //go here if arrCars[i]== 0 (no more cars in this hour), so i++ is the next hour
                      
                    }//end of while
            
            return countMoves;
        }//end of fill function


       

      
  


