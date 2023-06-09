import React from 'react';

/* No idea if forms still work the same here.. 
   <br> by itself does not work for React
    Try <br></br> and for input fields they require a /> at the end */

export function Login() {
    return (
        <div className='login_container'>
            <form action="/handle_login" method="POST" className="login-form">
                <p className="login_header"><h1><b>Log in</b></h1></p>
                <p className="username-field">
                    <label for="username"><b>Username or Email</b></label><br></br>
                    <input id="username" type="text" name="username" className="login-field" />
                </p>
                <p className="password-field">
                    <label for="password"><b>Password</b></label><br></br>
                    <input id="password" type="password" name="password" className="login-field" />
                </p>
                <p className="submit-btn5">
                    <input id="submit" type="submit" value="Login" className="submit" />
                </p>
            </form>
        </div>
    )
}