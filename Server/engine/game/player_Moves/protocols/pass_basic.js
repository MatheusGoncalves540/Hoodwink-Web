

function pass_basic(playerMove, room) {
    // playerMove = {
    //     type: "playerMove",
    //     owner: playeruuid,
    //     content: {
    //       action: "pass_basic"
    //     }
    // };

    const moveOwner = room.players.find(player => player.header.playeruuid === playerMove.owner);

    if (room.currentMove.moveType === 'waitingFirstMove') {
        //muda o currentMove
        room.currentMove = {
            moveType: "pass_basic",
            player: moveOwner
        };

        //tempo em segundos que será mostrado no "currentMove"
        const displayTime = room.header.displayTime;

        const currentMove_clients = { ...room.currentMove };
        currentMove_clients.player = currentMove_clients.player.header.nickname;

        const payload = {
            type: "gameData",
            content: {
                currentMove: currentMove_clients,
                moveTimer: displayTime
            }
        };
        room.sendInfoForAllPlayers(payload);

        setTimeout(() => {
            room.passTurnToNextPlayer(room.currentTurnOwner);
        }, displayTime*1000);
    };
};

module.exports = { pass_basic };