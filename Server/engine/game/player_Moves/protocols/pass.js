function pass(playerMove, room) {
    //se ainda não tem o uuid do player neste array, então é adicionado.
    if (room.playersWhoWantsToSkip.includes(playerMove.owner)) return false;
    room.playersWhoWantsToSkip.push(playerMove.owner);

    //caso todos os players estejam neste array, então é executada imediatamente a função em aguardo
    if (room.playersWhoWantsToSkip.length >= (room.players.length - 1)) {
        clearTimeout(room.playInTimeOut);
        room.playersWhoWantsToSkip.length = 0;
        room.moveFunction();
    };
};

module.exports = { pass };