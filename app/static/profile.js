var monthInput = document.getElementById("month");
var chosenMonth = document.getElementById("monthButton");
chosenMonth.addEventListener('click', function(e) {check()})

var check = function(e){
  console.log(monthInput)
  if (parseInt(monthInput.value) >= 2020){//parseInt get the year
    render(monthInput.value)//passes chosen month to render
  }
}

var x = document.getElementById("data").value;
data = JSON.parse(x)
console.log(data)

function clearNodes() {
    var display = document.getElementById("display");

    while (display.hasChildNodes()) {
        display.removeChild(display.childNodes[0]);
    }
}

var render = function(e){//displays all entries of this month
    yearAndMonth = e.split("-")
    year = yearAndMonth[0]
    month = yearAndMonth[1]
    var x = document.getElementById("display")
    var total = 0;

    clearNodes()
    for (var i=0;i<data.length; i++) {
        if (data[i][0] == month) {
            var addDate = document.createTextNode(data[i][1] + " ");
            var addExpense = document.createTextNode(data[i][2] + " ");
            var addCategory = document.createTextNode(data[i][3]);
            var addNewLine = document.createElement("br")
            
            x.appendChild(addDate)
            x.appendChild(addExpense)
            x.appendChild(addCategory)
            x.appendChild(addNewLine)

            total += data[i][2]
        }
    }
    console.log(total)

    var addBudget = "Your budget remaining is " + total;
    var totalText = document.getElementById("total")
    totalText.innerHTML = addBudget;
}

var date = document.getElementById("date")
var expense = document.getElementById("expense")
var entry = document.getElementById("entryButton")
entry.addEventListener('click', function(e) {addEntry()})

var addEntry = function(e){ //adds entry to database and redisplays all entry of this month
  console.log(date.value)
  console.log(expense.value)
}
