import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import Header from '../components/Header';
import RecommendedEvents from '../components/RecommendedEvents';
import EventCategory from '../components/EventCategory';
import styles from '../styles/Home.module.css';

function Home() {
  const { user, authToken } = useAuth(); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [recommendedEvents, setRecommendedEvents] = useState([]); 
  const [allEvents, setAllEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
   const eventsPerPage = 9;
 

  const [currentRecommendedPage, setCurrentRecommendedPage] = useState(1);
  const [currentAllEventsPage, setCurrentAllEventsPage] = useState(1);
  
  
  const fetchRecommendedEvents = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/interest/recommendations`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Önerilen etkinlikler alınamadı.');
      }

      const data = await response.json();
      setRecommendedEvents(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchAllEvents = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/event/events', {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!response.ok) {
        throw new Error('Tüm etkinlikler alınamadı.');
      }

      const data = await response.json();
      setAllEvents(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (!authToken) {
      navigate('/'); 
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchRecommendedEvents(), fetchAllEvents()]);
      setLoading(false);
    };

    fetchData();
  }, [authToken, navigate]);

  const indexOfLastRecommendedEvent = currentRecommendedPage * eventsPerPage;
  const indexOfFirstRecommendedEvent = indexOfLastRecommendedEvent - eventsPerPage;
  const currentRecommendedEvents = recommendedEvents.slice(
    indexOfFirstRecommendedEvent,
    indexOfLastRecommendedEvent
  );

  const recommendedTotalPages = Math.ceil(recommendedEvents.length / eventsPerPage);

  const filteredEvents = allEvents.filter(
    (event) =>
      (event.name && event.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (event.category && event.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const indexOfLastEvent = currentAllEventsPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);

  const allEventsTotalPages = Math.ceil(filteredEvents.length / eventsPerPage);

 
  const renderPagination = (totalPages, currentPage, onPageChange) => {
    const paginationButtons = [];

    paginationButtons.push(
      <button
        key={1}
        className={`pagination-button ${currentPage === 1 ? 'active' : ''}`}
        onClick={() => onPageChange(1)}
      >
        1
      </button>
    );

    if (currentPage > 3) {
      paginationButtons.push(
        <span key="start-dots" className="pagination-dots">
          ...
        </span>
      );
    }

    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      paginationButtons.push(
        <button
          key={i}
          className={`pagination-button ${currentPage === i ? 'active' : ''}`}
          onClick={() => onPageChange(i)}
        >
          {i}
        </button>
      );
    }

    if (currentPage < totalPages - 2) {
      paginationButtons.push(
        <span key="end-dots" className="pagination-dots">
          ...
        </span>
      );
    }

    if (totalPages > 1) {
      paginationButtons.push(
        <button
          key={totalPages}
          className={`pagination-button ${currentPage === totalPages ? 'active' : ''}`}
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    return paginationButtons;
  };

  const handleRecommendedPageChange = (pageNumber) =>
    setCurrentRecommendedPage(pageNumber);
  const handleAllEventsPageChange = (pageNumber) =>
    setCurrentAllEventsPage(pageNumber);
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentAllEventsPage(1);
  };

  const openEventDetails = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  return (
    <div>
      <Header />
      <h1>Hoş Geldiniz, {user ? user.username : 'Kullanıcı'}</h1>
      <section>
        <h2>Önerilen Etkinlikler</h2>
        <div className={styles.cardContainer}>
          {currentRecommendedEvents.map((event) => (
            <div
              key={event.id}
              className={styles.card}
              onClick={() => openEventDetails(event.id)}
            >
              <h3>{event.name}</h3>
              <p>{event.category}</p>
              <p>{new Date(event.date).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
        <div className="pagination">
          {renderPagination(recommendedTotalPages, currentRecommendedPage, handleRecommendedPageChange)}
        </div>
      </section>
      <section>
        <h2>Tüm Etkinlikler</h2>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Etkinlik Ara..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <div className={styles.cardContainer}>
          {currentEvents.map((event) => (
            <div
              key={event.id}
              className={styles.card}
              onClick={() => openEventDetails(event.id)}
            >
              <h3>{event.name}</h3>
              <p>{event.category}</p>
              <p>{new Date(event.date).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
        <div className="pagination">
          {renderPagination(allEventsTotalPages, currentAllEventsPage, handleAllEventsPageChange)}
        </div>
      </section>
    </div>
  );
}

export default Home;
