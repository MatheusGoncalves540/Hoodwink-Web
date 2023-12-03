function verifyDeadPlayerProtocol(player, room) { 
    if (player.isDead()) {
        room.currentMove = {
            moveType: 'deadPlayer',
            player: player
        };

        let currentMove_clients = { ...room.currentMove };
        currentMove_clients.player = currentMove_clients.player.header.nickname;

        const payload = {
            type: "gameData",
            content: {
                currentMove: currentMove_clients,
                displayTime: room.header.displayTime_highRelevance
            }
        };
        room.sendInfoForAllPlayers(payload);
        //

        const payloadToDeadPlayer = {
            type: "gameData",
            content: {
                me: {
                    isAlive: player.isAlive
                }
            }
        }
        player.header.socket.send(JSON.stringify(payloadToDeadPlayer));

        //
        setTimeout(()=>{
            room.passTurnToNextPlayer(room.currentTurnOwner);
        }, room.header.displayTime_highRelevance * 1000)

    } else {
        room.passTurnToNextPlayer(room.currentTurnOwner);
    }; 
}; 

module.exports = { verifyDeadPlayerProtocol };