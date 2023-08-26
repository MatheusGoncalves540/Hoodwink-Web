const { ValidateEntry } = require('../../lib/validations');
const { BringPastMessages } = require('../chat');

function socketOnNewConnection(socket, room, urlData, msgServer) {
    const { idRoom, roomPass } = urlData;

    const newPlayer = {
        playeruuid: urlData['playeruuid'],
        nickname: urlData['nickname'],
        socket: socket
    };

    //validação da entrada novamente
    if (!room || !ValidateEntry(newPlayer.nickname, room, roomPass, newPlayer.playeruuid, 'socket')) {
        if (socket) socket.send(msgServer.errors.alrdyInRoom);
        socket.close();
        return;
    };

    // Armazenando as informações no contexto do WebSocket
    socket.context = {
        idRoom: idRoom,
        roomPass: roomPass,
        nickname: newPlayer.nickname,
        playeruuid: newPlayer.playeruuid,
    };

    //verifica se existe um player com o uuid fornecido dentro da sala
    const playerToUpdate = room.players.find(player => player.header.uuidPlayer === newPlayer.playeruuid);

    //atualiza o "socket" do player, caso ele já estava conectado na sala anteriormente
    if (playerToUpdate) {
        playerToUpdate.header.socket = newPlayer.socket;
        playerToUpdate.header.nickname = newPlayer.nickname;
        const payload = {
            "type": "msg_chat",
            "msgs": [{
                "content": newPlayer.nickname + msgServer.chat.reconected,
                "owner": "server"
            }]
        };
        room.sendInfoForAllPlayers(payload);
    }
    //caso o jogo ainda não tenha iniciado, adiciona o novo jogador na sala
    else if (room.turn === 0) {
        room.addPlayerOnRoom(newPlayer);

        const payload = {
            "type": "msg_chat",
            "msgs": [{
                "content": newPlayer.nickname + msgServer.chat.connected,
                "owner": "server"
            }]
        };
        room.sendInfoForAllPlayers(payload);
    }
    //caso ele não estava na partida antes e o jogo já começou
    else { //TODO conectar o cliente como espectador então
        socket.close();
        return; //ADICIONAR RETORNO DE ERRO PARA O CLIENTE AQUI
    };

    room.BringGameInfos(socket);

    BringPastMessages(room, newPlayer.playeruuid);
};

module.exports = { socketOnNewConnection };