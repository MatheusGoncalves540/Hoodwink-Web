let gameDatasReceived = 0;

ws.onmessage = function(msg) { 
    try {
        msg = JSON.parse(msg.data);
        console.log(msg);
    } catch {
        window.alert(msg.data)
        console.error(msg.data);
    };
    
    switch (msg.type) {
        case 'msg_chat':
            msg.msgs.forEach(chatMessage => {
                addMessage(chatMessage);
            });
        break;

        case 'gameData':
            mergeObjects(gameData, msg.content);
            if (!localVariables.alreadyReceiptInfos) FirstReceipt(msg);
            updateScreenInfos(msg);

            //Depois de 2 gameDatas recebidos (o suficiente para receber todas as informações necessárias). ele trava a "FirstReceipt" function
            //A página ficará em carregamento até que os 2 gameDatas tiverem sido recebidos
            if (!localVariables.alreadyReceiptInfos) gameDatasReceived ++;
            if (gameDatasReceived >= 2) {
                localVariables.alreadyReceiptInfos = true;
                document.getElementById("game").style.visibility = "visible";
            };
        break;
    
        default:
        break;
    };
};

function mergeObjects(target, source) {
    for (const key in source) {
        if (typeof source[key] === 'object' && source[key] !== null) {
            if (!target.hasOwnProperty(key)) {
                target[key] = {};
            }
            mergeObjects(target[key], source[key]);
        } else {
            target[key] = source[key];
        };
    };
};