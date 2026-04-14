import { useEffect, useState } from "react";
import decodeJWT from "./decodeJWT";

const CLIENT_ID = "58863270996-45l8cn568h3uoauamoqkkdh9dh0o6ota.apps.googleusercontent.com";
const BACKEND_URL = "http://localhost:8088/auth/external/google";

function GoogleAuth({ updateTicket, setJwtToken, jwtToken, setPlayerId }) {
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
    try {
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ IdToken: response.credential }),
      });

      console.log("STATUS:", res.status);

      const text = await res.text();
      console.log("RAW RESPONSE:", text);

      const data = JSON.parse(text);
      console.log("PARSED:", data);

    } catch (err) {
      console.error("ERRO REAL:", err);
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
