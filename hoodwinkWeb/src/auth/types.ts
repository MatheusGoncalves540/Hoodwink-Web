export type LoginCredentials = {
	email: string;
	password: string;
};

export type AuthProviderId = "credentials" | "google";

export type GoogleAuthResponse = {
	message: "logged_in" | "need_additional_data" | string;
	data?: {
		token?: string;
	};
};
