const { ValidateEntry } = require('../../lib/validations');
const { BringPastMessages } = require('../chat');

function socketOnNewConnection(socket, room, urlData, msgServer, playingNow) {
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
                type: "gameData",
                content: {
                    players: {}
                }
            };
            room.players.forEach(player_ => {
                payload.content.players[`${player_.header.playerNum}`] = {
                    nick: player_.header.nickname,
                    playerNum: player_.header.playerNum,
                    coins: player_.coins,
                    playerCards: [
                        player_.cards[0] != -1 ? true : false, //posição 0 no array: carta esquerda | true se estiver viva, false se estiver morta
                        player_.cards[1] != -1 ? true : false //posição 0 no array: carta esquerda  | id de carta morta: -1
                    ],
                    invested: player_.invested,
                    usedCards: player_.usedCards,
                    isAlive: player_.isAlive,
                    connected: player_.header.socket !== null ? true : false
                }
            });
            
            room.sendInfoForAllPlayers(payload);
        }
        //caso o jogo ainda não tenha iniciado, adiciona o novo jogador na sala
        else if (room.turn === 0) {
            room.addNewPlayerOnRoom(newPlayer);
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
                        coins: player_.coins,
                        playerCards: [
                            player_.cards[0] != -1 ? true : false, //posição 0 no array: carta esquerda | true se estiver viva, false se estiver morta
                            player_.cards[1] != -1 ? true : false //posição 0 no array: carta esquerda  | id de carta morta: -1
                        ],
                        invested: player_.invested,
                        usedCards: player_.usedCards,
                        isAlive: player_.isAlive,
                        connected: player_.header.socket !== null ? true : false
                    }
                });

                player.header.socket.send(JSON.stringify(payload));
            });
        }
        //caso ele não estava na partida antes e o jogo já começou
        else { //
            socket.close();
            return; //TODO ADICIONAR RETORNO DE ERRO PARA O CLIENTE AQUI ou conectar o cliente como espectador então
        };

        room.BringGameInfos(socket);
        BringPastMessages(room, newPlayer.playeruuid);

        if (room.timeOut_deleteRoom != undefined && !room.timeOut_deleteRoom._destroyed) {
            console.log("exclusão da sala: " + `${room.header.roomId}` + " cancelada");
            clearTimeout(room.timeOut_deleteRoom);
        };
        
        playingNow.connected ++;
};

module.exports = { socketOnNewConnection };