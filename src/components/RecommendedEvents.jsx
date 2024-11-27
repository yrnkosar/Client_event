import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Home.module.css';

const RecommendedEvents = ({ events }) => {
  return (
    <div className={styles.recommendedEvents}>
      <h2>Önerilen Etkinlikler</h2>
      <div className={styles.eventList}>
        {events.map((event) => (
          <div key={event.id} className={styles.card}>
            <h3>{event.name}</h3>
            <p>Alt Kategori: {event.Subcategory?.name || 'Belirtilmemiş'}</p>
            <p>Tarih: {new Date(event.date).toLocaleDateString()}</p>
            <Link to={`/event/${event.id}`} className={styles.detailsButton}>Detayları Gör</Link>
          </div>
        ))}
      </div>
    </div>
  );
};


export default RecommendedEvents;
