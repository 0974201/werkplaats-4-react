import React from 'react';
import { useForm } from 'react-hook-form';
import { UserLogin } from "../universal/manipulateDB";

export function Login() {

  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = data => UserLogin(data);
  //const onSubmit = data => console.log(data);
  //console.log(errors);
  
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