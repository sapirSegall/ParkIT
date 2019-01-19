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
    database.ref('/Drivers/' + employeeNum).set({
        firstName: newDriver.firstName,
        lastName: newDriver.lastName,
        email: newDriver.email,
        exitTime: newDriver.exitTime,
        phoneNumber: newDriver.phoneNumber,
        carNumber: newDriver.carNumber,
        carType: newDriver.carType,
        carSeries: newDriver.carSeries,
        carColor: newDriver.carColor,
        carCode: newDriver.carCode,
        barcode: newDriver.barcode,
        parkingNumber: newDriver.parkingNumber
    }).catch(function (error) {
        console.log('Error writing new message to Realtime Database:', error);
    });
    console.log(`add the new driver to the db ${newDriver}`);
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
        password: newUser.password,
    }).catch(function (error) {
        console.log('Error writing new message to Realtime Database:', error);
    });
    console.log(`add the new driver to the db ${newDriver}`);
}
function createRequest(employeeNum, newRequest) {
    database.ref(`/Requests/${employeeNum}/${newRequest.requestNumber}`).set({
        requestTime: newRequest.requestTime,
        parkingSlotNumber: newRequest.parkingSlotNumber,
    }).catch(function (error) {
        console.log('Error writing new message to Realtime Database:', error);
    });
    console.log(`add the new request to the db ${newRequest}`);
}
async function getRequestsByDriver(employeeNum) {
    var requests = [];
    await database.ref('/Requests/' + employeeNum).once('value').then(function (snapshot) {
        requests = snapshot.val();
    });
    return requests;
}
async function saveParkingNumber(employeeNum, parkingNumber) {
    activeDriver.parkingNumber = parkingNumber;
    updateDriver(activeUser.user, activeDriver);
}
async function getDrivers() {
    var drivers;
    await database.ref('/Drivers/').once('value').then(function (snapshot) {
        drivers = snapshot.val();
    });
    return drivers;
}
