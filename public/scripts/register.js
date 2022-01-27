mailInp = document.getElementById("email");
pass1Inp = document.getElementById("pass1");
pass2Inp = document.getElementById("pass2");
phoneInp = document.getElementById("phone");

info1 = document.getElementById("info1");
info2 = document.getElementById("info2");
info3 = document.getElementById("info3");
info6 = document.getElementById("info6");

const emailPattern = new RegExp('^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$', 'i');

function validateMail() {
    if (!emailPattern.test(mailInp.value)) {
        info1.className = "input-group error";
        return false;
    } else {
        info1.className = "input-group correct";
        return true;
    }
}

function validatePassword1() {
    if (!/^(?=.*\d)(?=.*[a-zA-Z])(?!.*\s).{8,15}$/.test(pass1Inp.value)) {
        info2.className = "input-group error";
        return false;
    } else {
        info2.className = "input-group correct";
        return true;
    }
}

function validatePassword2() {
    if (pass2Inp.value != pass1Inp.value) {
        info3.className = "input-group error";
        return false;
    } else {
        info3.className = "input-group correct";
        return true;
    }
}

function validateEmpty(id) {
    const input_group = document.getElementById(id);
    if (input_group.getElementsByTagName('INPUT')[0].value == "") {
        input_group.className = "input-group error";
        return false;
    } else {
        input_group.className = "input-group correct";
        return true;
    }
}

function validatePhone() {
    if (!/^[0-9]{9}$/.test(phoneInp.value)) {
        info6.className = "input-group error";
        return false;
    } else {
        info6.className = "input-group correct";
        return true;
    }
}
function validateSubmit() {
    const tab = [validateMail(), validatePassword1(), validatePassword2(), validateEmpty('info4'), validateEmpty('info5'), validatePhone()];
    for(const val of tab) {
        if(!val) {
            return false;
        }
    }
    return true;
}

