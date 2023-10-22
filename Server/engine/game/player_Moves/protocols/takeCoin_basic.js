const { getPlayerNickFromCurrentMove } = require('../../../../lib/functions');

function takeCoin_basic(playerMove, room) {
    const moveOwner = room.players.find(player => player.header.playeruuid === playerMove.owner);
    
    moveOwner.coins += playerMove.content.amount;

    //muda o currentMove
    room.currentMove = {
        moveType: "takeCoin_basic",
        player: moveOwner,
        amount: playerMove.content.amount
    };

    const currentMove_clients = room.currentMove;
    currentMove_clients.player = getPlayerNickFromCurrentMove(currentMove_clients);

    //tempo em segundos que será mostrado no "currentMove"
    const displayTime = 2;

    const payloadToOwner = {
        type: "gameData",
        content: {
            currentMove: currentMove_clients,
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
            currentMove: currentMove_clients,
            moveTimer: displayTime,
            players: {}
        }
    };

    payload.content.players[`${moveOwner.header.playerNum}`] = {
        coins: moveOwner.coins
    };

    room.sendInfoForAllPlayers(payload);

    setTimeout(() => {
        room.passTurnToNextPlayer(moveOwner);
    }, displayTime*1000);
};

module.exports = { takeCoin_basic };