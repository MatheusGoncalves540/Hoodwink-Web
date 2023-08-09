function createRoom (rooms, idNewRoom, roomName, maxPlayer, roomPass) {
    rooms[idNewRoom] = {
        header : {
          roomId: idNewRoom,
          roomName: roomName,
          maxPlayer: maxPlayer,
          roomPass: roomPass 
        },
        //cada mensagem no chat, será um array, dentro do array "chat"
        chat: [
          //[[horas,minutos,segundos], uuui_do_remetente, mensagem]
          [[0,0,0], "Servidor", "Sala criada!"]
        ],
        turn: 0,
        players: [
          // { 
          //   nickname: player_exemple,
          //   uuidPlayer: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          //   socket: websocket_connection,
          //   playerNum: (room.players.length) + 1
          // }
        ]
    };
}

module.exports = {createRoom}