import { useRouteLoaderData } from 'react-router-dom';
import LoginPage from './LoginPage.jsx';

const MainPage = () => {
  const [message, items] = useRouteLoaderData("root");
  const user = null;

  return (
    <div>
      <h1>{message}</h1>
      <h2>These items are fetched from the database:</h2>
      <ul>
        {items.map(item => <li key={item.id}>{item.stuff}</li>)}
      </ul>
      {!user && <LoginPage />}
    </div>
  );
};

export default MainPage;