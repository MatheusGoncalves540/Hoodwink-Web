const mongoose = require('mongoose');

//connecting
function connectToDataBase() {
    mongoose.connect('mongodb://127.0.0.1:27017').then(() => {
        console.log('conectou-se ao banco!');
        return true;
    }).catch((err) => {
        console.log (err);
        return false;
    });
}

module.exports = {connectToDataBase}