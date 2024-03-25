 function card_8(playerMove, room) {
    // playerMove = {
    //     type: "playerMove",
    //     owner: playeruuid,
    //     content: {
    //       action: "card_8",
    //       attackedPlayer: attackedPlayer,
    //       card: card, //0 ou 1
    //       sacrificedCard: sacrificedCard //0 ou 1
    //     }
    //   };

    const moveOwner = room.players.find(player => player.header.playeruuid === playerMove.owner);
    const attackedPlayer = room.players.find(player => player.header.nickname === playerMove.content.attackedPlayer);
    const displayTime = room.header.displayTime_withPossibleCounterPlays;
    const usedForCounterPlay = room.currentMove.moveType = "waitingFirstMove" ? false : true;

    room.currentMove = {
        moveType: "card_8",
        player: moveOwner,
        attackedPlayer: attackedPlayer,
        card: playerMove.content.card,
        sacrificedCard: playerMove.content.sacrificedCard
    };

    let currentMove_clients = { ...room.currentMove };
    currentMove_clients.player = currentMove_clients.player.header.nickname;
    currentMove_clients.attackedPlayer = currentMove_clients.attackedPlayer.header.nickname;

    const payload = {
        type: "gameData",
        content: {
            currentMove: currentMove_clients,
            moveTimer: displayTime
        }
    };

    room.sendInfoForAllPlayers(payload);

    if (usedForCounterPlay) {
        room.moves.functions.push([() => {
            
        }, true]);
    } else {
        room.moves.functions.push([() => {
            
        }, true]);
    };

    room.playInTimeOut = setTimeout(room.moves.functions[room.moves.functions.length-1][0], displayTime * 1000);
};

module.exports = { card_8 };