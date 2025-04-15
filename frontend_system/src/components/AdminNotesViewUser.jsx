import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const AdminNotesUsername = () => {
  const { username } = useParams();
  const [notes, setNotes] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      const token = Cookies.get('access_token');

      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/admin_panel/admin-panel/notes-by-username/(?P<username>[^/.]+)`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setNotes(response.data.notes);
      } catch (error) {
        console.error('Error fetching notes:', error);
        setMessage('Failed to load notes.');
      }
    };

    fetchNotes();
  }, [username]);

  const handleDelete = async (noteId) => {
    const token = Cookies.get('access_token');

    try {
      await axios.delete(`http://127.0.0.1:8000/admin_panel/admin-panel/delete-note/${noteId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotes(notes.filter((note) => note.id !== noteId));
    } catch (error) {
      console.error('Error deleting note:', error);
      setMessage('Failed to delete note.');
    }
  };

  const styles = {
    container: {
      padding: '30px',
      fontFamily: 'Arial, sans-serif',
    },
    header: {
      textAlign: 'center',
      fontSize: '2rem',
      marginBottom: '20px',
      color: '#333',
    },
    message: {
      textAlign: 'center',
      color: 'red',
      marginBottom: '20px',
    },
    backButton: {
      marginBottom: '20px',
      backgroundColor: '#555',
      color: '#fff',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },
    card: {
      border: '1px solid #ccc',
      borderRadius: '10px',
      padding: '20px',
      marginBottom: '20px',
      backgroundColor: '#f9f9f9',
    },
    title: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
    },
    content: {
      margin: '10px 0',
    },
    buttonGroup: {
      display: 'flex',
      gap: '10px',
    },
    deleteButton: {
      backgroundColor: '#e74c3c',
      color: 'white',
      padding: '8px 12px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Notes for {username}</h2>
      {message && <p style={styles.message}>{message}</p>}

      <button style={styles.backButton} onClick={() => navigate('/admin-dashboard')}>
        ← Back to Dashboard
      </button>

      {notes.length === 0 ? (
        <p>No notes found for this user.</p>
      ) : (
        notes.map((note) => (
          <div key={note.id} style={styles.card}>
            <div style={styles.title}>{note.title}</div>
            <div style={styles.content}>{note.content}</div>
            <div style={styles.buttonGroup}>
              <button
                style={styles.deleteButton}
                onClick={() => handleDelete(note.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminNotesUsername;
