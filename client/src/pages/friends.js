import React, { useEffect, useState } from 'react';
import styles from './../css/friends.module.css';

const FriendsList = () => {
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchName, setSearchName] = useState('');
  const [requestMessage, setRequestMessage] = useState('');

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      console.log('Token:', token); // Check if token exists
      
      const response = await fetch('http://localhost:3001/api/friends', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Response status:', response.status); // Check response status
      
      if (!response.ok) {
        throw new Error('Failed to fetch friends');
      }
      
      const data = await response.json();
      console.log('Fetched data:', data); // Check the actual response data
      
      setFriends(data.friends);
      setFriendRequests(data.friendRequests);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load friends');
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (e) => {
    e.preventDefault();
    if (!searchName.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/friends/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: searchName })
      });

      const data = await response.json();
      
      if (response.ok) {
        setRequestMessage('Friend request sent successfully!');
        setSearchName('');
      } else {
        setRequestMessage(data.message || 'Failed to send request');
      }
    } catch (err) {
      console.error('Error:', err);
      setRequestMessage('Failed to send friend request');
    }
  };

  const handleAcceptRequest = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/friends/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId })
      });

      if (response.ok) {
        fetchFriends(); // Refresh the friends list
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to accept request');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to accept friend request');
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles['friends-section']}>
      <h2>SOCIAL</h2>
      <form onSubmit={handleSendRequest} className={styles['search-section']}>
        <input
          type="text"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          placeholder="Enter player name"
          className={styles['search-input']}
        /><br/>
        <button type="submit" className={styles['send-button']}>
          Send friend request
        </button>
      </form>
      <br/><hr/>
      {requestMessage && (
        <div className={styles['request-message']}>{requestMessage}</div>
      )}

      <div className={styles['requests-container']}>
        <h3>Friend Requests</h3>
        {friendRequests.length === 0 ? (
          <p style={{"paddingLeft":"20px"}}>No pending friend requests</p>
        ) : (
          <ul>
            {friendRequests.map((request) => (
              <li key={request.id} className={styles['request-item']}>
                <span>{request.name}</span>
                <button
                  onClick={() => handleAcceptRequest(request.id)}
                  className={styles['accept-button']}
                >
                  Accept
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Friends List Section */}
      <div className={styles['friends-container']}>
        <h3>Your Friends</h3>
        {friends.length === 0 ? (
          <p style={{"paddingLeft":"20px"}}>No friends added yet</p>
        ) : (
          <ul>
            {friends.map((friend) => (
              <li key={friend.id} className={styles['friend-item']}>
                <span>{friend.name}</span>
                <span className={styles['games-played']}>
                  Games played together: {friend.gamesPlayed}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FriendsList;
