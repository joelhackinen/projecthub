import { Outlet } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/App.css";
import InfoBar from "./components/InfoBar";

const App = () => {
  return (
    <div>
      <InfoBar />
      <Outlet />
    </div>
  );
};

export default App;
