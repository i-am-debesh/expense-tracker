const expenseListElement = document.querySelector('.expense-list');
const addExpenseElement = document.querySelector('.add-expense-btn');
const purposeInputElement = document.querySelector('.purpose-input');
const amountInputElement = document.querySelector('.amount-input');
const manualDateInputElement = document.querySelector('.date-input');
const manualTimeInputElement = document.querySelector('.time-input');
let inputAllowed = false;
let prevInputAllowed = false;
populateYears();
const totalAmountElement = document.querySelector('.total-amount');
function enableInput(buttonName) {
    if(buttonName === 'recent') {
        purposeInputElement.hidden = false;
        amountInputElement.hidden = false;
    }else if(buttonName === 'prev') {
        document.querySelector('.prev-purpose-input').hidden = false;
        document.querySelector('.prev-amount-input').hidden = false;
        manualDateInputElement.hidden = false;
        manualTimeInputElement.hidden = false;
    }
    
}
function disableInput(buttonName) {

    if(buttonName === 'recent') {
        purposeInputElement.value = '';
        amountInputElement.value = '';
        purposeInputElement.hidden = true;
        amountInputElement.hidden = true;
    }else if(buttonName === 'prev') {
        document.querySelector('.prev-purpose-input').value = '';
        document.querySelector('.prev-amount-input').value = '';
        document.querySelector('.prev-purpose-input').hidden = true;
        document.querySelector('.prev-amount-input').hidden = true;
        manualDateInputElement.hidden = true;
        manualTimeInputElement.hidden = true;
    }
    
}

function populateYears(startYear=2002) {
    const currYear = new Date().getFullYear();
    const selectYearElement = document.getElementById('select-years');
    for(let year = startYear; year <= currYear; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.text = year;
        selectYearElement.appendChild(option);
    }
}
function extractDateParts(dateString) {
  const [year, month, day] = dateString.split('-').map(Number);
  return { day, month, year };
}
function extractedTimeParts(timeString) {
    const [hour,mins] = timeString.split(':').map(Number);
    return {hour,mins};
}
function addPrevExpense() {
    document.getElementById('months').value = 0;
    document.getElementById('select-years').value = new Date().getFullYear();

    if(prevInputAllowed === false && inputAllowed === false) {
        enableInput('prev');
        prevInputAllowed = true;
    }else if(inputAllowed === true) {
        disableInput('recent');
        inputAllowed = false;
        enableInput('prev');
        prevInputAllowed = true;
    }

    const purpose = document.querySelector('.prev-purpose-input').value || '';
    const amount = document.querySelector('.prev-amount-input').value || '';
    const date = manualDateInputElement.value || '';
    const time = manualTimeInputElement.value || '';

    if(purpose !== '' && 
        amount !== '' &&
        date !== '' &&
        time !== ''
    ) {
        const formattedDate = extractDateParts(date);
        const formattedTime = extractedTimeParts(time);

        const newExpense = {
            id : Date.now(),
            month : formattedDate.month,
            day : formattedDate.day,
            year: formattedDate.year,
            hours : formattedTime.hour,
            mins : formattedTime.mins,
            purpose: purpose,
            amount: amount,
        }
        //console.log(newExpense);
        let expenseList = JSON.parse(localStorage.getItem("expenses")) || [];
        expenseList.push(newExpense);
        localStorage.setItem("expenses", JSON.stringify(expenseList));
        disableInput('prev');
        prevInputAllowed = false;

    }renderList();

    
    
}
function addExpense() {
    
    document.getElementById('months').value = 0;
    document.getElementById('select-years').value = new Date().getFullYear();
    if(inputAllowed === false && prevInputAllowed === false) {
        enableInput('recent');
        inputAllowed = true;
    }else if(prevInputAllowed === true) {
        disableInput('prev');
        prevInputAllowed = false;
        enableInput('recent');
        inputAllowed = true;
    }
    if(inputAllowed === true) {

        const purpose = purposeInputElement.value;
        const amount = amountInputElement.value;
        if(purpose !== '' && amount !== '') {
            const d = new Date;
            const newExpense = {
                id : Date.now(),
                month : d.getMonth()+1,
                day : d.getDate(),
                year: d.getFullYear(),
                hours : d.getHours(),
                mins : d.getMinutes(),
                purpose: purpose,
                amount: amount,

            }
            let expenseList = JSON.parse(localStorage.getItem("expenses")) || [];
            expenseList.push(newExpense);
            localStorage.setItem("expenses", JSON.stringify(expenseList));
            disableInput('recent');
            inputAllowed = false;
            
        }
    }renderList();
    
}
const currDate = new Date;
function filterList(month=0,year=currDate.getFullYear()) {
    renderList(month,year);
}

function renderList(month=0, year = currDate.getFullYear()) {
    
    //console.log(month,year);
    
    expenseListElement.innerHTML = '';

    const allExpenses = JSON.parse(localStorage.getItem("expenses")) || [];
    let sum=0, items=0, total = 0;
    allExpenses.forEach(expense => {
        if((expense.month == Number(month) || Number(month) ==0)&& expense.year == Number(year)) {
            items++;
            sum+= Number(expense.amount);
            expenseListElement.innerHTML += listItemCompFromLocalStorage(expense.id,expense.day, expense.month, expense.year, expense.hours, expense.mins, expense.purpose, expense.amount);
        };
    });
    if(items === 0) {
        expenseListElement.innerHTML = `<p class="no-records">No Records Found</p>`;
    }
    document.querySelector('.filter-sum').innerHTML = `Expense(${monthList[month]}-${year}): ${sum}/-`
    allExpenses.forEach(expense => {
        total += Number(expense.amount);
    });
    totalAmountElement.innerHTML = `Overall Expense: ${total}/-`;

}
renderList();

function clearData() {
    const userChoice = prompt('are you sure ? All data will be erased permanently! (y/n)');

    if(userChoice.toLowerCase() === 'y') {
        localStorage.clear();
        alert('All Data has been Erased successfully!');
        renderList();
    }
}

function deleteItem(button) {

    const userChoice = prompt('are you sure ? All data will be erased permanently! (y/n)');

    if(userChoice.toLowerCase() === 'y') {
        const expenseElement = button.closest(".exp");  
        const expenseId = parseInt(expenseElement.id); 
        
        expenseElement.remove();

        let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

        expenses = expenses.filter(exp => exp.id !== expenseId);

        localStorage.setItem("expenses", JSON.stringify(expenses));
    }renderList();
  
  
}

function editItem(button) {
  const expenseElement = button.closest(".exp");
  const expenseId = parseInt(expenseElement.id);

  // Get fields to edit
  const purposeEl = expenseElement.querySelector(".purpose");
  const amountEl = expenseElement.querySelector(".purpose-amount");

  // Extract current values
  const currentPurpose = purposeEl.childNodes[0].nodeValue.trim();
  const currentAmount = amountEl.textContent.trim();

  // Prompt user for new values
  const newPurpose = prompt("Edit purpose:", currentPurpose);
  const newAmount = prompt("Edit amount:", currentAmount);

  // If user cancels (null), do nothing
  if (newPurpose === null || newAmount === null) return;

  // Update DOM
  purposeEl.childNodes[0].nodeValue = newPurpose + " ";
  amountEl.textContent = newAmount;

  // Update localStorage
  let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

  const updatedExpenses = expenses.map(exp => {
    if (exp.id === expenseId) {
      return { ...exp, purpose: newPurpose, amount: newAmount };
    }
    return exp;
  });

  localStorage.setItem("expenses", JSON.stringify(updatedExpenses));
  renderList();
}




