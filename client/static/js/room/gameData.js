//estrutura para armazenamento das informações
let gameData = {
    turn: 0,

    time: {
        startTime: undefined,
        seconds: 0,
        minutes: 0,
        hours: 0
    },

    timesDoubledRebel: 0,
    timesDoubledPolitical: 0,

    aliveDeck: 0,
    deadDeck: 0,

    currentTurnOwner: `sala: ${document.title.split(':')[1]}`,
    currentMove: {},
    moveTimer: 0,

    tax: 0,
    maxCoins: 0,

    cards: {},

    me: {
        nick: nickname,
        coins: 0,
        invested: [],
        cardsInHand: ['left','right'],
        playerNum: undefined,
        isAlive: true,
        playeruuid: undefined
    },

    players: {
        '1': {
            nick: "",
            playerNum: 1,
            playerCards: [],
            coins: null,
            invested: [],
            usedCards: {},
            isAlive: false,
            connected: false
        },
        '2': {
            nick: "",
            playerNum: 2,
            playerCards: [],
            coins: null,
            invested: [],
            usedCards: {},
            isAlive: false,
            connected: false
        },
        '3': {
            nick: "",
            playerNum: 3,
            playerCards: [],
            coins: null,
            invested: [],
            usedCards: {},
            isAlive: false,
            connected: false
        },
        '4': {
            nick: "",
            playerNum: 4,
            playerCards: [],
            coins: null,
            invested: [],
            usedCards: {},
            isAlive: false,
            connected: false
        },
        '5': {
            nick: "",
            playerNum: 5,
            playerCards: [],
            coins: null,
            invested: [],
            usedCards: {},
            isAlive: false,
            connected: false
        },
        '6': {
            nick: "",
            playerNum: 6,
            playerCards: [],
            coins: null,
            invested: [],
            usedCards: {},
            isAlive: false,
            connected: false
        },
        '7': {
            nick: "",
            playerNum: 7,
            playerCards: [],
            coins: null,
            invested: [],
            usedCards: {},
            isAlive: false,
            connected: false
        },
        '8': {
            nick: "",
            playerNum: 8,
            playerCards: [],
            coins: null,
            invested: [],
            usedCards: {},
            isAlive: false,
            connected: false
        },
        '9': {
            nick: "",
            playerNum: 9,
            playerCards: [],
            coins: null,
            invested: [],
            usedCards: {},
            isAlive: false,
            connected: false
        },
        '10': {
            nick: "",
            playerNum: 10,
            playerCards: [],
            coins: null,
            invested: [],
            usedCards: {},
            isAlive: false,
            connected: false
        }
    }
}

let localVariables = {
    alreadyReceiptInfos: false,
    itsMyTurnAndMyFirstMove: gameData.currentTurnOwner === gameData.me.nick && gameData.currentMove.moveType === "waitingFirstMove" ? true : false,
    set_timeOutTick: undefined,
    timeOutTick: undefined,
    moveTimerProgress: 0,
    moveTimerDecrementTick: 0,
};