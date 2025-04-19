import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password1: '',
    password2: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password1 !== formData.password2) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/auth/signup/',
        {
          username: formData.username,
          email: formData.email,
          password1: formData.password1,
          password2: formData.password2,
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      if (response.status === 201 || response.data?.message === 'User created') {
        alert('Signup successful! Please login.');
        navigate('/login');
      } else {
        setError('Unexpected response from server.');
      }
    } catch (err) {
      console.error('Signup error:', err.response?.data || err.message);
      const errorData = err.response?.data;
      if (typeof errorData === 'object') {
        const messages = Object.entries(errorData).map(([field, msg]) => `${field}: ${msg}`);
        setError(messages.join(' | '));
      } else {
        setError('Signup failed. Please try again.');
      }
    }
  };

  const styles = {
    container: {
      maxWidth: '400px',
      margin: 'auto',
      padding: '2rem',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      marginTop: '80px',
    },
    title: {
      fontSize: '24px',
      marginBottom: '20px',
      textAlign: 'center',
    },
    input: {
      width: '100%',
      padding: '10px',
      marginBottom: '15px',
      border: '1px solid #ccc',
      borderRadius: '4px',
    },
    button: {
      width: '100%',
      padding: '10px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    error: {
      color: 'red',
      marginTop: '10px',
      textAlign: 'center',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input
          style={styles.input}
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          style={styles.input}
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          style={styles.input}
          type="password"
          name="password1"
          placeholder="Password"
          value={formData.password1}
          onChange={handleChange}
          required
        />
        <input
          style={styles.input}
          type="password"
          name="password2"
          placeholder="Confirm Password"
          value={formData.password2}
          onChange={handleChange}
          required
        />
        <button type="submit" style={styles.button}>
          Signup
        </button>
        {error && <p style={styles.error}>{error}</p>}
      </form>
    </div>
  );
};

export default Signup;
