import React, { useContext } from 'react';
import { WebSocketContext } from './WebSocketContext';

const ButtonPanel = ( {playerId} ) => {
    const { sendMessage, targetPlayer } = useContext(WebSocketContext);
    console.log({ sendMessage, targetPlayer, playerId });
    const messages = [
        {
            text: 'Contestar',
            data: {
                "type": "CONTEST",
                "payload": {}
            }
        },
        {
            text: 'Selecionar Carta',
            data: {
                "type": "CONTEST_PENALTY",
                "payload": {
                    "TargetCardIndex": 1
                }
            }
        },
        { 
            text: 'Assassino',
            data: {
                "type": "ASSASSIN",
                "payload": {
                    "targetPlayer": targetPlayer,
                    "targetCardIndex": 0,
                }
            }
        },
        {
            text: 'Kamikaze',
            data: {
                "type": "KAMIKAZE",
                "payload": {
                    "targetPlayer": targetPlayer,
                    "targetCardIndex": 0,
                    "targetAllyCardIndex": 1
                }
            }
        },
        {
            text: 'Trilionario',
            data: {
                "type": "TRILLIONAIRE",
                "payload": null
            }
        },
        {
            text: 'Politica',
            data: {
                "type": "POLITICAL",
                "payload": null
            }
        },
        {
            text: 'Rebelde',
            data: {
                "type": "REBEL",
                "payload": null
            }
        },
        {
            text: 'Clarividente',
            data: {
                "type": "CLAIRVOYANT",
                "payload": {
                    "targetPlayer": targetPlayer,
                    "targetCardIndex": 0,
                    "showToAllPlayers": false
                }
            }
        },
        {
            text: 'Guardiã',
            data: {
                "type": "GUARDIAN",
                "payload": {
                    "targetPlayer": playerId,
                    "targetCardIndex": 0
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