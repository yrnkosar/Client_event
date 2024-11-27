import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Home.module.css';

function EventCategory({ category, events }) {
  return (
    <div className={styles.categorySection}>
      <h2>{category}</h2>
      <div className={styles.eventList}>
        {events.map(event => (
          <div key={event.id} className={styles.card}>
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <Link to={`/event/${event.id}`} className={styles.detailsButton}>
              Detayları Gör
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EventCategory;
