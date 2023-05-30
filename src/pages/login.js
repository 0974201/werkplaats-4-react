import React from 'react';
import { useForm } from 'react-hook-form';
import { UserLogin } from "../universal/manipulateDB";

export function Login() {

  const { register, handleSubmit, formState: { errors } } = useForm();
  //const onSubmit = data => UserLogin(data);
  const onSubmit = data => console.log(data);
  console.log(errors);
  
  return (
    <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label for="email">E-mail:</label> <br/>
          <input type="email" placeholder="E-mail" {...register("E-mail", {})} /> <br/>
          <label for="password">Password:</label> <br/>
          <input type="password" placeholder="Password" {...register("Password", {})} /> <br/>
          <input type="submit" />
      </form>
    </div>
  );
}