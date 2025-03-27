import { useState } from "react";
import { RegisterService } from "../services/registerService";

interface RegisterFormData {
  nickname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

function RegisterView() {
  const [data, setData] = useState<RegisterFormData>({
    nickname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (data.nickname.length < 3 || data.nickname.length > 22) {
      setError("Nick inválido.");
      return;
    }

    if (data.email.length < 5 || data.email.length > 42 || !data.email.includes("@")) {
      setError("Email inválido.");
      return;
    }

    if (data.password.length < 8 || data.password.length > 42 || data.password === data.nickname) {
      setError("Senha inválida.");
      return;
    }

    if (data.password !== data.confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    const response = await RegisterService.register(
      data.nickname,
      data.email,
      data.password
    );

    if (response.status === "error") {
      setError(response.message);
    }
  };

  return (
    <form id="registerForm" onSubmit={handleSubmit}>
      <label>Nick:</label>
      <input
        name="nickname"
        value={data.nickname}
        onChange={handleChange}
        type="text"
        required
        minLength={3}
        maxLength={22}
      />
      <br />
      <label>Email:</label>
      <input
        name="email"
        value={data.email}
        onChange={handleChange}
        type="email"
        required
        minLength={5}
        maxLength={42}
      />
      <br />
      <label>Senha:</label>
      <input
        name="password"
        value={data.password}
        onChange={handleChange}
        type="password"
        required
        minLength={8}
        maxLength={42}
      />
      <br />
      <label>Confirme senha:</label>
      <input
        name="confirmPassword"
        type="password"
        value={data.confirmPassword}
        onChange={handleChange}
        required
        minLength={8}
        maxLength={42}
      />
      <br />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit">Criar Usuário</button>
    </form>
  );
}

export default RegisterView;