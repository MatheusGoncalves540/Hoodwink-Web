//TODO quando o player for desconectado: player.waitReconnecting = true. Se depois de 5 segundos: player.waitReconnecting === true, então: exibe a mensagem de desconectado e torna a variável false.
//E na parte que exibe a mensagem de conectado, se player.waitReconnecting === true: Não exibe a mensagem, caso contrario, exibe normalmente.
function socketOnCloseConnection(socket, room, rooms, playingNow) {
    if (!room || !socket) return;
    socket.on('close', function () {
            const disconnectedPlayer = room.players.find(player => player.header.socket === socket);

            if (!disconnectedPlayer) return;

            //se o jogo já tiver iniciado, socket do player = null
            if (room.turn !== 0) {
                disconnectedPlayer.header.socket = null;
                //mas se o jogo não tiver iniciado ainda, delete o player por inteiro
            } else {
                room.players = room.players.filter(player => player.header.socket !== socket);
            };

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
                        playerCards: [
                            player_.cards[0] != -1 ? true : false, //posição 0 no array: carta esquerda | true se estiver viva, false se estiver morta
                            player_.cards[1] != -1 ? true : false //posição 0 no array: carta esquerda  | id de carta morta: -1
                        ],
                        coins: player_.coins,
                        invested: player_.invested,
                        usedCards: player_.usedCards,
                        connected: player_.header.socket !== null ? true : false
                    }
                });

                try {
                    player.header.socket.send(JSON.stringify(payload));
                } catch {};
            });

            room.selfDestructionByNoPlayers(rooms);
            playingNow.connected --;
    });
};

module.exports = { socketOnCloseConnection };