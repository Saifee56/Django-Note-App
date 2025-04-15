// src/components/Welcome.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Welcome = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome to Note!</h1>
      <p style={styles.paragraph}>
        We’re glad to have you here. Start jotting down your thoughts, ideas, and important notes. Your creativity is just a click away. Enjoy your note-taking experience!
      </p>
      <div>
        <Link to="/signup" style={styles.link}>Sign Up</Link> | 
        <Link to="/login" style={styles.link}> Login</Link>
      </div>
    </div>
  );
};

// Inline styles
const styles = {
  container: {
    textAlign: 'center',
    marginTop: '50px',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    color: '#4CAF50',
    fontSize: '2.5em',
    marginBottom: '15px',
  },
  paragraph: {
    fontSize: '1.2em',
    color: '#333',
  },
  link: {
    color: '#4CAF50',
    textDecoration: 'none',
    fontWeight: 'bold',
    marginLeft: '10px',
  },
};

export default Welcome;
