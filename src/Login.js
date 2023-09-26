
import React from 'react';

function Login() {
    return (
        <div id="login-menu">
            <div id="login-container">
                <p>To use this app, you must give us permission to use your spotify data</p>
                <a href="http://localhost:5000/auth/login" >
                    <button className="green-button">Login with Spotify</button>
                </a>
            </div>
        </div>

    );
}

export default Login;
