import { FRONT_CONFIG } from "../auth/config";

type CreateRoomPayload = {
	roomName: string;
	password: string;
	maxPlayers: number;
};

type CreateRoomResult = {
	roomId: string | null;
	response: unknown;
};

type TicketResult = {
	ticket: string | null;
	response: unknown;
};

function getAuthHeaders(token: string) {
	return {
		authorization: `Bearer ${token}`,
		"content-type": "application/json",
	};
}

function extractRoomId(payload: unknown): string | null {
	if (!payload || typeof payload !== "object") {
		return null;
	}

	const maybe = payload as {
		RoomId?: unknown;
		roomId?: unknown;
		id?: unknown;
		data?: {
			RoomId?: unknown;
			roomId?: unknown;
			id?: unknown;
		};
	};

	const roomId =
		maybe.data?.RoomId ??
		maybe.data?.roomId ??
		maybe.data?.id ??
		maybe.RoomId ??
		maybe.roomId ??
		maybe.id;
	return typeof roomId === "string" && roomId.length > 0 ? roomId : null;
}

function extractTicket(payload: unknown): string | null {
	if (!payload || typeof payload !== "object") {
		return null;
	}

	const maybe = payload as {
		ticket?: unknown;
		data?: {
			ticket?: unknown;
		};
	};

	const ticket = maybe.data?.ticket ?? maybe.ticket;
	return typeof ticket === "string" && ticket.length > 0 ? ticket : null;
}

async function parseResponseOrThrow(response: Response) {
	const rawText = await response.text();
	let data: unknown = null;
	if (rawText) {
		try {
			data = JSON.parse(rawText) as unknown;
		} catch {
			data = rawText;
		}
	}

	if (!response.ok) {
		const message =
			(data && typeof data === "object" && "message" in data
				? String((data as { message?: unknown }).message)
				: null) ?? `Erro HTTP ${response.status}`;
		throw new Error(message);
	}

	return data;
}

export async function createRoom(token: string, payload: CreateRoomPayload): Promise<CreateRoomResult> {
	const url = `${FRONT_CONFIG.gameServerUrl.replace(/\/$/, "")}/newRoom`;
	const response = await fetch(url, {
		method: "POST",
		headers: getAuthHeaders(token),
		body: JSON.stringify({
			roomName: payload.roomName,
			password: payload.password,
			MaxPlayers: payload.maxPlayers,
		}),
	});

	const data = await parseResponseOrThrow(response);
	return {
		roomId: extractRoomId(data),
		response: data,
	};
}

export async function getRoomTicket(token: string, roomId: string): Promise<TicketResult> {
	const normalizedBase = FRONT_CONFIG.gameServerUrl.replace(/\/$/, "");
	const url = `${normalizedBase}/getTicket/${encodeURIComponent(roomId)}`;
	const response = await fetch(url, {
		method: "POST",
		headers: {
			authorization: `Bearer ${token}`,
		},
	});

	const data = await parseResponseOrThrow(response);
	return {
		ticket: extractTicket(data),
		response: data,
	};
}

export function buildGameWebSocketUrl(ticket: string) {
	const normalizedGameUrl = FRONT_CONFIG.gameServerUrl.replace(/\/$/, "");
	const wsBase = normalizedGameUrl.startsWith("https://")
		? normalizedGameUrl.replace("https://", "wss://")
		: normalizedGameUrl.startsWith("http://")
			? normalizedGameUrl.replace("http://", "ws://")
			: normalizedGameUrl;

	return `${wsBase}/game?Ticket=${encodeURIComponent(ticket)}`;
}
