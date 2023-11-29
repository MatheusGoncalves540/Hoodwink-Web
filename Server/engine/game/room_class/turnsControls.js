const { nextBigger } = require('../../../lib/functions');

function passTurnToNextPlayer(moveOwner, room) {
    const playersNumbers = [];
    room.players.forEach(player => {
      if (player.isAlive && player.header.socket !== null) playersNumbers.push(player.header.playerNum);
    });

    const nextPlayer = nextBigger(playersNumbers, moveOwner.header.playerNum);
    room.currentTurnOwner = room.players.find(player => player.header.playerNum === nextPlayer);

    room.currentMove = {
      moveType: "waitingFirstMove",
      player: room.currentTurnOwner
    };

    //caso o próximo a jogar, for o player com a menor posição, então é um novo turno
    if (nextPlayer === Math.min(...playersNumbers)) room.newTurn();

    const currentMove_clients = JSON.parse(JSON.stringify(room.currentMove));
    currentMove_clients.player = currentMove_clients.player.header.nickname;

    const payload = {
      type: "gameData",
      content: {
        turn: room.turn,
        currentMove: currentMove_clients,
        currentTurnOwner: room.currentTurnOwner.getPublicInfos().nick,
        moveTimer: room.header.timeToThink,
      }
    };

    room.sendInfoForAllPlayers(payload);
    room.alreadyPlayed = false;
};

//

function newTurn(room) {
    //troca o turno
    room.turn ++;

    //mecânica de preço do politico
    if (room.cards["1"].doubled > 0 && !room.cards["1"].usedThisTurn) {
      room.cards["1"].roundsUntilCheaper --;

      if (room.cards["1"].roundsUntilCheaper <= 0) {
        room.cards["1"].roundsUntilCheaper = 3;
        room.cards["1"].doubled --;
      };
    };
    if (room.cards["1"].usedThisTurn) room.cards["1"].usedThisTurn = false;

    //mecânica de preço do rebelde
    if (room.cards["2"].doubled > 0 && !room.cards["2"].usedThisTurn) {
      room.cards["2"].roundsUntilCheaper --;

      if (room.cards["2"].roundsUntilCheaper <= 0) {
        room.cards["2"].roundsUntilCheaper = 3;
        room.cards["2"].doubled --;
      };
    };
    if (room.cards["2"].usedThisTurn) room.cards["2"].usedThisTurn = false;

    //mecânica de aumento e diminuição aleatório das taxas
    if (Math.random() <= 0.05) { //se cair nos 10% de chance

      //50% de aumentar ou diminuir
      
      if (Math.random() <= 0.50) { 
        //caso esteja no limite, faz o contrario
        if (room.tax <= -5) { 
          room.tax ++;
        } else {
          room.tax --;
        };
      } else {
        if (room.tax >= 5) {
          room.tax --;
        } else {
          room.tax ++;
        };
      };
    };

    //envia as informações para o cliente
    const payload = {
      type: "gameData",
      content: {
        turn: room.turn,
        tax: room.tax,
        cards: {
          "1": room.cards["1"],
          "2": room.cards["2"]
        }
      }
    };
    room.sendInfoForAllPlayers(payload);
};

module.exports = { newTurn, passTurnToNextPlayer };