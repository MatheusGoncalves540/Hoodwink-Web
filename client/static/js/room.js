//valor do uuidPlayer sempre fornecido pelo servidor
//console.log(uuidPlayer);

const getPlayeruuid = () => {
    let playeruuid = localStorage.getItem("playeruuid");
    if (!playeruuid) {
        playeruuid = uuidPlayer; // playeruuid fornecido pelo servidor, que foi recebido no head do html.
        localStorage.setItem("playeruuid", playeruuid);
    };
    return playeruuid;
};

const idRoom = (window.location.href).split('/room/')[1];
const playeruuid = getPlayeruuid();


//valor do playeruuid final, se já estiver no localStorage, é o mesmo, caso contrario, usa o fornecido pelo servidor
//console.log(playeruuid);

//cria conexão websocket
const ws = new WebSocket(`ws://localhost:8080/?idRoom=${idRoom}&playeruuid=${playeruuid}&nickname=${nickname}&roomPass=${roomPass}`);

//adiciona a mensagem no chat
function addMessage(messageText) {
    const chatMessages = document.getElementById("chat-messages");
    const message = document.createElement("p");
    message.textContent = `${messageText.owner}: ${messageText.content}`;
    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Mantém a barra de rolagem na parte inferior
};

//envia a mensagem para o servidor redistribui-lá
function sendMessage() {
    const messageInput = document.getElementById("message");
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

//recebe msg do websocket
ws.onmessage = function(msg) { 
    msg = JSON.parse(msg.data);
    console.log(msg)
    if  (msg.type === 'msg_chat') addMessage(msg);
};