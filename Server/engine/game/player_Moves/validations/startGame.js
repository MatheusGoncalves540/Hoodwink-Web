function startGame_validation(playerMove, room) {
    
    if (!(room.players.find(player => player.header.playerNum === 1))) return;
    if (playerMove.owner !== (room.players.find(player => player.header.playerNum === 1))['header']['playeruuid']) return false;
    if (room.turn !== 0) return false;
    return true;
};

module.exports = { startGame_validation };