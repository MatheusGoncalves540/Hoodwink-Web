import { FormEvent } from "react";
import { LoginService } from "../services/loginService";

interface RegisterFormData {
  nickname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

function RegisterView() {
  function RegisterForm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const data: RegisterFormData = {
      nickname: formData.get("nickname") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    };

    console.log(data.nickname);
    LoginService.register(data.nickname, data.email, data.password);
  }

  return (
    <form method="POST" id="registerForm" onSubmit={RegisterForm}>
      Nick: <input name="nickname" type="text" required />
      <br />
      Email: <input name="email" type="email" required />
      <br />
      Senha: <input name="password" type="password" required />
      <br />
      Confirme senha: <input name="confirmPassword" type="password" required />
      <br />
      <input type="submit" value="Criar Usuário" />
    </form>
  );
}

export default RegisterView;