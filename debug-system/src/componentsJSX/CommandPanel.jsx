import React, { useContext } from 'react';
import { WebSocketContext } from './WebSocketContext';

const CommandPanel = () => {
    const { sendMessage } = useContext(WebSocketContext);
    const messages = [

    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', margin: '20px' }}>
            {messages.map((message, index) => (
                <button key={index} onClick={() => sendMessage(message.data)} style={{ margin: '6px 0' }}>
                    Enviar: {message.text}
                </button>
            ))}
        </div>
    );
};

export default CommandPanel;