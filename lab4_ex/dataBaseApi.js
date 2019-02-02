// Initialize Firebase
var config = {
    apiKey: "AIzaSyBPEANHVPLwavh8zzcQSbtC9G0m0dW58Yo",
    authDomain: "parkit-a2963.firebaseapp.com",
    databaseURL: "https://parkit-a2963.firebaseio.com",
    projectId: "parkit-a2963",
    storageBucket: "parkit-a2963.appspot.com",
    messagingSenderId: "407864105205"
};
firebase.initializeApp(config);
var database = firebase.database();
function createDriver(employeeNum, newDriver) {
    database.ref('/Drivers/' + employeeNum).set(newDriver);
    console.log(`add the new driver to the db ${JSON.stringify(newDriver)}`);
}
async function getDriver(employeeNum) {
    var driver;
    await database.ref('/Drivers/' + employeeNum).once('value').then(function (snapshot) {
        driver = snapshot.val();
    });
    return driver;
}
function deleteDriver(employeeNum) {
    database.ref('/Drivers/').child(employeeNum).remove().catch(function (error) {
        console.log('Error remove driver from DB:', error);
    });
    database.ref('/Requests/').child(employeeNum).remove();
    database.ref('/Users/').child(employeeNum).remove();
}
function updateDriver(employeeNum, newDriver) {
    console.log(`add the new driver to the db ${JSON.stringify(newDriver)}`);
    createDriver(employeeNum, newDriver);
}
async function getPassword(employeeNum) {
    var password;
    await database.ref('/Users/' + employeeNum).once('value').then(function (snapshot) {
        password = snapshot.val().password;
    });
    return password;
}
async function getUserType(employeeNum) {
    var type;
    await database.ref('/Users/' + employeeNum).once('value').then(function (snapshot) {
        type = snapshot.val().type;
    });
    return type;
}
async function getEmail(employeeNum) {
    var email;
    await database.ref('/Users/' + employeeNum).once('value').then(function (snapshot) {
        email = snapshot.val().email;
    });
    return email;
}
function createUser(employeeNum, newUser) {
    firebase.database().ref('/Users/' + employeeNum).set({
        employeeNum: newUser.employeeNum,
        password: newUser.password
    }).catch(function (error) {
        console.log('Error writing new message to Realtime Database:', error);
    });
    console.log(`add the new driver to the db ${newDriver}`);
}
function createRequest(employeeNum, newRequest) {
    database.ref(`/Requests/${employeeNum}/${newRequest.requestNumber}`).set({
        requestTime: newRequest.requestTime,
        parkingSlotNumber: newRequest.parkingSlotNumber,
        priority: newRequest.priority,
        flagPriority: newRequest.flagPriority
    }).catch(function (error) {
        console.log('Error writing new message to Realtime Database:', error);
    });
    console.log(`add the new request to the db ${JSON.stringify(newRequest)}`);
}
async function getRequestsByDriver(employeeNum) {
    var requests = [];
    await database.ref('/Requests/' + employeeNum).once('value').then(function (snapshot) {
        requests = snapshot.val();
    });
    return requests;
}
async function getParkingNumber(employeeNum){
    var parkingNumber;
    await database.ref(`/Drivers/${employeeNum}`).once('value').then(function (snapshot) {
        parkingNumber = snapshot.val().parkingNumber;
    });
    console.log(`parking number from DB: ${parkingNumber}`);
    return parkingNumber;
}
async function getDrivers() {
    var drivers;
    await database.ref('/Drivers/').once('value').then(function (snapshot) {
        drivers = snapshot.val();
    });
    return drivers;
}
async function getIDDriverSlot(parkingSlotNum) {
    var driverID;
    await database.ref('/Lot/' + parkingSlotNum).once('value').then(function (snapshot) {
        driverID = snapshot.val().userID;
    });
    return driverID;
}
async function getRequests() {
    var requests;
    await database.ref('/Requests/').once('value').then(function (snapshot) {
        requests = snapshot.val();
    });
    return requests;
}
function deleteRequest(employeeNum, requestNumber) {
    database.ref(`/Requests/${employeeNum}`).child(requestNumber).remove().catch(function (error) {
        console.log('Error remove request from DB:', error);
    });
}
async function getExitTDriverSlot(parkingSlotNum) {
    var driverExitTi;
    await database.ref('/Lot/' + parkingSlotNum).once('value').then(function (snapshot) {
        driverExitTi = snapshot.val().exitT;
    });
    return driverExitTi;
}
async function getSlots() {
    var lots;
    await database.ref('/Lot/').once('value').then(function (snapshot) {
        lots = snapshot.val();
    });
    return lots;
}
function setSlot(slotNum, updatedSlot) {
    database.ref('/Lot/' + slotNum).set(updatedSlot);
    console.log(`update slot in db ${updatedSlot}`);
}
function setexitT(slotNum, updatedexitT) {
    database.ref('/Lot/' + slotNum).set(updatedSlot);
    console.log(`update slot in db ${updatedSlot}`);
}
function updateRequest(employeeNum, newRequest) {
    console.log(`update the request to the db ${JSON.stringify(newRequest)}`);
    createRequest(employeeNum, newRequest);
}

async function getOutPutRequest() {
    var newOutPutRequest;
    await database.ref('/outPutRequest/').once('value').then(function (snapshot) {
        newOutPutRequest = snapshot.val();
    });
    return newOutPutRequest;
}

function setOutPutRequest(newOutPutRequest) {
    database.ref('/outPutRequest/').set(newOutPutRequest);
}