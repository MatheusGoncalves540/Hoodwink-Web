const {
  passTurnToNextPlayer,
  newTurn,
  alertModifyTax
} = require('./turnsAndTaxControls');

const {
  BringGameInfos,
  recordMessageInChat,
  sendInfoForAllPlayers,
  elapsedTime
} = require('./processPlayerInformation');

const {
  selfDestructionByNoPlayers,
  addNewPlayerOnRoom
} = require('./addAndRemovePlayers');

const { 
  defaultChat
} = require('./defaultRoomConfig');

class Room {
  constructor(header, chat = defaultChat()) {
    this.header = header;

    this.timeOut_deleteRoom;
    this.gameOver = false,

    this.alreadyPlayed = false;
    this.turn = 0;
    this.currentTurnOwner;
    this.tax = 0;
    this.currentMove = {};
    
    this.playInTimeOut;
    this.moveFunction;

    this.playInTimeOut_counterPlay;
    this.moveFunction_counterPlay;

    this.playersWhoWantsToSkip = [];
    
    this.aliveDeck = [1,1,1,2,2,2,3,3,3,4,4,4,5,5,5,6,6,6,7,7,7,8,8,8,9,9,9,10,10,10,11,11,11,12,12,12]; 
    this.deadDeck = []; 

    this.players = [];
    this.spectators = []; //ideia futura, aqui serão guardados apenas o uuid do espectador, nada mais

    this.chat = chat;
  

    //é necessário aqui usar o JSON.parse(JSON.stringify()), para criar uma cópia das normas padrões das cartas, sempre que uma nova sala for criada
    this.cards = JSON.parse(JSON.stringify(require('../cardsDefaultData.json')));
  };

  restart() {
    restartRoom(this);
  }

  addNewPlayerOnRoom(newPlayer) {
    addNewPlayerOnRoom(newPlayer, this);
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

  async newTurn() {
    return new Promise(resolve => {
      newTurn(this).then(() => {
        resolve()
      });
    });
  };

  //é chamada para avisar os jogadores quando as taxas forem alteradas 
  async alertModifyTax(modifier) {
    return new Promise(resolve => {
      alertModifyTax(this, modifier).then(() => {
        resolve();
      });
    })
  };

  passTurnToNextPlayer(moveOwner) {
    passTurnToNextPlayer(moveOwner, this);
  };

  //quando for executado, verifica se não há players, e depois do tempo faz a mesma verificação e exclui se não houver mais players
  selfDestructionByNoPlayers(rooms) {
    selfDestructionByNoPlayers(rooms, this);
  };

  calculateCardPrice(card) {
    let estimatedPrice;

    if ("amountReceived" in card) {
      estimatedPrice = card.amountReceived + this.tax;
    } else if ("amountWithdrawn" in card) {
      estimatedPrice = card.amountWithdrawn + this.tax;
    } else if ("investedMaxAmount" in card) {
      estimatedPrice = card.investedMaxAmount + this.tax;
    } else if ("price" in card) {
      estimatedPrice = card.price + this.tax;
    };

    if (this.tax < 0 && "taxMinimum" in card) {
      if (estimatedPrice < card.taxMinimum) {
        return card.taxMinimum;
      } else {
        return estimatedPrice;
      };
    };

    if (this.tax > 0 && "taxMax" in card) {
      if (estimatedPrice > card.taxMax) {
        return card.taxMax;
      } else {
        return estimatedPrice;
      };
    };

    if ("doubled" in card) {
      return card.fixPrice ** (card.doubled + 1);
    };

    return estimatedPrice;
    };
};

module.exports = { Room };