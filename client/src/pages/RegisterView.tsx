function RegisterView() {
  return (
    <form method="POST" id="registerForm">
      <input type="text" required></input>
      <br></br>
      <input type="email" required></input>
      <br></br>
      <input type="password" required></input>
      <br></br>
      <input type="password" required></input>
      <br />
      <input type="submit" value="Criar Usuário" />
    </form>
  );
}
export default RegisterView;
