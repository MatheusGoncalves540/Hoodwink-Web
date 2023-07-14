//cria conexão websocket
let ws = new WebSocket("ws://localhost:9090");

//Ids
let clientId = null;
let roomId = null;

//criar nova sala]
let maxPlayer_input;
const createGame_button = document.getElementById("createGame");
createGame_button.addEventListener("click", create => {
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

//entrar em uma sala
let roomId_input;
const roomId_button = document.getElementById("joinGame");
roomId_button.addEventListener("click", join => {
    roomId_input = document.getElementById("InputRoomId").value;
    if (roomId_input === null || roomId_input == "") {
        window.alert("Preencha o campo com o id da sala")
    } else {
        const payLoad = {
            "method": "join",
            "clientId": clientId,
            "roomId": roomId_input
        }
        ws.send(JSON.stringify(payLoad));
    }
    
})

//recebendo uma mensagem do servidor
ws.onmessage = message => {
    //dados da mensagem
    const response = JSON.parse(message.data);
    
    switch (response.method) {
        //conectado
        case "connect": 
            clientId = response.clientId;
            console.log("Client Id foi definido com sucesso: "+ clientId);
            break;
        //mensagem de erro
        case "error":
            switch (response.CauseOfError) {
                case "FullRoom":
                    alert(`${response.msgErro}`)
                    break;
                case "AlreadyInRoom":
                    alert(`${response.msgErro}`)
                    break;
                default:
                    break;
            }
        //criou nova sala
        case "create": 
            roomId = response.room.id;
            console.log("Sala definido com sucesso: "+roomId);
            break;
        //default
        default:
            break;
    }
}