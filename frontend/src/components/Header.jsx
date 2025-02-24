import {React, useState} from 'react';

const Header = () => {
  const [login, setLogin] = useState(false);
  function handleLogin() {
    if(!login){
      const login = fetch('http://localhost:3000/auth/login', {
        method: 'POST',
      })
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
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Contact</a></li>
          <li>
            <button onClick = {handleLogin}>{login ? 'Logout' : 'Login'}</button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;