import React, { useContext } from 'react';
import { WebSocketContext } from './WebSocketContext';

const ButtonPanel = () => {
    const { sendMessage } = useContext(WebSocketContext);
    const messages = [
        { 
            text: 'Assassino',
            data: {
                "type": "ASSASSIN",
                "payload": {
                    "targetPlayer": "019bb7a4-e85c-7fd6-921e-e735ef0cbf40",
                    "targetCardIndex": 1,
                }
            }
        },
        {
            text: 'Kamikaze',
            data: {
                "type": "KAMIKAZE",
                "payload": {
                    "targetPlayer": "019bb7a4-e85c-7fd6-921e-e735ef0cbf40",
                    "targetCardIndex": 0,
                    "targetAllyCardIndex": 1
                }
            }
        },
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

export default ButtonPanel;