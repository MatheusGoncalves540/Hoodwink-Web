const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const { generateNewId, uuidv4 } = require('../lib/functions');
const { Room } = require('./game/room_class/room_class');
const { validateCreatedRoom, ValidateEntry } = require('../lib/validations');
const { defaultHeader } = require('./game/room_class/defaultRoomConfig');
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
    RestartRoom(rooms)//Página que conecta todos os jogadores de uma sala, à outra nova
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
            roomPass: req.body['roomPass'],
            startCoins: req.body['startCoins'],
            maxCoins: req.body['maxCoins'],
            displayTime_withPossibleCounterPlays: req.body['displayTime_withPossibleCounterPlays'],
            displayTime_highRelevance: req.body['displayTime_highRelevance'],
            displayTime: req.body['displayTime']
        };
      
        if (validateCreatedRoom(res, msgServer, newRoomData) !== true) return;
      
        //gera um id para a sala
        const idNewRoom = generateNewId();
      
        const newRoomHeader = defaultHeader(idNewRoom, newRoomData.roomName, newRoomData.maxPlayer, newRoomData.roomPass,
            newRoomData.startCoins, newRoomData.maxCoins, newRoomData.displayTime_withPossibleCounterPlays,
            newRoomData.displayTime_highRelevance, newRoomData.displayTime
        ); //TODO fazer com que as informações aq sejam mais amplamente configuráveis.

        //adiciona a sala no mapa de salas em memória
        try {
            rooms[idNewRoom] = new Room (
                newRoomHeader
            );
        } catch (error) {
            console.error(error)
        };       
      
        //envie a resposta com o ID da sala que acabou de criar
        res.json({
          roomId: rooms[idNewRoom].header.roomId,
          roomPass: rooms[idNewRoom].header.roomPass,
          nickname: newRoomData.nickname
        });
      
        console.log("a sala: " + idNewRoom + " foi criada.");
        
    });
};

//ao receber um post aqui, tentará criar uma nova sala e conectar todos os jogadores que estavam na anterior à ela
function RestartRoom(rooms) {
    app.post("/room/:id/restarting-room", (req, res) => {
        const oldRoom = rooms[req.params['id']];
        const idNewRoom = generateNewId();
        
        if (!oldRoom.gameOver) return res.send('Jogo ainda não concluído');

        const oldRoomHeader = {...oldRoom.header};
        oldRoomHeader.roomId = idNewRoom;
        //adiciona a sala no mapa de salas em memória
        try {
            rooms[idNewRoom] = new Room (
                oldRoomHeader,
                oldRoom.chat
            );
        } catch (error) {
            console.error(error);
        };
        //

        const payload = {
            type: "restartRoom",
            content: {
                idNewRoom: idNewRoom
            }
        };

        console.log("a sala: " + idNewRoom + " foi criada.");

        oldRoom.sendInfoForAllPlayers(payload);
    })
}


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
        if (ValidateEntry(res, msgServer, entryData, 'express') === false) return;
    
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