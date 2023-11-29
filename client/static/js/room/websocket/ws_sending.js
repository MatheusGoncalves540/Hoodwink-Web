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
    (gameData.me.coins < (gameData.cards["1"].fixPrice ** (gameData.cards["1"].doubled + 1))) ||
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
    (gameData.me.coins < (gameData.cards["2"].fixPrice ** (gameData.cards["2"].doubled + 1))) ||
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

//envia a mensagem de chat para o servidor redistribui-lá
function sendMessage() {
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