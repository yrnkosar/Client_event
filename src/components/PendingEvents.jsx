import React from 'react';
import { Link } from 'react-router-dom';

function PendingEvents({ compact }) {
  // Örnek onay bekleyen etkinlik verileri
  const pendingEvents = [
    { id: 1, title: 'Etkinlik 1', status: 'Onay Bekliyor' },
    { id: 2, title: 'Etkinlik 2', status: 'Onay Bekliyor' },
    { id: 3, title: 'Etkinlik 3', status: 'Onay Bekliyor' },
    { id: 4, title: 'Etkinlik 4', status: 'Onay Bekliyor' },
    { id: 5, title: 'Etkinlik 5', status: 'Onay Bekliyor' },
    // Daha fazla etkinlik eklenebilir
  ];

  // compact modunda sadece ilk 3 etkinliği gösterelim
  const displayedEvents = compact ? pendingEvents.slice(0, 3) : pendingEvents;

  return (
    <div style={styles.container}>
      <h2>Onay Bekleyen Etkinlikler</h2>
      <p>Toplam Onay Bekleyen Etkinlik: {pendingEvents.length}</p>

      <ul style={styles.eventList}>
        {displayedEvents.map(event => (
          <li key={event.id} style={styles.eventItem}>
            <strong>{event.title}</strong> - <span>{event.status}</span>
          </li>
        ))}
      </ul>

      {compact ? (
        <Link to="/admin/pending-events" style={styles.viewMore}>Tümünü Görüntüle</Link>
      ) : (
        <div style={styles.buttons}>
          <button style={styles.approveButton}>Tümünü Onayla</button>
          <button style={styles.rejectButton}>Tümünü Reddet</button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '20px',
    backgroundColor: '#fff',
    marginBottom: '20px',
  },
  eventList: {
    listStyleType: 'none',
    padding: 0,
    marginTop: '10px',
  },
  eventItem: {
    marginBottom: '8px',
  },
  viewMore: {
    display: 'inline-block',
    marginTop: '10px',
    color: '#007bff',
    textDecoration: 'none',
  },
  buttons: {
    marginTop: '10px',
  },
  approveButton: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    padding: '8px 12px',
    marginRight: '10px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  rejectButton: {
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default PendingEvents;
