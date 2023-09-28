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
    currentMove: "undefined",
    moveTime: 0,

    tax: 0,

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
            num_cards: null,
            coins: null,
            invested: [],
            usedCards: {}
        },
        '2': {
            nick: "",
            num_cards: null,
            coins: null,
            invested: [],
            usedCards: {}
        },
        '3': {
            nick: "",
            num_cards: null,
            coins: null,
            invested: [],
            usedCards: {}
        },
        '4': {
            nick: "",
            num_cards: null,
            coins: null,
            invested: [],
            usedCards: {}
        },
        '5': {
            nick: "",
            num_cards: null,
            coins: null,
            invested: [],
            usedCards: {}
        },
        '6': {
            nick: "",
            num_cards: null,
            coins: null,
            invested: [],
            usedCards: {}
        },
        '7': {
            nick: "",
            num_cards: null,
            coins: null,
            invested: [],
            usedCards: {}
        },
        '8': {
            nick: "",
            num_cards: null,
            coins: null,
            invested: [],
            usedCards: {}
        },
        '9': {
            nick: "",
            num_cards: null,
            coins: null,
            invested: [],
            usedCards: {}
        },
        '10': {
            nick: "",
            num_cards: null,
            coins: null,
            invested: [],
            usedCards: {}
        }
    }
}