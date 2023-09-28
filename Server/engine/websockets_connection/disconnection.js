function socketOnCloseConnection(socket, room, msg) {
    socket.on('close', function () {
        
            const disconnectedPlayer = room.players.find(player => player.header.socket === socket);

            if (!disconnectedPlayer) return;

            //se o jogo já tiver iniciado, delete apenas o socket do player
            if (room.turn !== 0) {
                disconnectedPlayer.header.socket = null;
                //mas se o jogo não tiver iniciado ainda, delete o player por inteiro
            } else {
                room.players = room.players.filter(player => player.header.socket !== socket);
            };

            //TODO quando o player for desconectado: player.waitReconnecting = true. Se depois de 5 segundos: player.waitReconnecting === true, então: exibe a mensagem de desconectado e torna a variável false.
            //E na parte que exibe a mensagem de conectado, se player.waitReconnecting === true: Não exibe a mensagem, caso contrario, exibe normalmente.


            //TODO quando um player for desconectado, rearranjar os playerNum de cada player.
            if (room.turn === 0) {
                room.players.forEach(player => {
                    player.header.playerNum = room.players.indexOf(player) + 1;
                });

                room.players.forEach(player => {
                    const payload = {
                        type: "gameData",
                        content: {
                            me: {
                                playerNum: player.header.playerNum
                            },
                            players: {}
                        }
                    };
                    room.players.forEach(player_ => {
                        payload.content.players[`${player_.header.playerNum}`] = {
                            nick: player_.header.nickname,
                            playerNum: player_.header.playerNum,
                        }
                    });

                    player.header.socket.send(JSON.stringify(payload));
                });
            };

            //envia para os players a mensagem de disconnect
            const payload = {
                "type": "msg_chat",
                "msgs": [{
                    "content": disconnectedPlayer.header.nickname + msg.chat.disconnected,
                    "owner": "server"
                }]
            };
            room.sendInfoForAllPlayers(payload);
            console.log('disconnected');
    });
};

module.exports = { socketOnCloseConnection };