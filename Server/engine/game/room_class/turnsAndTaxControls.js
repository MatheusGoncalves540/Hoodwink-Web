const { nextBigger } = require('../../../lib/functions');
const { gameWinner } = require('../gameProtocols/gameOver');

function passTurnToNextPlayer(moveOwner, room) {
  room.moveFunction_counterPlay = undefined;
  room.moveFunction = undefined;

  let playersNumbers = [];
  room.players.forEach(player => {
    if (player.isAlive && player.header.socket !== null) playersNumbers.push(player.header.playerNum);
  });

  if (playersNumbers.length <= 1) return gameWinner(playersNumbers[0], room);

  const nextPlayer = nextBigger(playersNumbers, moveOwner.header.playerNum);
  room.currentTurnOwner = room.players.find(player => player.header.playerNum === nextPlayer);

  let sendData = () => {
    room.currentMove = {
      moveType: "waitingFirstMove",
      player: room.currentTurnOwner
    };
  
    const currentMove_clients = { ...room.currentMove };
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

  //caso o próximo a jogar, for o player com a menor posição, então é um novo turno
  if (nextPlayer === Math.min(...playersNumbers)) {
    room.newTurn().then(sendData);
  } else {
    sendData();
  } 
};

//

async function newTurn(room) {
  return new Promise(resolve => {
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
    randomTaxByNewTurn(room).then(() => {
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
      resolve();
    });  
  });
};

async function randomTaxByNewTurn(room) {
  return new Promise(resolve => {
    if (Math.random() <= 0.05) { //se cair nos 5% de chance
      if (Math.random() <= 0.50) { //aumentar ou diminuir
        //caso esteja no limite, faz o contrario
        if (room.tax <= -5) { 
          alertModifyTax(room, 'increased').then(() => {
            room.tax ++;
            resolve();
          });
        } else {
          alertModifyTax(room, 'decreased').then(() => {
            room.tax --;
            resolve();
          });
        };
      } else {
        if (room.tax >= 5) {
          alertModifyTax(room, 'decreased').then(() => {
            room.tax --;
            resolve();
          });
        } else {
          alertModifyTax(room, 'increased').then(() => {
            room.tax ++;
            resolve();
          });
        };
      };
    } else {
      resolve();
    };   
  });
};

async function alertModifyTax(room, modifier) {
  return new Promise(resolve => {
    room.currentMove = {
      moveType: `${modifier}Tax`
    };

    const payload = {
      type: "gameData",
      content: {
        currentMove: room.currentMove,
        moveTimer: room.header.displayTime
      }
    };

    room.sendInfoForAllPlayers(payload);

    setTimeout(() => {
      resolve();
    }, payload.content.moveTimer * 1000);
  });
};

module.exports = { newTurn, passTurnToNextPlayer, alertModifyTax };