import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie'; 
import { useNavigate } from 'react-router-dom';

const CreateNote = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newNote = { title, content };

    try {
      const accessToken = Cookies.get('access_token');
      await axios.post('http://127.0.0.1:8000/note/create/', newNote, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setMessage('✅ Note created successfully!');
      setTitle('');
      setContent('');
      navigate('/get-all-notes');
    } catch (error) {
      console.error(error.response?.data || error.message);
      if (error.response?.status === 401) {
        setMessage('Unauthorized. Please login again.');
      } else {
        setMessage('Failed to create note.');
      }
    }
  };

  const styles = {
    page: {
      minHeight: '100vh',
      backgroundColor: '#e6f2ff',   
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Segoe UI, sans-serif',
    },
    card: {
      backgroundColor: '#ffffff',
      padding: '40px 30px',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      width: '100%',
      maxWidth: '500px',
    },
    heading: {
      marginBottom: '25px',
      color: '#004080',
      fontSize: '2rem',
      textAlign: 'center',
    },
    message: {
      marginBottom: '20px',
      color: '#d8000c',   
      textAlign: 'center',
      fontWeight: '600',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
    input: {
      padding: '12px',
      borderRadius: '6px',
      border: '1px solid #99c2ff',
      fontSize: '1rem',
      outlineColor: '#3399ff',
    },
    textarea: {
      padding: '12px',
      borderRadius: '6px',
      border: '1px solid #99c2ff',
      fontSize: '1rem',
      outlineColor: '#3399ff',
      minHeight: '120px',
      resize: 'vertical',
    },
    button: {
      marginTop: '10px',
      padding: '12px',
      backgroundColor: '#007bff',
      color: '#ffffff',
      border: 'none',
      borderRadius: '6px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    buttonHover: {
      backgroundColor: '#0056b3',
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.heading}>📝 Create a New Note</h2>
        {message && <div style={styles.message}>{message}</div>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Note Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
            required
          />
          <textarea
            placeholder="Note Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={styles.textarea}
            required
          />
          <button type="submit" style={styles.button}>
            ➕ Create Note
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateNote;
