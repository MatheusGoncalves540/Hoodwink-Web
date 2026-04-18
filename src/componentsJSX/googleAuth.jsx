import { useEffect } from "react";
import handleCredentialResponse from "../auth/handleCredentialResponse";
import { useAuthStore } from "../store/authStore";
import { ENV } from "../config/envs";
import isTokenExpired from "../auth/isTokenExpired";

function GoogleAuth() {
  const { jwtToken, closeLogin, setAuth } = useAuthStore();

  useEffect(() => {
    window.google.accounts.id.initialize({
      client_id: ENV.VITE_GOOGLE_CLIENT_ID,
      callback: (response) =>
        handleCredentialResponse(response, setAuth)
    });
    window.google.accounts.id.renderButton(
      document.getElementById("googleButton"),
      { theme: "outline", size: "large" },
    );
  }, []);

  useEffect(() => {
    //TODO mudar isso 
    if (jwtToken) {
      if (isTokenExpired(jwtToken)) {
        alert("Token JWT expirado. Faça login novamente.");
        closeLogin();
      } else {
        console.log("Token JWT carregado do localStorage: " + jwtToken);
      }
    }
  }, [jwtToken]);

  return (
    <div
      style={{
        maxWidth: "100%",
        lineBreak: "anywhere",
      }}
    >
      <div id="googleButton"></div>
    </div>
  );
}

export default GoogleAuth;
