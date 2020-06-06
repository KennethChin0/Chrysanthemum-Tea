var month = document.getElementById("month")
var chosenMonth = document.getElementById("monthButton")
chosenMonth.addEventListener('click', function(e) {check()})

var check = function(e){
  console.log(month.value)
  if (parseInt(month.value) >= 2020){//parseInt get the year
    render(parseInt(month.value))//passes chosen month to render
  }
}

var render = function(e){//displays all entries of this month
  console.log(e)
}

var date = document.getElementById("date")
var expense = document.getElementById("expense")
var entry = document.getElementById("entryButton")
entry.addEventListener('click', function(e) {addEntry()})

var addEntry = function(e){//adds entry to database and redisplays all entry of this month
  console.log(date.value)
  console.log(expense.value)
}

var x = document.getElementById("data").value;
x2 = JSON.parse(x)
console.log(x2)
