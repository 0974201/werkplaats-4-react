async function UserLogin(login){
  return fetch('http://127.0.0.1:81/handle_login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(login)
  })
  .then(res => res.json());
}

export { UserLogin }