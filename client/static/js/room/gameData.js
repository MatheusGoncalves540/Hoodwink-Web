//estrutura para armazenamento das informações
let gameData = {
    turn: undefined,

    time: {
        startTime: undefined,
        seconds: undefined,
        minutes: undefined,
        hours: undefined
    },

    tax: undefined,
//TODO terminar aq
    me: {
        nick: "",
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
    //TODO Terminar de adicionar as informações necessárias para construir o andamento do jogo na tela do cliente

}