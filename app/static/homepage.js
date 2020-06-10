// GLOBAL VARIABLES
var running = false; // Don't let a user spam the button


// BUTTON GROUP
var chooseGraph = function(e) {
    if (!running) {
        // Reset clicked button to original state
        var button = document.getElementsByClassName("btn btn-primary");
        if (button.length > 0) {
            button[0].className = "btn btn-outline-primary";
        }
        // Change this button's state (fills button in)
        e.target.className = "btn btn-primary";

        running = true;
        initGraph(e.target.id);
    }
}

var button1 = document.getElementById("b1");
button1.addEventListener("click", chooseGraph);

var button2 = document.getElementById("b2");
button2.addEventListener("click", chooseGraph);

var button3 = document.getElementById("b3");
button3.addEventListener("click", chooseGraph);


// FETCH AND FORMAT DATA
var jsonData = document.getElementById("data").value;
data = JSON.parse(jsonData);
var parseTime = d3.timeParse("%Y-%m-%d");
var formatTime = d3.timeFormat("%Y-%m-%d");

// Sort dates in ascending order
data.sort(function(a, b) {
    return parseTime(a[1]) - parseTime(b[1]);
});

// console.log(data);


// GRAPHS
function initGraph(id) {
    // Clear
    d3.select("#graph").selectAll("svg").remove();
    document.getElementById("graph").innerHTML = "";

    var dates = [];
    var money = [];
    var cash = 0;
    var range;

    // Draw Graph
    if (id == "b1") {
        var timeNow = new Date();
        timeNow.setHours(0, 0, 0);
        timeNow = formatTime(timeNow);

        var date = timeNow.split("-");
        var year = date[0];
        var month = date[1];
        var day = date[2];

        if (month == 1) {
            date[0] = String(year - 1);
            date[1] = "12";
        }
        else {
            if (month == 3 && day > 28) {
                date[2] = "28";
                if (year % 4 == 0 && year % 100 != 0) date[2] = "29";
                else if (year % 400 == 0) date[2] = "29";
                
            }
            else if (month != 8 && day == 31) {
                date[2] = "30";
            }
            date[1] = "0" + String(month - 1);
        }
        var firstDate = date.join("-");
        firstDate = parseTime(firstDate);

        for (var i = 0; i < data.length; i++) {
            var dataDate = parseTime(data[i][1]);
            if (firstDate <= dataDate) {
                cash += data[i][2];
                money.push(cash);

                dates.push(dataDate);
            }
        }

        if (dates.length == 0 || money.length == 0) {
            document.getElementById("graph").innerHTML = 
            "<br><br> Uhoh. There's nothing here. &#128557";
        }
        else {
            createGraph(dates, money, 0);
        }
    }

    else if (id == "b2") {
        var timeNow = new Date();
        timeNow.setHours(0, 0, 0);
        timeNow = formatTime(timeNow);

        var date = timeNow.split("-");
        var year = date[0];
        var month = date[1];
        var day = date[2];

        if (month > 6) {
            if (month == 8 && day > 28) {
                date[2] = "28";
                if (year % 4 == 0 && year % 100 != 0) date[2] = "29";
                else if (year % 400 == 0) date[2] = "29";
                
            }
            else if (day == 31) {
                date[2] = "30"
            }
            date[1] = "0" + String(month - 6);
        }
        else {
            if (day == 31) {
                date[2] = "30";
            }
            date[0] = String(year - 1);
            date[1] = "0" + String(month + 6);
        }

        var firstDate = date.join("-");
        firstDate = parseTime(firstDate);

        for (var i = 0; i < data.length; i++) {
            var dataDate = parseTime(data[i][1]);
            if (firstDate <= dataDate) {
                cash += data[i][2];
                money.push(cash);

                dates.push(dataDate);
            }
        }

        if (dates.length == 0 || money.length == 0) {
            document.getElementById("graph").innerHTML = 
            "<br><br> Uhoh. There's nothing here. &#128557";
        }
        else {
            createGraph(dates, money, 0);
        }
    }

    else if (id == "b3") {
        for (var i = 0; i < data.length; i++) {
            cash += data[i][2];
            money.push(cash);

            dates.push(parseTime(data[i][1]));
        }
        
        if (dates.length == 0 || money.length == 0) {
            document.getElementById("graph").innerHTML = 
            "<br><br> Uhoh. There's nothing here. &#128557";
        }
        else {
            createGraph(dates, money, 0);
        }
    }

    running = false;
}

function createGraph(dates, money, range) {
    var svgHeight = 600;
    var svgWidth = 600;

    var margins = { top: 50, bottom: 50, left: 50, right: 50 };
    var height = svgHeight - margins.top - margins.bottom;
    var width = svgWidth - margins.left - margins.right;

    // dates = dates.slice(0, range);
    // money = money.slice(0, range);
    var dataPoints = [];
    // for (var i = 0; i < range; i++)
    for (var i = 0; i < dates.length; i++) {
        dataPoints[i] = {
            "date": dates[i],
            "cash": money[i]
        };
    }

    // Create SVG
    var svg = d3.select("#graph")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .append("g")
        .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

    // Create and add axes to graph
    var xAxis = d3.scaleTime()
        .domain(d3.extent(dates))
        .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xAxis));

    var yAxis = d3.scaleLinear()
        .domain(d3.extent(money))
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(yAxis));

    // Add lines
    svg.append("path")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .datum(dataPoints)
        .attr("d", d3.line()
            .x(d => xAxis(d.date))
            .y(d => yAxis(d.cash)));
    
    // Add labels
}
