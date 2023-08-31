function startGame(room) {
    room.startGame();
    const payload = {
        type: "gameData",
        content: {
            time: room.elapsedTime(),
            turn: room.turn
        }
    };
    room.sendInfoForAllPlayers(payload);
};

module.exports = { startGame };