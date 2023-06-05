//conexão websocket
const http = require("http");
const webSocketServer = require("websocket").server;
const httpServer = http.createServer();
httpServer.listen(9090, () => console.log("escutando.. 9090"))

const wsServer = new webSocketServer({
    "httpServer": httpServer
})

//requisição dos documentos
path = require('path');
const express = require("express");
const app = express();

app.get("/", (req,res) => res.sendFile(path.join(__dirname, '..', 'Cliente', 'index.html')));   
app.use('/static', express.static(path.join(__dirname, '..', 'Cliente', 'static')))

app.listen(9091, () => console.log("escutando.. 9091"));

//mapa de clientes
const clients = {};

//mapa das salas
const rooms = {};

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

//server recebendo um request
wsServer.on("request", request => {
    //conectar o websocket
    const connection = request.accept(null, request.origin);

    connection.on("message", message => {
        //recebendo uma mensagem do cliente
        const result = JSON.parse(message.utf8Data)
        //usuario quer criar uma nova sala
        if (result.metodo === "create" && result.maxPlayer <= 10) {
            const clientId = result.clientId;
            const roomId = uuidv4()
            rooms[roomId] = {
                "id": roomId,
                "maxPlayer": result.maxPlayer
            }
            console.log(rooms[roomId])
        }
    })

    //gera um uuid para o novo cliente conectado
    const clientId = uuidv4();
    //adiciona o novo cliente conectado ao mapa
    clients[clientId] = {
        "connection":connection
    }

    //manda para o cliente qual é o ID dele
    const payLoad = {
        "metodo":"connect",
        "clientId": clientId
    }
    connection.send(JSON.stringify(payLoad))
})
