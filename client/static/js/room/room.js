function addCoin(amount) {
    gameData.me.coins = gameData.me.coins + amount;
    document.getElementById('coin-amount').innerHTML = gameData.me.coins;
};

function updateScreenInfos() {
    document.getElementById('coin-amount').innerHTML = gameData.me.coins;
    document.getElementById('tax-amount').innerHTML = gameData.tax;
    document.getElementById('turns').innerHTML = gameData.turn;
}


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


function getPlayeruuid () {
    let playeruuid = localStorage.getItem("playeruuid");
    if (!playeruuid) {
        playeruuid = uuidPlayer; // playeruuid fornecido pelo servidor, que foi recebido no head do html.
        localStorage.setItem("playeruuid", playeruuid);
    };
    return playeruuid;
};

const idRoom = (window.location.href).split('/room/')[1];
const playeruuid = getPlayeruuid();



//cria conexão websocket
const ws = new WebSocket(`ws://localhost:8080/?idRoom=${idRoom}&playeruuid=${playeruuid}&nickname=${nickname}&roomPass=${roomPass}`);



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

//envia a mensagem para o servidor redistribui-lá
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

//recebe msg do servidor
ws.onmessage = function(msg) { 
    try {
        msg = JSON.parse(msg.data);
        console.log(msg)
    } catch {
        window.alert("um erro na mensagem vinda do servidor foi encontrado! Se possível, mande uma print para o desenvolvedor ficar ciente e recarregue esta página!" + msg.data)
        console.error(msg.data);
    };
    
    if (msg.type === 'msg_chat') {
        msg.msgs.forEach(chatMessage => {
            addMessage(chatMessage);
        });
    };

    if (msg.type === 'gameData') {
        for (const [key, value] of Object.entries(msg.content)) {
            gameData[key] = value;
        }
        updateScreenInfos();
    };
};


//estrutura para armazenamento das informações
let gameData = {
    turn: undefined,

    time: {
    seconds: undefined,
    minutes: undefined,
    hours: undefined
    },

    tax: undefined,
//TODO terminar aq
    me: {
        coins: 0,
        cardsInHand: ['left','rigth']
    },

    players: {
        1: {
            cardsInHand: null,
            coins:null,
        },
        2: {
            cardsInHand: null,
            coins:null,
        },
        3: {
            cardsInHand: null,
            coins:null,
        },
        4: {
            cardsInHand: null,
            coins:null,
        },
        5: {
            cardsInHand: null,
            coins:null,
        },
        6: {
            cardsInHand: null,
            coins:null,
        },
        7: {
            cardsInHand: null,
            coins:null,
        },
        8: {
            cardsInHand: null,
            coins:null,
        },
        9: {
            cardsInHand: null,
            coins:null,
        },
        10: {
            cardsInHand: null,
            coins:null,
        }
    }
    //TODO Terminar de adicionar as informações necessarias para construir o andamento do jogo na tela do cliente

}