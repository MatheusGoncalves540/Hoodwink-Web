import { useState, type FormEvent } from "react";
import { Button, Dialog, Flex, Separator, Text, TextField } from "@radix-ui/themes";
import { useGoogleLogin } from "./auth/hooks/useGoogleLogin";
import type { AuthProviderId, LoginCredentials } from "./auth/types";

type LoginModalProps = {
	triggerLabel?: string;
	enabledProviders?: AuthProviderId[];
	onLogin?: (credentials: LoginCredentials) => void;
	onGoogleLoginToken?: (token: string) => void;
};

export default function LoginModal({
	triggerLabel = "Entrar",
	enabledProviders = ["credentials", "google"],
	onLogin,
	onGoogleLoginToken,
}: LoginModalProps) {
	const [open, setOpen] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const hasCredentials = enabledProviders.includes("credentials");
	const hasGoogle = enabledProviders.includes("google");

	const { status, googleButtonRef } = useGoogleLogin({
		enabled: open && hasGoogle,
		onSuccessToken: (token) => {
			onGoogleLoginToken?.(token);
			setOpen(false);
		},
	});

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		onLogin?.({ email, password });
		setOpen(false);
	};

	return (
		<Dialog.Root open={open} onOpenChange={setOpen}>
			<Dialog.Trigger>
				<Button>{triggerLabel}</Button>
			</Dialog.Trigger>

			<Dialog.Content maxWidth="420px">
				<Dialog.Title>Login</Dialog.Title>
				<Dialog.Description size="2" mb="4">
					Entre com seu e-mail e senha para continuar.
				</Dialog.Description>

				<Flex direction="column" gap="3">
					{hasCredentials ? (
						<form onSubmit={handleSubmit}>
							<Flex direction="column" gap="3">
								<label>
									<Text as="div" size="2" mb="1" weight="bold">
										E-mail
									</Text>
									<TextField.Root
										required
										type="email"
										placeholder="seuemail@exemplo.com"
										value={email}
										onChange={(event) => setEmail(event.target.value)}
									/>
								</label>

								<label>
									<Text as="div" size="2" mb="1" weight="bold">
										Senha
									</Text>
									<TextField.Root
										required
										type="password"
										placeholder="••••••••"
										value={password}
										onChange={(event) => setPassword(event.target.value)}
									/>
								</label>

								<Flex gap="3" mt="4" justify="end">
									<Dialog.Close>
										<Button variant="soft" color="gray" type="button">
											Cancelar
										</Button>
									</Dialog.Close>
									<Button type="submit">Entrar</Button>
								</Flex>
							</Flex>
						</form>
					) : null}

					{hasGoogle && hasCredentials ? <Separator size="4" my="2" /> : null}

					{hasGoogle ? (
						<Flex direction="column" gap="2" align="center">
							<div ref={googleButtonRef} />
							{status ? (
								<Text size="1" color="gray" style={{ lineBreak: "anywhere" }}>
									{status}
								</Text>
							) : null}
						</Flex>
					) : null}
				</Flex>
			</Dialog.Content>
		</Dialog.Root>
	);
}
