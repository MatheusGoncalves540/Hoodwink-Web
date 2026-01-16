import React, { createContext, useRef, useState, useEffect, useCallback } from 'react';

export const WebSocketContext = createContext();

export const WebSocketProvider = ({ ticket, children }) => {
  const wsRef = useRef(null);
  const [status, setStatus] = useState('Conectando...');

  useEffect(() => {
    if (!ticket) {
      setStatus('Sem ticket');
      return;
    }

    const ws = new WebSocket('ws://localhost:5000/game?Ticket=' + ticket);

    ws.onopen = () => {
      console.log('WebSocket conectado (Context)');
      setStatus('Conectado');
      wsRef.current = ws;
    };

    ws.onclose = () => {
      console.log('WebSocket desconectado');
      setStatus('Desconectado');
      wsRef.current = null;
    };

    ws.onerror = (error) => {
      console.error('Erro no WebSocket:', error);
      setStatus('Erro na conexão');
    };

    return () => {
      ws.close();
    };
  }, [ticket]);

  const sendMessage = useCallback((data) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
      console.log('Mensagem enviada:', data);
    } else {
      console.warn('WebSocket não está pronto para enviar mensagens');
    }
  }, []);

  return (
    <WebSocketContext.Provider value={{ sendMessage, status, ws: wsRef.current }}>
      {children}
    </WebSocketContext.Provider>
  );
};
