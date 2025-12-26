import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import GoogleAuth from "./googleAuth.jsx";
import RoomViewer from "./roomViewer.jsx";

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
    <>
      <GoogleAuth updateTicket={updateTicket} setJwtToken={setJwtTokenWithStorage} jwtToken={jwtToken} />
      <RoomViewer ticket={ticket} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);