import React, { useEffect, useState } from 'react';
import PendingEvents from '../components/PendingEvents.jsx';

function PendingEventsPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Fetch pending events when the component is mounted
    const fetchPendingEvents = async () => {
      try {
        const response = await fetch('/inactive-events');
        const data = await response.json();
        if (data.success) {
          setEvents(data.events);
        } else {
          console.error('Failed to fetch pending events');
        }
      } catch (error) {
        console.error('Error fetching pending events:', error);
      }
    };

    fetchPendingEvents();
  }, []);

  const handleApprove = async (eventId) => {
    try {
      const response = await fetch(`/events/${eventId}/status`, {
        method: 'PATCH',
      });
      const data = await response.json();
      if (data.success) {
        setEvents(events.filter(event => event.id !== eventId));  // Remove the approved event from the list
        console.log('Event approved');
      } else {
        console.error('Failed to approve event');
      }
    } catch (error) {
      console.error('Error approving event:', error);
    }
  };

  const handleDelete = async (eventId) => {
    try {
      const response = await fetch(`/events/${eventId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.message === 'Event deleted') {
        setEvents(events.filter(event => event.id !== eventId));  // Remove the deleted event from the list
        console.log('Event deleted');
      } else {
        console.error('Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Onay Bekleyen Etkinlikler</h1>
      <PendingEvents 
        events={events}
        onApprove={handleApprove}
        onDelete={handleDelete}
      />
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
