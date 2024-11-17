import React, { useEffect, useState, useCallback } from 'react';
import styles from './../css/leaderboard.module.css';

const API_BASE_URL = 'http://127.0.0.1:3001';

const api = {
  async fetchLeaderboard() {
    const response = await fetch(`${API_BASE_URL}/api/leaderboard`, {
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error('Invalid data format received');
    }
    return data;
  },
};

const LeaderboardTable = ({ players }) => (
  <table className={`${styles['leaderboard-table']}`}>
    <tbody className={styles['leaderboard-table-body']}>
      {players
        .slice(0, 8) // Only take the first 8 players
        .map((player, index) => (
          <tr
            key={player._id}
            className={styles['leaderboard-table-row']}
          >
            <td className={styles['leaderboard-table-cell']}>{index + 1}</td>
            <td className={styles['leaderboard-table-cell']}>{player.name}</td>
            <td className={styles['leaderboard-table-cell']}>{player.rating}</td>
            <td className={styles['leaderboard-table-cell']}>{player.gamesPlayed}</td>
            <td className={styles['leaderboard-table-cell']}>{player.wins}</td>
          </tr>
        ))}
    </tbody>
  </table>
);

const Leaderboard = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching data...');
      const data = await api.fetchLeaderboard();
      // Sort players by rating in descending order before setting state
      const sortedData = data.sort((a, b) => b.rating - a.rating);
      console.log('Data fetched:', sortedData);
      setPlayers(sortedData);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError(err.message || 'Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return (
    <div className={styles['leaderboard-section']}>
      <div className={styles['leaderboard-container']}>
        <div className={styles['leaderboard-header']}>
          <h2>Leaderboard</h2>
        </div>

        {loading && (
          <div className={styles['loading-message']}>
            Loading leaderboard data...
          </div>
        )}

        {!loading && error && (
          <div className={styles['error-message']}>
            Error: {error}
          </div>
        )}

        {!loading && !error && players.length === 0 && (
          <div className={styles['empty-message']}>
            <p>No one has played this season.</p>
          </div>
        )}

        {!loading && !error && players.length > 0 && (
          <LeaderboardTable players={players} />
        )}
      </div>
    </div>
  );
};

export default Leaderboard;