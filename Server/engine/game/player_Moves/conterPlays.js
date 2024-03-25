const { card_8 } = require("./protocols/allProtocols");
const { card_8_validation } = require("./validations/allValidations");

function verifyPossibleCardsConterPlays(playerMove, room) {
    switch (playerMove.content.action) {
        case "card_8":
            if (!card_8_validation(playerMove, room)) break;
            room.playersWhoWantsToSkip.length = 0;
            card_8(playerMove, room);
        break;

        default:
        break;
    };
};

module.exports = { verifyPossibleCardsConterPlays };