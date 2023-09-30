import { useEffect, useState } from 'react';

const App = () => {
  const [message, setMessage] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/')
      .then(response => response.json())
      .then(({ data }) => {
        setMessage(data);
      })
      .catch(error => {
        console.log(error);
      })

    fetch('http://localhost:8080/api/dbtest')
      .then(response => response.json())
      .then(data => {
        setItems(data);
      })
      .catch(error => {
        console.log(error);
      })
  }, []);

  return (
    <div>
      <h1>{message}</h1>
      <h2>These items are fetched from the database:</h2>
      <ul>
        {items.map(item => <li key={item.id}>{item.stuff}</li>)}
      </ul>
    </div>
  );
};

export default App;