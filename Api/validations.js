//nickname validation
async function ValidNickname(nickname) {
    if (!nickname) {
        return false;
    } else {
        if (nickname.length < 3) {
            return false;
        };

        if (nickname.length > 17) {
            return false;
        };
    };
    return true;
};

//email validation
async function ValidEmail(email) {
    if (!email) {
        return false;

    } else {
        if (email.length < 5) {
            return false;
        };

        if (!email.includes("@")) {
            return false;
        };
    };
    return true;
};

//password validation
function ValidPass(password) {
    if (!password) {
        return false;

    } else {

        if (password.length < 8) {
            return false;
        };

        if (password.length > 20) {
            return false;
        };
    };
    return true;
};

//confirm password validation
function ValidConfirmPass(password,confirmpassword) {
    if (confirmpassword !== password) {
        return false;
    };
   return true;
};

module.exports = {ValidNickname, ValidPass, ValidEmail, ValidConfirmPass}