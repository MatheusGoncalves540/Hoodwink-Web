function takeCoin_basic(playerMove, room) {
    // playerMove = {
    //     type: "playerMove",
    //     owner: playeruuid,
    //     content: {
    //       action: "takeCoin_basic"
    //     }
    // };

    const moveOwner = room.players.find(player => player.header.playeruuid === playerMove.owner);
    
    moveOwner.coins += 1;

    //muda o currentMove
    room.currentMove = {
        moveType: "takeCoin_basic",
        player: moveOwner
    };

    const currentMove_clients = { ...room.currentMove };
    currentMove_clients.player = currentMove_clients.player.header.nickname;

    //tempo em segundos que será mostrado no "currentMove"
    const displayTime = room.header.displayTime;

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
        room.passTurnToNextPlayer(room.currentTurnOwner);
    }, displayTime*1000);
};

module.exports = { takeCoin_basic };