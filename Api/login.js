require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

//credenciais
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;

//rota publica
app.get('/', (req,res) => {
    res.status(200).json({"msg":"conectado com sucesso!"})
});

//registrar usuario


mongoose
    .connect(`mongodb://localhost:27017/`)
    .then(() => {
        app.listen(1010);
        console.log("connected to database");
    }).catch((err) => console.log(err));

