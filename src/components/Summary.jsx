import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
function Summary() {
  const { authToken } = useAuth(); 
  const [totalUsers, setTotalUsers] = useState(null);
  const [totalEvents, setTotalEvents] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummaryData = async () => {
      if (!authToken) {
        setLoading(false);
        return;  
      }

      try {
        const [usersRes, eventsRes] = await Promise.all([
          fetch('http://localhost:3000/api/admin/total-users', {
            headers: {
              Authorization: `Bearer ${authToken}`,  
            },
          }),
          fetch('http://localhost:3000/api/admin/total-events', {
            headers: {
              Authorization: `Bearer ${authToken}`,  
            },
          }),
        ]);

        const [usersData, eventsData] = await Promise.all([
          usersRes.json(),
          eventsRes.json(),
        ]);

        setTotalUsers(usersData.totalUsers);
        setTotalEvents(eventsData.totalEvents);  
        setLoading(false);
      } catch (error) {
        console.error('Error fetching summary data:', error);
        setLoading(false);
      }
    };

    fetchSummaryData();
  }, [authToken]); 

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
