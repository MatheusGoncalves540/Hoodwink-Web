const url = require('url');
const WebSocket = require('ws');
const msgServer = require('../lib/languages/messages.json')['ptbr'];
const { socketOnNewConnection } = require('./websockets_connection/connection');
const { socketOnCloseConnection } = require('./websockets_connection/disconnection');
const { socketOnMessage } = require('./game/receivedFromClient');

//servidor websocket
const server = new WebSocket.Server({ port: 8080 }, () => { console.log("online na porta: 8080 (Websocket)") });


function Start_WebSocket(rooms, playingNow) {
  server.on('connection', function (socket, request) {
    //buscando informações
    const urlData = url.parse(request.url, true).query;
    const { idRoom } = urlData;
    const room = rooms[idRoom];

    //comandos executados quando um socket é desconectado
    socketOnCloseConnection(socket, room, rooms, playingNow);

    //comandos executados quando um novo socket é conectado
    socketOnNewConnection(socket, room, urlData, msgServer, playingNow);

    //comandos executados quando uma mensagem chega ao servidor
    socketOnMessage(socket, room);
  });
};


module.exports = { Start_WebSocket };