const { getPlayerNickFromCurrentMove } = require('../../../../lib/functions');

function pass_basic(playerMove, room) {
    const moveOwner = room.players.find(player => player.header.playeruuid === playerMove.owner);

    if (room.currentMove.moveType === 'waitingFirstMove') {
        //muda o currentMove
        room.currentMove = {
            moveType: "pass_basic",
            player: moveOwner
        };

        //tempo em segundos que será mostrado no "currentMove"
        const displayTime = 2;

        const currentMove_clients = room.currentMove;
        currentMove_clients.player = getPlayerNickFromCurrentMove(currentMove_clients);

        const payload = {
            type: "gameData",
            content: {
                currentMove: currentMove_clients,
                moveTimer: displayTime
            }
        };
        room.sendInfoForAllPlayers(payload);

        setTimeout(() => {
            room.passTurnToNextPlayer(moveOwner);
        }, displayTime*1000);
    };
};

module.exports = { pass_basic };