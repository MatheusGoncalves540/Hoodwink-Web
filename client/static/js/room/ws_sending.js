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
  if (gameData.turn === 0) return;
  if (gameData.currentTurnOwner !== gameData.me.nick) return;
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

//não fazer nada
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