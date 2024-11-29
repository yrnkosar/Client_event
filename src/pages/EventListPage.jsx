// pages/EventListPage.js
import EventList from '../components/EventList.jsx';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import '../styles/EventListPage.css';

const EventListPage = () => {
  const { authToken } = useAuth();
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 10;
  const [modalEvent, setModalEvent] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:3000/api/admin/events', {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        if (!response.ok) {
          throw new Error('Etkinlik verileri alınamadı.');
        }
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [authToken]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Arama yapıldığında ilk sayfaya dön
  };

  const filteredEvents = events.filter(
    (event) =>
      (event.name && event.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (event.category && event.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const openModal = (event) => {
    setModalEvent(event);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalEvent(null);
    setModalOpen(false);
  };

  const handleDelete = async (eventId) => {
    const confirmDelete = window.confirm('Bu etkinliği silmek istediğinizden emin misiniz?');
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:3000/api/admin/events/${eventId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Hata: ${response.status} - ${errorData.message}`);
        }

        setEvents(events.filter((event) => event.id !== eventId));
      } catch (err) {
        console.error('Silme işlemi başarısız:', err);
      }
    }
  };

  return (
    <div className="event-list-page">
      <h1 className="event-list-title">Etkinlik Yönetim Paneli</h1>

      {/* Arama Çubuğu */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Etkinlik Ara..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {/* Etkinlik Tablosu */}
      {loading ? (
        <p>Yükleniyor...</p>
      ) : error ? (
        <p className="error-message">Hata: {error}</p>
      ) : (
        <table className="event-list-table">
          <thead>
            <tr>
              <th>Adı</th>
              <th>Kategori</th>
              <th>Tarih</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {currentEvents.length > 0 ? (
              currentEvents.map((event) => (
                <tr key={event.id}>
                  <td>{event.name}</td>
                  <td>{event.category}</td>
                  <td>{new Date(event.date).toLocaleDateString()}</td>
                  <td>
                    <button className="action-button details" onClick={() => openModal(event)}>
                      Detaylar
                    </button>
                    <button
                      className="action-button delete"
                      onClick={() => handleDelete(event.id)}
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-data">
                  Etkinlik bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Sayfalama */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`pagination-button ${
              index + 1 === currentPage ? 'active' : ''
            }`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Etkinlik Detayları Modalı */}
      {isModalOpen && modalEvent && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>Etkinlik Detayları</h2>
            <p>
              <strong>Adı:</strong> {modalEvent.name}
            </p>
            <p>
              <strong>Kategori:</strong> {modalEvent.category}
            </p>
            <p>
              <strong>Tarih:</strong> {new Date(modalEvent.date).toLocaleDateString()}
            </p>
            <p>
              <strong>Konum:</strong> Latitude: {modalEvent.location_latitude}, Longitude:{' '}
              {modalEvent.location_longitude}
            </p>
            <button className="modal-close" onClick={closeModal}>
              Kapat
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventListPage;
