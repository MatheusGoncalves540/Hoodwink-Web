//recebe msg do servidor
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
            FirstReceipt(msg);
            updateScreenInfos(msg);
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