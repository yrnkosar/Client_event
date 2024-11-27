import React from 'react';

const EventList = ({ events, onDelete}) => {
  return (
    <ul className="event-list">
      {events.map((event) => (
        <li key={event.id} className="event-item">
          <div>
            <h3>{event.name || "Etkinlik Adı Belirtilmemiş"}</h3>
            <p>{event.description || "Açıklama mevcut değil"}</p>
            <p>{event.date || "Tarih belirtilmemiş"}</p>
          </div>
          <button
            className="delete-button"
            onClick={() => onDelete(event.id)}
          >
            Sil
          </button>
        </li>
      ))}
    </ul>
  );
};

export default EventList;
