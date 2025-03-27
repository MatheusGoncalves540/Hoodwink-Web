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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const response = await LoginService.login(
      data.email,
      data.password
    );

    if (response.response.data.status === "error") {
      setError(response.response.data.message);
    }
  };

  return (
    <form id="loginForm" onSubmit={handleSubmit}>
      <label>Email:</label>
      <input
        name="email"
        value={data.email}
        onChange={handleChange}
        type="email"
        required
        minLength={5}
        maxLength={41}
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
        maxLength={41}
      />
      <br />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit">Entrar</button>
    </form>
  );
}

export default LoginView;
