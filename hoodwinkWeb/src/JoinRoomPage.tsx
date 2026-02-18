import { Button, Card, Container, Flex, Heading, Text, TextField } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FRONT_CONFIG } from "./auth/config";

export default function JoinRoomPage() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const [roomCode, setRoomCode] = useState("");
	const [status, setStatus] = useState("");

	useEffect(() => {
		const prefilledRoomId = searchParams.get("roomId");
		if (prefilledRoomId) {
			setRoomCode(prefilledRoomId);
		}
	}, [searchParams]);

	const handleJoinRoom = () => {
		const token = localStorage.getItem(FRONT_CONFIG.userTokenStorageKey);
		if (!token) {
			setStatus("Você precisa fazer login antes de entrar em sala.");
			return;
		}

		if (!roomCode.trim()) {
			setStatus("Informe o ID da sala.");
			return;
		}

		navigate(`/room/${encodeURIComponent(roomCode.trim())}`);
	};

	return (
		<Container size="2" p="4">
			<Flex align="center" justify="center" style={{ minHeight: "85vh" }}>
				<Card size="4" style={{ width: "100%", maxWidth: "520px" }}>
					<Flex direction="column" gap="4">
						<Heading size="6">Entrar em sala</Heading>
						<Text color="gray" size="2">
							Informe o ID da sala para entrar no jogo.
						</Text>
						<TextField.Root
							placeholder="ID da sala"
							value={roomCode}
							onChange={(event) => setRoomCode(event.target.value)}
						/>
						<Flex direction="column" gap="3">
							<Button size="3" disabled={!roomCode.trim()} onClick={handleJoinRoom}>
								Entrar
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
