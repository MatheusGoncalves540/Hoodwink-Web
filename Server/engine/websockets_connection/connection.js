const { ValidateEntry } = require('../../lib/validations');
const { BringPastMessages } = require('../chat');

function socketOnNewConnection(socket, room, urlData, msgServer) {
        const { idRoom, roomPass } = urlData;

        const newPlayer = {
            playeruuid: urlData['playeruuid'],
            nickname: urlData['nickname'],
            socket: socket,
            roomPass: roomPass,
            room: room
        };

        //validação da entrada novamente
        const validation = ValidateEntry(null, msgServer, newPlayer, 'socket');
        if (!room || validation !== true) {
            if (socket) socket.send(validation);
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
        const playerToUpdate = room.players.find(player => player.header.playeruuid === newPlayer.playeruuid);

        //atualiza o "socket" do player, caso ele já estava conectado na sala anteriormente
        if (playerToUpdate) {
            playerToUpdate.header.socket = newPlayer.socket;
            playerToUpdate.header.nickname = newPlayer.nickname;
            const payload = {
                "type": "msg_chat",
                "msgs": [{
                    "content": newPlayer.nickname + msgServer.chat.reconnected,
                    "owner": "server"
                }]
            };
            room.sendInfoForAllPlayers(payload);
        }
        //caso o jogo ainda não tenha iniciado, adiciona o novo jogador na sala
        else if (room.turn === 0) {
            room.addNewPlayerOnRoom(newPlayer);

            const payload = {
                "type": "msg_chat",
                "msgs": [{
                    "content": newPlayer.nickname + msgServer.chat.connected,
                    "owner": "server"
                }]
            };
            room.sendInfoForAllPlayers(payload);

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
                //TODO as informações do player 1, não estão sendo enviadas ao cliente
                room.players.forEach(player_ => {
                    payload.content.players[`${player_.header.playerNum}`] = {
                        nick: player_.header.nickname,
                        playerNum: player_.header.playerNum,
                    }
                });

                player.header.socket.send(JSON.stringify(payload));
            });
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