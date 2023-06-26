const { Sequelize } = require('sequelize');

//connecting
function connectToDataBase(dialect, storage) {
    const dataBase = new Sequelize({
        dialect: `${dialect}`,
        storage: `${storage}`
    });

    try {
        dataBase.authenticate();
        console.log('Conexão estabelecida com sucesso');
        return dataBase;
    } catch (error) {
        console.error('Não foi possivel se conectar ao db:', error);
        return false
    }
}

module.exports = {connectToDataBase}