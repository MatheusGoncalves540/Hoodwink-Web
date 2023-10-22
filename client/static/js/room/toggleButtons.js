function updateToggleButtons() {
    toggleStart_button() ? document.getElementById('startGame-button').disabled = false : document.getElementById('startGame-button').disabled = true;
    toggleTakeCoinBasic_button() ? document.getElementById('Buy').disabled = false : document.getElementById('Buy').disabled = true;
    passBasic_button() ? document.getElementById('pass').disabled = false : document.getElementById('pass').disabled = true;
};

function toggleStart_button() {
    if (gameData.me.playerNum === 1 && gameData.players[2].connected === true) return true;
    return false;
};

function toggleTakeCoinBasic_button() {
    if (gameData.currentTurnOwner === gameData.me.nick && gameData.currentMove.moveType === "waitingFirstMove" && gameData.me.coins < gameData.coinLimit) return true;
    return false;
};

function passBasic_button() {
    if (gameData.currentTurnOwner === gameData.me.nick && gameData.currentMove.moveType === "waitingFirstMove") return true;
    if (false) return true; //TODO adicionar outras condições para que o botão ligue
    return false;
};
