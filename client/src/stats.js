import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import arrow from './img/icons/double_arrow.svg';
import styles from './css/home.module.css';

const Stats = () => {
  const [leaderboardPosition, setLeaderboardPosition] = useState(null);
  const userData = JSON.parse(localStorage.getItem('userData'));

  useEffect(() => {
    const fetchLeaderboardPosition = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/leaderboard');
        const leaderboard = await response.json();
        
        const position = leaderboard.findIndex(player => 
          player.name === userData?.name
        ) + 1;
        
        setLeaderboardPosition(position > 0 ? position : 'Not ranked');
      } catch (error) {
        console.error('Error fetching leaderboard position:', error);
        setLeaderboardPosition('Not available');
      }
    };

    if (userData?.name) {
      fetchLeaderboardPosition();
    }
  }, [userData?.name]);

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
        <ul className={styles.small}>
          <li>Rating: {userData.rating?.elo || 'Not available'}</li>
          <li>Games Played: {userData.statistics?.gamesPlayed || 0}</li>
          <li>Win Rate: {userData.statistics?.winRate || '0'}%</li>
          <li>Peak Rating: {userData.rating?.peakElo || userData.rating?.elo || 700}</li>
          <li>LeaderBoard Position: #{leaderboardPosition || '...'}</li>
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