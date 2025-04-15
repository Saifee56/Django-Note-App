// src/components/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie'; // For handling cookies

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      username,
      password,
    };

    try {
      const response = await axios.post('http://127.0.0.1:8000/auth/login/', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { message, tokens } = response.data;
      setMessage(message);

      // Store tokens in cookies
      Cookies.set('access_token', tokens.access, { expires: 1 });
      Cookies.set('refresh_token', tokens.refresh, { expires: 7 });

      // Redirect user or show links for notes
      window.location.href = '/notes'; // You can redirect or update the state to show links

    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.detail || 'Login failed');
      } else {
        setMessage('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;
