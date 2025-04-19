// src/components/Welcome.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Welcome = () => {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Welcome to <span style={styles.brand}>Note</span>!</h1>
        <p style={styles.paragraph}>
          Capture your thoughts, ideas, and inspirations in one place. Stay organized, stay creative, and enjoy a seamless note-taking experience.
        </p>
        <div style={styles.buttonGroup}>
          <Link to="/signup" style={{ ...styles.button, backgroundColor: '#4CAF50' }}>Sign Up</Link>
          <Link to="/login" style={{ ...styles.button, backgroundColor: '#2196F3' }}>Login</Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #e0f7fa, #e8f5e9)',
    fontFamily: 'Segoe UI, sans-serif',
  },
  card: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    maxWidth: '500px',
  },
  heading: {
    color: '#333',
    fontSize: '2.5rem',
    marginBottom: '20px',
  },
  brand: {
    color: '#4CAF50',
  },
  paragraph: {
    fontSize: '1.1rem',
    color: '#555',
    marginBottom: '30px',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
  },
  button: {
    padding: '12px 24px',
    color: 'white',
    textDecoration: 'none',
    fontWeight: 'bold',
    borderRadius: '6px',
    transition: 'background 0.3s ease',
  },
};

export default Welcome;
