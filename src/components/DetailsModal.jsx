import React from 'react';

const DetailsModal = ({ event, onClose }) => {
  if (!event) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Etkinlik Detayları</h2>
        <p>
          <strong>Adı:</strong> {event.name}
        </p>
        <p>
          <strong>Açıklama:</strong> {event.description}
        </p>
        <p>
          <strong>Tarih:</strong> {new Date(event.date).toLocaleDateString()}
        </p>
        <p>
          <strong>Saat:</strong> {event.time}
        </p>
        <p>
          <strong>Süre:</strong> {event.duration}
        </p>
        <p>
          <strong>Konum:</strong> Enlem: {event.latitude}, Boylam: {event.longitude}
        </p>
        <p>
          <strong>Kullanıcı ID:</strong> {event.user_id}
        </p>
        <p>
          <strong>Alt Kategori ID:</strong> {event.subcategory_id}
        </p>
        <p>
          <strong>Durum:</strong> {event.status ? 'Aktif' : 'Pasif'}
        </p>
        <div className="modal-actions">
          <button className="action-button close" onClick={onClose}>
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailsModal;
