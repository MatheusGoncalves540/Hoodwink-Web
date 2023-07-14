//importating external functions
const express = require('express');
const bcrypt = require('bcrypt');
require('dotenv').config();

//importating internal functions
const { connectToDataBase } = require('./database/connection');
const User = require('./database/models_schemas');
const { registerNewUser } = require('./database/record_data');
const { GenerateTokenAndLogin, checkTocken } = require('./token_functions')
const {
    ValidadeData
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

//private route
app.get('/logged/:id', checkTocken, async(req, res) => {
    try {
        const id = req.params.id;

        //check if user exist
        const user = await User.findById(id, '-password -createdAt -updatedAt -__v');

        if (!user) {
            return res.status(404).json({msg: "user not found"});
        };

        res.status(200).json({ user });
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg:"a server error has occurred"});
    };
});

//register user
app.post('/register', async(req, res) => {
    try {
        const {nickname, email, password} = req.body;
        console.log(req)
        //validations
        if (ValidadeData(nickname,email,password,res,'register')){
            return;
        };
        //check if email in use
        const emailInUse =  await User.findOne({ email: email });
        if (emailInUse) {
            return res.status(422).json({"msg":"invalid email"});
        }
        //check if nickname in use
        const nickInUse =  await User.findOne({ nickname: nickname });
        if (nickInUse) {
            return res.status(422).json({"msg":"invalid nickname"});
        }

        //encript password to save on db
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);

        //write on db the new user
        registerNewUser(User,res,nickname,email,passwordHash);
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg:"a server error has occurred"});
    };
});


//login
app.post("/login", async (req,res) => {
    try {
        const { nicknameOrEmail, password } = req.body;

        //validation
        if (ValidadeData(null,nicknameOrEmail,password,null,res,"login")){
        return;
        };
        
        //check if email in use
        const userDB =  await User.findOne({ email: email });
        if (!userDB) {
            return res.status(404).json({"msg":"login not found"});
        }
        //check if password match
        const checkPass = await bcrypt.compare(password, userDB.password);
        if (!checkPass) {
            return res.status(422).json({"msg":"Invalid password"});
        };

        //generating a token and try to logging in the user
        GenerateTokenAndLogin(userDB,res);
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg:"a server error has occurred"});
    };
    
});