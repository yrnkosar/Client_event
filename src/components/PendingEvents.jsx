import React from 'react';

function PendingEvents({ events = [], onApprove, onDelete }) {
  // Handle the case where events might not be loaded or be empty
  if (!Array.isArray(events)) {
    return <p>Failed to load events.</p>;
  }

  return (
    <div>
      {events.length === 0 ? (
        <p>No pending events</p>
      ) : (
        <ul>
          {events.map(event => (
            <li key={event.id} style={{ marginBottom: '10px' }}>
              <h3>{event.name}</h3>
              <p>Category: {event.subcategory.name}</p>
              <p>Created by: {event.user.username}</p>
              <button onClick={() => onApprove(event.id)}>Onayla</button>
              <button onClick={() => onDelete(event.id)}>Sil</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PendingEvents;