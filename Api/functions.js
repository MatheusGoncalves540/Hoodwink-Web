const { Sequelize } = require("sequelize");

//nickname validation
function ValidNickname(nick,Table) {
    Valid = true;

    if (!nick) {
        Valid = false;
    } else {

        if (nick.length < 3) {
            Valid = false;
        }

        if (nick.length > 17) {
            Valid = false;
        }

        //verify if the nick is already registered
        const InUse = Table.findAll ({
            where: {nickname : nick}
        });
        //if true, the nick is not valid
        if (InUse.Promiseresult) {
            Valid = false;
        };
    };
    

   return Valid;
};

//email validation
function ValidEmail(email,Table) {
    Valid = true;

    if (!email) {
        Valid = false;

    } else {

        if (email.length < 5) {
        Valid = false;
        };

        if (!email.includes("@")) {
            Valid = false;
        };

        //verify if the email is already registered
        const InUse = Table.findAll ({
            where: {email : email}
        });
        if (InUse.Promiseresult) {
            Valid = false;
        };
    };

   return Valid;
};

//password validation
function ValidPass(password) {
    Valid = true;

    if (!password) {
        Valid = false;

    } else {

        if (password.length < 8) {
            Valid = false;
        };

        if (password.length > 20) {
            Valid = false;
        };
    };

   return Valid;
};

//confirm password validation
function ValidConfirmPass(password,confirmpassword) {
    Valid = true;

    if (confirmpassword !== password) {
        Valid = false;
    }
    
   return Valid;
};

function ValidateRegisterData(Table,password,confirmpassword,nickname,email) {
    if (!ValidPass(password)) {
        return res.status(422).json({"msg":"invalid password"});
    };
    
    if (!ValidNickname(nickname,Table)) {
        return res.status(422).json({"msg":"invalid nickname"});
    };

    if (!ValidEmail(email,Table)) {
        return res.status(422).json({"msg":"invalid email"});
    };

    if (!ValidConfirmPass(password,confirmpassword)) {
        return res.status(422).json({"msg":"invalid confirm password"});
    };
};

module.exports = {ValidNickname,ValidEmail,ValidPass,ValidConfirmPass}