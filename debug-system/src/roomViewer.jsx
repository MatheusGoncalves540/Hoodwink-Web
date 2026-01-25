import React, { useState, useEffect, useContext } from 'react';
import { WebSocketContext } from './WebSocketContext';

function RoomViewer({ ticket }) {
  const { ws, status: wsStatus } = useContext(WebSocketContext);
  const [roomData, setRoomData] = useState(null);
  const [rawMessage, setRawMessage] = useState('Aguardando mensagens...');
  const [status, setStatus] = useState('Conectando...');
  const [reconnectTrigger, setReconnectTrigger] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);

  const formatDate = (value) => {
    if (!value) return '—';
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString();
  };

  const calculateTimeLeft = (expiresAt) => {
    if (!expiresAt) return null;
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry - now;
    if (diff <= 0) return 'Expirado';
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  useEffect(() => {
    setStatus(wsStatus);
  }, [wsStatus]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (roomData?.gameEvent?.ExpiresAt) {
        setTimeLeft(calculateTimeLeft(roomData.gameEvent.ExpiresAt));
      } else {
        setTimeLeft(null);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [roomData]);

  useEffect(() => {
    if (!ws) return;

    const handleMessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          setRoomData(parsed);
        } else {
          setRoomData(null);
        }
        setRawMessage(JSON.stringify(parsed, null, 2));
      } catch (e) {
        setRoomData(null);
        setRawMessage(event.data);
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
        fontSize: '14px',
        textAlign: 'left',
        overflow: 'auto'
      }}>
        {roomData ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <section style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '10px', backgroundColor: '#fff' }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>Informações Gerais</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '6px' }}>
                <div><strong>ID:</strong> {roomData.id || '—'}</div>
                <div><strong>Nome:</strong> {roomData.name || '—'}</div>
                <div><strong>Senha:</strong> {roomData.password || '—'}</div>
                <div><strong>Regras:</strong> {roomData.rules || '—'}</div>
                <div><strong>Timeout:</strong> {roomData.timeoutType || '—'}</div>
                <div><strong>Taxa:</strong> {roomData.tax ?? '—'}</div>
                <div><strong>Jogadores Máx.:</strong> {roomData.maxPlayers ?? '—'}</div>
                <div><strong>Turno:</strong> {roomData.turn ?? '—'}</div>
                <div><strong>Partida Custom:</strong> {roomData.customMatch ? 'Sim' : 'Não'}</div>
                <div><strong>Jogador Atual:</strong> {roomData.currentPlayer || '—'}</div>
                <div><strong>Deck:</strong> {Array.isArray(roomData.Deck) ? roomData.Deck.length : '—'}</div>
                <div><strong>Pendências:</strong> {Array.isArray(roomData.pendingEffects) ? roomData.pendingEffects.length : '—'}</div>
                <div><strong>Game Over:</strong> {roomData.gameOver ? 'Sim' : 'Não'}</div>
                <div><strong>Início:</strong> {formatDate(roomData.startTime)}</div>
                <div><strong>Criada:</strong> {formatDate(roomData.created)}</div>
              </div>
            </section>

            <section style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '10px', backgroundColor: '#fff' }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>Evento Atual</h3>
              {roomData.gameEvent ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '6px' }}>
                  <div><strong>Tipo:</strong> {roomData.gameEvent.Type || '—'}</div>
                  <div><strong>Jogador:</strong> {roomData.gameEvent.PlayerID || '—'}</div>
                  <div><strong>Expira:</strong> {formatDate(roomData.gameEvent.ExpiresAt)} {timeLeft && `(${timeLeft})`}</div>
                  <div><strong>Payload:</strong> {roomData.gameEvent.Payload ? JSON.stringify(roomData.gameEvent.Payload) : '—'}</div>
                </div>
              ) : (
                <span>Nenhum evento ativo.</span>
              )}
            </section>

            <section style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '10px', backgroundColor: '#fff' }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>Jogadores</h3>
              {roomData.players && Object.keys(roomData.players).length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {Object.values(roomData.players).map((player) => (
                    <div key={player.id} style={{ border: '1px solid #e0e0e0', borderRadius: '4px', padding: '8px', backgroundColor: '#fafafa' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '6px', marginBottom: '6px' }}>
                        <div><strong>ID:</strong> {player.id || '—'}</div>
                        <div><strong>Nome:</strong> {player.name || '—'}</div>
                        <div><strong>Moedas:</strong> {player.coins ?? '—'}</div>
                        <div><strong>Vivo:</strong> {player.alive ? 'Sim' : 'Não'}</div>
                      </div>
                      <div>
                        <strong>Cartas:</strong>
                        {player.cards && player.cards.length > 0 ? (
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '4px', marginTop: '4px' }}>
                            {player.cards.map((card) => (
                              <div key={`${player.id}-${card.index}`} style={{ border: '1px solid #dcdcdc', borderRadius: '4px', padding: '6px', backgroundColor: '#fff' }}>
                                <div><strong>Nome:</strong> {card.name || '—'}</div>
                                <div><strong>Índice:</strong> {card.index ?? '—'}</div>
                                <div><strong>Protegida:</strong> {card.protected ? 'Sim' : 'Não'}</div>
                                <div><strong>Morta:</strong> {card.dead ? 'Sim' : 'Não'}</div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span>Sem cartas.</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <span>Nenhum jogador cadastrado.</span>
              )}
            </section>

            <section style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '10px', backgroundColor: '#fff' }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>Dados Brutos</h3>
              <pre style={{ margin: 0, fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>{rawMessage}</pre>
            </section>
          </div>
        ) : (
          <pre style={{ margin: 0, fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>{rawMessage}</pre>
        )}
      </div>
    </div>
  );
}

export default RoomViewer;
