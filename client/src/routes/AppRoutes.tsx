import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import HomeView from "../pages/HomeView";
import LoginView from "../pages/LoginView";
import RegisterView from "../pages/RegisterView";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/login" element={<LoginView />} />
        <Route path="/register" element={<RegisterView />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
