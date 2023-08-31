const { startGame } = require('./startGame')
const { startGame_validation } = require('./validations/startGame')

function playerMove_protocol(playerMove, room) {
    switch (playerMove.content.action) {
        case "startGame":
            if (!startGame_validation(playerMove, room)) break;
            startGame(room);
        break;

        case "takeCoin_basic":
            console.log("+1");
        break;
    
        default:
        break;
    }
    return;
};

module.exports = { playerMove_protocol };