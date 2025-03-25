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

  const RegisterForm = async () => {
    if (data.password !== data.confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }
    setError(""); // Reseta erro se estiver correto
    const response = await RegisterService.register(
      data.nickname,
      data.email,
      data.password
    );
    console.log(response)
    if (response.status == "error") {
      setError(response.message);
    }
  };

  return (
    <div id="registerForm">
      <label>Nick:</label>
      <input
        name="nickname"
        value={data.nickname}
        onChange={handleChange}
        type="text"
        required
      />
      <br />
      <label>Email:</label>
      <input
        name="email"
        value={data.email}
        onChange={handleChange}
        type="email"
        required
      />
      <br />
      <label>Senha:</label>
      <input
        name="password"
        value={data.password}
        onChange={handleChange}
        type="password"
        required
      />
      <br />
      <label>Confirme senha:</label>
      <input
        name="confirmPassword"
        type="password"
        value={data.confirmPassword}
        onChange={handleChange}
        required
      />
      <br />
      {error && <p style={{ color: "red" }}>{error}</p>}{" "}
      {/* Exibe erro se houver */}
      <button onClick={RegisterForm}>Criar Usuário</button>
    </div>
  );
}

export default RegisterView;
