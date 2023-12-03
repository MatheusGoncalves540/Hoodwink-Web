function dispute_HasTheCard(playerMove, room) {
    //TODO
    //TODO fazer com que a habilidade da carta seja realizada caso ele tinha a carta
    if (playerMove.owner !== room.currentMove.disputedPlayer) return false;
};

module.exports = { dispute_HasTheCard };