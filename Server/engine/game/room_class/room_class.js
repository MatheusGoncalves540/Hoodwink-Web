const cardsData = require('../cardsDefaultData.json');
const {
  passTurnToNextPlayer,
  newTurn
} = require('./turnsControls');

const {
  BringGameInfos,
  recordMessageInChat,
  sendInfoForAllPlayers,
  elapsedTime
} = require('./processPlayerInformation');

const {
  selfDestructionByNoPlayers,
  addNewPlayerOnRoom
} = require('./addAndRemovePlayers')

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

    this.timeOut_deleteRoom;

    this.alreadyPlayed = false;
    this.turn = 0;
    this.currentTurnOwner;
    this.tax = 0;
    this.currentMove = {};
    
    this.playInTimeOut;
    this.moveFunction;
    this.playersWhoWantsToSkip = [];
    
    this.aliveDeck = [1,1,1,2,2,2,3,3,3,4,4,4,5,5,5,6,6,6,7,7,7,8,8,8,9,9,9,10,10,10,11,11,11,12,12,12]; 
    this.deadDeck = []; 

    this.players = [];
    this.spectators = []; //ideia futura, aqui serão guardados apenas o uuid do espectador, nada mais

    this.chat = [{ //estrutura de mensagem do chat
        time: [0, 0, 0],
        owner: "Servidor",
        ownerNick: "Servidor",
        content: "Sala criada!",
      },
    ];

    this.cards = cardsData;
  };

  addNewPlayerOnRoom(newPlayer) {
    addNewPlayerOnRoom(newPlayer, this)
  };
  
  //retorna os segundos, minutos e horas passadas desde o inicio da partida e o "startTime"
  elapsedTime() {
    return elapsedTime(this);
  };

  //manda o payload passado para todos os players na sala
  sendInfoForAllPlayers(payload) {
    sendInfoForAllPlayers(payload, this);
  };

  recordMessageInChat(message, elapsedTime, messageOwnerNick) {
    recordMessageInChat(message, elapsedTime, messageOwnerNick, this);
  };

  //manda para o socket passado, as informações necessárias para conectar e jogar
  BringGameInfos(socket) {
    BringGameInfos(socket, this);
  };

  newTurn() {
    newTurn(this);
  };

  passTurnToNextPlayer(moveOwner) {
    passTurnToNextPlayer(moveOwner, this);
  };

  //quando for executado, verifica se não há players, e depois do tempo faz a mesma verificação e exclui se não houver mais players
  selfDestructionByNoPlayers(rooms) {
    selfDestructionByNoPlayers(rooms, this);
  };

  // revalidateAllPlayersPossiblesMoves() {
  //   this.players.forEach(player => {
      
  //   });
  // }

};

module.exports = { Room };