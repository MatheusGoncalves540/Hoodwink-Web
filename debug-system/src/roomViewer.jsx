import React, { useState, useEffect, useContext } from 'react';
import { WebSocketContext } from './WebSocketContext';

function RoomViewer({ ticket }) {
  const { ws, status: wsStatus } = useContext(WebSocketContext);
  const [dynamicText, setDynamicText] = useState('Aguardando mensagens...');
  const [status, setStatus] = useState('Conectando...');
  const [reconnectTrigger, setReconnectTrigger] = useState(0);

  useEffect(() => {
    setStatus(wsStatus);
  }, [wsStatus]);

  useEffect(() => {
    if (!ws) return;

    const handleMessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        setDynamicText(JSON.stringify(parsed, null, 2));
      } catch (e) {
        setDynamicText(event.data);
      }
    };

    ws.addEventListener('message', handleMessage);

    return () => {
      ws.removeEventListener('message', handleMessage);
    };
  }, [ws]);

  const handleReconnect = () => {
    setReconnectTrigger(prev => prev + 1);
  };

  return (
    <div style={{
      width: '50%',
      height: '80%',
      border: '2px solid #000',
      backgroundColor: '#f0f0f0',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      margin: '0 auto'
    }}>
      <div style={{
        padding: '10px',
        fontSize: '14px',
        fontWeight: 'bold',
        textAlign: 'center',
        borderBottom: '1px solid #000',
        backgroundColor: status === 'Conectado' ? '#d4edda' : status === 'Desconectado' ? '#f8d7da' : '#fff3cd',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span>Status: {status}</span>
        <button onClick={handleReconnect} disabled={!ticket}>Reconectar</button>
      </div>
      <div style={{
        flex: 1,
        padding: '10px',
        fontSize: '16px',
        textAlign: 'left',
        overflow: 'auto',
        whiteSpace: 'pre-wrap'
      }}>
        {dynamicText}
      </div>
    </div>
  );
}

export default RoomViewer;
