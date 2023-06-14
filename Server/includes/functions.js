
//verifica se o player já está na sala que está tentando conectar
function VerifyPlayerOnRoom(room,clientId) {
    let exist = false;
    room.players.filter(player => player.clientId === clientId).map((player) => {
        exist = true;
    })
    return exist;
}

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

module.exports = {VerifyPlayerOnRoom,uuidv4}