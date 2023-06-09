import React from 'react';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from "react";
import { UserLogin } from "../universal/loginDB";
import { redirect } from 'react-router';

export function Login(derp) {

  const { register, handleSubmit } = useForm();
  const onSubmit = data => UserLogin(data);

  const [user, setUser] = useState([]);
  
  useEffect(() => {
    fetch('http://127.0.0.1:81/post_login',{
      'methods':'GET',
      headers: {
        'Content-Type':'application/json'
      }
    })
    .then(response => response.json())
    .then(response => setUser(response))
    .catch(error => console.error(error));
  },[]); // uh, okay dus we hebben nu de user.. wat nu?

  console.log(user);
  console.log(typeof user);

  derp = user;
  console.log(derp);

  if(!derp === null){
    redirect('/surveylist')
  }
  
  return (
    <div className='login_container'>
      <h1><p className="login_header"><b>Log in</b></p></h1>
      <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="email">E-mail:</label> <br/>
          <input type="email" placeholder="E-mail" {...register("email", {})} /> <br/>
          <label htmlFor="password">Password:</label> <br/>
          <input type="password" placeholder="Password" {...register("password", {})} /> <br/><br/>
          <input type="submit" className="submit-btn5"/>
      </form>
    </div>
  );
}