import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie'; 
import { useNavigate } from 'react-router-dom';

const CreateNote = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // To redirect after success if you want

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newNote = {
      title,
      content,
    };

    try {
      const accessToken = Cookies.get('access_token');

      const response = await axios.post('http://127.0.0.1:8000/note/create/', newNote, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log(response.data);

      setMessage('✅ Note created successfully!');
      setTitle('');
      setContent('');

      // Optional: Navigate to Notes page after creation
      // navigate('/notes');
    } catch (error) {
      console.error(error.response?.data || error.message);

      if (error.response?.status === 401) {
        setMessage('Unauthorized. Please login again.');
      } else if (error.response?.data?.user) {
        setMessage(`${error.response.data.user[0]}`);
      } else {
        setMessage('Failed to create note.');
      }
    }
  };

  const styles = {
    container: {
      maxWidth: '600px',
      margin: '50px auto',
      padding: '40px',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
      textAlign: 'center',
    },
    heading: {
      marginBottom: '30px',
      color: '#4CAF50',
      fontSize: '2.5em',
    },
    message: {
      marginBottom: '20px',
      color: 'red',
      fontWeight: 'bold',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    input: {
      padding: '12px',
      fontSize: '16px',
      borderRadius: '8px',
      border: '1px solid #ccc',
    },
    textarea: {
      padding: '12px',
      fontSize: '16px',
      borderRadius: '8px',
      border: '1px solid #ccc',
      minHeight: '120px',
    },
    button: {
      padding: '12px',
      fontSize: '16px',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Create a New Note</h2>

      {message && <p style={styles.message}>{message}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
          required
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={styles.textarea}
          required
        />
        <button type="submit" style={styles.button}>Create Note</button>
      </form>
    </div>
  );
};

export default CreateNote;
