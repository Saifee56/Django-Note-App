import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const GetAllNotes = () => {
  const [notes, setNotes] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const accessToken = Cookies.get('access_token');
        
        if (!accessToken) {
          setMessage('No access token found.');
          return;
        }

        const response = await axios.get('http://127.0.0.1:8000/note/get-all/', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          withCredentials: true,
        });

        if (Array.isArray(response.data)) {
          setNotes(response.data);
        } else if (Array.isArray(response.data.notes)) {
          setNotes(response.data.notes);
        } else {
          setMessage('Unexpected response format.');
        }
      } catch (error) {
        setMessage('Failed to load notes.');
        console.error(error);
      }
    };

    fetchNotes();
  }, []);

  const styles = {
    container: {
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
    },
    title: {
      textAlign: 'center',
      fontSize: '2rem',
      marginBottom: '20px',
    },
    message: {
      color: 'red',
      textAlign: 'center',
    },
    notesList: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: '20px',
    },
    noteCard: {
      width: '300px',
      padding: '15px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    },
    noteTitle: {
      fontSize: '1.5rem',
      color: '#333',
    },
    noteContent: {
      color: '#555',
    },
    noNotes: {
      textAlign: 'center',
      fontSize: '1.2rem',
      color: '#777',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>All Notes</h2>

      {message && <p style={styles.message}>{message}</p>}

      {notes.length === 0 ? (
        <p style={styles.noNotes}>No notes available.</p>
      ) : (
        <div style={styles.notesList}>
          {notes.map((note) => (
            <div key={note.id} style={styles.noteCard}>
              <h3 style={styles.noteTitle}>{note.title}</h3>
              <p style={styles.noteContent}>{note.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GetAllNotes;
