const { verifyPossibleConterPlays } = require('./conterPlays.js');
const { startGame } = require('./protocols/startGame');
const { startGame_validation } = require('./validations/startGame');
const { takeCoin_basic } = require('./protocols/takeCoin_basic');
const { takeCoin_basic_validation } = require('./validations/takeCoin_basic');
const { pass_basic_validation } = require('./validations/pass_basic');
const { pass_basic } = require('./protocols/pass_basic');
const { card_1_validation } = require('./validations/card_1');
const { card_1 } = require('./protocols/card_1');
const { card_2_validation } = require('./validations/card_2');
const { card_2 } = require('./protocols/card_2');

function playerMove_protocol(playerMove, room) {
    let validPlay = true;
    
    //se alguma jogada já foi realizada, verifica se a jogada nova recebida, é valida como contra jogada ou ação a se tomar em cima da jogada já ates realizada.
    if (room.alreadyPlayed) {
        validPlay = false;

        switch (playerMove.content.action) {
            case "pass":
                //se ainda não tem o uuid do player neste array, então é adicionado.
                if (room.playersWhoWantsToSkip.includes(playerMove.owner)) break;
                room.playersWhoWantsToSkip.push(playerMove.owner);

                //caso todos os players estejam neste array, então é executada imediatamente a função em aguardo
                if (room.playersWhoWantsToSkip.length >= (room.players.length - 1)) {
                    clearTimeout(room.playInTimeOut);
                    room.playersWhoWantsToSkip.length = 0;
                    room.moveFunction();
                }
            break;
        
            case "dispute":
                //TODO adicionar contestação nas jogadas
                room.playersWhoWantsToSkip.length = 0;
            break;

            default:
                if (verifyPossibleConterPlays(playerMove, room)) validPlay = true; //TODO validar as possíveis cartas que podem ser usadas em cima de outras
            break;
        };
    };

    if (validPlay) {
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