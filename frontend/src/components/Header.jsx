import {React, useState} from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
  const [login, setLogin] = useState(false);
  function handleLogin() {
    if(!login){
      const resp = fetch('http://localhost:3000/auth/login')
      .then(response => response.json())
      .then((data) =>{
        if(data.message){
          setLogin(true);
        }
      } )
      .catch(error => console.error(error));
    }
  }

  return (
    <header>
      <nav>
        <ul>
          <li><NavLink to="#">Home</NavLink></li>
          <li><NavLink to="#">About</NavLink></li>
          <li><NavLink to="/send-bulk">Send Bulk</NavLink></li>
          <li>
            <button onClick = {handleLogin}>{login ? 'Logout' : 'Login'}</button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;