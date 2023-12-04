function gameWinner(WinnerPlayerNumber, room) {
    room.gameOver = true;
    const winner = room.players.find(player => player.header.playerNum == WinnerPlayerNumber);

    room.currentMove = {
        moveType: "gameWinner",
        player: winner
    }

    const currentMove_clients = { ...room.currentMove };
    currentMove_clients.player = currentMove_clients.player.header.nickname;    

    const payload = {
        type: "gameData",
        content: {
            currentMove: currentMove_clients
        }
    }
    room.sendInfoForAllPlayers(payload);
};

module.exports = { gameWinner };