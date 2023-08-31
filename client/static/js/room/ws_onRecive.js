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
            for (const [key, value] of Object.entries(msg.content)) {
                gameData[key] = value;
            };
            if (msg.content.roomName) document.title = msg.content.roomName;
            if (msg.content.time) startTimer(msg.content.time.startTime);

            updateScreenInfos();
        break;
    
        default:
            break;
    };
};