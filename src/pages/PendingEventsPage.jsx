import React from 'react';
import PendingEvents from '../components/PendingEvents.jsx';

function PendingEventsPage() {
  return (
    <div style={styles.container}>
      <h1>Onay Bekleyen Etkinlikler</h1>
      <PendingEvents />
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
