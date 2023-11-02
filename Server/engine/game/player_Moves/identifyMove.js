const { verifyPossibleConterPlays } = require('./conterPlays.js');
const {
    startGame_validation,
    takeCoin_basic_validation,
    pass_basic_validation,
    card_1_validation,
    card_2_validation,
} = require('./validations/allValidations.js');
const {
    startGame,
    takeCoin_basic,
    pass_basic,
    card_1,
    card_2,
    pass
} = require('./protocols/allProtocols.js');

//
function playerMove_protocol(playerMove, room) {
    let validMove = true;
    
    //se alguma jogada já foi realizada, verifica se a jogada nova recebida, é valida como contra jogada ou ação a se tomar em cima da jogada já ates realizada.
    if (room.alreadyPlayed) {
        validMove = false;

        switch (playerMove.content.action) {
            case "pass":
                if (!pass(playerMove, room)) break;
            break;
        
            case "dispute":
                //TODO adicionar contestação nas jogadas
                room.playersWhoWantsToSkip.length = 0;
            break;

            default:
                if (verifyPossibleConterPlays(playerMove, room)) validMove = true; //TODO validar as possíveis cartas que podem ser usadas em cima de outras
            break;
        };
    };

    if (validMove) {
        switch (playerMove.content.action) {
        
        
        
            case "startGame":
                if (!startGame_validation(playerMove, room)) break;
                room.alreadyPlayed = true;
                startGame(room);
            break;
    
            case "takeCoin_basic":
                if (!takeCoin_basic_validation(playerMove, room)) break;
                room.alreadyPlayed = true;
    
                takeCoin_basic(playerMove, room);
    
                //room.revalidateAllPlayersPossiblesMoves();
            break;
    
            case "pass_basic":
                if (!pass_basic_validation(playerMove, room)) break;
                room.alreadyPlayed = true;
    
                pass_basic(playerMove, room);
    
                //room.revalidateAllPlayersPossiblesMoves();
            break;
    
            case "card_1":
                if (!card_1_validation(playerMove, room)) break;
                room.alreadyPlayed = true;
    
                card_1(playerMove, room);
    
                //room.revalidateAllPlayersPossiblesMoves();
            break;
    
            case "card_2":
                if (!card_2_validation(playerMove, room)) break;
                room.alreadyPlayed = true;
    
                card_2(playerMove, room);
    
                //room.revalidateAllPlayersPossiblesMoves();
            break;
    
            //TODO continuar a adicionar jogadas
        
            default:
            break;
        };
    };
    return;
};

module.exports = { playerMove_protocol };