import React from 'react';
import { useState } from "react";
//import { UserLogin } from "../universal/loginDB";
import { useNavigate } from 'react-router';

async function getUser(login){
  return fetch('http://127.0.0.1:81/handle_login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(login)
  })
  .then(res => res.json());
}

export function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async e => {
    e.preventDefault();
    const user = await getUser({
      email,
      password
    });
    console.log(user);
    sessionStorage.setItem('user', JSON.stringify(user));

    if(user !== null){
      console.log('yo');
      navigate('/login');
    }
  }

  return (
    <div className='login_container'>
      <h1><p className="login_header"><b>Log in</b></p></h1>
      <form onSubmit={handleSubmit}>
          <label htmlFor="email">E-mail:</label> <br/>
          <input type="email" placeholder="E-mail" onChange={e => setEmail(e.target.value)} /> <br/>
          <label htmlFor="password">Password:</label> <br/>
          <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} /> <br/><br/>
          <input type="submit" className="submit-btn5"/>
      </form>
    </div>
  );
}