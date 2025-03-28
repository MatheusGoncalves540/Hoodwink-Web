import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";

const Navbar: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Função para ler o valor do cookie
  const getCookie = (name: string): string | undefined => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";")?.shift();
  };

  // Verifica o status de login ao montar o componente
  useEffect(() => {
    // Verifica se o cookie 'jwt' existe (indica que o usuário está logado)
    const token = getCookie("userData");
    if (token) {
      setIsLoggedIn(true); // O usuário está logado
    } else {
      setIsLoggedIn(false); // O usuário não está logado
    }
  }, []); // Esse efe
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        {!isLoggedIn && (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
