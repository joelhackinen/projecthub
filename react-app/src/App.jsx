import './App.css';
import {
  Outlet,
  useLoaderData
} from 'react-router-dom';

const App = () => {
  const [ message, items ] = useLoaderData();

  return (
    <div>
      <h1>{message.data}</h1>
      <h2>These items are fetched from the database:</h2>
      <ul>
        {items.map(item => <li key={item.id}>{item.stuff}</li>)}
      </ul>

      <Outlet />
    </div>
  );
};

export default App;