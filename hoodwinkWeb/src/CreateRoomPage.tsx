import {
	Button,
	Card,
	Container,
	Flex,
	Heading,
	Text,
	TextField,
} from "@radix-ui/themes";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FRONT_CONFIG } from "./auth/config";
import { createRoom } from "./room/api";

export default function CreateRoomPage() {
	const navigate = useNavigate();
	const [roomName, setRoomName] = useState("");
	const [password, setPassword] = useState("");
	const [maxPlayers, setMaxPlayers] = useState("4");
	const [status, setStatus] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleCreateRoom = async () => {
		const token = localStorage.getItem(FRONT_CONFIG.userTokenStorageKey);
		if (!token) {
			setStatus("Você precisa fazer login antes de criar sala.");
			return;
		}

		if (!roomName.trim()) {
			setStatus("Informe o nome da sala.");
			return;
		}

		setIsSubmitting(true);
		setStatus("Criando sala...");
		try {
			const result = await createRoom(token, {
				roomName: roomName.trim(),
				password,
				maxPlayers: Number(maxPlayers) || 4,
			});

			if (!result.roomId) {
				setStatus("Sala criada, mas não foi possível identificar o roomId.");
				return;
			}

			setStatus("Sala criada com sucesso. Redirecionando...");
			navigate(`/room/${encodeURIComponent(result.roomId)}`);
		} catch (error) {
			setStatus(error instanceof Error ? error.message : "Erro ao criar sala.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Container size="2" p="4">
			<Flex align="center" justify="center" style={{ minHeight: "85vh" }}>
				<Card size="4" style={{ width: "100%", maxWidth: "520px" }}>
					<Flex direction="column" gap="4">
						<Heading size="6">Criar sala</Heading>
						<Text color="gray" size="2">
							Defina os dados da sala para criar uma nova partida.
						</Text>
						<label>
							<Text as="div" size="2" mb="1" weight="bold">
								Nome da sala
							</Text>
							<TextField.Root
								placeholder="Sala nome Teste"
								value={roomName}
								onChange={(event) => setRoomName(event.target.value)}
							/>
						</label>
						<label>
							<Text as="div" size="2" mb="1" weight="bold">
								Senha
							</Text>
							<TextField.Root
								placeholder="passwo"
								type="password"
								value={password}
								onChange={(event) => setPassword(event.target.value)}
							/>
						</label>
						<label>
							<Text as="div" size="2" mb="1" weight="bold">
								Máximo de jogadores
							</Text>
							<TextField.Root
								type="number"
								min="2"
								max="10"
								value={maxPlayers}
								onChange={(event) => setMaxPlayers(event.target.value)}
							/>
						</label>
						<Flex direction="column" gap="3">
							<Button size="3" onClick={handleCreateRoom} loading={isSubmitting}>
								Criar agora
							</Button>
							<Button size="3" variant="soft" onClick={() => navigate("/")}>
								Voltar ao menu
							</Button>
							{status ? (
								<Text size="1" color="gray" style={{ lineBreak: "anywhere" }}>
									{status}
								</Text>
							) : null}
						</Flex>
					</Flex>
				</Card>
			</Flex>
		</Container>
	);
}
