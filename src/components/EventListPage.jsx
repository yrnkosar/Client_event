// pages/EventListPage.js
import React, { useState, useEffect } from 'react';
import EventList from '../components/EventList.jsx';
import '../styles/EventListPage.css';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const EventListPage = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const { authToken, role, logout } = useAuth(); // AuthContext'ten authToken ve role alınıyor
 
 
  useEffect(() => {
    const fetchEvents = async () => {
      if (!authToken) {
        console.error('Auth token yok! Lütfen giriş yapın.');
        return;
      }
      try {
        const response = await fetch('http://localhost:3000/api/admin/events', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchEvents();
  }, []);
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/admin/events/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      // Silme işlemi başarılı olduğunda listeyi güncelle
      setEvents(events.filter((event) => event.id !== id));
    } catch (err) {
      console.error('Silme işlemi hatası:', err.message);
    }
  };

  return (
    <div className="event-list-page">
      <h2 className="event-list-title">Event List</h2>
      {error ? (
        <p className="error-message">Error: {error}</p>
      ) : (
        <EventList events={events} onDelete={handleDelete}/>
      )}
    </div>
  );
};

export default EventListPage;


