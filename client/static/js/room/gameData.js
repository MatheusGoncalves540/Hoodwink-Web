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
    moveTime: 0,

    tax: 0,
    coinLimit: 20,

    me: {
        nick: nickname,
        coins: 0,
        invested: [],
        cardsInHand: ['left','right'],
        playerNum: undefined
    },

    players: {
        '1': {
            nick: "",
            playerNum: 1,
            num_cards: null,
            coins: null,
            invested: [],
            usedCards: {},
            connected: false
        },
        '2': {
            nick: "",
            playerNum: 2,
            num_cards: null,
            coins: null,
            invested: [],
            usedCards: {},
            connected: false
        },
        '3': {
            nick: "",
            playerNum: 3,
            num_cards: null,
            coins: null,
            invested: [],
            usedCards: {},
            connected: false
        },
        '4': {
            nick: "",
            playerNum: 4,
            num_cards: null,
            coins: null,
            invested: [],
            usedCards: {},
            connected: false
        },
        '5': {
            nick: "",
            playerNum: 5,
            num_cards: null,
            coins: null,
            invested: [],
            usedCards: {},
            connected: false
        },
        '6': {
            nick: "",
            playerNum: 6,
            num_cards: null,
            coins: null,
            invested: [],
            usedCards: {},
            connected: false
        },
        '7': {
            nick: "",
            playerNum: 7,
            num_cards: null,
            coins: null,
            invested: [],
            usedCards: {},
            connected: false
        },
        '8': {
            nick: "",
            playerNum: 8,
            num_cards: null,
            coins: null,
            invested: [],
            usedCards: {},
            connected: false
        },
        '9': {
            nick: "",
            playerNum: 9,
            num_cards: null,
            coins: null,
            invested: [],
            usedCards: {},
            connected: false
        },
        '10': {
            nick: "",
            playerNum: 10,
            num_cards: null,
            coins: null,
            invested: [],
            usedCards: {},
            connected: false
        }
    }
}