//importating external functions
require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//importating internal functions
const { connectToDataBase } = require('./database/connection');
const User = require('./database/models');
//const { registerNewUser } = require('./database/record_data');

const {
    ValidNickname,
    ValidEmail,
    ValidPass,
    ValidConfirmPass
} = require("./validations");

//connect to db
connectToDataBase();

//init
const app = express();
app.use(express.json());
app.listen(1010);

//public route
app.get('/', (req,res) => {
    res.status(200).json({"msg":"Api is online!"});
});

//register user
app.post('/register', async(req, res) => {
    const {nickname, email, password, confirmpassword} = req.body;

    //validations
    if (!ValidNickname(nickname)) {
        return res.status(422).json({"msg":"invalid nickname"});
    };
    //
    if (!ValidEmail(email)) {
        return res.status(422).json({"msg":"invalid email"});
    };
    //
    if (!ValidPass(password)) {
        return res.status(422).json({"msg":"invalid password"});
    };
    //
    if (!ValidConfirmPass(password,confirmpassword)) {
        return res.status(422).json({"msg":"the passwords do not match"});
    };
    //
    const emailInUse =  await User.findOne({ email: email });
    if (emailInUse) {
        return res.status(422).json({"msg":"invalid email"});
    }
    //
    const nickInUse =  await User.findOne({ nickname: nickname });
    if (nickInUse) {
        return res.status(422).json({"msg":"invalid nickname"});
    }

    //encript password to save on db
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    //write on db the new user
    const newUser = new User({
        nickname,
        email,
        password
    });

    try {
        
        await newUser.save();

        res.status(201).json({ msg: "new user created successfully"})

    } catch (error) {
        console.log(error);
        res.status(500).json({msg:"a server error has occurred"});
    }
    //registerNewUser(User,res,nickname,email,passwordHash);
});