import { Button, Card, Container, Flex, Heading, Text } from "@radix-ui/themes";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FRONT_CONFIG } from "./auth/config";
import { buildGameWebSocketUrl, getRoomTicket } from "./room/api";

export default function RoomGamePage() {
	const navigate = useNavigate();
	const { roomId } = useParams<{ roomId: string }>();
	const [status, setStatus] = useState("Preparando conexão...");
	const [ticket, setTicket] = useState<string | null>(null);
	const [gameUrl, setGameUrl] = useState<string | null>(null);
	const socketRef = useRef<WebSocket | null>(null);

	useEffect(() => {
		const token = localStorage.getItem(FRONT_CONFIG.userTokenStorageKey);
		if (!token) {
			navigate("/", { replace: true });
			return;
		}

		if (!roomId) {
			navigate("/room/join", { replace: true });
			return;
		}

		let disposed = false;

		const connectToGame = async () => {
			try {
				setStatus("Buscando ticket da sala...");
				const result = await getRoomTicket(token, roomId);
				if (!result.ticket) {
					setStatus("Ticket não encontrado na resposta do backend.");
					return;
				}

				if (disposed) {
					return;
				}

				setTicket(result.ticket);
				const wsUrl = buildGameWebSocketUrl(result.ticket);
				setGameUrl(wsUrl);
				setStatus("Conectando ao servidor do jogo...");

				socketRef.current?.close();
				const socket = new WebSocket(wsUrl);
				socketRef.current = socket;

				socket.onopen = () => {
					if (!disposed) {
						setStatus("Conectado. O jogo acontece nesta sala.");
					}
				};

				socket.onerror = () => {
					if (!disposed) {
						setStatus("Falha ao conectar no WebSocket do jogo.");
					}
				};

				socket.onclose = () => {
					if (!disposed) {
						setStatus("Conexão encerrada.");
					}
				};
			} catch (error) {
				if (!disposed) {
					setStatus(
						error instanceof Error ? error.message : "Erro ao entrar na sala."
					);
				}
			}
		};

		void connectToGame();

		return () => {
			disposed = true;
			socketRef.current?.close();
		};
	}, [navigate, roomId]);

	return (
		<Container size="2" p="4">
			<Flex align="center" justify="center" style={{ minHeight: "85vh" }}>
				<Card size="4" style={{ width: "100%", maxWidth: "640px" }}>
					<Flex direction="column" gap="4">
						<Heading size="6">Sala {roomId}</Heading>
						<Text color="gray" size="2" style={{ lineBreak: "anywhere" }}>
							{status}
						</Text>
						{ticket ? (
							<Text size="1" color="gray" style={{ lineBreak: "anywhere" }}>
								Ticket: {ticket}
							</Text>
						) : null}
						{gameUrl ? (
							<Text size="1" color="gray" style={{ lineBreak: "anywhere" }}>
								WebSocket: {gameUrl}
							</Text>
						) : null}
						<Button variant="soft" onClick={() => navigate("/")}>
							Voltar ao menu
						</Button>
					</Flex>
				</Card>
			</Flex>
		</Container>
	);
}
