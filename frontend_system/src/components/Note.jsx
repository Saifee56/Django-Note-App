import React from 'react';
import { Link } from 'react-router-dom';

const Notes = () => {
  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.title}>Notes Dashboard</h1>
        <p style={styles.subtitle}>Manage all your notes in one place</p>
      </header>

      <div style={styles.grid}>
        <Card to="/create-note" label="Create Note" />
        <Card to="/update-note" label="Update Note" />
        <Card to="/get-all-notes" label="View All Notes" />
        <Card to="/delete" label="Delete Note" />
        <Card to="/admin-login" label="Login As Admin" />
      </div>
    </div>
  );
};

const Card = ({ to, label }) => (
  <Link to={to} style={styles.card}>
    <span>{label}</span>
  </Link>
);

const styles = {
  page: {
    backgroundColor: '#f0f6ff',
    minHeight: '100vh',
    padding: '40px 20px',
    fontFamily: 'Segoe UI, sans-serif',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  title: {
    fontSize: '2.5rem',
    color: '#003366',
    marginBottom: '10px',
  },
  subtitle: {
    color: '#666',
    fontSize: '1rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '10px',
    textAlign: 'center',
    color: '#007bff',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    textDecoration: 'none',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.3s ease',
  },
  cardHover: {
    backgroundColor: '#007bff',
    color: '#fff',
  },
};

export default Notes;
