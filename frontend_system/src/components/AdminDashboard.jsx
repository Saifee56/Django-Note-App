import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom'; // Add this import

const AdminDashboard = () => {
  const [activities, setActivities] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Initialize navigate function

  useEffect(() => {
    const fetchUserActivities = async () => {
      const token = Cookies.get('access_token');

      if (!token) {
        setMessage('No access token found.');
        return;
      }

      try {
        const response = await axios.get(
          'http://127.0.0.1:8000/admin_panel/admin-user-activity/all/',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Group activities by unique user
        const users = response.data.reduce((acc, activity) => {
          if (!acc[activity.user]) {
            acc[activity.user] = [];
          }
          acc[activity.user].push(activity);
          return acc;
        }, {});

        setActivities(users);
      } catch (error) {
        console.error('Error fetching activities:', error);
        setMessage('Failed to load user activities.');
      }
    };

    fetchUserActivities();
  }, []);

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
    cardContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '20px',
      justifyContent: 'center',
    },
    card: {
      width: '250px',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#fff',
      textAlign: 'center',
      cursor: 'pointer',
    },
    cardTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginBottom: '10px',
      color: '#333',
    },
    cardItem: {
      fontSize: '1rem',
      color: '#555',
      marginBottom: '5px',
    },
    noActivity: {
      textAlign: 'center',
      color: '#777',
      fontSize: '1.2rem',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Admin Dashboard - User Activities</h2>

      {message && <p style={styles.message}>{message}</p>}

      {Object.keys(activities).length === 0 ? (
        <p style={styles.noActivity}>No activity found.</p>
      ) : (
        <div style={styles.cardContainer}>
          {Object.keys(activities).map((username) => (
            <div
              key={username}
              style={styles.card}
              onClick={() => navigate(`/user-activity/${username}`)} // Handle user click to navigate to history
            >
              <div style={styles.cardTitle}>
                {username}
              </div>
              <div style={styles.cardItem}>
                <strong>Total Activities:</strong> {activities[username].length}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
