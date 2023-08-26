class Room {
  constructor(idNewRoom, roomName, maxPlayer, roomPass) {
    this.header = {
      roomId: idNewRoom,
      roomName: roomName,
      maxPlayer: maxPlayer,
      roomPass: roomPass,
      startTime: undefined,
      startCoins: 2,
      maxCoins: 20,
    };
    this.chat = [
      {
        time: [0, 0, 0],
        owner: "server",
        ownerNick: "server",
        content: "Sala criada!",
      },
    ];
    this.turn = 0;
    this.tax = 2;
    
    this.players = [];
    this.spectators = [];
  };

  //adiciona o novo player na sala
  //estrutura do player
  addPlayerOnRoom(newPlayer) {
    newPlayer['coins'] = this.header.startCoins < this.header.maxCoins ? this.header.startCoins : this.header.maxCoins;
    newPlayer['cards'] = 2;


    this.players.push({
      header: {
        nickname: newPlayer.nickname,
        uuidPlayer: newPlayer.playeruuid,
        socket: newPlayer.socket,
        playerNum: (this.players.length) + 1,
      },
      cards: newPlayer.cards,
      coins: newPlayer.coins,
    });
  }

  //começa o jogo
  startGame() {
    if (this.turn !== 0) return;

    this.turn = 1;
    this.header.startTime = Date.now();
  };

  //TODO a ideia é quando o jogo começar, gravar o date.now() e sempre que alguem fizer algo que precise do horario, o servidor faz a conta de "elapsedTimeInSeconds = Math.floor((currentTime - this.startTime) / 1000);"
  //isso vai fazer com que o cliente saiba a quantos segundos começou aquela partida, e apartir dai, o timer fica apenas na parte do cliente.
  //assim, é possivel manter um timer preciso, mas sem precisar ficar contando cada segundo no servidor, apenas grava o horario de inicio e quando alguem se conecta, o proprio cliente começa a contar.

  //retorna os segundos, minutos e horas passadas desde o inicio da partida
  elapsedTime() {
    if (this.turn !== 0) {
      return {
        seconds: Math.floor((Date.now() - this.header.startTime) / 1000),
        minutes: Math.floor((Date.now() - this.header.startTime) / 60000),
        hours: Math.floor((Date.now() - this.header.startTime) / 3600000)
      };
    } else {
      return {
        seconds: 0,
        minutes: 0,
        hours: 0
      };
    };
  };

  //manda para o socket passado, as informações necessarias para conectar e jogar o jogo
  BringGameInfos(socket) {
    const connectedPlayer = this.players.find(player => player.header.uuidPlayer === socket.context.playeruuid);
    const time = this.elapsedTime();

    const payload = {
      type: "gameData",
      content: { //TODO enviar todas as informações necessarias para a construção da tela do jogo na tela do cliente
        turn: this.turn,
        time: {
          seconds: time.seconds,
          minutes: time.minutes,
          hours: time.hours
        },
        tax: this.tax,

        me: {
            coins: connectedPlayer.coins,
            cardsInHand: ['left','rigth']
        },
      }
    };
    socket.send(JSON.stringify(payload));
  };

  //manda o payload passado para todos os players na sala
  sendInfoForAllPlayers(payload) {
    payload = JSON.stringify(payload);
    
    this.players.forEach(player => {
      try {
          player.header.socket.send(payload);
      } catch { };
    });
  };

  //grava a mensagem no chat
  recordMessageInChat(result, elapsedTime, messageOwnerNick) {
    if (this.chat.length >= 20) this.chat.shift();

    this.chat.push({
      "time": [elapsedTime.hours, elapsedTime.minutes, elapsedTime.seconds],
      "owner": result.owner,
      "ownerNick": messageOwnerNick,
      "content": result.content
    });
  };
};

module.exports = { Room }