import { useEffect, useState } from "react";

function UserLogin(user){
  fetch('http://localhost:81/handle_login', {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  });
  console.log(user);
  
}

export { UserLogin }