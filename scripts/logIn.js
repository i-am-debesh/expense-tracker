function saveUser(userID, password, passCode) {
    if(userID !== '' && password !== '' && passCode != '') {
        
        let user = localStorage.getItem('expense-user') || {};
        const newUSer = {
            userID : userID,
            password : password,
            passCode : passCode
        }
        user = newUSer;
        localStorage.setItem('expense-user', JSON.stringify(newUSer));
        location.reload();

        
    }

}

function checkForExistingUser() {
    
    if(localStorage.getItem('expense-user')) {
        document.getElementById('pass-code-page').hidden = false;
        document.getElementById('log-in-page').hidden = true;
        document.querySelector('.app').hidden = true;
    }
    else if(!localStorage.getItem('expense-user')) {
        document.getElementById('pass-code-page').hidden = true;
        document.querySelector('.app').hidden = true;
        document.getElementById('log-in-page').hidden = false;
        
    }
};
checkForExistingUser();

function checkPassCode(passCode) {
    
    const userPassCode = (JSON.parse(localStorage.getItem('expense-user'))).passCode;
    if(Number(passCode) === Number(userPassCode)) {
        document.getElementById('pass-code-page').hidden = true;
        document.querySelector('.app').hidden = false;
        alert('access granted!');
        
    }else {
        alert('access denied!');
        
    }
    
}


