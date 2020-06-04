var month = document.getElementById("month")
var chosenMonth = document.getElementById("monthButton")
chosenMonth.addEventListener('click', function(e) {check()})

var check = function(e){
  console.log(month.value)
  if (parseInt(month.value) >= 2020){//parseInt get the year
    render(parseInt(month.value))//passes chosen month to render
  }
}

var render = function(e){
  console.log(e)
}

var date = document.getElementById("date")
var expense = document.getElementById("expense")
var entry = document.getElementById("entryButton")
entry.addEventListener('click', function(e) {addEntry()})

var addEntry = function(e){
  console.log(date.value)
  console.log(expense.value)
}
