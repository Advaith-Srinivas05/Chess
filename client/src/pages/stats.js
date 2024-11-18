import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import arrow from './../img/icons/double_arrow.svg';
import styles from './../css/home.module.css';

const Stats = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          return;
        }

        // Fetch user data from new endpoint
        const response = await fetch('http://localhost:3001/api/user-data', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        
        // Store user data in state
        setUserData(data.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Clear user data on error
        setUserData(null);
      }
    };

    fetchUserData();
  }, []);

  if (!userData) {
    return (
      <div className={`${styles.card} ${styles.small}`}>
        <div className={styles.heading}>Stats:</div>
        <hr/>
        <div className={styles.body}>
          <ul className={styles.small}>
            <li>Please log in to view your stats</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.card} ${styles.small}`}>
      <div className={styles.heading}>Stats:</div>
      <hr/>
      <div className={styles.body}>
        <ul>
          <li>Rating: {userData.rating.elo || 'Not available'}</li>
          <li>Games Played: {userData.statistics.gamesPlayed || 0}</li>
          <li>Win Rate: {userData.statistics.winRate || '0'}%</li>
          <li>Peak Rating: {userData.rating.peakElo || userData.rating.elo || 700}</li>
          <li>LeaderBoard Position: #{userData.leaderboardPosition || 'Not ranked'}</li>
        </ul>
      </div>
      <div className={styles.link}>
        <Link to='/leaderboard'>
          <div className={styles.link2}>
            View Full LeaderBoard
            <img src={arrow} alt="arrow"/>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Stats;