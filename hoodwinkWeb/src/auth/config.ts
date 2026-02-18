const backendUrl = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:8080";
const gameServerUrl = import.meta.env.VITE_GAME_SERVER_URL ?? "http://localhost:5000";

export const FRONT_CONFIG = {
	backendUrl,
	gameServerUrl,
	googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "",
	googleBackendUrl:
		import.meta.env.VITE_GOOGLE_BACKEND_URL ?? `${backendUrl}/auth/external/google`,
	userTokenStorageKey: "hoodwink.userToken",
	roomBackendUrl: gameServerUrl,
};
