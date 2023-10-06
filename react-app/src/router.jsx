import { createBrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import LoginPage from './components/LoginPage.jsx';

const appLoader = async () => {
  const [res1, res2, /*res3*/] = await Promise.all([
    fetch('/api/'),
    fetch('/api/dbtest'),
    //fetch('/api/whoami'),
  ]);
  /*
  const { user } = await res3.json();
  if (!user) {
    redirect("/login")
  }
  */
  return [ (await res1.json()).data, (await res2.json()) ];
};


//tarvittavat api-kutsut voi tehä tuol routejen loadereissa nii periaattees ei enää tartte tunkee useEffectejä komponentteihin =D
//loader on siis vaa funktio joka suoritetaan ennen ku routen komponentti renderöidää,
//eli tismallee sama ku useEffect tyhjäl dependency arrayl


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    loader: appLoader,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
    ],
  },
]);

export default router;