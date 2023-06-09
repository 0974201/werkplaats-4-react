import React from 'react';
import { useState } from "react";
import { UserLogin } from "../universal/loginDB";
import { useNavigate } from 'react-router';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async e => {
    e.preventDefault();
    const user = await UserLogin({
      email,
      password
    });
    console.log(user);
    
    if(user !== null){
      console.log('yo');
      localStorage.setItem("user", JSON.stringify(user));
      navigate('/surveylist');
    }
  }

  return (
    <div className='login_container'>
      <h1><p className="login_header"><b>Log in</b></p></h1>
      <form onSubmit={handleSubmit}>
          <label htmlFor="email">E-mail:</label> <br/>
          <input type="email" placeholder="E-mail" onChange={e => setEmail(e.target.value)} id="email" required /> <br/>
          <label htmlFor="password">Password:</label> <br/>
          <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} /> <br/><br/>
          <input type="submit" className="submit-btn5"/>
      </form>
    </div>
  );
}