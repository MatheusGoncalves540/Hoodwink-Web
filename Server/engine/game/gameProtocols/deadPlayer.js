async function verifyDeadPlayerProtocol(player, room) { 
    return new Promise(resolve => {
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
                    moveTimer: room.header.displayTime_highRelevance,
                    players: {}
                }
            };
            payload.content.players[`${player.header.playerNum}`] = player.getPublicInfos();
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
                resolve(); //conclui que o código terminou
            }, room.header.displayTime_highRelevance * 1000)
    
        } else {
            resolve(); //conclui que o código terminou
        }; 
    });
}; 

module.exports = { verifyDeadPlayerProtocol };