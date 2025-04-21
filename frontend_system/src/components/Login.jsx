import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom'; // import this

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // initialize navigate

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = { username, password };

    try {
      const response = await axios.post('http://127.0.0.1:8000/auth/login/', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { message, tokens } = response.data;
      setMessage(message);

      Cookies.set('access_token', tokens.access, { expires: 1 });
      Cookies.set('refresh_token', tokens.refresh, { expires: 7 });
      const finalUsername = returnedUsername || username;

      navigate('/notes');
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.detail || 'Login failed');
      } else {
        setMessage('An error occurred. Please try again.');
      }
    }
    localStorage.setItem('username', response.data.username);
  };

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f0f8ff',
      fontFamily: 'Segoe UI, sans-serif',
    },
    formWrapper: {
      backgroundColor: '#ffffff',
      padding: '40px',
      borderRadius: '12px',
      boxShadow: '0 8px 24px rgba(0, 0, 255, 0.1)',
      width: '100%',
      maxWidth: '400px',
    },
    heading: {
      textAlign: 'center',
      color: '#0077cc',
      marginBottom: '20px',
      fontSize: '1.8rem',
      fontWeight: 'bold',
    },
    formGroup: {
      marginBottom: '15px',
    },
    label: {
      display: 'block',
      marginBottom: '6px',
      color: '#333',
      fontWeight: '600',
    },
    input: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '6px',
      fontSize: '1rem',
    },
    button: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#0077cc',
      color: '#ffffff',
      border: 'none',
      borderRadius: '6px',
      fontSize: '1rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      marginTop: '10px',
    },
    message: {
      marginTop: '15px',
      textAlign: 'center',
      color: '#e63946',
      fontWeight: '600',
    },
    adminLink: {
      marginTop: '15px',
      textAlign: 'center',
      color: '#0077cc',
      textDecoration: 'underline',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        <h2 style={styles.heading}>Login</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label htmlFor="username" style={styles.label}>Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button}>Login</button>
        </form>

        {message && <p style={styles.message}>{message}</p>}

        {/* Login as Admin */}
        <p style={styles.adminLink} onClick={() => navigate('/admin-login')}>
          Login as Admin
        </p>
      </div>
    </div>
  );
}

export default Login;
