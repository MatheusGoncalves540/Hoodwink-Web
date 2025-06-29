import { useEffect } from 'react'

export function useSocket(url: string) {
  useEffect(() => {
    const socket = new WebSocket(url)
    socket.onopen = () => console.log('WebSocket conectado')
    socket.onmessage = (event) => console.log('Mensagem recebida:', event.data)
    socket.onclose = () => console.log('WebSocket fechado')
    return () => socket.close()
  }, [url])
}
