import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const UserActivityDetails = () => {
  const { username } = useParams();
  const [activities, setActivities] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUserHistory = async () => {
      const token = Cookies.get('access_token');
      if (!token) {
        setMessage('No access token found.');
        return;
      }

      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/admin_panel/admin-user-activity/user-activities/${username}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setActivities(response.data);
      } catch (error) {
        console.error('Error fetching user activity history:', error);
        setMessage('Failed to load user activity history.');
      }
    };

    fetchUserHistory();
  }, [username]);

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
      justifyContent: 'center',
      gap: '20px',
    },
    card: {
      width: '280px',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#f9f9f9',
      textAlign: 'left',
    },
    cardTitle: {
      fontSize: '1.1rem',
      fontWeight: 'bold',
      marginBottom: '8px',
      color: '#444',
    },
    cardTimestamp: {
      fontSize: '0.95rem',
      color: '#777',
    },
    noActivity: {
      textAlign: 'center',
      fontSize: '1.2rem',
      color: '#555',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>{username}'s Activity History</h2>
      {message && <p style={styles.message}>{message}</p>}
      {activities.length === 0 ? (
        <p style={styles.noActivity}>No activity history available.</p>
      ) : (
        <div style={styles.cardContainer}>
          {activities.map((activity) => (
            <div key={activity.id} style={styles.card}>
              <div style={styles.cardTitle}>{activity.activity_type}</div>
              <div style={styles.cardTimestamp}>
                {new Date(activity.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserActivityDetails;