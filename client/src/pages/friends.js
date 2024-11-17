import React, { useEffect, useState } from 'react';
import styles from './../css/friends.module.css'; // Ensure you have corresponding CSS for friends

const FriendsList = () => {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    const fetchFriends = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch data from your API
        const response = await fetch('http://127.0.0.1:3001/api/friends', {
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setFriends(data);
      } catch (err) {
        console.error('Error fetching friends:', err);
        setError(err.message || 'Failed to load friends');
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchFriends();
    }, []);
  
    return (
      <div className={styles['friends-section']}>
        {loading && <div className={styles['loading-message']}>Loading friends...</div>}
        {!loading && error && (
          <div className={styles['error-message']}>
            Error: {error}
          </div>
        )}
        {!loading && !error && (
          <div className={styles['friends-container']}>
            {friends.length === 0 ? (
              <div className={styles['empty-message']}>No friends found.</div>
            ) : (
              <ul>
                {friends.map(friend => (
                  <li key={friend.friendId}>
                    {friend.name} - Games Played Together: {friend.gamesPlayedTogether}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    );
  };
  
  export default FriendsList;
  