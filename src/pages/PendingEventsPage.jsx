import React, { useEffect, useState } from 'react';
import PendingEvents from '../components/PendingEvents.jsx';
import { useAuth } from '../AuthContext';
import '../styles/pending.module.css'

function PendingEventsPage() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { authToken, role } = useAuth(); // AuthContext'ten authToken ve role alındı
  
  useEffect(() => {
    const fetchPendingEvents = async () => {
      if (!authToken) {
        console.error('Auth token yok! Lütfen giriş yapın.');
        setError('Yetkilendirme gerekiyor. Lütfen giriş yapın.');
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/api/admin/inactive-events', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          if (response.status === 403) {
            throw new Error('Yetkisiz erişim: Admin değilsiniz.');
          } else {
            throw new Error('Etkinlikler yüklenemedi.');
          }
        }

        const data = await response.json();
        console.log('Fetched Pending Events:', data); // Gelen veriyi kontrol edin
        setEvents(data.events || []);
      } catch (err) {
        console.error('Hata:', err.message);
        setError(err.message);
      }finally {
        setLoading(false);}
    };

    fetchPendingEvents();
  }, [authToken]); // authToken değiştiğinde tetiklenir

  const handleApprove = async (eventId) => {
    if (!authToken) return;
  
    try {
      const response = await fetch(`http://localhost:3000/api/admin/events/${eventId}/status`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Etkinlik onaylanamadı.');
      }
  
      const data = await response.json();
      if (data.success) {
        // Sadece onaylanan etkinliği listeden çıkar
        setEvents(events.filter(event => event.id !== eventId));
        console.log('Etkinlik onaylandı:', eventId);
      
      }
    } catch (err) {
      console.error('Onaylama hatası:', err.message);
    }
  };

  const handleDelete = async (eventId) => {
    if (!authToken) return;

    try {
      const response = await fetch(`http://localhost:3000/api/admin/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Etkinlik silinemedi.');
      }

      const data = await response.json();
      if (data.message === 'Event deleted') {
        setEvents(events.filter(event => event.id !== eventId));
        console.log('Etkinlik silindi:', eventId);
      }
    } catch (err) {
      console.error('Silme hatası:', err.message);
    }
  };

  return (
    <div>
      <h2>Pending Events</h2>
      {loading ? (
        <p>Loading events...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <PendingEvents
          events={events}
          onApprove={handleApprove}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#f9f9f9',
    minHeight: '100vh',
  },
};

export default PendingEventsPage;
