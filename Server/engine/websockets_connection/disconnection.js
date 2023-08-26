function socketOnCloseConnection(socket, room, msg) {
    socket.on('close', function () {
        console.log('disconected');
        const desconectedPlayer = room.players.find(player => player.header.socket === socket);

        if (!desconectedPlayer) return;

        //se o jogo já tiver iniciado, delete apenas o socket do player
        if (room.turn !== 0) {
            desconectedPlayer.header.socket = null;
            //mas se o jogo não tiver iniciado ainda, delete o player por inteiro
        } else {
            room.players = room.players.filter(player => player.header.socket !== socket);
        };

        //TODO quando o player for desconectado: player.waitReconecting = true. Se depois de 5 segundos: player.waitReconecting === true, então: exibe a mensagem de desconectado e torna a variavel false.
        //E na parte que exibe a mensagem de conectado, se player.waitReconecting === true: Não exibe a mensagem, caso contrario, exibe normalmente.

        const payload = {
            "type": "msg_chat",
            "content": desconectedPlayer.nickname + msg.chat.desconected,
            "owner": "server"
        };
    });
};

module.exports = { socketOnCloseConnection };