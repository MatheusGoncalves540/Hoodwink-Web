const {createGame} = require("../lib/engine");

function verifyCreategame(result) {
    if (result.method === "create" && result.maxPlayer <= 10) {
        return createGame(result);
    }
    return false;
}

module.exports = {verifyCreategame}