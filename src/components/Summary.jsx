import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';  // Importing useAuth hook to access authToken

function Summary() {
  const { authToken } = useAuth();  // Get the authToken from AuthContext
  const [totalUsers, setTotalUsers] = useState(null);
  const [totalEvents, setTotalEvents] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummaryData = async () => {
      if (!authToken) {
        setLoading(false);
        return;  // If there's no authToken, skip fetching data
      }

      try {
        const [usersRes, eventsRes] = await Promise.all([
          fetch('http://localhost:3000/api/admin/total-users', {
            headers: {
              Authorization: `Bearer ${authToken}`,  // Include the token in the request header
            },
          }),
          fetch('http://localhost:3000/api/admin/total-events', {
            headers: {
              Authorization: `Bearer ${authToken}`,  // Include the token in the request header
            },
          }),
        ]);

        const [usersData, eventsData] = await Promise.all([
          usersRes.json(),
          eventsRes.json(),
        ]);

        setTotalUsers(usersData.totalUsers);  // Set total users from response
        setTotalEvents(eventsData.totalEvents);  // Set total events from response

        setLoading(false);
      } catch (error) {
        console.error('Error fetching summary data:', error);
        setLoading(false);
      }
    };

    fetchSummaryData();
  }, [authToken]);  // Run the effect when authToken changes

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.summary}>
      <h2>Özet Bilgi</h2>
      <p>Toplam Etkinlik: {totalEvents}</p>
      <p>Toplam Kullanıcı: {totalUsers}</p>
    </div>
  );
}

const styles = {
  summary: {
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    marginBottom: '20px',
    backgroundColor: '#f9f9f9',
  },
};

export default Summary;
