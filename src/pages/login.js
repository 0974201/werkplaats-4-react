import React from 'react';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from "react";
import { UserLogin } from "../universal/loginDB";
import { useNavigate, redirect } from 'react-router';
import { async } from 'q';

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
  //const { register, handleSubmit } = useForm();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  //const onSubmit = data => UserLogin(data);
  const handleSubmit = async e => {
    e.preventDefault();
    const user = await getUser({
      email,
      password
    });
    console.log(user);
    sessionStorage.setItem('user', user);
    console.log(typeof user);
    if(user !== null){
      console.log('yo');
      navigate('/survey');
    }
  }

 // const [user, setUser] = useState([]);
  
  /*function getUser(){
    const response = fetch('http://127.0.0.1:81/post_login');
    const data = response;

    console.log(data);
  }
  getUser();

  console.log(getUser());

  //console.log(user);
  //console.log(typeof user);

  //derp = user;
  //console.log(derp);

  if(!derp === null){
    redirect('/surveylist')
  }*/
  
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