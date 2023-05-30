//conexão websocket
const http = require("http");
const webSocketServer = require("websocket").server;
const httpServer = http.createServer();
httpServer.listen(8080, () => console.log("escutando.. 8080"))

const wsServer = new webSocketServer({
    "httpServer": httpServer
})

//mapa de clientes
const clients = {};

//função que gera um uuid v4
function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

wsServer.on("request", request => {
    //conectar
    const connection = request.accept(null, request.origin);
    connection.on("open", () => console.log("Aberto!"))
    connection.on("close", () => console.log("Fechado!"))
    connection.on("message", message => {
        //recebi uma mensagem do cliente
        const result = JSON.parse(message.utf8Data)
        console.log(result)
    })
    const clientId = uuidv4();
    clients[clientId] = {
        "connection":connection
    }
    const payLoad = {
        "metodo":"connect",
        "clientId": clientId
    }
    connection.send(JSON.stringify(payLoad))
})
