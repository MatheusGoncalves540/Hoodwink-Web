import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import CreateRoomPage from "./CreateRoomPage";
import JoinRoomPage from "./JoinRoomPage";
import Menu from "./Menu";
import RoomGamePage from "./RoomGamePage";

export default function App() {
	return (
		<Theme
			appearance="dark"
			accentColor="blue"
			grayColor="sand"
			radius="large"
			scaling="95%"
		>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Menu />} />
					<Route path="/room/create" element={<CreateRoomPage />} />
					<Route path="/room/join" element={<JoinRoomPage />} />
					<Route path="/room/:roomId" element={<RoomGamePage />} />
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</BrowserRouter>
		</Theme>
	);
}
