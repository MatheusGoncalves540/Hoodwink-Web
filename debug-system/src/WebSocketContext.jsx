import React, { createContext, useRef, useState, useEffect, useCallback } from 'react';

export const WebSocketContext = createContext();

export const WebSocketProvider = ({ ticket, targetPlayer, targetCardIndex, children }) => {
  const wsRef = useRef(null);
  const [status, setStatus] = useState('Conectando...');

  const connect = useCallback(() => {
    if (!ticket) {
      setStatus('Sem ticket');
      return;
    }

    if (wsRef.current && wsRef.current.readyState !== WebSocket.CLOSED) {
      wsRef.current.close();
    }

    setStatus('Conectando...');
    const ws = new WebSocket('ws://localhost:4444/game?Ticket=' + ticket);
    wsRef.current = ws;

    ws.onopen = () => {
      if (wsRef.current !== ws) return;
      console.log('WebSocket conectado (Context)');
      setStatus('Conectado');
    };

    ws.onclose = () => {
      if (wsRef.current !== ws) return;
      console.log('WebSocket desconectado');
      setStatus('Desconectado');
      wsRef.current = null;
    };

    ws.onerror = (error) => {
      if (wsRef.current !== ws) return;
      console.error('Erro no WebSocket:', error);
      setStatus('Erro na conexão');
    };
  }, [ticket]);

  useEffect(() => {
    connect();
    return () => {
      if (wsRef.current && wsRef.current.readyState !== WebSocket.CLOSED) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  const sendMessage = useCallback((data) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
      console.log('Mensagem enviada:', data);
    } else {
      console.warn('WebSocket não está pronto para enviar mensagens');
    }
  }, []);

  const reconnect = useCallback(() => {
    connect();
  }, [connect]);

  return (
    <WebSocketContext.Provider value={{ sendMessage, status, ws: wsRef.current, targetPlayer, reconnect, targetCardIndex }}>
      {children}
    </WebSocketContext.Provider>
  );
};
