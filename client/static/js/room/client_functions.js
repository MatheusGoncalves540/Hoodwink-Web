//atualiza todas as informações da tela com base no "gameData"
function updateScreenInfos(msg) {
  localVariables.readyToSelect_aPlayer = false;
  localVariables.readyToSelect_aCard = false;
  if ("time" in msg.content) {
    startTimer(msg.content.time.startTime);
  };
  if (
    gameData.turn !== 0 &&
    (!document.getElementById("startGame-button").classList.contains("hidden") ||
     document.getElementById("bar-div").classList.contains("hidden"))
  ) {
    document.getElementById("startGame-button").classList.add("hidden");
    document.getElementById("atual-moment-text").classList.remove("hidden");
    document.getElementById("bar-div").classList.remove("hidden");
  };
  document.getElementById("room-code").innerHTML =
    gameData.turn !== 0
      ? "vez de: " + gameData.currentTurnOwner
      : gameData.currentTurnOwner;
  document.getElementById("coin-amount").innerHTML = gameData.me.coins;
  document.getElementById("tax-amount").innerHTML = gameData.tax;
  document.getElementById("turns").innerHTML = gameData.turn;
  document.getElementById("invest-amount").innerHTML =
    gameData.me.invested.length;
  document.getElementById("atual-moment-text").innerHTML =
    generateCurrentTurnText();
  document.getElementById("card-left").innerHTML = identifyCardName(
    gameData.me.cardsInHand[0]
  );
  document.getElementById("card-right").innerHTML = identifyCardName(
    gameData.me.cardsInHand[1]
  );
  document.getElementById("dead-deck-amount").innerHTML = gameData.deadDeck;
  document.getElementById("deck-amount").innerHTML = gameData.aliveDeck;
  updatePlayers(msg);
  document.getElementById("startGame-button").innerHTML =
    gameData.players[2].connected === false
      ? "Aguardando players..."
      : "Iniciar";

  
  disputeSituationsProtocols();
  updateCardsPrice();
  updateTimer();
  updateToggleButtons();
  VerifyGameOver();

  if ("moveTimer" in msg.content) {
    decrementMoveTimer();
  } else {
    gameData.moveTimer = 0;
    decrementMoveTimer();
  };
};

//função que verifica se teve um ganhador
function VerifyGameOver() {
  if (gameData.currentMove.moveType === "gameWinner") {
    winnerPopup(gameData.currentMove.player);
  };
};

//função do primeiro recebimento de informações
function FirstReceipt(msg) {
  if ("roomName" in msg.content) {
    document.title = msg.content.roomName;
    if (gameData.turn === 0)
      window.alert(
        "Compartilhe o link desta página com seus amigos. Ou envie à eles o id da sala!"
      );
  };
  if ("cards" in msg.content) {
    Object.keys(msg.content.cards).forEach((cardId) => {
      document.getElementById(
        `card-${cardId}`
      ).innerHTML = `${msg.content.cards[cardId].name}: <span id="card-${cardId}-price"></span>`;
    });
  };
};

//

async function disputeSituationsProtocols() {
  if (gameData.currentMove.moveType === "dispute_doesNotHasTheCard" && gameData.currentMove.player === gameData.me.nick) {
    const disputedPlayer = Object.values(gameData.players).find(player => player.nick === gameData.currentMove.disputedPlayer);
    const cardsRemaining = [];
    if (disputedPlayer.playerCards[0] === true) cardsRemaining.push('esquerda');
    if (disputedPlayer.playerCards[1] === true) cardsRemaining.push('direita');

    let selectedCard = 0;
    if (cardsRemaining.length != 1) selectedCard = await selectPopup(cardsRemaining);

    cardsRemaining[selectedCard] == 'direita' ? sendResultOfDisputeCard(disputedPlayer.nick, 1) : sendResultOfDisputeCard(disputedPlayer.nick, 0);
  };

  if (gameData.currentMove.moveType === "dispute_hasTheCard" && gameData.currentMove.disputedPlayer === gameData.me.nick) {
    const playerWhoDisputed = Object.values(gameData.players).find(player => player.nick === gameData.currentMove.player);
    const cardsRemaining = [];
    if (playerWhoDisputed.playerCards[0] === true) cardsRemaining.push('esquerda');
    if (playerWhoDisputed.playerCards[1] === true) cardsRemaining.push('direita');
    
    let selectedCard = 0;
    if (cardsRemaining.length != 1) selectedCard = await selectPopup(cardsRemaining);

    cardsRemaining[selectedCard] == 'direita' ? sendResultOfDisputeCard(playerWhoDisputed.nick, 1) : sendResultOfDisputeCard(playerWhoDisputed.nick, 0);
  };
};

// Função pra abrir um popup pro jogador selecionar
async function selectPopup(options) {
  return new Promise(resolve => {
      const fatherDiv = document.createElement("div");
      fatherDiv.classList.add("popup");
    
      for (let i = 0; i < options.length; i++) {
    
        let div = document.createElement("div");
        div.id = i;
        div.innerHTML = options[i];
    
        div.addEventListener("click", () => {
          resolve(parseInt(div.id));
        });

        fatherDiv.appendChild(div);
      }
      document.body.appendChild(fatherDiv);
  });
};

// Função pra exibir o jogador vencedor e dois botões
function winnerPopup(winner, winnerText = "É o vencedor!") {
  if (document.getElementsByClassName('winnerPopup')[0]) return; //Se já existir um "winnerPopup", então não continue

  // Criando a Main Box pra comportar os elementos
  const mainBox = document.createElement("div");
  mainBox.classList.add("winnerPopup");

  // Criando a infoBox
  const infoBox = document.createElement("div");
  infoBox.classList.add("infoBox");

  // Informações do player
  const playerInfos = document.createElement("div");
  playerInfos.classList.add("playerInfos");
  const PlayerName = document.createElement("h1");
  PlayerName.innerText = winner;
  const winnerTxt = document.createElement("h2");
  winnerTxt.innerText = winnerText;
  playerInfos.appendChild(PlayerName);
  playerInfos.appendChild(winnerTxt);

  // Botões de jogar novamente e Kitar
  const buttonBox = document.createElement("div");
  buttonBox.classList.add("buttonBox");
  let options = ["Jogar Novamente", "Desconectar"];

  for (let i = 0; i < options.length; i++) {
    let button = document.createElement("button");
    button.innerText = options[i];
    if (i == 0) {
      button.addEventListener("click", () => {
        replayButton()
      });
    } else {
      button.addEventListener("click", () => {
        window.location.replace(window.location.href.split('/room/')[0]);
      });
    }
    buttonBox.appendChild(button);
  }

  // Finalizando a box
  infoBox.appendChild(playerInfos);
  infoBox.appendChild(buttonBox);
  mainBox.appendChild(infoBox);
  document.body.appendChild(mainBox);
}

//

function replayButton() {
  axios.post(`/room/${idRoom}/restarting-room`, {
  });
}

//

function findPlayerNumPerNick(searchNick) {
  for (const key in players) {
    if (players[key].nick === searchNick) {
      return parseInt(key);
    }
  }
  return null;
}
//

function updateTimer() {
  if (gameData.time.seconds < 10) {
    document.getElementById("seconds").innerHTML = `0${gameData.time.seconds}`;
  } else {
    document.getElementById("seconds").innerHTML = gameData.time.seconds;
  }
  if (gameData.time.minutes < 10) {
    document.getElementById("minutes").innerHTML = `0${gameData.time.minutes}`;
  } else {
    document.getElementById("minutes").innerHTML = gameData.time.minutes;
  }
  if (gameData.time.hours < 10) {
    document.getElementById("hours").innerHTML = `0${gameData.time.hours}`;
  } else {
    document.getElementById("hours").innerHTML = gameData.time.hours;
  }
}

function identifyCardName(cardId) {
  if (cardId == null || cardId == "right" || cardId == "left") return "";
  if (cardId == -1) return "Carta morta";
  return gameData.cards[cardId].name;
}

function updateCardsPrice() {
  Object.keys(gameData.cards).forEach((cardId) => {
    const cardPrice = calculatePriceCardsPlusTax(gameData.cards[`${cardId}`]);
    if (cardPrice != undefined)
      document.getElementById(`card-${cardId}-price`).innerHTML = cardPrice;
  });
}

function calculatePriceCardsPlusTax(card) {
  let estimatedPrice;

  if ("amountReceived" in card) {
    estimatedPrice = card.amountReceived + gameData.tax;
  } else if ("amountWithdrawn" in card) {
    estimatedPrice = card.amountWithdrawn + gameData.tax;
  } else if ("investedMaxAmount" in card) {
    estimatedPrice = card.investedMaxAmount + gameData.tax;
  } else if ("price" in card) {
    estimatedPrice = card.price + gameData.tax;
  }

  if (gameData.tax < 0 && "taxMinimum" in card) {
    if (estimatedPrice < card.taxMinimum) {
      return card.taxMinimum;
    } else {
      return estimatedPrice;
    }
  }
  if (gameData.tax > 0 && "taxMax" in card) {
    if (estimatedPrice > card.taxMax) {
      return card.taxMax;
    } else {
      return estimatedPrice;
    }
  }

  if ("doubled" in card) {
    return card.fixPrice ** (card.doubled + 1);
  }

  return estimatedPrice;
}

function updatePlayers(msg) {
  Object.keys(gameData.players).forEach((playerNum) => {
    if ("players" in msg.content) {
      if (playerNum in msg.content.players) {
        let player_cardsInHand;
        if (
          gameData.players[playerNum].playerCards[0] &&
          gameData.players[playerNum].playerCards[1]
        ) {
          player_cardsInHand = "2 vivas";
        } else if (gameData.players[playerNum].playerCards[0]) {
          player_cardsInHand = "apenas esquerda viva";
        } else if (gameData.players[playerNum].playerCards[1]) {
          player_cardsInHand = "apenas direita viva";
        } else {
          player_cardsInHand = "todas mortas";
        }

        document.getElementById(
          `player-${playerNum}`
        ).innerHTML = `${gameData.players[playerNum].playerNum} - ${gameData.players[playerNum].nick}, cartas: ${player_cardsInHand}, moedas: ${gameData.players[playerNum].coins}
                investido: ${gameData.players[playerNum].invested.length}`;
        //TODO tratar das cartas dos players, pois estão aparecendo como: true, true. e quero que apareça como tendo a carta esquerda e direita
      } else if (gameData.turn === 0) {
        document.getElementById(`player-${playerNum}`).innerHTML = "";
        gameData.players[playerNum] = {
          nick: "",
          playerNum: playerNum,
          playerCards: [],
          coins: null,
          invested: [],
          usedCards: {},
          isAlive: false,
          connected: false,
        };
      }
    }
  });

  if (gameData.turn !== 0) {
    Object.keys(gameData.players).forEach((playerNum) => {
      if (!gameData.players[playerNum].connected) {
        document
          .getElementById(`player-${playerNum}`)
          .classList.add("disconnectedPlayer");
        if (
          gameData.players[playerNum].nick !== "" &&
          !document
            .getElementById(`player-${playerNum}`)
            .textContent.includes(" - AFK")
        ) {
          document.getElementById(`player-${playerNum}`).innerHTML += " - AFK";
        }
      }

      if (gameData.players[playerNum].connected) {
        document
          .getElementById(`player-${playerNum}`)
          .classList.remove("disconnectedPlayer");
      }
    });
  }
}

//

//gera o texto da jogada atual, com base no que foi recebido do servidor
function generateCurrentTurnText() {
  let choosedCard;
  switch (gameData.currentMove.moveType) {
    case "waitingFirstMove":
      if (gameData.me.nick == gameData.currentTurnOwner) return "aguardando sua jogada...";
      return `aguardando jogada de: ${gameData.currentTurnOwner}`;
        
    case "increasedTax":
      return `As taxas foram aumentadas!`;
        
    case "gameWinner":
      return `${gameData.currentMove.player} é o vencedor!`;
        
    case "decreasedTax":
      return `As taxas foram diminuídas!`;
        
    case "takeCoin_basic":
      return `${gameData.currentMove.player} pegou 1 moeda`;

    case "pass_basic":
      return `${gameData.currentMove.player} passou a vez...`;

    case "dispute":
      return `${gameData.currentMove.player} contestou o(a) ${gameData.cards[gameData.currentMove.disputedCard].name} de ${gameData.currentMove.disputedPlayer}`; //TODO terminar a função de contestação
    
    case "dispute_doesNotHasTheCard": //TODO
      return `${gameData.currentMove.disputedPlayer} NÃO tinha a carta. Aguardando ${gameData.currentMove.player} matar um carta de ${gameData.currentMove.disputedPlayer}.`;

    case "dispute_hasTheCard": //TODO
      return `${gameData.currentMove.disputedPlayer} TINHA a carta. Aguardando ${gameData.currentMove.disputedPlayer} matar um carta de ${gameData.currentMove.player}.`;

    case "responseToDoesNotHasTheCard":
      choosedCard = gameData.currentMove.card === 0 ? "esquerda" : "direita"; 
      return `${gameData.currentMove.player} escolheu a carta da ${choosedCard} de ${gameData.currentMove.disputedPlayer}. Será um Kamikaze?...`;

    case "responseToHasTheCard":
      choosedCard = gameData.currentMove.card === 0 ? "esquerda" : "direita"; 
      return `${gameData.currentMove.player} escolheu a carta da ${choosedCard} de ${gameData.currentMove.playerWhoDisputed}. Será um Kamikaze?...`;

    case "deadPlayer":
      return `${gameData.currentMove.player} foi eliminado!`;

    case "card_1": 
      return `${gameData.currentMove.player} quer utilizar o Político. As taxas serão aumentadas em 1.`;

    case "card_2": 
      return `${gameData.currentMove.player} quer utilizar o Rebelde. As taxas serão diminuídas em 1.`;

    case "card_3": 
      choosedCard = gameData.currentMove.card === 0 ? "esquerda" : "direita"; 
      return `${gameData.currentMove.player} quer utilizar o Assassino para matar a carta da ${choosedCard} de ${gameData.currentMove.attackedPlayer}`;
    
    case "responseToCard_3": 
      choosedCard = gameData.currentMove.card === 0 ? "esquerda" : "direita"; 
      return `${gameData.currentMove.player} matou a carta da ${choosedCard} de ${gameData.currentMove.attackedPlayer}. Será um Kamikaze?...`;

    case "card_4": 
      return `${gameData.currentMove.player} quer utilizar o Trilionário para receber ${calculatePriceCardsPlusTax(gameData.cards['4'])} moedas.`;
    
    default:
      break;
  };
};

//recupera as notas do localStorage
document.getElementById("notes").value = localStorage.getItem("notes");

//salva as notas a cada 10 segundos
setInterval(() => {
  localStorage.setItem("notes", document.getElementById("notes").value);
}, 10 * 1000);

//troca as abas de chat/notas
function switchToTab(tabId) {
  const tabToGo = document.getElementById(tabId);
  const tabs = document.querySelectorAll(".tab");

  tabs.forEach((tab) => {
    if (tab !== tabToGo) {
      if (!tab.classList.contains("hidden")) {
        tab.classList.add("hidden");
      }
    } else {
      if (tabToGo.classList.contains("hidden")) {
        tab.classList.remove("hidden");
      }
    }
  });
}

//adiciona a mensagem no chat
function addMessage(messageText) {
  const chatMessages = document.getElementById("chat-messages");
  const message = document.createElement("p");

  if (messageText.time) {
    const time = `[${messageText.time[0]}:${messageText.time[1]}:${messageText.time[2]}]`;
    message.textContent = `${time} ${messageText.owner}: ${messageText.content}`;
  } else {
    message.textContent = `${messageText.owner}: ${messageText.content}`;
  }

  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight; // Mantém a barra de rolagem na parte inferior
}

//timer
let timeRunning = false;
function startTimer(startTime) {
  if (!startTime) return;
  if (gameData.turn === 0) return;
  if (timeRunning === true) return;

  setInterval(() => {
    const secondsPassTotal = Math.floor((Date.now() - startTime) / 1000);
    const minutesPassTotal = Math.floor(secondsPassTotal / 60);
    const hoursPassTotal = Math.floor(minutesPassTotal / 60);

    gameData.time.seconds = secondsPassTotal - minutesPassTotal * 60;
    gameData.time.minutes = minutesPassTotal - hoursPassTotal * 60;
    gameData.time.hours = hoursPassTotal;

    updateTimer();
  }, 1000);
  timeRunning = true;
}

function errorOnLoadingScript() {
  window.location.replace(`${window.location.href}/LoadingError`);
}
