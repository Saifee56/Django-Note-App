import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      username,
      password,
    };

    try {
      const response = await axios.post('http://127.0.0.1:8000/admin_panel/admin-login/login-admin/', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { tokens, message } = response.data;

      Cookies.set('access_token', tokens.access, { expires: 1 }); 
      Cookies.set('refresh_token', tokens.refresh, { expires: 7 }); 

      setMessage(message);

      navigate('/admin-dashboard'); 
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data?.error) {
        setMessage(error.response.data.error);
      } else {
        setMessage('Login failed. Please try again.');
      }
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', paddingTop: '50px' }}>
      <h2>Admin Login</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%' }}
          />
        </div>
        <button type="submit" style={{ width: '100%' }}>Login</button>
      </form>
    </div>
  );
}

export default AdminLogin;
