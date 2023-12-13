const { Player } = require('../player_class');

function selfDestructionByNoPlayers(rooms, room) {
    const connectedPlayers = room.players.filter((player) => { 
        return player.header.socket !== null; 
    });

    if (connectedPlayers.length <= 0) {
        const timeWithoutPlayers = 1800; //30 min

        if (room.gameOver || room.turn === 0) {
            if (connectedPlayers.length <= 0) {
                delete rooms[room.header.roomId];
                console.warn("a sala: " + `${room.header.roomId}` + " foi excluída.");
            };
        } else {
            room.timeOut_deleteRoom = setTimeout(() => {
                console.warn("a sala: " + `${room.header.roomId}` + " foi excluída.");
            }, timeWithoutPlayers * 1000);
    
            console.log("a sala: " + `${room.header.roomId}` + " será excluída em " + `${(timeWithoutPlayers / 60)}` + " minutos");
        };
    };
};

//

function addNewPlayerOnRoom(newPlayer, room) {
    newPlayer['coins'] = room.header.startCoins < room.header.maxCoins ? room.header.startCoins : room.header.maxCoins;
    room.players.push(new Player(newPlayer, room));
};

module.exports = { selfDestructionByNoPlayers, addNewPlayerOnRoom };