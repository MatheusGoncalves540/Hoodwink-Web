import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import GoogleAuth from "./googleAuth.jsx";
import RoomViewer from "./roomViewer.jsx";
import ButtonPanel from "./ButtonPanel.jsx";
import CommandPanel from "./CommandPanel.jsx";
import { WebSocketProvider } from "./WebSocketContext.jsx";

function App() {
  const [ticket, setTicket] = useState('');
  const [roomId, setRoomId] = useState(localStorage.getItem('roomId') || '');
  const [jwtToken, setJwtToken] = useState(localStorage.getItem('jwtToken') || '');

  const setJwtTokenWithStorage = (token) => {
    localStorage.setItem('jwtToken', token);
    setJwtToken(token);
  };

  const updateTicket = async () => {
    const newRoomId = prompt("insira o RoomId", roomId);
    setRoomId(newRoomId);
    localStorage.setItem('roomId', newRoomId);
    try {
      const response = await fetch(`http://localhost:5000/getTicket/${newRoomId}`, {
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

  return (
    <WebSocketProvider ticket={ticket}>
      <GoogleAuth updateTicket={updateTicket} setJwtToken={setJwtTokenWithStorage} jwtToken={jwtToken} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <ButtonPanel />
        <RoomViewer ticket={ticket} />
        <CommandPanel />
      </div>
    </WebSocketProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);