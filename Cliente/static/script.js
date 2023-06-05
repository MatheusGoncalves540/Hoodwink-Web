//cria conexão websocket
let ws = new WebSocket("ws://localhost:9090")

//criar nova sala
let maxPlayer_input = document.getElementById("maxPlayer").value;
const createGame_button = document.getElementById("createGame");
createGame_button.addEventListener("click", createRoom => {
    maxPlayer_input = document.getElementById("maxPlayer").value;
    //envia quer fazer o método de criar uma sala
    const payLoad = {
        "method": "create",
        "clientId": clientId,
        "maxPlayer": maxPlayer_input,
        "init_coins": 2
    }
    ws.send(JSON.stringify(payLoad));
})

//recebendo uma mensagem do servidor
ws.onmessage = message => {
    //dados da mensagem
    const response = JSON.parse(message.data);
    //conectado
    if (response.method === "connect") {
        clientId = response.clientId;
        console.log("Client Id foi definido com sucesso: "+ clientId)
    }
    //criou nova sala
    if (response.method === "create") {
        roomId = response.room.id;
        console.log("Sala definido com sucesso: "+roomId)
    }
}