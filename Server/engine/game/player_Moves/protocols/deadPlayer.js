function deadPlayerProtocol(disputedPlayer, room) { 
    if (disputedPlayer.isDead()) {
        room.currentMove = {
            moveType: 'deadPlayer',
            player: disputedPlayer
        };

        let currentMove_clients = { ...room.currentMove };
        currentMove_clients.player = currentMove_clients.player.header.nickname;

        const payload3 = {
            type: "gameData",
            content: {
                currentMove: currentMove_clients,
                displayTime: room.header.displayTime_highRelevance
            }
        };
        room.sendInfoForAllPlayers(payload3);
        
        //
        setTimeout(()=>{
            room.passTurnToNextPlayer(room.currentTurnOwner);
        }, room.header.displayTime_highRelevance * 1000)

    } else {
        room.passTurnToNextPlayer(room.currentTurnOwner);
    }; 
}; 

module.exports = { deadPlayerProtocol };