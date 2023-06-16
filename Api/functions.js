//nickname validation
function ValidNickname(nickname) {
    Valid = true;

    if (!nickname) {
        Valid = false;
    }
    if (nickname.length < 3) {
        Valid = false;
    }
    if (nickname.length > 17) {
        Valid = false;
    }

   return Valid;
};

//email validation
function ValidEmail(email) {
    Valid = true;

    if (!email) {
        Valid = false;
    }
    if (email.length < 5) {
        Valid = false;
    }
    if (!email.includes("@")) {
        Valid = false;
    }

   return Valid;
};

//password validation
function ValidPass(password) {
    Valid = true;

    if (!password) {
        Valid = false;
    }
    if (password.length < 8) {
        Valid = false;
    }
    if (password.length > 20) {
        Valid = false;
    }

   return Valid;
};

//confirm password validation
function ValidConfirmPass(password,confirmpassword) {
    Valid = true;

    if (confirmpassword === password) {
        Valid = false;
    }
    
   return Valid;
};



module.exports = {ValidNickname,ValidEmail,ValidPass,ValidConfirmPass}