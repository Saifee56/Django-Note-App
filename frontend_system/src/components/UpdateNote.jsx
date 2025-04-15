import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const UpdateNote = () => {
  const [notes, setNotes] = useState([]);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editedNote, setEditedNote] = useState({ title: '', content: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

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
        console.error('Error fetching notes:', error);
        setMessage('Failed to fetch notes.');
      }
    };

    fetchNotes();
  }, []);

  const handleEdit = (note) => {
    setEditingNoteId(note.id);
    setEditedNote({ title: note.title, content: note.content });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedNote((prevNote) => ({ ...prevNote, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const accessToken = Cookies.get('access_token');
      if (!accessToken) {
        setMessage('No access token found.');
        return;
      }

      const response = await axios.put(
        `http://127.0.0.1:8000/note/${editingNoteId}/update/`,
        editedNote,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );

      // Update the notes list after saving
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === editingNoteId
            ? { ...note, title: editedNote.title, content: editedNote.content }
            : note
        )
      );

      setEditingNoteId(null); // Clear the editing state
      setMessage('Note updated successfully!');
    } catch (error) {
      console.error('Error updating note:', error);
      setMessage('Failed to update note.');
    }
  };

  const handleCancel = () => {
    setEditingNoteId(null);
  };

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
    editBtn: {
      backgroundColor: '#007bff',
      color: 'white',
      padding: '8px 16px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      marginTop: '10px',
    },
    inputGroup: {
      marginBottom: '15px',
    },
    inputLabel: {
      display: 'block',
      marginBottom: '5px',
    },
    inputField: {
      width: '100%',
      padding: '8px',
      border: '1px solid #ccc',
      borderRadius: '4px',
    },
    textarea: {
      width: '100%',
      padding: '8px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      height: '100px',
    },
    buttonGroup: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    saveBtn: {
      backgroundColor: '#28a745',
      color: 'white',
      padding: '8px 16px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    cancelBtn: {
      backgroundColor: '#dc3545',
      color: 'white',
      padding: '8px 16px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
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
      <div style={styles.notesList}>
        {notes.length === 0 ? (
          <p style={styles.noNotes}>No notes available.</p>
        ) : (
          notes.map((note) => (
            <div key={note.id} style={styles.noteCard}>
              {editingNoteId === note.id ? (
                <div>
                  <h3>Edit Note</h3>
                  <div style={styles.inputGroup}>
                    <label style={styles.inputLabel}>Title</label>
                    <input
                      type="text"
                      name="title"
                      value={editedNote.title}
                      onChange={handleChange}
                      style={styles.inputField}
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.inputLabel}>Content</label>
                    <textarea
                      name="content"
                      value={editedNote.content}
                      onChange={handleChange}
                      style={styles.textarea}
                    />
                  </div>
                  <div style={styles.buttonGroup}>
                    <button onClick={handleSave} style={styles.saveBtn}>Save</button>
                    <button onClick={handleCancel} style={styles.cancelBtn}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 style={styles.noteTitle}>{note.title}</h3>
                  <p style={styles.noteContent}>{note.content}</p>
                  <button onClick={() => handleEdit(note)} style={styles.editBtn}>Edit</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UpdateNote;
