import React, { useState, useEffect } from 'react';

function RoomViewer() {
  const [dynamicText, setDynamicText] = useState('Aguardando mensagens...');
  const [status, setStatus] = useState('Conectando...');

  const ticket = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwbGF5ZXJJZCI6IjAxOWI0N2UyLWIzM2MtNzZmNi1iZmZiLTg4NDlkMmY3MWQ0MyIsInVzZXJuYW1lIjoicG9ycm9saG8iLCJyb29tSWQiOiI2NWY3ZGE4OWM3ZWEzMDAiLCJleHAiOjE3NjY2MDM2NjJ9.SY6dWZmgAuENJx9VNwYkLae5SPveu_lVRmv2_vXGAUQ';
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:5000/game?Ticket=' + ticket);

    ws.onopen = () => {
      console.log('Conectado ao WebSocket');
      setStatus('Conectado');
    };

    ws.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        setDynamicText(JSON.stringify(parsed, null, 2));
      } catch (e) {
        setDynamicText(event.data);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket desconectado');
      setStatus('Desconectado');
    };

    ws.onerror = (error) => {
      console.error('Erro no WebSocket:', error);
      setStatus('Erro na conexão');
    };

    return () => {
      ws.close();
    };
  }, []);

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
        backgroundColor: status === 'Conectado' ? '#d4edda' : status === 'Desconectado' ? '#f8d7da' : '#fff3cd'
      }}>
        Status: {status}
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
