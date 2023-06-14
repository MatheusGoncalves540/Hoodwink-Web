const {uuidv4} = require("../includes/functions")

//cria a sala
function createGame(result) {
    const roomId = uuidv4();
    let room = {
        "id": roomId,
        "maxPlayer": result.maxPlayer,
        "players":[],
        "init_coins": result.init_coins
    }
    return room;
}

module.exports = {createGame}