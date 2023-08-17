const url = require('url');
const WebSocket = require('ws');
const msg = require('../languages/messages.json')['ptbr'];
const { socketOnNewConnection } = require('./websockets_connection/connection');
const { socketOnCloseConnection } = require('./websockets_connection/disconnection');
const { socketOnMessage } = require('./game/recivedFromClient');

//servidor websocket
const server = new WebSocket.Server({ port: 8080 }, () => { console.log("online em 8080... -Websocket") });


function Start_WebSocket(rooms) {
  server.on('connection', function (socket, request) {
    //buscando informações
    const urlData = url.parse(request.url, true).query;
    const { playeruuid, idRoom, nickname, roomPass } = urlData;
    const room = rooms[idRoom];

    //comandos executados quando um novo socket é conectado
    socketOnNewConnection(socket, room, msg, playeruuid, idRoom, nickname, roomPass);

    //comandos executados quando um socket é desconectado
    socketOnCloseConnection(socket, room, msg);

    //comandos executados quando uma mensagem chega ao servidor
    socketOnMessage(socket, room);
    
  });
};


module.exports = { Start_WebSocket };