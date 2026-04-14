import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import GoogleAuth from "./googleAuth.jsx";
import RoomViewer from "./roomViewer.jsx";
import ChatViewer from "./ChatViewer.jsx";
import ButtonPanel from "./ButtonPanel.jsx";
import { WebSocketProvider } from "./WebSocketContext.jsx";

function App() {
  const [ticket, setTicket] = useState('');
  const [roomId, setRoomId] = useState(localStorage.getItem('roomId') || '');
  const [playerId, setPlayerId] = useState(localStorage.getItem('playerId') || '');
  const [jwtToken, setJwtToken] = useState(localStorage.getItem('jwtToken') || '');
  const [targetPlayer, setTargetPlayer] = useState(localStorage.getItem('targetPlayer') || '');
  const [targetCardIndex, setTargetCardIndex] = useState(localStorage.getItem('targetCardIndex') || '');

  const setJwtTokenWithStorage = (token) => {
    localStorage.setItem('jwtToken', token);
    setJwtToken(token);
  };

  const updateTicket = async () => {
    const newRoomId = prompt("insira o RoomId", roomId);
    setRoomId(newRoomId);
    localStorage.setItem('roomId', newRoomId);
    try {
      const response = await fetch(`http://localhost:4444/getTicket/${newRoomId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`
        }
      });
      const data = await response.json();
      setTicket(data.data.ticket);
    } catch (error) {
      console.error('Erro ao atualizar ticket:', error);
    }
  };

  const updateTarget = () => {
    const newTarget = prompt("insira o targetPlayer", targetPlayer);
    setTargetPlayer(newTarget);
    localStorage.setItem('targetPlayer', newTarget);
  };

  const updateTargetCardIndex = () => {
    const newTargetCardIndex = prompt("insira o targetCardIndex", targetCardIndex);
    setTargetCardIndex(newTargetCardIndex);
    localStorage.setItem('targetCardIndex', newTargetCardIndex);
  };

  const fetchCreateRoom = async () => {
    try {
      const response = await fetch("http://144.33.18.156:4444/newRoom", {
      method: 'POST',
      headers: {
        authorization: `Bearer ${jwtToken}`,
        'content-type': 'application/json'
      },
      body: '{"roomName":"Sala nome Teste212","password":"passwo","MaxPlayers":4}'
    });
      const data = await response.json();
      setRoomId(data.RoomId);
      console.log(data.RoomId);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <WebSocketProvider ticket={ticket} targetPlayer={targetPlayer} targetCardIndex={targetCardIndex}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f5f5f5' }}>
        {/* Header */}
        <div style={{ 
          backgroundColor: '#ffffff', 
          borderBottom: '2px solid #ddd', 
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ flex: 1 }}>
            <GoogleAuth updateTicket={updateTicket} setJwtToken={setJwtTokenWithStorage} jwtToken={jwtToken} setPlayerId={setPlayerId} />
          </div>
        </div>

        {/* Control Bar */}
        <div style={{
          backgroundColor: '#ffffff',
          padding: '12px 20px',
          display: 'flex',
          gap: '12px',
          borderBottom: '1px solid #eee'
        }}>
          <button onClick={updateTarget} style={{ 
            padding: '8px 16px',
            backgroundColor: '#8f1919',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            Mudar Player Alvo
          </button>
          <button onClick={updateTargetCardIndex} style={{ 
            padding: '8px 16px',
            backgroundColor: '#be7403',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            Mudar Index de Carta Alvo
          </button>
          <button onClick={fetchCreateRoom} style={{ 
            padding: '8px 16px',
            backgroundColor: '#2bb855',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            Criar Sala
          </button>
        </div>

        {/* Main Content */}
        <div style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '1fr 1.5fr 1fr',
          gap: '16px',
          padding: '16px 20px',
          overflow: 'hidden'
        }}>
          {/* Left Panel */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto',
            backgroundColor: '#ffffff',
            borderRadius: '6px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              padding: '16px',
              borderBottom: '1px solid #eee',
              fontWeight: '600',
              fontSize: '14px',
              color: '#333'
            }}>
              Ações
            </div>
            <div style={{ flex: 1, overflow: 'auto', padding: '12px' }}>
              <ButtonPanel playerId={playerId}/>
            </div>
          </div>

          {/* Center Panel */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            width: '100%',
            height: '100%',
            backgroundColor: '#ffffff',
            borderRadius: '6px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ flex: 1, overflow: 'hidden', width: '100%', height: '100%' }}>
              <RoomViewer ticket={ticket} />
            </div>
          </div>

          {/* Right Panel */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            width: '100%',
            height: '100%',
            backgroundColor: '#ffffff',
            borderRadius: '6px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ flex: 1, overflow: 'hidden', width: '100%', height: '100%' }}>
              <ChatViewer ticket={ticket} />
            </div>
          </div>
        </div>
      </div>
    </WebSocketProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);