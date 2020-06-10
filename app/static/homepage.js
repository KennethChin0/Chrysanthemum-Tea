var changeButtonState = function(e) {
    // Reset clicked button to original state
    var button = document.getElementsByClassName("btn btn-primary");
    if (button.length > 0) button[0].className = "btn btn-outline-primary";

    // Change this button's state
    e.path[0].className = "btn btn-primary";
}

var button1 = document.getElementById("b1");
button1.addEventListener("click", changeButtonState);

var button2 = document.getElementById("b2");
button2.addEventListener("click", changeButtonState);

var button3 = document.getElementById("b3");
button3.addEventListener("click", changeButtonState);
