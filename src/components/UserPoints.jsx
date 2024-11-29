import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';

const UserPoints = () => {
  const [points, setPoints] = useState([]);
  const [error, setError] = useState(null);
  const { user, authToken, userPoints, setUserPoints, role } = useAuth();

  // Etkinlik katılımı sonrası puanları güncellemek için fonksiyon
  const fetchPoints = async () => {
    if (!user || !user.id) {
      setError('User ID is not available.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/point/user-points`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch points.');
      }

      const data = await response.json();
      const totalPoints = data.points.reduce((total, item) => total + item.points, 0);
      setUserPoints(totalPoints); // Update global points state
    } catch (err) {
      setError(err.message);
    }
  };

  // useEffect ile puanları çağır
  useEffect(() => {
    if (user && authToken&& role !== 'admin') {
      fetchPoints();
    }
  }, [user, authToken,role, setUserPoints]);

  return (
    <div className="user-points">
      <h2>Your Points</h2>
      {role === 'admin' ? (
        <p>Admins do not have points.</p>
      ) : (
        <>
          {error && <p className="error">{error}</p>}
          {userPoints !== null ? (
            <p>Total Points: {userPoints}</p>
          ) : (
            <p>Loading...</p>
          )}
        </>
      )}
    </div>
  );
};
export default UserPoints;
