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
        if (activity.activity_type !== 'view_all_notes') {
          if (!acc[activity.user]) acc[activity.user] = [];
          acc[activity.user].push(activity);
        }
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
    setExpandedUsers((prev) =>
      prev.includes(username)
        ? prev.filter((u) => u !== username)
        : [...prev, username]
    );
  };

  const styles = {
    container: {
      padding: '30px',
      fontFamily: 'Segoe UI, sans-serif',
      backgroundColor: '#1e1e2f',
      color: '#f5f5f5',
      minHeight: '100vh',
    },
    heading: {
      fontSize: '1.8rem',
      fontWeight: 'bold',
      marginBottom: '30px',
      textAlign: 'center',
    },
    userCard: {
      backgroundColor: '#292943',
      padding: '15px 20px',
      borderRadius: '10px',
      marginBottom: '15px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '1.1rem',
      transition: 'background 0.3s',
    },
    noteCard: {
      backgroundColor: '#2e2e3e',
      padding: '20px',
      borderRadius: '10px',
      width: '300px',
      marginBottom: '15px',
      boxShadow: '0 0 10px rgba(0,0,0,0.2)',
    },
    activityCard: {
      backgroundColor: '#34344e',
      padding: '15px',
      borderRadius: '10px',
      width: '300px',
      marginBottom: '15px',
      boxShadow: '0 0 10px rgba(0,0,0,0.2)',
    },
    section: {
      marginTop: '15px',
      marginBottom: '10px',
      fontSize: '1.05rem',
      fontWeight: '600',
      color: '#c9c9ff',
    },
    grid: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '20px',
      marginBottom: '25px',
    },
    deleteBtn: {
      backgroundColor: '#e63946',
      color: '#fff',
      padding: '8px 12px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      marginTop: '10px',
      fontWeight: 'bold',
    },
    message: {
      color: '#ffb703',
      fontSize: '1rem',
      marginBottom: '20px',
      textAlign: 'center',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.heading}>Admin Dashboard - User Notes & Activities</div>
      {message && <p style={styles.message}>{message}</p>}
      {Object.keys(notesByUser).map((username) => (
        <div key={username}>
          <div style={styles.userCard} onClick={() => toggleUser(username)}>
            👤 {username}
          </div>

          {expandedUsers.includes(username) && (
            <>
              <div style={styles.section}>📝 Notes</div>
              <div style={styles.grid}>
                {notesByUser[username].length === 0 ? (
                  <p>No notes available.</p>
                ) : (
                  notesByUser[username].map((note) => (
                    <div key={note.id} style={styles.noteCard}>
                      <p><strong>Title:</strong> {note.title}</p>
                      <p><strong>Content:</strong> {note.content}</p>
                      <button style={styles.deleteBtn} onClick={() => handleDeleteNote(note.id)}>Delete</button>
                    </div>
                  ))
                )}
              </div>

              <div style={styles.section}>📋 Activities</div>
              <div style={styles.grid}>
                {activitiesByUser[username]?.length > 0 ? (
                  activitiesByUser[username].map((activity, idx) => (
                    <div key={idx} style={styles.activityCard}>
                      <p><strong>Type:</strong> {activity.activity_type}</p>
                      <p><strong>Time:</strong> {new Date(activity.timestamp).toLocaleString()}</p>
                    </div>
                  ))
                ) : (
                  <p>No activity recorded.</p>
                )}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;
