function startGame_validation(playerMove, room) {
    if (playerMove.owner !== room.players[0].header.playeruuid) return false;
    if (room.turn !== 0) return false;
    return true;
};

module.exports = { startGame_validation };