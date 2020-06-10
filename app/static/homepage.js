// Global variables
var running = false; // Don't let a user spam the button

// BUTTON GROUP
var chooseGraph = function(e) {
    if (!running) {
        // Reset clicked button to original state
        var button = document.getElementsByClassName("btn btn-primary");
        if (button.length > 0)
            button[0].className = "btn btn-outline-primary";

        // Change this button's state (fills button in)
        e.path[0].className = "btn btn-primary";

        running = true;
        initGraph(e.path[0].id);
    }
}

var button1 = document.getElementById("b1");
button1.addEventListener("click", chooseGraph);

var button2 = document.getElementById("b2");
button2.addEventListener("click", chooseGraph);

var button3 = document.getElementById("b3");
button3.addEventListener("click", chooseGraph);

// GRAPHS
function initGraph(id) {
    if (id == "b1") {
        console.log(1);
    }
    if (id == "b2") {
        console.log(2);
    }
    if (id == "b3") {
        console.log(3);
    }
    running = false;
}
