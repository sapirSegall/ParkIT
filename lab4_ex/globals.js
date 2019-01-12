
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
    exitTime: ''
};
var request = {
    requestNumber: '',
    requestTime: '',
    parkingSlotNumber: '',
}
function ShowPage(n) {
    $(".page").hide();
    $(".page").eq(n).show();
    if (n == 0) {/*registertion page*/
        $("#aReg").hide();
        $("#aLogin").show();
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
        $("#aLogout").show();
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
