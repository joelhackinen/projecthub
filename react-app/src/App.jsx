import { Outlet } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/App.css';

const App = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default App;