const {VerifyPlayerOnRoom,uuidv4} = require("./includes/functions")
const {verifyCreategame} = require("./componentes/menu")
const {login} = require("../Api/login")

//conexão websocket
const http = require("http");
const webSocketServer = require("websocket").server;
const httpServer = http.createServer();
httpServer.listen(9090, () => console.log("online na porta.. 9090"))

const wsServer = new webSocketServer({
    "httpServer": httpServer
})

//requisição dos documentos
path = require('path');
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());
app.get("/login", (req,res) => res.sendFile(path.join(__dirname, '..', 'Cliente', 'login.html')));   
app.post("/api/login", (req,res) => login(req,res));
app.listen(9091, () => console.log("online na porta.. 9091"));

//mapa de clientes
let clients = {};

//mapa das salas
let rooms = {};


//criar jogo


//conexão estabelecida
wsServer.on("connect", () => {
    console.log("aberto");
})

//conexão encerrada
wsServer.on("close", () => {
    console.log("fechado");
 }) 

//server recebendo um request
wsServer.on("request", request => {
    //conectar o websocket
    const connection = request.accept(null, request.origin);
    //gera um uuid para o novo cliente conectado
    const clientId = uuidv4();
    //adiciona o novo cliente conectado ao mapa
    clients[clientId] = {
        "connection":connection
    }
    //manda para o cliente qual é o ID dele
    const payLoad = {
        "method":"connect",
        "clientId": clientId
    }
    connection.send(JSON.stringify(payLoad));

    //recebendo uma mensagem do cliente
    connection.on("message", message => {
        const result = JSON.parse(message.utf8Data);
        //usuario quer criar uma nova sala


        const createdRoom = verifyCreategame(result);
        if (createdRoom !== false) {
            rooms[createdRoom.id] = createdRoom;
            const payLoad = {
                "method":"create",
                "room":createdRoom
            }
            const connection = clients[clientId].connection;
            connection.send(JSON.stringify(payLoad));
            console.log(payLoad)
        }

        //usuario que entrar em uma sala
        else if (result.method === "join") {
            const roomId = result.roomId;
            const room = rooms[roomId];
            const clientId = result.clientId;
            //verifica se o cliente já está na sala
            if (!VerifyPlayerOnRoom(room,clientId)) { 
                //verifica se a sala está cheia
                if (room.players.length < room.maxPlayer) {
                    
                    room.players.push({
                        "clientId": clientId,
                        "playerNum": (room.players.length) + 1

                    })
                    const payLoad = {
                        "method":"join",
                        "clientId": clientId,
                        "room":room
                    }
                    //repete para cada player na sala, informando que entrou esse novo player
                    room.players.forEach(player => {
                        clients[player.clientId].connection.send(JSON.stringify(payLoad))
                    });
                } else {
                    const msgErro = "A sala está cheia!"
                    const payLoad = {
                        "method":"error",
                        "CauseOfError":"FullRoom",
                        "msgErro":msgErro
                    }
                    connection.send(JSON.stringify(payLoad));
                }
            //sala cheia
            } else {
                const msgErro = "Você já está na sala"
                    const payLoad = {
                        "method":"error",
                        "CauseOfError":"AlreadyInRoom",
                        "msgErro":msgErro
                    }
                    connection.send(JSON.stringify(payLoad));                
            }
        }
        //metodo invalido
        else {
            console.error("INVALID METHOD")
        }
    })
})
