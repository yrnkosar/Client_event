import { useNavigate , Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import '../styles/EventListPage.css';
import DetailsModal from '../components/DetailsModal.jsx';

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
  const [isEditMode, setEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    date: '',
    time: '',
    duration: '',
    latitude: 0,
    longitude: 0,
    subcategory_id: 0,
    status: true,
  });
  const openEditModal = (event) => {
    setEditMode(true);
    setModalEvent(event);
    setEditFormData({
      name: event.name,
      description: event.description,
      date: event.date,
      time: event.time,
      duration: event.duration,
      latitude: event.latitude,
      longitude: event.longitude,
      subcategory_id: event.subcategory_id,
      status: event.status,
    });
    setModalOpen(true);
  };
  
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleEditSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`http://localhost:3000/api/event/update-event/${modalEvent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(editFormData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Hata: ${response.status} - ${errorData.message}`);
      }

      const updatedEvent = await response.json();
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === updatedEvent.id ? { ...event, ...updatedEvent } : event
        )
      );
  
      closeModal();
    } catch (err) {
      console.error('Düzenleme işlemi başarısız:', err);
    }
  };

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
    setCurrentPage(1); 
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

      <div className="search-bar">
        <input
          type="text"
          placeholder="Etkinlik Ara..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>


      {loading ? (
        <p>Yükleniyor...</p>
      ) : error ? (
        <p className="error-message">Hata: {error}</p>
      ) : (
        <table className="event-list-table">
          <thead>
            <tr>
              <th>Adı</th>
              <th>Tarih</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {currentEvents.length > 0 ? (
              currentEvents.map((event) => (
                <tr key={event.id}>
                  <td>{event.name}</td>
                  <td>{new Date(event.date).toLocaleDateString()}</td>
                  <td>
                  <button className="action-button details" onClick={() => openModal(event)}>
                      Detaylar
                    </button>
                    <button className="action-button edit" onClick={() => openEditModal(event)}>
                      Düzenle
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

 {isModalOpen && (
        <DetailsModal event={modalEvent} onClose={closeModal} />
      )}
 
      <div className="pagination">
        <button
          className="pagination-button"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(1)}
        >
          İlk Sayfa
        </button>

        {currentPage > 3 && (
          <>
            <button className="pagination-button" onClick={() => handlePageChange(currentPage - 1)}>
              ‹
            </button>
            <span className="pagination-ellipsis">...</span>
          </>
        )}

        {Array.from({ length: totalPages }, (_, index) => (
          (index + 1 >= currentPage - 2 && index + 1 <= currentPage + 2) && (
            <button
              key={index}
              className={`pagination-button ${index + 1 === currentPage ? 'active' : ''}`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          )
        ))}

        {currentPage < totalPages - 2 && (
          <>
            <span className="pagination-ellipsis">...</span>
            <button
              className="pagination-button"
              onClick={() => handlePageChange(totalPages)}
            >
              Son Sayfa
            </button>
          </>
        )}

        <button
          className="pagination-button"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          ›
        </button>
      </div>

      {isModalOpen && modalEvent && (
  <div className="modal-backdrop">
    <div className="modal">
      {isEditMode ? (
        <>
          <h2>Etkinliği Düzenle</h2>
          <form onSubmit={handleEditSubmit}>
            <div>
              <label>Adı:</label>
              <input
                type="text"
                name="name"
                value={editFormData.name}
                onChange={handleEditInputChange}
                required
              />
            </div>
            <div>
              <label>Açıklama:</label>
              <textarea
                name="description"
                value={editFormData.description}
                onChange={handleEditInputChange}
                required
                rows="4"
              ></textarea>
            </div>
            <div>
              <label>Tarih:</label>
              <input
                type="date"
                name="date"
                value={new Date(editFormData.date).toISOString().slice(0, 10)}
                onChange={handleEditInputChange}
                required
              />
            </div>
            <div>
              <label>Saat:</label>
              <input
                type="time"
                name="time"
                value={editFormData.time}
                onChange={handleEditInputChange}
                required
              />
            </div>
            <div>
              <label>Süre:</label>
              <input
                type="text"
                name="duration"
                value={editFormData.duration}
                onChange={handleEditInputChange}
                required
              />
            </div>
            <div>
              <label>Enlem:</label>
              <input
                type="number"
                name="latitude"
                value={editFormData.latitude}
                onChange={handleEditInputChange}
                required
              />
            </div>
            <div>
              <label>Boylam:</label>
              <input
                type="number"
                name="longitude"
                value={editFormData.longitude}
                onChange={handleEditInputChange}
                required
              />
            </div>
            <div>
              <label>Alt Kategori ID:</label>
              <input
                type="number"
                name="subcategory_id"
                value={editFormData.subcategory_id}
                onChange={handleEditInputChange}
                required
              />
            </div>
            <div>
              <label>Durum:</label>
              <select
                name="status"
                value={editFormData.status}
                onChange={handleEditInputChange}
                required
              >
                <option value={true}>Aktif</option>
                <option value={false}>Pasif</option>
              </select>
            </div>
            <div className="modal-actions">
              <button type="submit" className="action-button save">
                Kaydet
              </button>
              <button type="button" className="action-button cancel" onClick={closeModal}>
                İptal
              </button>
            </div>
          </form>
        </>
      ) : (
  
        <>
          <h2>Etkinlik Detayları</h2>
          <p>
            <strong>Adı:</strong> {modalEvent.name}
          </p>
          <p>
            <strong>Açıklama:</strong> {modalEvent.description}
          </p>
          <p>
            <strong>Tarih:</strong> {new Date(modalEvent.date).toLocaleDateString()}
          </p>
          <p>
            <strong>Saat:</strong> {modalEvent.time}
          </p>
          <p>
            <strong>Süre:</strong> {modalEvent.duration}
          </p>
          <p>
            <strong>Konum:</strong> Enlem: {modalEvent.latitude}, Boylam: {modalEvent.longitude}
          </p>
          <p>
            <strong>Kullanıcı ID:</strong> {modalEvent.user_id}
          </p>
          <p>
            <strong>Alt Kategori ID:</strong> {modalEvent.subcategory_id}
          </p>
          <p>
            <strong>Durum:</strong> {modalEvent.status ? 'Aktif' : 'Pasif'}
          </p>
          <button className="modal-close" onClick={closeModal}>
            Kapat
          </button>
        </>
      )}
    </div>
  </div>
)}
    </div>
  );
};

export default EventListPage;
