const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const url = require('url');
const WebSocket = require('ws');
const {generateNewId, uuidv4} = require('./lib/functions');
const {createRoom} = require('./engine/rooms');
const {ValidateEntry, validateCreatedRoom} = require('./lib/validations');



//configuração do express
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('./client/static'));
app.engine('html', require('ejs').renderFile);

//servidor websocket
const server = new WebSocket.Server({ port: 8080 }, () => { console.log("online em 8080... -Websocket") });

//porta principal
const PORT = 1235;

//mapa das salas
let rooms = {};

//lobby
app.get("/", (req,res) => res.render(path.join(__dirname, '..', 'client', 'index.html'))); 

//ao receber um post aqui, tentará criar uma sala com os atributos que foram enviados
app.post("/creating-room", (req, res) => {
  //traz as informações passadas
  const {nickname, roomName, maxPlayer, roomPass} = req.body;

  if (!validateCreatedRoom(nickname, roomName, maxPlayer, roomPass)) {
    return res.status(422).json({erro:"INFORMAÇÕES INVALIDAS"});
  }

  //gera um id para a sala
  const idNewRoom = generateNewId();

  //adiciona a sala no mapa de salas em memória
  createRoom(rooms, idNewRoom, roomName, maxPlayer, roomPass); 

  //envie a resposta com o ID da sala que acabou de criar
  res.json({
    room: rooms[idNewRoom],
    nickname: nickname
  });

  console.log(rooms[idNewRoom]);
});

//ao receber um psot aqui, tentará entrar em uma sala com os atributo que foram enviados
app.post("/room/:id", (req, res) => {
  //traz as informações passadas
  const {id} = req.params;
  const {nickname, roomPass} = req.body;
  const room = rooms[id];
  
  //valida os dados e libera a entrada
  if (!room || !ValidateEntry(nickname, room, roomPass, null, 'express')) {
    return res.status(422).json({erro:"INFORMAÇÕES INVALIDAS"});
  };

  const playeruuid = uuidv4();

  // Envie o arquivo room.html com os valores personalizados como variaveis
  res.render(path.join(__dirname, '..', 'client', 'room.html'), { uuidPlayer: playeruuid, nickname:nickname, roomPass:roomPass });
});

server.on('connection', function(socket, request) {
  // Recuperando informações
  const urlData = url.parse(request.url, true).query;
  const {playeruuid, idRoom, nickname, roomPass} = urlData;
  const room = rooms[idRoom];

  //validação da entrada novamente
  if (!room || !ValidateEntry(nickname, room, roomPass, playeruuid, 'socket')) {
    socket.send("Sala, nick ou senha invalida!");
    socket.close();
    return;  //ADICIONAR RETORNO DE ERRO PARA O CLIENTE AQUI
  };

  // Armazenando as informações no contexto do WebSocket
  socket.context = {
    idRoom: idRoom,
    roomPass: roomPass,
    nickname: nickname,
    playeruuid: playeruuid,
  };

  //verifica se existe um player com o uuid fornecido dentro da sala
  const playerToUpdate = room.players.find(player => player.uuidPlayer === playeruuid);
  
  //atualiza o "socket" do player, caso ele já estava conectado na sala anteriormente
  if (playerToUpdate) {
    playerToUpdate.socket = socket;
    playerToUpdate.nickname = nickname;
    //envia a mensagem aos outros jogadores da sala
    room.players.forEach(player => {
      player.socket.send(`Jogador ${nickname} foi reconectado!`);
      room.chat.push([

      ])
    });
  }
  //caso o jogo ainda não tenha iniciado, adiciona o novo jogador na sala
  else if (room.turn === 0) {
    room.players.push({
      nickname: nickname,
      uuidPlayer: playeruuid,
      socket: socket,
      playerNum: (room.players.length) + 1,
    });
    //envia a mensagem aos outros jogadores da sala
    room.players.forEach(player => {
      player.socket.send(`Jogador ${nickname} foi conectado!`);
    });
  }
  //caso ele não estava na partida antes e o jogo já começou, não é possivel se conectar
  else {
    socket.close();
    return; //ADICIONAR RETORNO DE ERRO PARA O CLIENTE AQUI
  };

  // Quando você receber uma mensagem, enviamos ela para todos os sockets
  socket.on('message', function(msg) {
    console.log(msg);
  });

  // Quando a conexão de um socket é fechada/disconectada, removemos o socket do array
  socket.on('close', function() {
    //identifica qual player foi desconectado
    const desconectedPlayer = room.players.find(player => player.socket === socket);

    //envia a mensagem aos outros jogadores da sala
    room.players.forEach(player => {
      player.socket.send(`Jogador ${desconectedPlayer.nickname} foi desconectado!`);
    });

    //se não for o primeiro turno, delete apenas o socket do player
    if (room.turn !== 0) {
      desconectedPlayer.socket = null;
    //mas se o jogo não tiver iniciado ainda, delete o player por inteiro
    } else {
      room.players = room.players.filter(player => player.socket !== socket);
    };
  });
});


app.listen(PORT, function (err) {
    if (err) console.log(err);
    console.log("online na porta: ", PORT);
});
