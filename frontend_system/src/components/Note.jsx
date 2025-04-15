// src/components/Notes.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Notes = () => {
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Manage Your Notes</h2>
      <div>
        <Link to="/create-note" style={styles.link}>Create Note</Link>
      </div>
      <div>
        <Link to="/update-note" style={styles.link}>Update Note</Link>
      </div>
      <div>
        <Link to="/get-all-notes" style={styles.link}>View All Notes</Link>
      </div>
      <div>
        <Link to="/delete" style={styles.link}>Delete Note</Link>
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
  link: {
    color: '#4CAF50',
    textDecoration: 'none',
    fontWeight: 'bold',
    display: 'block',
    marginBottom: '15px',
  },
};

export default Notes;
