const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const { generateNewId, uuidv4 } = require('../lib/functions');
const { Room } = require('./game/room_class/room_class');
const { validateCreatedRoom, ValidateEntry } = require('../lib/validations');
const msgServer = require('../lib/languages/messages.json')['ptbr'];

//porta principal
const PORT = 1235;

//configuração do express
function ExpressConfigs() {
    app.use(express.json());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.static(path.join(__dirname, '..', '..', 'client', 'static')));
    app.engine('html', require('ejs').renderFile);
};


function StartExpress_Pages(rooms, playingNow) {
    ExpressConfigs();
    Lobby_Page(playingNow);
    CreatingRoom_Page(rooms); //Página que recebe as informações que vieram do lobby e cria a sala
    EnterByUrl_Page(); //Página que recebe requisições de entrada por link
    Room_Page(rooms); //Página da sala, que recebe as informações vindas da "CreatingRoom_Page" e tenta conectar no websocket da sala especificada, se as informações forem validas
    Rules_Page(); //Página de regras
    errorOnLoadingScript(); //Página de erro ao carregar scripts da sala
};


//pagina do lobby
function Lobby_Page(playingNow) {
    app.get("/", (req, res) => {
        res.render(path.join(__dirname, '..', '..', 'client', 'index.html'), { playingNow : playingNow.connected });
    }); 
};


//ao receber um post aqui, tentará criar uma sala com os atributos que foram enviados
function CreatingRoom_Page(rooms) {
    app.post("/creating-room", (req, res) => {
        //traz as informações passadas
        const newRoomData = {
            nickname: req.body['nickname'],
            roomName: req.body['roomName'],
            maxPlayer: req.body['maxPlayer'],
            roomPass: req.body['roomPass']
        };
      
        if (validateCreatedRoom(res, msgServer, newRoomData) !== true) return;
      
        //gera um id para a sala
        const idNewRoom = generateNewId();
      
        //adiciona a sala no mapa de salas em memória
        try {
            rooms[idNewRoom] = new Room (
                idNewRoom,
                newRoomData.roomName,
                newRoomData.maxPlayer,
                newRoomData.roomPass
            );
        } catch (error) {
            console.error(error)
        };       
      
        //envie a resposta com o ID da sala que acabou de criar
        res.json({
          room: rooms[idNewRoom],
          nickname: newRoomData.nickname
        });
      
        console.log(rooms[idNewRoom]);
    });
};

function EnterByUrl_Page() {
    app.get("/room/:id", (req, res) => {
        res.render(path.join(__dirname, '..', '..', 'client', 'enteringByUrl.html'));
    });
}

//ao receber um post aqui, tentará entrar em uma sala com os atributo que foram enviados
function Room_Page(rooms) {
    app.post("/room/:id", (req, res) => {
        //traz as informações passadas
        const entryData = {
            id: req.params['id'],
            nickname: req.body['nickname'],
            roomPass: req.body['roomPass'],
            room: rooms[req.params['id']]
        };
    
        //valida os dados e libera a entrada
        if (!entryData.room) return res.status(404).json({erro:"sala não encontrada"})
        if (ValidateEntry(res, msgServer, entryData, 'express') !== true) return;
    
        const playeruuid = uuidv4();
    
        // Envie o arquivo room.html com os valores personalizados como variáveis
        res.render(path.join(__dirname, '..', '..', 'client', 'room.html'), { playeruuid: playeruuid, nickname: entryData.nickname, roomPass: entryData.roomPass });
    });
};

//Página de regras
function Rules_Page() {
    app.get("/rules", (req, res) => {
        res.render(path.join(__dirname, '..', '..', 'client', 'rules.html'));
    });
};

//Página caso aconteça um erro nos scripts
function errorOnLoadingScript() {
    app.get("/room/:id/LoadingError", (req, res) => {
        return res.status(404).json({ erro: msgServer.errors.onLoadError });
    });
};


//abre as páginas
function Listen_App(){
    app.listen(PORT, function (err) {
    if (err) console.log(err);
    console.log("online na porta:", PORT);
    });
};

module.exports = {StartExpress_Pages, Listen_App};