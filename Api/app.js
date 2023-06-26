//importação de bibliotecas externas
require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//importação de funções internas
const { connectToDataBase } = require('./database/connection');
const { userModel } = require('./database/models');

const {
    ValidateRegisterData
} = require("./functions");

//connect to db
dataBase = connectToDataBase('sqlite', './Api/database/registers.db');

const User = userModel(dataBase);

//init
const app = express();

app.use(express.json())

//rota publica
app.get('/', (req,res) => {
    res.status(200).json({"msg":"conectado com sucesso!"})
});

//registrar usuario
app.post('/register', async(req, res) => {
    const {nickname, email, password, confirmpassword} = req.body;

    //validações
    ValidateRegisterData(User,confirmpassword,password,nickname,email);
    
    res.status(200).json({"msg":"cadastrado com sucesso!"});

});

app.listen(1010);