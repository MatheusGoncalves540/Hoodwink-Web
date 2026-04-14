import { useEffect, useState } from "react";
import decodeJWT from "../decodeJWT";
import handleCredentialResponse from "../Auth/handleCredentialResponse";

const CLIENT_ID = "58863270996-45l8cn568h3uoauamoqkkdh9dh0o6ota.apps.googleusercontent.com";

function GoogleAuth({ updateTicket, setJwtToken, jwtToken, setPlayerId }) {
  const [status, setStatus] = useState("");

  useEffect(() => {
    window.google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: (response) => handleCredentialResponse(response, setStatus, setJwtToken, decodeJWT, setPlayerId),
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
