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
function takeCoin_basic(amount) {
  // gameData.me.coins = gameData.me.coins + amount;
  // document.getElementById('coin-amount').innerHTML = gameData.me.coins;
  const payload = {
    type: "playerMove",
    owner: playeruuid,
    content: {
      action: "takeCoin_basic",
      amount: amount
    }
  };
  
  ws.send(JSON.stringify(payload));
};

//ação básica de pegar 1 moeda
function pass_basic() {
  const payload = {
    type: "playerMove",
    owner: playeruuid,
    content: {
      action: "pass_basic"
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