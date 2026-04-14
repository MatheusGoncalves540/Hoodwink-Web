const BACKEND_URL = "http://localhost:8088/auth/external/google";

export default async function handleCredentialResponse(response: any, setStatus: any, setJwtToken: any, decodeJWT: any, setPlayerId: any) {
    const res = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ IdToken: response.credential }),
    });
    const data = await res.json();

    if (data.message === "logged_in") {
      const token = data.data.token;
      setStatus("Login concluído. Token JWT: " + token);
      setJwtToken(token);

      const tokenClaims = decodeJWT(token);
      const playerIdFromToken = tokenClaims?.id;

      setPlayerId(playerIdFromToken);

    } else if (data.message === "need_additional_data") {
      const username = prompt("Novo usuário! Escolha um nome de usuário:");
      const completeRes = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ IdToken: response.credential, username }),
      });
      const completeData = await completeRes.json();
      const token = completeData.data.token;

      setStatus("Cadastro finalizado. Token JWT: " + token);
      setJwtToken(token);

      const tokenClaims = decodeJWT(token);
      const playerIdFromToken = tokenClaims?.id;

      setPlayerId(playerIdFromToken);

    } else {
      setStatus("Erro: " + JSON.stringify(data));
    }
}