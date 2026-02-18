import { FRONT_CONFIG } from "../config";
import type { GoogleAuthResponse } from "../types";

export type GoogleCredentialResponse = {
	credential: string;
};

type GoogleAuthApi = {
	accounts: {
		id: {
			initialize: (options: {
				client_id: string;
				callback: (response: GoogleCredentialResponse) => void;
			}) => void;
			renderButton: (
				element: HTMLElement,
				options: {
					theme?: "outline" | "filled_blue" | "filled_black";
					size?: "large" | "medium" | "small";
					width?: string;
				}
			) => void;
		};
	};
};

declare global {
	interface Window {
		google?: GoogleAuthApi;
	}
}

let googleScriptPromise: Promise<void> | null = null;

export async function loadGoogleScript() {
	if (window.google) {
		return;
	}

	if (!googleScriptPromise) {
		googleScriptPromise = new Promise((resolve, reject) => {
			const existingScript = document.querySelector<HTMLScriptElement>(
				'script[src="https://accounts.google.com/gsi/client"]'
			);

			if (existingScript) {
				existingScript.addEventListener("load", () => resolve(), { once: true });
				existingScript.addEventListener(
					"error",
					() => reject(new Error("Falha ao carregar script do Google.")),
					{ once: true }
				);
				return;
			}

			const script = document.createElement("script");
			script.src = "https://accounts.google.com/gsi/client";
			script.async = true;
			script.defer = true;
			script.onload = () => resolve();
			script.onerror = () =>
				reject(new Error("Falha ao carregar script do Google."));
			document.head.appendChild(script);
		});
	}

	await googleScriptPromise;
}

export function renderGoogleButton(
	container: HTMLElement,
	onCredential: (response: GoogleCredentialResponse) => void
) {
	if (!FRONT_CONFIG.googleClientId) {
		throw new Error("VITE_GOOGLE_CLIENT_ID não configurado.");
	}

	if (!window.google) {
		throw new Error("SDK do Google não carregado.");
	}

	container.innerHTML = "";
	window.google.accounts.id.initialize({
		client_id: FRONT_CONFIG.googleClientId,
		callback: onCredential,
	});
	window.google.accounts.id.renderButton(container, {
		theme: "outline",
		size: "large",
		width: "320",
	});
}

async function exchangeGoogleToken(idToken: string, username?: string) {
	if (!FRONT_CONFIG.googleBackendUrl) {
		throw new Error("VITE_GOOGLE_BACKEND_URL não configurado.");
	}

	const response = await fetch(FRONT_CONFIG.googleBackendUrl, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ IdToken: idToken, username }),
	});

	if (!response.ok) {
		throw new Error("Falha ao autenticar com o backend.");
	}

	return (await response.json()) as GoogleAuthResponse;
}

export async function loginWithGoogleCredential(
	credential: string,
	requestUsername: () => string | null
) {
	const data = await exchangeGoogleToken(credential);

	if (data.message === "logged_in" && data.data?.token) {
		return data.data.token;
	}

	if (data.message === "need_additional_data") {
		const username = requestUsername();
		if (!username) {
			throw new Error("Cadastro cancelado: nome de usuário não informado.");
		}

		const completeData = await exchangeGoogleToken(credential, username);
		if (completeData.data?.token) {
			return completeData.data.token;
		}
		throw new Error(`Erro: ${JSON.stringify(completeData)}`);
	}

	throw new Error(`Erro: ${JSON.stringify(data)}`);
}
