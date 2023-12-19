function updateToggleButtons() {
    localVariables.itsMyTurnAndMyFirstMove = gameData.currentTurnOwner === gameData.me.nick && gameData.currentMove.moveType === "waitingFirstMove" ? true : false;
    if (!gameData.me.isAlive) {
        document.querySelectorAll('.disabeable').forEach((button) => {
            button.disabled = true;
        });
    } else {
        toggleStart_button() ? document.getElementById('startGame-button').disabled = false : document.getElementById('startGame-button').disabled = true;
        toggleTakeCoinBasic_button() ? document.getElementById('Buy').disabled = false : document.getElementById('Buy').disabled = true;
        togglePass_button() ? document.getElementById('pass').disabled = false : document.getElementById('pass').disabled = true;
        toggleDispute_button() ? document.getElementById('dispute').disabled = false : document.getElementById('dispute').disabled = true;
        toggleCard_1_button() ? document.getElementById('card-1').disabled = false : document.getElementById('card-1').disabled = true;
        toggleCard_2_button() ? document.getElementById('card-2').disabled = false : document.getElementById('card-2').disabled = true;
        toggleCard_3_button() ? document.getElementById('card-3').disabled = false : document.getElementById('card-3').disabled = true;
        toggleCard_4_button() ? document.getElementById('card-4').disabled = false : document.getElementById('card-4').disabled = true;
    };
};

function toggleStart_button() {
    if (
        gameData.me.playerNum === 1 &&
        gameData.players[2].connected === true
    ) return true;

    return false;
};

function toggleTakeCoinBasic_button() {
    if (
        localVariables.itsMyTurnAndMyFirstMove &&
        gameData.me.coins < gameData.maxCoins
    ) return true;

    return false;
};

function togglePass_button() {
    if (
        (localVariables.itsMyTurnAndMyFirstMove) ||
        (gameData.currentMove.moveType !== undefined && gameData.currentMove.moveType.includes("card_") && gameData.currentMove.player !== nickname)
    ) return true;
    
    return false;
};

function toggleDispute_button() {
    if (
        (gameData.turn != 0) &&
        (gameData.currentMove.player != gameData.me.nick) &&
        (gameData.currentMove.moveType.includes("card_")))
    return true;
    
    return false;
};

function toggleCard_1_button() {
    if (
        localVariables.itsMyTurnAndMyFirstMove &&
        gameData.me.coins >= (gameData.cards["1"].fixPrice ** (gameData.cards["1"].doubled + 1)) &&
        gameData.tax < 5
    ) return true;

    return false;
};

function toggleCard_2_button() {
    if (
        localVariables.itsMyTurnAndMyFirstMove &&
        gameData.me.coins >= (gameData.cards["2"].fixPrice ** (gameData.cards["2"].doubled + 1)) &&
        gameData.tax > -5
    ) return true;

    return false;
};

function toggleCard_3_button() {
    if (
        (localVariables.itsMyTurnAndMyFirstMove) &&
        (gameData.me.coins >= calculatePriceCardsPlusTax(gameData.cards["3"]))
    ) return true;

    return false;
};

function toggleCard_4_button() {
    if (
        localVariables.itsMyTurnAndMyFirstMove &&
        gameData.me.coins + gameData.cards['4'].amountReceived <= gameData.maxCoins
    ) return true;

    return false;
};