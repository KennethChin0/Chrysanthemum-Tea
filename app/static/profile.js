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

function sortDates() {
    data.sort(function(a, b) {
        date1 = new Date(a[1] + " 0:00");
        date2 = new Date(b[1] + " 0:00");

        return date1 - date2;
    });
}

var render = function(e){//displays all entries of this month
    yearAndMonth = e.split("-")
    year = yearAndMonth[0]
    month = yearAndMonth[1]
    var x = document.getElementById("display")
    var total = 0;

    clearNodes()
    sortDates()
    for (var i=0;i<data.length; i++) {
        if (data[i][0] == month) {
            var addDate = document.createTextNode(data[i][1] + " ");
            var addExpense = document.createTextNode(data[i][2] + " ");
            var addCategory = document.createTextNode(data[i][3] + " ");
            var addRemove = document.createElement("form")
            var removeButton = document.createElement("input")
            var dateInput = document.createElement("input")
            var div = document.createElement("div");
            var row = document.createElement("div");
            var div1 = document.createElement("div");
            var div2 = document.createElement("div");
            var div3 = document.createElement("div");
            var div4 = document.createElement("div");
            // div.style.backgroundColor = "#D93600";
            row.className = "row"
            div.className = "container"
            div1.className = "col"
            div2.className = "col"
            div3.className = "col"
            div4.className = "col"
            dateInput.id = "dateInput"
            dateInput.name = "dateInput"
            dateInput.value = data[i][1]
            dateInput.type = "hidden"
            var expenseInput = document.createElement("input")
            expenseInput.id = "expenseInput"
            expenseInput.name = "expenseInput"
            expenseInput.value = data[i][2]
            expenseInput.type = "hidden"
            var categoryInput = document.createElement("input")
            categoryInput.id = "categoryInput"
            categoryInput.name = "categoryInput"
            categoryInput.value = data[i][3]
            categoryInput.type = "hidden"
            addRemove.method="POST"
            addRemove.action="/removeEntry"
            removeButton.type = "submit"
            removeButton.className = "btn btn-outline-danger"
            removeButton.value="remove"
            addRemove.appendChild(dateInput)
            addRemove.appendChild(expenseInput)
            addRemove.appendChild(categoryInput)
            addRemove.appendChild(removeButton)
            var addNewLine = document.createElement("br")

            //
            // x.appendChild(addDate)
            // x.appendChild(addExpense)
            // x.appendChild(addCategory)
            // x.appendChild(addRemove)
            // x.appendChild(addNewLine)

            div1.appendChild(addDate)
            div2.appendChild(addExpense)
            div3.appendChild(addCategory)
            div4.appendChild(addRemove)
            row.appendChild(div1)
            row.appendChild(div2)
            row.appendChild(div3)
            row.appendChild(div4)
            div.appendChild(row)
            div.appendChild(addNewLine)
            x.appendChild(div)
            total += data[i][2]
        }
    }

    var addBudget = "   Remaining Budget:  " + total;
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
