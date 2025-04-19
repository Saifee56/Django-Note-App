import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const GetAllNotes = () => {
  const [notes, setNotes] = useState([]);
  const [message, setMessage] = useState('');
  const token = Cookies.get('access_token');
  const navigate = useNavigate();  // to navigate when edit button is clicked

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      if (!token) {
        setMessage('No access token found.');
        return;
      }
      const { data } = await axios.get(
        'http://127.0.0.1:8000/note/get-all/',
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setNotes(Array.isArray(data) ? data : data.notes);
    } catch (err) {
      console.error(err);
      setMessage('Failed to load notes.');
    }
  };

  const handleShare = async (noteId, username, permission, resetForm) => {
    console.log('noteId:', noteId);
    if (!username) {
      alert('Please enter a username to share with.');
      return;
    }
  
    try {
      const accessToken = Cookies.get('access_token');
      const resp = await axios.post(
        `http://127.0.0.1:8000/note/${noteId}/share/`,
        {
          shared_with: username,
          access_type: permission,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
  
      alert(resp.data.message || 'Note shared successfully!');
      resetForm();
    } catch (err) {
      console.error('Share error payload:', err.response?.data);
      alert(
        err.response?.data.error ||
        JSON.stringify(err.response?.data) ||
        'Failed to share note.'
      );
    }
  };

  const styles = {
    container: {
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh',
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
      backgroundColor: '#fff',
      width: '300px',
      padding: '15px',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    noteTitle: {
      fontSize: '1.25rem',
      margin: 0,
      color: '#333',
    },
    noteContent: {
      flexGrow: 1,
      color: '#555',
    },
    shareForm: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      marginTop: '10px',
      paddingTop: '10px',
      borderTop: '1px solid #eee',
    },
    input: {
      padding: '8px',
      borderRadius: '4px',
      border: '1px solid #ccc',
      width: '100%',
    },
    select: {
      padding: '8px',
      borderRadius: '4px',
      border: '1px solid #ccc',
      width: '100%',
    },
    shareBtn: {
      padding: '10px',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    noNotes: {
      textAlign: 'center',
      fontSize: '1.2rem',
      color: '#777',
      width: '100%',
    },
  };

  const NoteCard = ({ note, onShare, styles }) => {
    const [username, setUsername] = useState('');
    const [permission, setPermission] = useState('view');

    const resetForm = () => {
      setUsername('');
      setPermission('view');
    };

    const handleEditClick = () => {
      navigate(`/update-note/${note.id}`); 
    };

    return (
      <div style={styles.noteCard}>
        <h3 style={styles.noteTitle}>{note.title}</h3>
        <p style={styles.noteContent}>{note.content}</p>

        <div style={styles.shareForm}>
          <input
            type="text"
            placeholder="Username to share with"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />
          <select
            value={permission}
            onChange={(e) => setPermission(e.target.value)}
            style={styles.select}
          >
            <option value="view">View</option>
            <option value="edit">Edit</option>
          </select>
          <button
            style={styles.shareBtn}
            onClick={() => onShare(note.id, username, permission, resetForm)}
          >
            Share
          </button>
        </div>

        {/* Edit Button */}
        <button
          style={{
            ...styles.shareBtn,
            marginTop: '8px',
            backgroundColor: '#28a745',
          }}
          onClick={handleEditClick}
        >
          Edit Note
        </button>
      </div>
    );
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
            <NoteCard
              key={note.id}
              note={note}
              onShare={handleShare}
              styles={styles}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default GetAllNotes;
