//importação de bibliotecas externas
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//importação de funções internas
const {ValidNickname,ValidEmail,ValidPass,ValidConfirmPass} = require("./functions");


//init
const app = express();

//credenciais
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;

//rota publica
app.get('/', (req,res) => {
    res.status(200).json({"msg":"conectado com sucesso!"})
});

//registrar usuario
app.post('/register', async(req, res) => {
    const {nickname, email, password, confirmpassword} = req.body;

    //validações
    if (!ValidNickname(nickname)) {
        return res.status(422).json({"erro":"invalid nickname"})
    };
    if (!ValidEmail(email)) {
        return res.status(422).json({"erro":"invalid email"})
    };
    if (!ValidPass(password)) {
        return res.status(422).json({"erro":"invalid password"})
    };
    if (!ValidConfirmPass(password,confirmpassword)) {
        return res.status(422).json({"erro":"invalid confirm password"})
    };
    

})

mongoose
    .connect(`mongodb://localhost:27017/`)
    .then(() => {
        app.listen(1010);
        console.log("connected to database");
    }).catch((err) => console.log(err));

