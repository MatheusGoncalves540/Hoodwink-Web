import ReactDOM from "react-dom/client";
import GoogleAuth from "./googleAuth.jsx";
import RoomViewer from "./roomViewer.jsx";

function App() {
  return (
    <>
      <GoogleAuth />
      <RoomViewer />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);