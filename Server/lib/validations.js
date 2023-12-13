//valida se o nome passado é valido
function validateName(nickname, room) {
    nickname = nickname.trim();


    if (!nickname) return false;

    if (nickname.length > 15) return false;

    if (nickname.length < 3) return false;

    if (room !== undefined) {
        const PlayerNickAlreadyUsed = room.players.find(player => player.header.nickname === nickname);
        
        if (PlayerNickAlreadyUsed && PlayerNickAlreadyUsed.header.socket !== null) return false;
    };

    return true;
};

//valida se o nome de sala passado é valido
function validateRoomName(name) {
    name = name.trim();

    if (!name) return false;

    if (name.length > 15) return false;

    if (name.length < 3) return false;

    return true;
};

//verifica se as senhas conhecidem
function validateRoomPass(room, roomPass_byUser) {

    if (room.header.roomPass !== roomPass_byUser) return false;

    return true;
};

//verifica se existe um player com o uuid fornecido dentro da sala
function ValidateAlreadyPlayerInRoom(room, playeruuid) {

    const playerAlreadyInRoom = room.players.find(player => player.header.playeruuid === playeruuid);

    if (playerAlreadyInRoom) {
        if (playerAlreadyInRoom.header.socket !== null) return false;
    };

    return true;
}

//Valida se com os dados passados, é permitida a entrada
function ValidateEntry(res, msgServer, entryData, socketOrExpress) {
    if (!socketOrExpress || !entryData.room || !entryData.room.header) return msgServer.errors.invldData.room;

    if (socketOrExpress === "express") {
        if (!validateRoomPass(entryData.room, entryData.roomPass)) return res.status(401).json({ erro: msgServer.errors.invldData.roomPass });

        if (!validateName(entryData.nickname , undefined)) return res.status(422).json({ erro: msgServer.errors.invldData.nickname });

        return true;

    } else if (socketOrExpress === "socket") {
        if (!validateName(entryData.nickname, entryData.room)) return msgServer.errors.invldData.nick;

        if (!validateRoomPass(entryData.room, entryData.roomPass)) return msgServer.errors.invldData.roomPass;

        if (!ValidateAlreadyPlayerInRoom(entryData.room, entryData.playeruuid, entryData.nickname)) return msgServer.errors.invldEntry.alrdyInRoom;

        const playerAlreadyInRoom = entryData.room.players.find(player => player.header.playeruuid === entryData.playeruuid);

        if (!playerAlreadyInRoom) {
            if(entryData.room.players.length >= entryData.room.header.maxPlayer) return msgServer.errors.invldEntry.fullRoom;
        };
        
        return true;
    };

};

//valida se com os dados passados, pode-se criar uma sala
function validateCreatedRoom(res, msgServer, roomData) {
    
    //nome do player tem que se enquadrar nos padrões de nome
    if (!validateName(roomData.nickname, undefined)) return res.status(422).json({ erro: msgServer.errors.invldData.nickname });

    //nome da sala tem que se enquadrar nos padrões de nome
    if (!validateRoomName(roomData.roomName)) return res.status(422).json({ erro: msgServer.errors.invldData.roomName });

    //validando senha da sala
    if (roomData.roomPass.length > 20) return res.status(422).json({ erro: msgServer.errors.invldData.roomPass})

    //não pode ter mais que 10 players ou menos que 2
    if (roomData.maxPlayer > 10 || roomData.maxPlayer < 2) return res.status(422).json({ erro: msgServer.errors.invldData.generic });

    //senha da sala não pode ter mais que 30 caracteres
    if (roomData.roomPass.length > 30) return res.status(422).json({ erro: msgServer.errors.invldData.roomPass });

    return true;
};

//verifica se a mensagem passada é permitida
function allowedMessage(message, room) {

    //se o dono da mensagem for espectador
    if (room.spectators.includes(message['owner'])) return false;

    if (!message['content']) return false;

    if (message['content'].length > 50) return false;

    if (message['content'].trim() === '') return false;

    return true;
};

function validRequest(data, socket, room) {
    try {
        data = JSON.parse(data);
        if (!(room.players.find(player => player.header.playeruuid === data['owner']))) throw new Error("player not in Room");
        return data;
    } catch (error) {
        if (socket) socket.send(msg.errors.invldReq);
        return false;
    };
};

module.exports = { ValidateEntry, validateCreatedRoom, allowedMessage, validRequest };