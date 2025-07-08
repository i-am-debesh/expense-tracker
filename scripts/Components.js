
function greetComponent(className, message) {
    return `<h1 class="${className}">${message}</h1>`;
}
const monthList = ['all','jan','feb','mar','april','may','jun','jul','aug','sept','oct','nov','dec'];

function listItemCompFromLocalStorage(id,day,month, year, hours,mins, purpose, amount) {
    
    const itemHtml = `
        <div class="exp ${month}" id="${id}">
            <div class="purpose">${purpose}
            <p class="time-stamp">${day}-${monthList[month]}-${year}<br>
            ${hours}:${mins}</p>
            </div>  
                <div class="purpose-amount">${amount}</div>
                    <div class="actions">
                    <button class="edit-item action-btn" onclick="editItem(this)">Edit</button>
                    <button class="delete-item action-btn" onclick="deleteItem(this)">Delete</button>
                </div>
            </div>
              
        </div>
    `;

    return itemHtml;
}
