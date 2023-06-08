import React from 'react';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from "react";
import { UserLogin } from "../universal/manipulateDB";

export function Login() {

  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = data => UserLogin(data);
  //const onSubmit = data => console.log(data);
  //console.log(errors);

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

  let test = ({user}) => (<p>{JSON.stringify(user)}</p>);
  
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
      <div>{test}</div>
    </div>
  );
}