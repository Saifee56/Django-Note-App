import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const DeleteNote = () => {
  const [notes, setNotes] = useState([]);
  const [message, setMessage] = useState('');

  const fetchNotes = async () => {
    try {
      const accessToken = Cookies.get('access_token');

      const response = await axios.get('http://127.0.0.1:8000/note/get-all/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log(response.data); // See what comes back

      // If your response is an object with a "notes" key:
      if (Array.isArray(response.data)) {
        setNotes(response.data);
      } else if (Array.isArray(response.data.notes)) {
        setNotes(response.data.notes);
      } else {
        console.error('Unexpected response format:', response.data);
      }
    } catch (error) {
      console.error(error);
      setMessage('Failed to fetch notes.');
    }
  };

  const handleDelete = async (noteId) => {
    try {
      const accessToken = Cookies.get('access_token');

      await axios.delete(`http://127.0.0.1:8000/note/${noteId}/delete/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setMessage('✅ Note deleted successfully.');
      setNotes(notes.filter(note => note.id !== noteId));
    } catch (error) {
      console.error(error);
      setMessage('Failed to delete note.');
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Delete Your Notes</h2>

      {message && <p style={styles.message}>{message}</p>}

      {Array.isArray(notes) && notes.length > 0 ? (
        notes.map(note => (
          <div key={note.id} style={styles.note}>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <button style={styles.deleteButton} onClick={() => handleDelete(note.id)}>
              Delete
            </button>
          </div>
        ))
      ) : (
        <p>No notes found.</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  message: {
    textAlign: 'center',
    marginBottom: '20px',
    color: 'green',
  },
  note: {
    backgroundColor: '#f9f9f9',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '10px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  },
  deleteButton: {
    marginTop: '10px',
    padding: '8px 12px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default DeleteNote;
