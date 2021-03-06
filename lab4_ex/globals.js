
var activeUser = {
    user: '',
    pass: ''                                                   
};
var activeDriver = {
    carType: '',
    carNumber: '',
    carSeries: '',
    carColor: '',
    parkingNumber: '',
    exitTime: '',
    isBlock:''
};
var request = {
    requestNumber: '',
    requestTime: '',
    parkingSlotNumber: '',
    priority: '',
    flagPriority: ''
};
var slot = {
    userID: '',
    exitT: ''
};

function validateTextBox() {
    if (document.getElementById("textbox").value != "") { } else {
        alert("Please enter a value");
    }
}

function ShowPage(n) {
    $(".page").hide();
    $(".page").eq(n).show();
    if (n == 0) {/*registertion page*/
        $("#aReg").hide();
        $("#aLogin").hide();
        $("#aLogout").hide();
    }
    else if (n == 1) {/* login page*/
        $("#aReg").show();
        $("#aLogin").hide();
        $("#aLogout").hide();
    }
    else if (n == 2) {/*weclome page*/
        $("#aReg").hide();
        $("#aLogin").hide();
        $("#aLogout").hide();
        $("#userName").text(activeUser.user + " [" + activeUser.mail + "]");
    }
    else if (n == 3) {/*error login*/
        $("#aReg").show();
        $("#aLogin").show();
        $("#aLogout").hide();
    }
    else if (n > 3) {  /*driver home page*/
        $("#aReg").hide();
        $("#aLogin").hide();
        $("#aLogout").hide();
    }
}

async function getRequestNumber() {
    var random = Math.floor(Math.random() * 900000) + 100000;
    var requests = await getRequests();
    if (!requests) {
        return random;
    }
    // if random is one of the existing requests numbers generate new one
    var allRequests = Object.values(requests).reduce(((acc, cur) => acc.concat(Object.keys(cur))), []);
    while (allRequests.includes(random)) {
        random = Math.floor(Math.random() * 900000) + 100000;
    }
    return random;
}
