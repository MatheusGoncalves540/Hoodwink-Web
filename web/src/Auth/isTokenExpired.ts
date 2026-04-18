function isTokenExpired(token: string): boolean {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const tokenData = JSON.parse(decoded);
    const currentTime = Math.floor(Date.now() / 1000);
    return tokenData.exp < currentTime;
  } catch (error) {
    console.error("Erro ao verificar expiração do token:", error);
    return true; // Considera o token expirado em caso de erro
  }
}

export default isTokenExpired;