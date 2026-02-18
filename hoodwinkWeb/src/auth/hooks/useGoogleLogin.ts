import { useEffect, useRef, useState } from "react";
import {
	loadGoogleScript,
	loginWithGoogleCredential,
	renderGoogleButton,
} from "../providers/googleProvider";

type UseGoogleLoginOptions = {
	enabled: boolean;
	onSuccessToken?: (token: string) => void;
};

export function useGoogleLogin({ enabled, onSuccessToken }: UseGoogleLoginOptions) {
	const [status, setStatus] = useState("");
	const googleButtonRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!enabled) {
			return;
		}

		let cancelled = false;

		const initialize = async () => {
			try {
				await loadGoogleScript();

				if (cancelled || !googleButtonRef.current) {
					return;
				}

				renderGoogleButton(googleButtonRef.current, async (response) => {
					setStatus("Validando login Google...");
					try {
						const token = await loginWithGoogleCredential(response.credential, () =>
							prompt("Novo usuário! Escolha um nome de usuário:")
						);
						setStatus("Login com Google concluído.");
						onSuccessToken?.(token);
					} catch (error) {
						const message =
							error instanceof Error
								? error.message
								: "Erro inesperado no login Google.";
						setStatus(message);
					}
				});
			} catch (error) {
				const message =
					error instanceof Error
						? error.message
						: "Não foi possível carregar login do Google.";
				setStatus(message);
			}
		};

		void initialize();

		return () => {
			cancelled = true;
		};
	}, [enabled, onSuccessToken]);

	return {
		status,
		googleButtonRef,
	};
}
