// GLOBAL VARIABLES
var running = false; // Don't let a user spam the button
var currentID = "";

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
        currentID = e.target.id;
        draw();
        running = false;
    }
}

var button1 = document.getElementById("b1");
button1.addEventListener("click", chooseGraph);

var button2 = document.getElementById("b2");
button2.addEventListener("click", chooseGraph);

var button3 = document.getElementById("b3");
button3.addEventListener("click", chooseGraph);


// WINDOW RESIZE
var hConst, wConst;

function draw() {
    hConst = window.innerHeight / screen.availHeight;
    hConst = hConst < 1 ? hConst + .068 : 1 // Make up for rough calculation
    wConst = window.innerWidth / screen.availWidth;

    if (currentID != "") {
        initGraphs(currentID);
    }
}
window.addEventListener("resize", draw);


// FETCH AND FORMAT DATA
var parseTime = d3.timeParse("%Y-%m-%d");
var formatTime = d3.timeFormat("%Y-%m-%d");

var jsonData = document.getElementById("data").value;
data = JSON.parse(jsonData);

// Sort dates in ascending order
data.sort(function(a, b) {
    return parseTime(a[1]) - parseTime(b[1]);
});

// console.log(data);


// GRAPHS
function initGraphs(id) {
    // Clear
    d3.select("#line").selectAll("svg").remove();
    d3.select("#pie").selectAll("svg").remove();
    document.getElementById("nothing").innerHTML = "";

    var dates = [];
    var money = [];
    var cash = 0;

    var pieData = [];

    // Sort Data into Arrays
    if (id == "b3") {
        for (var i = 0; i < data.length; i++) {
            cash += data[i][2];
            money[i] = cash;
            dates[i] = parseTime(data[i][1]);

            pieData[i] = {
                "category": data[i][3],
                "amount": data[i][2]
            };
        }
    }
    else {
        // Get correct past data for a certain time range
        var timeNow = new Date();
        timeNow.setHours(0, 0, 0);
        timeNow = formatTime(timeNow);

        var date = timeNow.split("-");
        var year = date[0];
        var month = date[1];
        var day = date[2];

        if (id == "b1") {
            if (month == 1) {
                date[0] = String(parseInt(year) - 1);
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
                date[1] = "0" + String(parseInt(month) - 1);
            }
        }
    
        else if (id == "b2") {
            if (month > 6) {
                if (month == 8 && day > 28) {
                    date[2] = "28";
                    if (year % 4 == 0 && year % 100 != 0) date[2] = "29";
                    else if (year % 400 == 0) date[2] = "29";
                    
                }
                else if (day == 31) {
                    date[2] = "30"
                }
                date[1] = "0" + String(parseInt(month) - 6);
            }
            else {
                if (day == 31) {
                    date[2] = "30";
                }
                if (month < 4) date[1] = "0" + String(parseInt(month) + 6);
                else date[1] = String(parseInt(month) + 6);
                date[0] = String(parseInt(year) - 1);
            }
        }

        var firstDate = date.join("-");
        firstDate = parseTime(firstDate);

        var index = 0;
        for (var i = 0; i < data.length; i++) {
            var dataDate = parseTime(data[i][1]);

            if (firstDate <= dataDate) {
                cash += data[i][2];
                money[index] = cash;
                dates[index] = parseTime(data[i][1]);

                pieData[index++] = {
                    "category": data[i][3],
                    "amount": data[i][2]
                };
            }
        }
    }

    if (dates.length == 0 || money.length == 0) {
        document.getElementById("nothing").innerHTML = 
        "<br><br> Uhoh. There's nothing here. &#128557";
    }
    else {
        createLine(dates, money, 0);
        createPie(pieData);
    }
}

function createLine(dates, money) {
    var svgHeight = 600 * hConst;
    var svgWidth = 750 * wConst;

    var margins = { top: 50 * hConst, bottom: 50 * hConst,
                    left: 60 * wConst, right: 50 * wConst};
    var height = svgHeight - margins.top - margins.bottom;
    var width = svgWidth - margins.left - margins.right;

    var dataPoints = [];
    for (var i = 0; i < dates.length; i++) {
        dataPoints[i] = {
            "date": dates[i],
            "cash": money[i]
        };
    }

    // Create SVG
    var svg = d3.select("#line")
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
        .attr("stroke", "white")
        .attr("stroke-width", 1.5)
        .datum(dataPoints)
        .attr("d", d3.line()
            .x(d => xAxis(d.date))
            .y(d => yAxis(d.cash)));
    
    // Add Title
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margins.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .text("Spending History");
}

function process(data) {
    var clothing = 0;
    var food = 0;
    var rent = 0;
    var other = 0;

    for (var entry in data) {
        var cat = data[entry]["category"];
        var amount = data[entry]["amount"] * -1;

        if (cat == "clothing") clothing += amount;
        else if (cat == "food") food += amount;
        else if (cat == "rent") rent += amount;
        else if (cat == "other") other += amount;
    }
    var total = {};
    if (clothing > 0) total["Clothing"] = clothing;
    if (food > 0) total["Food"] = food;
    if (rent > 0) total["Rent"] = rent;
    if (other > 0) total["Other"] = other;

    return total;
}
function createPie(pieData) {
    var svgDiameter = 600 * hConst;
    var margin = 40 * hConst;
    var radius = svgDiameter / 2 - margin;

    // Create SVG
    var svg = d3.select("#pie")
        .append("svg")
            .attr("width", svgDiameter)
            .attr("height", svgDiameter)
        .append("g")
            .attr("transform", "translate(" + svgDiameter / 2 + "," + svgDiameter / 2 + ")");
    
    // Add title
    svg.append("text")
        .attr("x", 0)
        .attr("y", 0 - svgDiameter / 2 + margin / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .text("What am I spending on?");
    
    var data = process(pieData);

    // Set color range
    var color = d3.scaleOrdinal()
        .domain(data)
        .range(["#FF6F61", "#88B04B", "#EFC050", "#7FCDCD"]);

    // Find pie positions of data
    var pie = d3.pie()
        .value(d => d.value);
    var posData = pie(d3.entries(data));

    // Find arcs
    var arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);
    
    // Draw
    svg.selectAll("arcs")
        .data(posData)
        .enter()
        .append("path")
            .attr("d", arc)
            .attr('fill', d => color(d.data.key));
    
    // Add labels
    svg.selectAll("arcs")
        .data(posData)
        .enter()
        .append("text")
            .text(d => d.data.key)
            .attr("transform", d => "translate(" + arc.centroid(d) + ")")
                .style("text-anchor", "middle")
                .style("fill", "white")
                .style("font-size", 16);
}
