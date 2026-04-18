import { ENV } from "../config/envs";
import decodeJWT from "./decodeJWT";

export default async function handleCredentialResponse(response: {
  credential: string;
}, setAuth: (token: string, playerId: string) => void) {

  const res = await fetch(`${ENV.VITE_BACKEND_URL}/auth/external/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ IdToken: response.credential }),
  });
  const resJSON = await res.json();

  if (resJSON.message === "logged_in") {
    const token = resJSON.data.token;
    const tokenClaims = decodeJWT(token);
    const playerIdFromToken = tokenClaims?.id;

    setAuth(token, playerIdFromToken);
  } else if (resJSON.message === "need_additional_data") {
    const username = prompt("Novo usuário! Escolha um nome de usuário:");
    const completeRes = await fetch(`${ENV.VITE_BACKEND_URL}/auth/external/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ IdToken: response.credential, username }),
    });
    const completeData = await completeRes.json();
    const token = completeData.data.token;
    const tokenClaims = decodeJWT(token);
    const playerIdFromToken = tokenClaims?.id;

    setAuth(token, playerIdFromToken);
  } else {
    alert("Erro no login: " + resJSON.message);
  }
}
