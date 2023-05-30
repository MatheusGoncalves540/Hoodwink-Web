//conexão websocket
const http = require("http");
const webSocketServer = require("websocket").server;
const httpServer = http.createServer();
httpServer.listen(9090, () => console.log("escutando.. 9090"))

const wsServer = new webSocketServer({
    "httpServer": httpServer
})

//requisição de pagina html
const app = require("express")();
path = require('path')
app.get("/", (req,res) => res.sendFile(path.join(__dirname, '..', 'Cliente', 'index.html')))
app.listen(9091, () => console.log("escutando.. 9091"))

//mapa de clientes
const clients = {};

//função que gera um uuid v4
function uuidv4(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
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
