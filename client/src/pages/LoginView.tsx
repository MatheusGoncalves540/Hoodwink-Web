import { useState } from "react";
import { LoginService } from "../services/loginService";

interface LoginFormData {
  email: string;
  password: string;
}

function LoginView() {
  const [data, setData] = useState<LoginFormData>({
    email: "",
    password: ""
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

  const LoginForm = async () => {
    setError("");
    const response = await LoginService.login(
      data.email,
      data.password
    );

    if (response.response.data.status == "error") {
      setError(response.response.data.message);
    }
  };

  return (
    <div id="registerForm">
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
        min={8}
        type="password"
        required
      />
      <br />
      {error && <p style={{ color: "red" }}>{error}</p>}{" "}
      {/* Exibe erro se houver */}
      <button onClick={LoginForm}>Criar Usuário</button>
    </div>
  );
}

export default LoginView;
