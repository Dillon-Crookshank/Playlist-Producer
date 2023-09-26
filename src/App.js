import {useEffect, useState} from 'react';
import Producer from './Producer';
import Loader from './Loader';
import Login from './Login';
import './Css/App.css';


function App() {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);

  //fetch the Spotify API token from the backend 
  useEffect(() => {
    //give the site time to properly load
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);

    //fetch the api token from the backend
    fetch("http://localhost:5000/auth/token")
    .then(response => response.json())
    .then(data => {setToken(data.token);})
    .catch((e) => {console.log(e);});
  }, []);
  
  
  return (
    <>
      {loading ? <Loader/> 
      : ((token === '') ? <Login/> : <Producer token={token}/>)}
    </>
  );
}

export default App;
