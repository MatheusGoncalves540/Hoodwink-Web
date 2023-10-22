const { startGame } = require('./protocols/startGame')
const { startGame_validation } = require('./validations/startGame')
const { takeCoin_basic } = require('./protocols/takeCoin_basic')
const { takeCoin_basic_validation } = require('./validations/takeCoin_basic')
const { pass_basic_validation } = require('./validations/pass_basic')
const { pass_basic } = require('./protocols/pass_basic')

function playerMove_protocol(playerMove, room) {
    if (room.alreadyPlayed) return;

    if (playerMove.content.action !== "startGame") {
        if (playerMove.owner !== room.currentTurnOwner.header.playeruuid) return;
    }
    
    switch (playerMove.content.action) {
        case "startGame":
            if (!startGame_validation(playerMove, room)) break;
            room.alreadyPlayed = true;
            startGame(room);
        break;

        case "takeCoin_basic":
            if (!takeCoin_basic_validation()) break;
            room.alreadyPlayed = true;

            takeCoin_basic(playerMove, room);

            //room.revalidateAllPlayersPossiblesMoves();
        break;

        case "pass_basic":
            if (!pass_basic_validation()) break;
            room.alreadyPlayed = true;

            pass_basic(playerMove, room);

            //room.revalidateAllPlayersPossiblesMoves();
        break;
    
        default:
        break;
    }
    return;
};

module.exports = { playerMove_protocol };