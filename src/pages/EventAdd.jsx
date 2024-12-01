import React, { useState , useEffect} from 'react';
import '../styles/EventAdd.css';
import { useAuth } from '../AuthContext'; 
import { useNavigate } from 'react-router-dom'; 
import SuccessModal from '../components/SuccessModal'; 


const EventAdd = () => {
  const { authToken } = useAuth(); 
  const navigate = useNavigate(); 
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    duration: '',
    location: '',
    category: '',
    latitude: null,
    longitude: null,
  });

  const [categories, setCategories] = useState([]); 
  const [showSuccessModal, setShowSuccessModal] = useState(false); 
 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    navigate('/profile');
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/event/subcategories', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });
        const data = await response.json();
        if (data) {
          setCategories(data); 
        }
      } catch (error) {
        console.error('Kategori verileri alınırken hata oluştu:', error);
      }
    };
    
    fetchCategories();
  }, [authToken]); 

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (eventData.location) {
      const coordinates = await getCoordinates(eventData.location);
      if (coordinates) {
        setEventData({
          ...eventData,
          latitude: coordinates.lat,
          longitude: coordinates.lon
        });
  
        const response = await fetch('http://localhost:3000/api/event/create-event', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}` 
          },
          body: JSON.stringify({
            name: eventData.title,
            description: eventData.description,
            date: eventData.date,
            time: eventData.time,
            duration: eventData.duration,
            latitude: coordinates.lat,
            longitude: coordinates.lon,
            subcategory_id: eventData.category, 
          }),
        });
  
        if (response.ok) {
          setShowSuccessModal(true);
        } else {
          alert('Etkinlik oluşturulurken hata oluştu');
        }
      } else {
        alert('Geolocation bilgisi bulunamadı');
      }
    } else {
      alert('Lütfen bir konum girin');
    }
  };

  const getCoordinates = async (address) => {
    const endpoint = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&addressdetails=1`;

    try {
      const response = await fetch(endpoint);
      const data = await response.json();

      if (data && data[0]) {
        return {
          lat: data[0].lat,
          lon: data[0].lon
        };
      }
      return null;
    } catch (error) {
      console.error('Geocoding hatası:', error);
      return null;
    }
  };
  
  return (
    <div className="event-add-container">
      <h2>Yeni Etkinlik Ekle</h2>
      <form onSubmit={handleSubmit} className="event-form">
        <div className="form-group">
          <label htmlFor="title">Etkinlik Başlığı</label>
          <input
            type="text"
            id="title"
            name="title"
            value={eventData.title}
            onChange={handleInputChange}
            required
            placeholder="Etkinlik başlığını girin"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Açıklama</label>
          <textarea
            id="description"
            name="description"
            value={eventData.description}
            onChange={handleInputChange}
            required
            placeholder="Etkinlik hakkında detaylı bilgi"
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Tarih</label>
          <input
            type="date"
            id="date"
            name="date"
            value={eventData.date}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="time">Saat</label>
          <input
            type="time"
            id="time"
            name="time"
            value={eventData.time}
            onChange={handleInputChange}
            required
          />
        </div>
       
        <div className="form-group">
          <label htmlFor="duration">Süre</label>
          <input
            type="text"
            id="duration"
            name="duration"
            value={eventData.duration}
            onChange={handleInputChange}
            required
            placeholder="Etkinlik süresi"
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Konum</label>
          <input
            type="text"
            id="location"
            name="location"
            value={eventData.location}
            onChange={handleInputChange}
            required
            placeholder="Etkinlik konumunu girin"
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Kategori</label>
          <select
            id="category"
            name="category"
            value={eventData.category}
            onChange={handleInputChange}
            required
          >
             <option value="">Bir kategori seçin</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <button type="submit" className="submit-btn">Etkinlik Ekle</button>
        </div>

        {eventData.latitude && eventData.longitude && (
          <div className="coordinates-display">
            <p>Koordinatlar: </p>
            <p>Lat: {eventData.latitude}, Lon: {eventData.longitude}</p>
          </div>
        )}
      </form>

       <SuccessModal
        isVisible={showSuccessModal}
        onClose={handleModalClose}
        message="Etkinlik başarıyla oluşturuldu!"
      />

    </div>
  );
};

export default EventAdd;
