const msgServer = require('../../../lib/languages/messages.json')['ptbr'];

function takeCoin_basic(playerMove, room) {
    const moveOwner = room.players.find(player => player.header.playeruuid === playerMove.owner);
    
    moveOwner.coins += playerMove.content.amount;
    room.currentMove = `${moveOwner.header.nickname}${msgServer.game.takeCoin_basic}`;

    //tempo em segundos que será mostrado no "currentMove"
    const displayTime = 2;

    const payloadToOwner = {
        type: "gameData",
            content: {
                currentMove: room.currentMove,
                currentTurnOwner: moveOwner.header.nickname,
                moveTimer: displayTime,
                me: {
                    coins: moveOwner.coins
                }
            }
    };
    moveOwner.header.socket.send(JSON.stringify(payloadToOwner));

    const payload = {
        type: "gameData",
            content: {
                currentMove: room.currentMove,
                currentTurnOwner: moveOwner.header.nickname,
                moveTimer: displayTime,
                players: {}
            }
    };

    payload.content.players[`${moveOwner.header.playerNum}`] = {
        coins: moveOwner.coins
    };

    room.sendInfoForAllPlayers(payload);

    //////////TODO fazer os controles de timer de jogada, no fim de cada jogada

    setTimeout(() => {
        room.passTurnToNextPlayer(moveOwner);
    }, displayTime*1000);
};


module.exports = { takeCoin_basic };