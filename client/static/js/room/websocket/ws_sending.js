//começar o jogo
function startGame() {
  document.getElementById('startGame-button').classList.add('hidden');
  document.getElementById('atual-moment-text').classList.remove('hidden');
  const payload = {
    type: "playerMove",
    owner: playeruuid,
    content: {
      action: "startGame"
    }
  };
  ws.send(JSON.stringify(payload));
};

//ação básica de pegar moeda
function takeCoin_basic() {
  if (gameData.turn === 0) return;
  if (gameData.currentTurnOwner !== gameData.me.nick) return;
  if (gameData.me.coins >= gameData.maxCoins) return;
  const payload = {
    type: "playerMove",
    owner: playeruuid,
    content: {
      action: "takeCoin_basic",
    }
  };
  
  ws.send(JSON.stringify(payload));
};

//não fazer nada
function pass_basic() {
  if (gameData.turn === 0) return;
  if (gameData.currentTurnOwner !== gameData.me.nick || gameData.currentMove.moveType !== "waitingFirstMove") return pass();
  const payload = {
    type: "playerMove",
    owner: playeruuid,
    content: {
      action: "pass_basic"
    }
  };
  
  ws.send(JSON.stringify(payload));
};

function pass() {
  if (
    (gameData.turn === 0) ||
    (gameData.currentTurnOwner === gameData.me.nick && gameData.currentMove.moveType === "waitingFirstMove"))
  return pass_basic();

  const payload = {
    type: "playerMove",
    owner: playeruuid,
    content: {
      action: "pass"
    }
  };
  document.querySelectorAll('.disabeable').forEach((button) => {
    button.disabled = true;
  });
  ws.send(JSON.stringify(payload));
};

//TODO ação de contestação
function dispute() {
  if (
    (gameData.turn == 0) ||
    (gameData.currentMove.player === gameData.me.nick) ||
    (!gameData.currentMove.moveType.includes("card_")))
  return;

  const payload = {
    type: "playerMove",
    owner: playeruuid,
    content: {
      action: "dispute"
    }
  };
  document.querySelectorAll('.disabeable').forEach((button) => {
    button.disabled = true;
  });
    
  ws.send(JSON.stringify(payload));
};

//usar a carta 1
function card_1() {
  if (
    (gameData.turn === 0) ||
    (gameData.currentTurnOwner !== gameData.me.nick) ||
    (gameData.me.coins < calculatePriceCardsPlusTax(gameData.cards["1"])) ||
    (gameData.tax > 5))
  return;

  const payload = {
    type: "playerMove",
    owner: playeruuid,
    content: {
      action: "card_1"
    }
  };
  
  ws.send(JSON.stringify(payload));
};

//usar a carta 2
function card_2() {
  if (
    (gameData.turn === 0) ||
    (gameData.currentTurnOwner !== gameData.me.nick) ||
    (gameData.me.coins < calculatePriceCardsPlusTax(gameData.cards["2"])) ||
    (gameData.tax < -5))
  return;

  const payload = {
    type: "playerMove",
    owner: playeruuid,
    content: {
      action: "card_2"
    }
  };
  
  ws.send(JSON.stringify(payload));
};

//usar a carta 3
async function card_3() {
  if (
    (gameData.turn === 0) ||
    (gameData.currentTurnOwner !== gameData.me.nick) ||
    (gameData.me.coins < calculatePriceCardsPlusTax(gameData.cards["3"])))
  return;

  let alivePlayers = Object.values(gameData.players)
  .filter(player => player.isAlive === true && player.nick !== gameData.me.nick)
  .map(player => player.nick);

  let attackedPlayerIndex = await selectPopup(alivePlayers);
  const attackedPlayer = Object.values(gameData.players).find(player => player.nick === alivePlayers[attackedPlayerIndex]);

  const cardsRemaining = [];
  if (attackedPlayer.playerCards[0] === true) cardsRemaining.push('esquerda');
  if (attackedPlayer.playerCards[1] === true) cardsRemaining.push('direita');

  document.getElementsByClassName("popup")[0].remove();
  let selectedCard = 0;
  if (cardsRemaining.length != 1) selectedCard = await selectPopup(cardsRemaining);

  let card = 0;
  if (cardsRemaining[selectedCard] == 'direita') card = 1;

  const payload = {
    type: "playerMove",
    owner: gameData.me.playeruuid,
    content: {
      action: "card_3",
      attackedPlayer: attackedPlayer.nick,
      card: card
    }
  };
  
  ws.send(JSON.stringify(payload));
  document.getElementsByClassName("popup")[0].remove();
};

//usar a carta 4
function card_4() {
  if (
    (gameData.turn === 0) ||
    (gameData.currentTurnOwner !== gameData.me.nick) ||
    (gameData.me.coins + gameData.cards['4'].amountReceived > gameData.maxCoins)) 
  return;

  const payload = {
    type: "playerMove",
    owner: playeruuid,
    content: {
      action: "card_4"
    }
  };
  
  ws.send(JSON.stringify(payload));
};

//envia a mensagem de chat para o servidor redistribui-lá
function sendMessage() {
  if (!gameData.me.isAlive) return;
  const messageInput = document.getElementById("input-chat");
  const messageText = messageInput.value;
  
  if (messageText.trim() !== "" && messageText.length < 51) {
    ws.send(JSON.stringify({
      "type":"msg_chat",
      "content":messageText,
      "owner":playeruuid
    }));
    messageInput.value = ""; // Limpa a caixa de texto após enviar
  };
};

// Envia a carta escolhida para o servidor
function sendResultOfDisputeCard(attackedPlayer, card_index) {
  const payload = {
    type: "playerMove",
    owner: playeruuid,
    content: {
      action: gameData.currentMove.moveType,
      attackedPlayer: attackedPlayer, 
      card: card_index
    }
  };
  
  ws.send(JSON.stringify(payload));
  document.getElementsByClassName("popup")[0].remove();
}