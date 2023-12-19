const { verifyPossibleCardsConterPlays } = require('./conterPlays.js');
const {
    startGame_validation,
    takeCoin_basic_validation,
    pass_basic_validation,
    card_1_validation,
    card_2_validation,
    card_3_validation,
    card_4_validation,
} = require('./validations/allValidations.js');
const {
    startGame,
    takeCoin_basic,
    pass_basic,
    card_1,
    card_2,
    card_3,
    card_4,
    pass,
    dispute,
    dispute_hasTheCard,
    dispute_doesNotHasTheCard
} = require('./protocols/allProtocols.js');

//
function playerMove_protocol(playerMove, room) {


    if (room.gameOver) return;

    let counterPlayMove = false;
    
    //se alguma jogada já foi realizada, verifica se a jogada nova recebida, é valida como contra jogada ou ação a se tomar em cima da jogada já ates realizada.
    if (room.alreadyPlayed) {
        counterPlayMove = true;

        switch (playerMove.content.action) {
            case "pass":
                if (!pass(playerMove, room)) break;
            break;
        
            case "dispute":
                if (!dispute(playerMove, room)) break;
            break;

            case "dispute_hasTheCard":
                if (!dispute_hasTheCard(playerMove, room)) break;
                room.playersWhoWantsToSkip.length = 0;
            break;
            
            case "dispute_doesNotHasTheCard":
                if (!dispute_doesNotHasTheCard(playerMove, room)) break;
                room.playersWhoWantsToSkip.length = 0;
            break;

            default:
                if (!verifyPossibleCardsConterPlays(playerMove, room)); //TODO validar as possíveis cartas que podem ser usadas em cima de outras
            break;
        };
    };

    if (!counterPlayMove) {
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
    
            case "card_3":
                if (!card_3_validation(playerMove, room)) break;
                room.alreadyPlayed = true;
    
                card_3(playerMove, room);
    
                //room.revalidateAllPlayersPossiblesMoves();
            break;
    
            case "card_4":
                if (!card_4_validation(playerMove, room)) break;
                room.alreadyPlayed = true;
    
                card_4(playerMove, room);
    
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