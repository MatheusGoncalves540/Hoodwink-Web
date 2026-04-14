import React, { useState, useEffect, useContext } from 'react';
import { WebSocketContext } from './WebSocketContext';

function ChatViewer({ ticket }) {
  const { ws } = useContext(WebSocketContext);
  const [roomData, setRoomData] = useState(null);

  const formatDate = (value) => {
    if (!value) return '—';
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString();
  };

  useEffect(() => {
    if (!ws) return;

    const handleMessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          setRoomData(parsed);
        }
      } catch (e) {
        // Handle error silently
      }
    };

    ws.addEventListener('message', handleMessage);

    return () => {
      ws.removeEventListener('message', handleMessage);
    };
  }, [ws]);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      border: '2px solid #000',
      backgroundColor: '#f0f0f0',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        padding: '10px',
        fontSize: '14px',
        fontWeight: 'bold',
        textAlign: 'center',
        borderBottom: '1px solid #000',
        backgroundColor: '#e3f2fd'
      }}>
        <span>Chat</span>
      </div>
      <div style={{
        flex: 1,
        padding: '10px',
        fontSize: '14px',
        textAlign: 'left',
        overflow: 'auto',
        overflowX: 'hidden',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        {roomData?.chat && roomData.chat.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', boxSizing: 'border-box' }}>
            {roomData.chat.map((msg, idx) => (
              <div key={idx} style={{ border: '1px solid #e0e0e0', borderRadius: '4px', padding: '8px', backgroundColor: '#fafafa', fontSize: '13px' }}>
                <div><strong>{msg.playerName}</strong> <span style={{ fontSize: '11px', color: '#999' }}>({formatDate(msg.timestamp)})</span></div>
                <div style={{ marginLeft: '12px', marginTop: '4px', wordBreak: 'break-word' }}>{msg.message}</div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
            Nenhuma mensagem no chat.
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatViewer;
