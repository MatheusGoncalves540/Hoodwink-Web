import { useEffect, useState } from "react";
import {
	Box,
	Button,
	Card,
	Container,
	Flex,
	Heading,
	Text,
} from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";
import { FRONT_CONFIG } from "./auth/config";
import LoginModal from "./loginModal";

export default function Menu() {
	const navigate = useNavigate();
	const [userToken, setUserToken] = useState<string | null>(null);

	useEffect(() => {
		const storedToken = localStorage.getItem(FRONT_CONFIG.userTokenStorageKey);
		if (storedToken) {
			setUserToken(storedToken);
		}
	}, []);

	const handleLoginWithCredentials = ({ email }: { email: string }) => {
		const generatedToken = `local-${btoa(email)}`;
		localStorage.setItem(FRONT_CONFIG.userTokenStorageKey, generatedToken);
		setUserToken(generatedToken);
	};

	const handleGoogleLoginToken = (token: string) => {
		localStorage.setItem(FRONT_CONFIG.userTokenStorageKey, token);
		setUserToken(token);
	};

	const handleLogout = () => {
		localStorage.removeItem(FRONT_CONFIG.userTokenStorageKey);
		setUserToken(null);
	};

	const isLoggedIn = Boolean(userToken);

	return (
		<Box p="6" style={{ minHeight: "100vh" }}>
			<Container size="2">
				<Flex align="center" justify="center" style={{ minHeight: "85vh" }}>
					<Card size="4" style={{ width: "100%", maxWidth: "460px" }}>
						<Flex direction="column" gap="4">
							<Heading size="6">Hoodwink</Heading>

							{isLoggedIn ? (
								<>
									<Text color="gray" size="2">
										Selecione uma opção para continuar.
									</Text>
									<Flex direction="column" gap="3">
										<Button size="3" onClick={() => navigate("/room/create")}>
											Criar sala
										</Button>
										<Button
											size="3"
											variant="soft"
											onClick={() => navigate("/room/join")}
										>
											Entrar em sala
										</Button>
										<Button
											size="3"
											variant="outline"
											color="red"
											onClick={handleLogout}
										>
											Logout
										</Button>
									</Flex>
								</>
							) : (
								<>
									<Text color="gray" size="2">
										Acesse sua conta para entrar no jogo.
									</Text>
									<LoginModal
										triggerLabel="Entrar"
										onLogin={handleLoginWithCredentials}
										onGoogleLoginToken={handleGoogleLoginToken}
									/>
								</>
							)}
						</Flex>
					</Card>
				</Flex>
			</Container>
		</Box>
	);
}
