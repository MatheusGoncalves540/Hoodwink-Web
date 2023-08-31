const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const { generateNewId, uuidv4 } = require('../lib/functions');
const { Room } = require('./game/room_class');
const { validateCreatedRoom, ValidateEntry } = require('../lib/validations');
const msgServer = require('../lib/languages/messages.json')['ptbr'];

//porta principal
const PORT = 1235;

//configuração do express
function ExpressConfigs() {
    app.use(express.json());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.static('./client/static'));
    app.engine('html', require('ejs').renderFile);
};


function StartExpress_Pages(rooms) {
    //Configuração do express
    ExpressConfigs();
    //Lobby
    Lobby_Page();
    //Página que recebe as informações que vieram do lobby e cria a sala
    CreatingRoom_Page(rooms);
    //Página da sala, que recebe as informações vindas da "CreatingRoom_Page" e tenta conectar no websocket da sala especificada, se as informações forem validas
    Room_Page(rooms);
    //Página de erro ao carregar scripts da sala
    errorOnLoadingScript();
};


//pagina do lobby
function Lobby_Page() {
    app.get("/", (req, res) => res.render(path.join(__dirname, '..', '..', 'client', 'index.html'))); 
};


//ao receber um post aqui, tentará criar uma sala com os atributos que foram enviados
function CreatingRoom_Page(rooms) {
    app.post("/creating-room", (req, res) => {
        //traz as informações passadas
        const { nickname, roomName, maxPlayer, roomPass } = req.body;
      
        if (!validateCreatedRoom(nickname, roomName, maxPlayer, roomPass)) {
          return res.status(422).json({ erro: msgServer.errors.invldData });
        }
      
        //gera um id para a sala
        const idNewRoom = generateNewId();
      
        //adiciona a sala no mapa de salas em memória
        rooms[idNewRoom] = new Room(idNewRoom, roomName, maxPlayer, roomPass);
      
        //envie a resposta com o ID da sala que acabou de criar
        res.json({
          room: rooms[idNewRoom],
          nickname: nickname
        });
      
        console.log(rooms[idNewRoom]);
    });
};


//ao receber um post aqui, tentará entrar em uma sala com os atributo que foram enviados
function Room_Page(rooms) {
    app.post("/room/:id", (req, res) => {
        //traz as informações passadas
        const { id } = req.params;
        const { nickname, roomPass } = req.body;
        const room = rooms[id];
    
        //valida os dados e libera a entrada
        if (!room || !ValidateEntry(nickname, room, roomPass, null, 'express')) {
        return res.status(422).json({ erro: msgServer.errors.invldEntry });
        };
    
        const playeruuid = uuidv4();
    
        // Envie o arquivo room.html com os valores personalizados como variáveis
        res.render(path.join(__dirname, '..', '..', 'client', 'room.html'), { playeruuid: playeruuid, nickname: nickname, roomPass: roomPass });
    });
};

//Página de erro ao carregar scripts da sala
function errorOnLoadingScript() {
    app.get("/room/:id/LoadingError", (req, res) => {
        return res.status(404).json({ erro: msgServer.errors.onLoadError });
    });
};


//abre as páginas
function Listen_App(){
    app.listen(PORT, function (err) {
    if (err) console.log(err);
    console.log("online na porta: ", PORT);
    });
};

module.exports = {StartExpress_Pages, Listen_App};