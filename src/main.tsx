import ReactDOM from "react-dom/client";
import { useAuthStore } from "./store/authStore";
import LoginModal from "./componentsTSX/LoginModal";
import "./main.css";

function App() {
  const openLogin = useAuthStore((state) => state.openLogin);

  return (
    <div>
      <button onClick={openLogin}>Login</button>
      <LoginModal />
    </div>
  );
  // return <InGame />;
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
