import { useEffect, useState } from "react";

const CLIENT_ID = "58863270996-45l8cn568h3uoauamoqkkdh9dh0o6ota.apps.googleusercontent.com";
const BACKEND_URL = "http://localhost:8080/auth/external/google";

function GoogleAuth({ updateTicket, setJwtToken, jwtToken }) {
  const [status, setStatus] = useState("");

  useEffect(() => {
    window.google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: handleCredentialResponse,
    });
    window.google.accounts.id.renderButton(
      document.getElementById("googleButton"),
      { theme: "outline", size: "large" }
    );
  }, []);

  useEffect(() => {
    if (jwtToken) {
      setStatus("Token JWT carregado do localStorage: " + jwtToken);
    }
  }, [jwtToken]);

  async function handleCredentialResponse(response) {
    const res = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ IdToken: response.credential }),
    });
    const data = await res.json();

    if (data.message === "logged_in") {
      setStatus("Login concluído. Token JWT: " + data.data.token);
      setJwtToken(data.data.token);
    } else if (data.message === "need_additional_data") {
      const username = prompt("Novo usuário! Escolha um nome de usuário:");
      const completeRes = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ IdToken: response.credential, username }),
      });
      const completeData = await completeRes.json();
      setStatus("Cadastro finalizado. Token JWT: " + completeData.data.token);
      setJwtToken(completeData.data.token);
    } else {
      setStatus("Erro: " + JSON.stringify(data));
    }
  }

  return (
    <div style={{
      maxWidth: "100%",
      lineBreak: "anywhere",
    }}>
      <div id="googleButton"></div>
      <p>{status}</p>
      <button onClick={updateTicket}>Atualize Ticket</button>
    </div>
  );
}

export default GoogleAuth;
