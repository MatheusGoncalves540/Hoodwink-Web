const { ValidateEntry } = require('../../lib/validations');
const { BringPastMessages } = require('../chat');

function socketOnNewConnection(socket, room, msg, playeruuid, idRoom, nickname, roomPass) {
    //validação da entrada novamente
    if (!room || !ValidateEntry(nickname, room, roomPass, playeruuid, 'socket')) {
        if (socket) socket.send(msg.errors.alrdyInRoom);
        socket.close();
        return;
    };

    // Armazenando as informações no contexto do WebSocket
    socket.context = {
        idRoom: idRoom,
        roomPass: roomPass,
        nickname: nickname,
        playeruuid: playeruuid,
    };

    //verifica se existe um player com o uuid fornecido dentro da sala
    const playerToUpdate = room.players.find(player => player.uuidPlayer === playeruuid);

    //atualiza o "socket" do player, caso ele já estava conectado na sala anteriormente
    if (playerToUpdate) {
        playerToUpdate.socket = socket;
        playerToUpdate.nickname = nickname;
        //envia a mensagem aos outros jogadores da sala
        room.players.forEach(player => {
            try {
                player.socket.send(JSON.stringify({
                    "type": "msg_chat",
                    "content": nickname + msg.chat.reconected,
                    "owner": "server"
                }));
            } catch { };
        });
    }
    //caso o jogo ainda não tenha iniciado, adiciona o novo jogador na sala
    else if (room.turn === 0) {
        room.players.push({
            nickname: nickname,
            uuidPlayer: playeruuid,
            socket: socket,
            playerNum: (room.players.length) + 1,
        });
        //envia a mensagem aos outros jogadores da sala
        room.players.forEach(player => {
            try {
                player.socket.send(JSON.stringify({
                    "type": "msg_chat",
                    "content": nickname + msg.chat.connected,
                    "owner": "server"
                }));
            } catch { };

        });
    }
    //caso ele não estava na partida antes e o jogo já começou
    else { //TODO conectar o cliente como espectador então
        socket.close();
        return; //ADICIONAR RETORNO DE ERRO PARA O CLIENTE AQUI
    };

    BringPastMessages(room, playeruuid);
};

module.exports = { socketOnNewConnection };