function updateToggleButtons() {
    let itsMyTurnAndMyFirstMove = gameData.currentTurnOwner === gameData.me.nick && gameData.currentMove.moveType === "waitingFirstMove" ? true : false;
    
    toggleStart_button(itsMyTurnAndMyFirstMove) ? document.getElementById('startGame-button').disabled = false : document.getElementById('startGame-button').disabled = true;
    toggleTakeCoinBasic_button(itsMyTurnAndMyFirstMove) ? document.getElementById('Buy').disabled = false : document.getElementById('Buy').disabled = true;
    pass_button(itsMyTurnAndMyFirstMove) ? document.getElementById('pass').disabled = false : document.getElementById('pass').disabled = true;
    card_1_button(itsMyTurnAndMyFirstMove) ? document.getElementById('card-1').disabled = false : document.getElementById('card-1').disabled = true;
    card_2_button(itsMyTurnAndMyFirstMove) ? document.getElementById('card-2').disabled = false : document.getElementById('card-2').disabled = true;
};

function toggleStart_button() {
    if (
        gameData.me.playerNum === 1 &&
        gameData.players[2].connected === true
    ) return true;

    return false;
};

function toggleTakeCoinBasic_button(itsMyTurnAndMyFirstMove) {
    if (
        itsMyTurnAndMyFirstMove &&
        gameData.me.coins < gameData.coinLimit
    ) return true;

    return false;
};

function pass_button(itsMyTurnAndMyFirstMove) {
    if (
        (itsMyTurnAndMyFirstMove) ||
        (gameData.currentMove.moveType !== undefined && gameData.currentMove.moveType.includes("card_") && gameData.currentMove.player !== nickname)
    ) return true;
    //TODO adicionar mais condições
    return false;
};

function card_1_button(itsMyTurnAndMyFirstMove) {
    if (
        itsMyTurnAndMyFirstMove &&
        gameData.me.coins >= (gameData.cards["1"].fixPrice ** (gameData.cards["1"].doubled + 1)) &&
        gameData.tax < 5
    ) return true;

    return false;
};

function card_2_button(itsMyTurnAndMyFirstMove) {
    if (
        itsMyTurnAndMyFirstMove &&
        gameData.me.coins >= (gameData.cards["2"].fixPrice ** (gameData.cards["2"].doubled + 1)) &&
        gameData.tax > -5
    ) return true;

    return false;
};