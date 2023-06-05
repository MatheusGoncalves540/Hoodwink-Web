const createGame_button = document.getElementById("createGame");
        let maxPlayer_input = document.getElementById("maxPlayer").value;
        let ws = new WebSocket("ws://localhost:9090")

        createGame_button.addEventListener("click", createRoom => {
            maxPlayer_input = document.getElementById("maxPlayer").value;
            const payLoad = {
                "metodo": "create",
                "clientId": clientId,
                "maxPlayer": maxPlayer_input
            }
            ws.send(JSON.stringify(payLoad));
        })

        ws.onmessage = message => {
            //dados da mensagem
            const response = JSON.parse(message.data);
            //conectado
            if (response.metodo === "connect") {
                clientId = response.clientId;
                console.log("Client Id foi definido com sucesso "+ clientId)
            }
        }