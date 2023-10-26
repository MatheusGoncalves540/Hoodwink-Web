const { Player } = require('./player_class');
const { nextBigger } = require('../../lib/functions');
const { getPlayerPublicInfos } = require('../../lib/functions');
const { getPlayerNickFromCurrentMove } = require('../../lib/functions');
const cardsData = require('./cardsDefaultData.json');

class Room {
  constructor(idNewRoom, roomName, maxPlayer, roomPass) {
    this.header = {
      roomId: idNewRoom,
      roomName: roomName,
      maxPlayer: maxPlayer,
      roomPass: roomPass,
      startTime: undefined,
      startCoins: 8,
      maxCoins: 20,
      displayTime_withPossibleCounterPlays: 8,
      displayTime: 2
    };

    this.alreadyPlayed = false;
    this.turn = 0;
    this.currentTurnOwner = undefined;
    this.tax = 0;
    this.coinLimit = 20;
    this.currentMove = {};
    
    this.playInTimeOut = undefined;
    this.moveFunction = undefined;
    this.playersWhoWantsToSkip = [];
    
    this.aliveDeck = [1,1,1,2,2,2,3,3,3,4,4,4,5,5,5,6,6,6,7,7,7,8,8,8,9,9,9,10,10,10,11,11,11,12,12,12]; 
    this.deadDeck = []; 

    this.players = [];
    this.spectators = [];
    this.chat = [{ //estrutura de mensagem do chat
        time: [0, 0, 0],
        owner: "Servidor",
        ownerNick: "Servidor",
        content: "Sala criada!",
      },
    ];

    this.cards = cardsData;
  };

  //quando for executado, verifica se não há players, e depois do tempo faz a mesma verificação e exclui se não houver mais players
  selfDestructionByNoPlayers(rooms) {
    if (this.players.length <= 0) {
      const timeWithoutPlayers = 1800; //30 min

      setTimeout(() => {
        if (this.players.length <= 0) {
          delete rooms[this.header.roomId];
        };

      }, timeWithoutPlayers * 1000);
    };
  };

  //adiciona o novo player na sala
  //parâmetros do player
  addNewPlayerOnRoom(newPlayer) {
    newPlayer['coins'] = this.header.startCoins < this.header.maxCoins ? this.header.startCoins : this.header.maxCoins;
    this.players.push(new Player(newPlayer, this));
  };
  
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
        startTime: 0,
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
      } catch {};
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

  //manda para o socket passado, as informações necessárias para conectar e jogar
  BringGameInfos(socket) {
    const connectedPlayer = this.players.find(player => player.header.playeruuid === socket.context.playeruuid);
    const time = this.elapsedTime();

    const payload = {
      type: "gameData",
      content: {
        roomName: this.header.roomName,
        turn: this.turn,
        time: time,
        tax: this.tax,
        coinLimit: this.coinLimit,
        currentTurnOwner: this.currentTurnOwner !== undefined ? this.currentTurnOwner.header.nickname : this.currentTurnOwner,
        currentMove: this.currentMove,
        aliveDeck: this.aliveDeck.length,
        deadDeck: this.deadDeck.length,
        cards: this.cards,

        me: {
          coins: connectedPlayer.coins,
          cardsInHand: [connectedPlayer.cards[0],connectedPlayer.cards[1]],
          invested: connectedPlayer.invested,
          playerNum: connectedPlayer.header.playerNum
        },

        players: {}
      }
    };

    this.players.forEach(player => {
      payload.content.players[`${player.header.playerNum}`] = getPlayerPublicInfos(player);
  });

    socket.send(JSON.stringify(payload));
  };

  passTurnToNextPlayer(moveOwner) {
    const playersNumbers = [];
    this.players.forEach(player => {
      if (player.isAlive && player.header.socket !== null) playersNumbers.push(player.header.playerNum);
    });

    const nextPlayer = nextBigger(playersNumbers, moveOwner.header.playerNum);
    this.currentTurnOwner = this.players.find(player => player.header.playerNum === nextPlayer);

    this.currentMove = {
      moveType: "waitingFirstMove",
      player: this.currentTurnOwner
    };

    //caso o próximo a jogar, for o player com a menor posição, então é um novo turno
    if (nextPlayer === Math.min(...playersNumbers)) this.newTurn();

    const currentMove_clients = this.currentMove;
    currentMove_clients.player = getPlayerNickFromCurrentMove(currentMove_clients);

    const payload = {
      type: "gameData",
      content: {
        turn: this.turn,
        currentMove: currentMove_clients,
        currentTurnOwner: getPlayerPublicInfos(this.currentTurnOwner).nick,
        moveTimer: this.header.timeToThink,
      }
    };

    this.sendInfoForAllPlayers(payload);
    this.alreadyPlayed = false;
  };

  newTurn() {
    //troca o turno
    this.turn ++;

    //mecânica de preço do politico
    if (this.cards["1"].doubled > 0 && !this.cards["1"].usedThisTurn) {
      this.cards["1"].roundsUntilCheaper --;

      if (this.cards["1"].roundsUntilCheaper <= 0) {
        this.cards["1"].roundsUntilCheaper = 3;
        this.cards["1"].doubled --;
      };
    };
    if (this.cards["1"].usedThisTurn) this.cards["1"].usedThisTurn = false;

    //mecânica de preço do rebelde
    if (this.cards["2"].doubled > 0 && !this.cards["2"].usedThisTurn) {
      this.cards["2"].roundsUntilCheaper --;

      if (this.cards["2"].roundsUntilCheaper <= 0) {
        this.cards["2"].roundsUntilCheaper = 3;
        this.cards["2"].doubled --;
      };
    };
    if (this.cards["2"].usedThisTurn) this.cards["2"].usedThisTurn = false;

    //mecânica de aumento e diminuição aleatório das taxas
    if (Math.random() <= 0.05) { //se cair nos 10% de chance

      //50% de aumentar ou diminuir
      
      if (Math.random() <= 0.50) { 
        //caso esteja no limite, faz o contrario
        if (this.tax <= -5) { 
          this.tax ++;
        } else {
          this.tax --;
        };
      } else {
        if (this.tax >= 5) {
          this.tax --;
        } else {
          this.tax ++;
        };
      };
    };

    //envia as informações para o cliente
    const payload = {
      type: "gameData",
      content: {
        turn: this.turn,
        tax: this.tax,
        cards: {
          "1": this.cards["1"],
          "2": this.cards["2"]
        }
      }
    };
    this.sendInfoForAllPlayers(payload);
  };

  // revalidateAllPlayersPossiblesMoves() {
  //   this.players.forEach(player => {
      
  //   });
  // }

};

module.exports = { Room };