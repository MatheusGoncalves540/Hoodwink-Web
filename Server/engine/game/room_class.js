const { Player } = require('./player_class');

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
  //parâmetros do player
  addPlayerOnRoom(newPlayer) {
    newPlayer['coins'] = this.header.startCoins < this.header.maxCoins ? this.header.startCoins : this.header.maxCoins;
    newPlayer['cards'] = 2;

    this.players.push(new Player(newPlayer, this));
  };

  //manda para o socket passado, as informações necessárias para conectar e jogar
  BringGameInfos(socket) {
    const connectedPlayer = this.players.find(player => player.header.playeruuid === socket.context.playeruuid);
    const time = this.elapsedTime();

    const payload = {
      type: "gameData",
      content: { //TODO enviar todas as informações necessárias para a construção da tela do jogo na tela do cliente
        roomName: this.header.roomName,
        turn: this.turn,
        time: time,
        tax: this.tax,
        me: {
            coins: connectedPlayer.coins,
            cardsInHand: ['left','right'],
            invested: connectedPlayer.invested,
            playerNum: connectedPlayer.header.playerNum
        },
      }
    };
    socket.send(JSON.stringify(payload));
  };

  //começa o jogo
  startGame() {
    if (this.turn !== 0) return;
    
    this.turn = 1;
    this.header.startTime = Date.now();
  };

  //TODO a ideia é quando o jogo começar, gravar o date.now() e sempre que alguém fizer algo que precise do horário, o servidor faz a conta de "elapsedTimeInSeconds = Math.floor((currentTime - this.startTime) / 1000);"
  //isso vai fazer com que o cliente saiba a quantos segundos começou aquela partida, e a partir dai, o timer fica apenas na parte do cliente.
  //assim, é possível manter um timer preciso, mas sem precisar ficar contando cada segundo no servidor, apenas grava o horário de inicio e quando alguém precisa dessa informação, o próprio cliente começa a contar.

 

  //retorna os segundos, minutos e horas passadas desde o inicio da partida
  elapsedTime() {
    if (this.turn !== 0) {
      const secondsPassTotal = Math.floor((Date.now() - this.header.startTime) / 1000);
      const minutesPassTotal = Math.floor(secondsPassTotal / 60);
      const hoursPassTotal = Math.floor(minutesPassTotal / 60);
      return {
        startTime: this.header.startTime,
        seconds: secondsPassTotal - (minutesPassTotal * 60),
        minutes: minutesPassTotal - (hoursPassTotal * 60),
        hours: hoursPassTotal
      };
    } else {
      return {
        startTime: undefined,
        seconds: 0,
        minutes: 0,
        hours: 0
      };
    };
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
  recordMessageInChat(message, elapsedTime, messageOwnerNick) {
    if (this.chat.length >= 20) this.chat.shift();

    this.chat.push({
      "time": [elapsedTime.hours, elapsedTime.minutes, elapsedTime.seconds],
      "owner": message.owner,
      "ownerNick": messageOwnerNick,
      "content": message.content
    });
  };
};

module.exports = { Room };