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
        ],
        spectators: [
          //se a sala estiver cheia, ou o jogo já tiver iniciado. os jogadores *novos*, serão conectados como espectadores automaticamente
          //mas antes do jogo começar, os jogadores podem escolher se querem ser espectadores ou players. (respeitando os limites, claro)
        ]
    };
}

class Room {
  constructor(id, roomName, maxPlayers, password) {
    this.header = {
      roomId: id,
      roomName: roomName,
      maxPlayer: maxPlayers,
      roomPass: password,
    };
    this.chat = [
      [[0, 0, 0], "Servidor", "Sala criada!"],
    ];
    this.turn = 0;
    this.players = [
      // { 
      //   nickname: player_exemple,
      //   uuidPlayer: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      //   socket: websocket_connection,
      //   playerNum: (room.players.length) + 1
      // }
    ];
    this.startTime = null;
    this.timerInterval = null;
  }

  startGame() {
    if (this.turn === 0) {
      this.turn = 1;
      this.startTime = Date.now();

      // Iniciar o timer
      this.startTimer();
    }
  }

//TODO a ideia é quando o jogo começar, gravar o date.now() e sempre que alguem conectar na sala, o servidor faz a conta de "elapsedTimeInSeconds = Math.floor((currentTime - this.startTime) / 1000);"
//isso vai fazer com que o cliente saiba a quantos segundos começou aquela partida, e apartir dai, o timer fica apenas na parte do cliente.
//assim, é possivel manter um timer preciso, mas sem precisar ficar contando cada segundo no servidor, apenas grava o horario de inicio e quando alguem se conecta, o proprio cliente começa a contar.

  startTimer() {
    if (!this.timerInterval) {
      this.timerInterval = setInterval(() => {
        const currentTime = Date.now();
        const elapsedTimeInSeconds = Math.floor((currentTime - this.startTime) / 1000);

        // Atualizar os jogadores com o tempo decorrido (opcional)
        this.updatePlayersWithElapsedTime(elapsedTimeInSeconds);
      }, 1000); // Atualizar a cada segundo
    }
  }

  updatePlayersWithElapsedTime(elapsedTimeInSeconds) {
    // Enviar informações de tempo decorrido para os jogadores (via WebSocket, por exemplo)
  }
}

module.exports = {createRoom}