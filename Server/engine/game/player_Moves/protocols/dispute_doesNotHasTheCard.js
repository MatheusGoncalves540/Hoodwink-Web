function dispute_doesNotHasTheCard(playerMove, room) {
    //TODO
    // const payload = {
    //     type: "playerMove",
    //     owner: playeruuid,
    //     content: {
    //       action: "responseToDoesNotHasTheCard",
    //       disputedPlayer: disputedPlayer,
    //       card: //0 ou 1
    //     }
    // };
    const moveOwner = room.players.find(player => player.header.playeruuid === playerMove.owner);
    const disputedPlayer = room.players.find(player => player.header.nickname === playerMove.content.disputedPlayer);

    const displayTime = room.header.displayTime_withPossibleCounterPlays;

    room.currentMove = {
        moveType: 'responseToDoesNotHasTheCard',
        player: moveOwner,
        disputedPlayer: disputedPlayer,
        disputedCard: disputedCardId
    };

    const currentMove_clients = { ...room.currentMove };
    currentMove_clients.player = currentMove_clients.player.header.nickname;
    currentMove_clients.disputedPlayer = currentMove_clients.disputedPlayer.header.nickname;
    
    
};

module.exports = { dispute_doesNotHasTheCard };
