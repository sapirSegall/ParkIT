async function createChart() {
    var carTypes = await getCarTypeNumbers();
    var totalEmpty = await getTotalEmpty();
    var totalBlocking = await getTotalBlocking();
    var chart = new CanvasJS.Chart("chartContainer", {
        backgroundColor: "rgba(225,150,150,0)",
        animationEnabled: true,
        title: {
            text: totalBlocking,
            fontSize: 40,
            fontColor: "white",
            verticalAlign: "center"
        },
          subtitles: [{
                  text: "Blocking Cars",
                  fontColor: "white",
                  verticalAlign: "center"
              }
          ],
        data: [{
            type: "doughnut",
            startAngle: 200,
            yValueFormatString: "##0",
            indexLabel: "{label}",
            dataPoints: [
                { y: carTypes.company, label: "Company Cars",  indexLabelFontColor: "white", color: "rgb(35,171,190)"},
                { y: carTypes.private, label: "Private Cars",  indexLabelFontColor: "white", color: "rgb(128,100,161)" },
                { y: totalEmpty, label: "Empty Parking Slots",  indexLabelFontColor: "white", color: "rgb(247,150,71)"},
            ]
        }]
    });
    chart.render();
    chart.subtitles[0].set("fontSize", chart.title.get("fontSize"));
    chart.title.set("padding",{ bottom: chart.title.get("fontSize")});
    chart.subtitles[0].set("padding", { top: chart.title.get("fontSize")});
}

async function getCarTypeNumbers(){
    var carTypes = {
        private: 0,
        company: 0
    };
    drivers = await getDrivers();
    for (const [employeeNumber, driver] of Object.entries(drivers)) {
        if (driver.carType == 'Company Car'){
            carTypes.company++;
        } else {
            carTypes.private++;
        }
    }
    return carTypes;
}