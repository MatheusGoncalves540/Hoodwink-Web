import { useEffect, useRef } from "react";
import handleCredentialResponse from "../auth/handleCredentialResponse";
import { useAuthStore } from "../store/authStore";
import { ENV } from "../config/envs";
import isTokenExpired from "../auth/isTokenExpired";

function GoogleAuth() {
  const { jwtToken, closeLogin, setAuth } = useAuthStore();
  const buttonRef = useRef<HTMLDivElement>(null);

  // Inicializa o Google Sign-In quando o componente é montado
  useEffect(() => {
    if (!window.google?.accounts?.id || !buttonRef.current) return;

    window.google.accounts.id.initialize({
      client_id: ENV.VITE_GOOGLE_CLIENT_ID,
      callback: (response) => handleCredentialResponse(response, setAuth),
    });

    window.google.accounts.id.renderButton(buttonRef.current, {
      type: "standard",
      theme: "outline",
      size: "large",
    });
  }, [setAuth]);

  // Verifica a validade do token JWT sempre que ele for atualizado
  useEffect(() => {
    if (!jwtToken) return;

    if (isTokenExpired(jwtToken)) {
      alert("Token JWT expirado. Faça login novamente.");
      closeLogin();
      return;
    }
  }, [jwtToken, closeLogin]);

  // Renderiza o botão do Google Sign-In
  return (
    <div
      style={{
        maxWidth: "100%",
        lineBreak: "anywhere",
      }}
    >
      <div ref={buttonRef}></div>
    </div>
  );
}

export default GoogleAuth;
