const { Player } = require('./player_class');
const msgServer = require('../../lib/languages/messages.json')['ptbr'];
const { nextBigger } = require('../../lib/functions');
const { getPlayerPublicInfos } = require('../../lib/functions');

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
      timeToThink: 10,
    };

    this.alreadyPlayed = false;
    this.turn = 0;
    this.currentTurnOwner = undefined;
    this.tax = 0;
    this.currentMove = "waiting to start";
    this.rebel = {
      doubled: 0, //se utilizado: +1 | //se "turnsUntilCheap" = 0: -1 e "turnsUntilCheap" = 3
      usedThisTurn: false, //quando ser usado: = true
      turnsUntilCheap: 3 //se passou um turno e não foi usado: -1
    };
    this.political = {
      doubled: 0, //se utilizado: +1 | //se "turnsUntilCheap" = 0: -1 e "turnsUntilCheap" = 3
      usedThisTurn: false, //quando ser usado = true
      turnsUntilCheap: 3 //se passou um turno e não foi usado: -1
    };

    this.aliveDeck = [1,1,1,2,2,2,3,3,3,4,4,4,5,5,5,6,6,6,7,7,7,8,8,8,9,9,9,10,10,10,11,11,11,12,12,12]; //nos decks, ficará o id de cada carta
    this.deadDeck = []; 

    this.players = [];
    this.spectators = [];
    this.chat = [
      { //estrutura de mensagem do chat
        time: [0, 0, 0],
        owner: "server",
        ownerNick: "server",
        content: "Sala criada!",
      },
    ];
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
        currentTurnOwner: this.currentTurnOwner !== undefined ? this.currentTurnOwner.header.nickname : this.currentTurnOwner,
        currentMove: this.currentMove,
        timesDoubledRebel: this.rebel.doubled,
        timesDoubledPolitical: this.political.doubled,
        aliveDeck: this.aliveDeck.length,
        deadDeck: this.deadDeck.length,

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
      if (player.isAlive) playersNumbers.push(player.header.playerNum);
    });

    const nextPlayer = nextBigger(playersNumbers, moveOwner.header.playerNum);
    this.currentTurnOwner = this.players.find(player => player.header.playerNum === nextPlayer);
    this.currentMove = `${msgServer.game.playerTurn}`+`${this.currentTurnOwner.header.nickname}`;

    //caso o próximo a jogar, for o player com a menor posição, então é um novo turno
    if (nextPlayer === Math.min(...playersNumbers)) this.newTurn();

    const payload = {
      type: "gameData",
      content: {
        turn: this.turn,
        currentMove: this.currentMove,
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

    //mecânica de preço do rebelde
    if (this.rebel.doubled > 0 && !this.rebel.usedThisTurn) {
      this.rebel.turnsUntilCheap --;

      if (this.rebel.turnsUntilCheap <= 0) {
        this.rebel.turnsUntilCheap = 3;
        this.rebel.doubled --;
      };
    };

    //mecânica de preço do politico
    if (this.political.doubled > 0 && !this.political.usedThisTurn) {
      this.political.turnsUntilCheap --;

      if (this.political.turnsUntilCheap <= 0) {
        this.political.turnsUntilCheap = 3;
        this.political.doubled --;
      };
    };

    //mecânica de aumento e diminuição aleatório das taxas
    if (Math.random() <= 0.05) { //se cair nos 5% de chance

      //50% de aumentar ou diminuir
      
      if (Math.random() <= 0.50) { 
        //caso esteja no limite, faz o contrario
        if (this.tax <= -5) { 
          this.tax ++;
        } else {
          this.tax --; //TODO verificar aqui pois acho que só estão aumentando as taxas
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
          timesDoubledRebel: this.rebel.doubled,
          timesDoubledPolitical: this.political.doubled
        }
    };
    this.sendInfoForAllPlayers(payload);
  };

};

module.exports = { Room };