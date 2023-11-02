function FirstReceipt(msg) {
    if ("roomName" in msg.content) {
        document.title = msg.content.roomName;
        if (gameData.turn === 0) window.alert("Compartilhe o link desta página com seus amigos. Ou envie à eles o id da sala!");
    };
    if("cards" in msg.content) {
        Object.keys(msg.content.cards).forEach(cardId => {
            document.getElementById(`card-${cardId}`).innerHTML = `${msg.content.cards[cardId].name}: <span id="card-${cardId}-price"></span>`
        });
    };
};

//

function updateTimer() {
    if (gameData.time.seconds < 10) {
        document.getElementById('seconds').innerHTML =  `0${gameData.time.seconds}`;
    } else {
        document.getElementById('seconds').innerHTML =  gameData.time.seconds;
    };
    if (gameData.time.minutes < 10) {
        document.getElementById('minutes').innerHTML =  `0${gameData.time.minutes}`;
    } else {
        document.getElementById('minutes').innerHTML = gameData.time.minutes;
    };
    if (gameData.time.hours < 10) {
        document.getElementById('hours').innerHTML =  `0${gameData.time.hours}`;
    } else {
        document.getElementById('hours').innerHTML = gameData.time.hours;
    };    
};

function identifyCardName(cardId) {
    if (cardId == null || cardId == "right" || cardId == "left") return "";
    if (cardId == -1) return "Carta morta";
    return gameData.cards[cardId].name
}

//atualiza todas as informações da tela com base no "gameData"
function updateScreenInfos(msg) {
    document.getElementById('room-code').innerHTML = gameData.turn !== 0 ? 'vez de: ' + gameData.currentTurnOwner : gameData.currentTurnOwner;
    document.getElementById('coin-amount').innerHTML = gameData.me.coins;
    document.getElementById('tax-amount').innerHTML = gameData.tax;
    document.getElementById('turns').innerHTML = gameData.turn;
    document.getElementById('invest-amount').innerHTML = gameData.me.invested.length;
    document.getElementById('atual-moment-text').innerHTML = generateCurrentTurnText();
    document.getElementById('card-left').innerHTML = identifyCardName(gameData.me.cardsInHand[0]); 
    document.getElementById('card-right').innerHTML = identifyCardName(gameData.me.cardsInHand[1]);
    document.getElementById('dead-deck-amount').innerHTML = gameData.deadDeck;
    document.getElementById('deck-amount').innerHTML = gameData.aliveDeck;
    updatePlayers(msg);
    document.getElementById('startGame-button').innerHTML = gameData.players[2].connected === false ? 'Aguardando players...' : 'Iniciar';

    if ("time" in msg.content) {
	    startTimer(msg.content.time.startTime);
    };
    if (gameData.turn !== 0 && !document.getElementById('startGame-button').classList.contains('hidden')) {
        document.getElementById('startGame-button').classList.add('hidden');
        document.getElementById('atual-moment-text').classList.remove('hidden');
    };

    updateCardsPrice();
    updateTimer();
    updateToggleButtons();
};

function updateCardsPrice() {
    Object.keys(gameData.cards).forEach(cardId => {
        if (cardId == 1 || cardId == 2) {
            document.getElementById(`card-${cardId}-price`).innerHTML = `${calculateCard1And2Prices(gameData.cards[`${cardId}`])}`;
            return
        };
        if ('price' in gameData.cards[`${cardId}`]) {
            document.getElementById(`card-${cardId}-price`).innerHTML = `${gameData.cards[`${cardId}`].price}`;
        }
        else if ('fixPrice' in gameData.cards[`${cardId}`]) {
            document.getElementById(`card-${cardId}-price`).innerHTML = `${gameData.cards[`${cardId}`].fixPrice}`;
        };
        if ('investPrice' in gameData.cards[`${cardId}`]) {
            document.getElementById(`card-${cardId}-price`).innerHTML = `${gameData.cards[`${cardId}`].investPrice}`;
        };
        if ('amountWithdrawn' in gameData.cards[`${cardId}`]) {
            document.getElementById(`card-${cardId}-price`).innerHTML = `${gameData.cards[`${cardId}`].amountWithdrawn}`;
        };
        if ('amountReceived' in gameData.cards[`${cardId}`]) {
            document.getElementById(`card-${cardId}-price`).innerHTML = `${gameData.cards[`${cardId}`].amountReceived}`;
        };
    });
};

function calculateCard1And2Prices(card) {
    return (card.fixPrice ** (card.doubled + 1));
};

function updatePlayers(msg) {
    Object.keys(gameData.players).forEach(playerNum => {
        if ('players' in msg.content) {
            if (playerNum in msg.content.players) {
                let player_cardsInHand;
                if (gameData.players[playerNum].playerCards[0] && gameData.players[playerNum].playerCards[1]) {
                    player_cardsInHand = "2 vivas";
                } else if (gameData.players[playerNum].playerCards[0]) {
                    player_cardsInHand = "apenas esquerda viva";
                } else if (gameData.players[playerNum].playerCards[1]) {
                    player_cardsInHand = "apenas direita viva";
                } else {
                    player_cardsInHand = "todas mortas";
                };

                document.getElementById(`player-${playerNum}`).innerHTML =
                `${gameData.players[playerNum].playerNum} - ${gameData.players[playerNum].nick}, cartas: ${player_cardsInHand}, moedas: ${gameData.players[playerNum].coins}
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
                    connected: false
                };
            };
        };
    });

    if (gameData.turn !== 0) {
        Object.keys(gameData.players).forEach(playerNum => {
            if (!gameData.players[playerNum].connected){
                document.getElementById(`player-${playerNum}`).classList.add('disconnectedPlayer');
                if (gameData.players[playerNum].nick !== "" && !document.getElementById(`player-${playerNum}`).textContent.includes(' - AFK')) {
                    document.getElementById(`player-${playerNum}`).innerHTML += ' - AFK';
                };
            };

            if (gameData.players[playerNum].connected) {
                document.getElementById(`player-${playerNum}`).classList.remove('disconnectedPlayer');
            };
        });
    };
};

//gera o texto da jogada atual, com base no que foi recebido do servidor
function generateCurrentTurnText() {
    switch (gameData.currentMove.moveType) {
        case "waitingFirstMove":
            if (gameData.me.nick == gameData.currentTurnOwner) return "aguardando sua jogada..."
            return `aguardando jogada de: ${gameData.currentTurnOwner}`
            
        case "takeCoin_basic":
            if (gameData.currentMove.amount > 1) return `${gameData.currentTurnOwner} pegou ${gameData.currentMove.amount} moedas`
            return `${gameData.currentTurnOwner} pegou ${gameData.currentMove.amount} moeda`

        case "pass_basic":
            return `${gameData.currentTurnOwner} passou a vez...`
            
        case "card_1": 
            return `${gameData.currentTurnOwner} quer utilizar o Político. As taxas serão aumentadas em 1.`

        case "card_2": 
            return `${gameData.currentTurnOwner} quer utilizar o Rebelde. As taxas serão diminuídas em 1.`

        case "card_2": 
            return `${gameData.currentTurnOwner} quer utilizar o Rebelde. As taxas serão diminuídas em 1.`

        default://TODO continuar a adicionar as jogadas

        break;
    };
};


//recupera as notas do localStorage
document.getElementById("notes").value = localStorage.getItem("notes");

//salva as notas a cada 10 segundos
setInterval(() => {
    localStorage.setItem("notes", document.getElementById("notes").value);
}, (10 * 1000));

//troca as abas de chat/notas
function switchToTab(tabId) {
    const tabToGo = document.getElementById(tabId);
    const tabs = document.querySelectorAll('.tab');

    tabs.forEach(tab => {
        if (tab !== tabToGo) {
            if (!tab.classList.contains('hidden')) {
                tab.classList.add('hidden');
            };
        } else {
            if (tabToGo.classList.contains('hidden')) {
                tab.classList.remove('hidden');
            };
        };        
    });
};

//adiciona a mensagem no chat
function addMessage(messageText) {
    const chatMessages = document.getElementById("chat-messages");
    const message = document.createElement("p");

    if (messageText.time) {
        const time = `[${messageText.time[0]}:${messageText.time[1]}:${messageText.time[2]}]`
        message.textContent = `${time} ${messageText.owner}: ${messageText.content}`;
    } else {
        message.textContent = `${messageText.owner}: ${messageText.content}`;
    };

    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Mantém a barra de rolagem na parte inferior
};

let timeRunning = false;
function startTimer(startTime) {
    if (!startTime) return;
    if (gameData.turn === 0) return;
    if (timeRunning === true) return;
	
    setInterval(() => {
        const secondsPassTotal = Math.floor((Date.now() - startTime) / 1000);
        const minutesPassTotal = Math.floor(secondsPassTotal / 60);
        const hoursPassTotal = Math.floor(minutesPassTotal / 60);

        gameData.time.seconds = secondsPassTotal - (minutesPassTotal * 60);
        gameData.time.minutes = minutesPassTotal - (hoursPassTotal * 60);
        gameData.time.hours = hoursPassTotal;

        updateTimer();
    }, 1000);
    timeRunning = true;
};

function errorOnLoadingScript() {
    window.location.replace(`${window.location.href}/LoadingError`);
};

