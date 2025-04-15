import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const AdminDashboard = () => {
  const [notesByUser, setNotesByUser] = useState({});
  const [activitiesByUser, setActivitiesByUser] = useState({});
  const [expandedUsers, setExpandedUsers] = useState([]);
  const [message, setMessage] = useState('');
  const token = Cookies.get('access_token');

  useEffect(() => {
    if (!token) {
      setMessage('No access token found.');
      return;
    }

    fetchAllNotes();
    fetchAllActivities();
  }, []);

  const fetchAllNotes = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/admin_panel/admin-panel/all-notes/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const notesMap = response.data.reduce((acc, item) => {
        acc[item.username] = item.notes;
        return acc;
      }, {});
      setNotesByUser(notesMap);
    } catch (err) {
      console.error(err);
      setMessage('Failed to fetch notes.');
    }
  };

  const fetchAllActivities = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/admin_panel/admin-user-activity/all/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const activitiesMap = response.data.reduce((acc, activity) => {
        if (!acc[activity.user]) acc[activity.user] = [];
        acc[activity.user].push(activity);
        return acc;
      }, {});
      setActivitiesByUser(activitiesMap);
    } catch (err) {
      console.error(err);
      setMessage('Failed to fetch activities.');
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/admin_panel/admin-panel/${noteId}/delete/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Note deleted');
      fetchAllNotes();
      fetchAllActivities();
    } catch (err) {
      console.error(err);
      alert('Failed to delete note.');
    }
  };

  const toggleUser = (username) => {
    if (expandedUsers.includes(username)) {
      setExpandedUsers(expandedUsers.filter((user) => user !== username));
    } else {
      setExpandedUsers([...expandedUsers, username]);
    }
  };

  const styles = {
    container: {
      padding: '40px',
      fontFamily: 'Segoe UI, sans-serif',
      backgroundColor: '#ffffff',
      minHeight: '100vh',
      color: '#000000',
    },
    userCard: {
      backgroundColor: '#f0f0f0',
      color: '#000000',
      padding: '18px',
      marginBottom: '20px',
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: '1.1rem',
      fontWeight: '600',
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
      transition: 'background 0.3s',
    },
    cardContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '20px',
      marginTop: '10px',
    },
    noteCard: {
      backgroundColor: '#ffffff',
      padding: '16px',
      width: '300px',
      borderRadius: '8px',
      border: '1px solid #ddd',
      boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
      color: '#000000',
    },
    activityCard: {
      backgroundColor: '#ffffff',
      padding: '16px',
      width: '300px',
      borderRadius: '8px',
      border: '1px solid #ccc',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      color: '#000000',
      fontSize: '0.95rem',
    },
    deleteBtn: {
      backgroundColor: '#ff4d4f',
      color: '#ffffff',
      border: 'none',
      padding: '8px 14px',
      borderRadius: '5px',
      cursor: 'pointer',
      marginTop: '10px',
      fontWeight: '500',
      transition: 'background 0.2s ease-in-out',
    },
    sectionTitle: {
      marginTop: '20px',
      marginBottom: '10px',
      fontWeight: '600',
      fontSize: '1.05rem',
      color: '#333333',
    },
    activityContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '20px',
      marginTop: '10px',
    },
  };

  return (
    <div style={styles.container}>
      <h2>Admin Dashboard - User Notes & Activities</h2>
      {message && <p style={{ color: 'red' }}>{message}</p>}
      {Object.keys(notesByUser).map((username) => (
        <div key={username}>
          <div style={styles.userCard} onClick={() => toggleUser(username)}>
            <strong>{username}</strong>
          </div>

          {expandedUsers.includes(username) && (
            <div>
              <div style={styles.sectionTitle}>📝 Notes</div>
              {notesByUser[username].length === 0 ? (
                <p style={{ marginLeft: '10px' }}>No notes available.</p>
              ) : (
                notesByUser[username].map((note) => (
                  <div key={note.id} style={styles.noteCard}>
                    <p><strong>Title:</strong> {note.title}</p>
                    <p><strong>Content:</strong> {note.content}</p>
                    <button style={styles.deleteBtn} onClick={() => handleDeleteNote(note.id)}>Delete</button>
                  </div>
                ))
              )}

              <div style={styles.sectionTitle}>📋 Activities</div>
              {activitiesByUser[username]?.length > 0 ? (
                <div style={styles.activityContainer}>
                  {activitiesByUser[username].map((activity, idx) => (
                    <div key={idx} style={styles.activityCard}>
                      <p><strong>Type:</strong> {activity.activity_type}</p>
                      <p><strong>Time:</strong> {new Date(activity.timestamp).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ marginLeft: '10px' }}>No activity recorded.</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;
