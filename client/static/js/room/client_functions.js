function FirstReceipt(msg) {
    if (msg.content.roomName) {
        document.title = msg.content.roomName;
        if (gameData.turn === 0) window.alert("Compartilhe o link desta página com seus amigos. Ou envie à eles o id da sala!");
    };
    if (msg.content.time) {
	    startTimer(msg.content.time.startTime);
    };
    if (gameData.turn !== 0 && !document.getElementById('startGame-button').classList.contains('hidden')) {
        document.getElementById('startGame-button').classList.add('hidden');
        document.getElementById('atual-moment-text').classList.remove('hidden');
    };
};

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

//atualiza todas as informações da tela com base no "gameData"
function updateScreenInfos(msg) {
    document.getElementById('room-code').innerHTML = gameData.turn !== 0 ? 'vez de: ' + gameData.currentTurnOwner : gameData.currentTurnOwner;
    document.getElementById('coin-amount').innerHTML = gameData.me.coins;
    document.getElementById('tax-amount').innerHTML = gameData.tax;
    document.getElementById('turns').innerHTML = gameData.turn;
    document.getElementById('invest-amount').innerHTML = gameData.me.invested.length;
    document.getElementById('atual-moment-text').innerHTML = generateCurrentTurnText();
    document.getElementById('card-left').innerHTML = gameData.me.cardsInHand[0];
    document.getElementById('card-right').innerHTML = gameData.me.cardsInHand[1];
    document.getElementById('dead-deck-amount').innerHTML = gameData.deadDeck;
    document.getElementById('deck-amount').innerHTML = gameData.aliveDeck;
    updateConnectedPlayers(msg);
    document.getElementById('startGame-button').innerHTML = gameData.players[2].connected === false ? 'Aguardando players...' : 'Iniciar';

    updateTimer();
    updateToggleButtons();
};

function updateConnectedPlayers(msg) {
    Object.keys(gameData.players).forEach(playerNum => {
        if ('players' in msg.content) {
            if (playerNum in msg.content.players) {
            document.getElementById(`player-${playerNum}`).innerHTML =
            `${gameData.players[playerNum].playerNum} - ${gameData.players[playerNum].nick}, cartas: ${gameData.players[playerNum].num_cards}, moedas: ${gameData.players[playerNum].coins}
            investido: ${gameData.players[playerNum].invested.length}`;

            } else if (gameData.turn === 0) {
                document.getElementById(`player-${playerNum}`).innerHTML = "";
                gameData.players[playerNum] = {
                    nick: "",
                    playerNum: playerNum,
                    num_cards: null,
                    coins: null,
                    invested: [],
                    usedCards: {},
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
            
        case "": //TODO continuar a adicionar as jogadas
            return ``

        default:

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
	const agora = (Date.now()); 
        const secondsPassTotal = Math.floor((agora - startTime) / 1000);
        const minutesPassTotal = Math.floor(secondsPassTotal / 60);
        const hoursPassTotal = Math.floor(minutesPassTotal / 60);

        gameData.time.seconds = secondsPassTotal - (minutesPassTotal * 60);
        gameData.time.minutes = minutesPassTotal - (hoursPassTotal * 60);
        gameData.time.hours = hoursPassTotal;

        updateTimer();
    }, 1000);
    timeRunning = true;
};

//redireciona para a página de erro, caso algum script não for executado corretamente
function errorOnLoadingScript() {
    window.location.replace(`${window.location.href}/LoadingError`);
};