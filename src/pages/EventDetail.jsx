import React, { useEffect, useState } from 'react';
import { useParams, Link,useNavigate} from 'react-router-dom';
import Chat from '../components/Chat.jsx';
import { useAuth} from '../AuthContext.jsx';

function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate(); // Yönlendirme için useNavigate
  const [event, setEvent] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false); // Formu açıp kapatmak için state
  const { user, authToken, setUserPoints } = useAuth(); // Add setUserPoints here
  const [participants, setParticipants] = useState([]);
  const [isParticipant, setIsParticipant] = useState(false);
  const [joined, setJoined] = useState(false);  // Declare the 'joined' state
  
  useEffect(() => {
    // Eğer user veya authToken yoksa, hata almamak için fonksiyonu sonlandır
    if (!user || !authToken) {
      return;
    }

    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/event/get-event/${id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Etkinlik detayları alınamadı.");
        }

        const data = await response.json();
        setEvent(data);
      } catch (err) {
        console.error(err.message);
      }
    };

    const fetchParticipants = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/participant/participants/${id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Katılımcılar alınamadı.");
        }

        const data = await response.json();
        setParticipants(data);
        const isUserParticipant = data.some((participant) => participant.user_id === user.id);
        setIsParticipant(isUserParticipant);
     
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchEvent();
    fetchParticipants();
  }, [id, authToken, user]);

  const handleJoinEvent = async () => {
    try {
        const response = await fetch(`http://localhost:3000/api/event/join/${id}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            console.log("Katılma başarılı");
            setJoined(true);
            setIsParticipant(true); // Kullanıcı katılımcı oldu, sohbeti aktif hale getir
            setShowChat(true);

            // Katılma işlemi başarılı olduktan sonra, kullanıcının puanlarını güncelle
            const userResponse = await fetch(`http://localhost:3000/api/point/user-points`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (userResponse.ok) {
              const userData = await userResponse.json();
              const totalPoints = userData.points.reduce((total, item) => total + item.points, 0);
              setUserPoints(totalPoints);  
              navigate('/profile');// Güncel puanları global state'e set et
          } else {
              console.error("Puanlar alınamadı");
          }
          // Profil sayfasına yönlendir
       
      } else {
          console.error('Katılma başarısız', await response.text());
      }
  } catch (error) {
      console.error("Katılma işlemi sırasında hata:", error);
  }
};
const handleDeleteEvent = async () => {
  const confirmDelete = window.confirm('Bu etkinliği silmek istediğinizden emin misiniz?');
  if (confirmDelete) {
    try {
      const response = await fetch(`http://localhost:3000/api/event/delete-event/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        console.log("Etkinlik başarıyla silindi");
        navigate('/profile'); // Etkinlik silindikten sonra profil sayfasına yönlendir
      } else {
        console.error('Etkinlik silinirken hata:', await response.text());
      }
    } catch (error) {
      console.error("Etkinlik silinirken hata:", error);
    }
  }
};

const handleJoinChat = () => {
  alert("Sohbet odasına yönlendiriliyorsunuz...");
  setShowChat(true);
};
  const toggleEditForm = () => setShowEditForm((prev) => !prev);

  const handleSaveEdit = async (updatedEvent) => {
    try {
      const response = await fetch(`http://localhost:3000/api/event/update-event/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEvent),
      });

      if (!response.ok) {
        throw new Error("Etkinlik güncellenemedi.");
      }
      navigate('/profile');
      const updatedData = await response.json();
      setEvent(updatedData);
      console.log('Etkinlik başarıyla güncellendi:', updatedData);
      setShowEditForm(false); 
        
    } catch (error) {
      console.error("Etkinlik güncellenirken hata:", error);
    }
  };

    if (!event) return <p>Etkinlik detayları yükleniyor...</p>;
  const isOwner = user?.id === event.user_id; // Kullanıcının etkinlik sahibi olup olmadığını kontrol ediyoruz

  return (
    <div style={styles.container}>
       <h1 style={styles.title}>{event.name}</h1>
      <p><strong>Etkinlik ID:</strong> {event.id}</p>
      <p><strong>Düzenleyen:</strong> {event.User?.username}</p>
      <p><strong>Açıklama:</strong> {event.description}</p>
      <p><strong>Tarih:</strong> {event.date}</p>
      <p><strong>Saat:</strong> {event.time}</p>
      <p><strong>Süre:</strong> {event.duration}</p>
      <p><strong>Konum:</strong> Latitude: {event.latitude}, Longitude: {event.longitude}</p>
      <p><strong>Kategori:</strong> {event.Subcategory?.name}</p>
      {/* Etkinlik sahibi kontrolü */}
   
      {isOwner && (
        <>
          <button onClick={toggleEditForm} style={styles.editButton}>
            {showEditForm ? "İptal Et" : "Düzenle"}
          </button>
          <button onClick={handleDeleteEvent} style={styles.deleteButton}>Sil</button>
        </>
      )}
      
      {showEditForm && (
        <EventEditForm event={event} onSave={handleSaveEdit} />
      )}
 {isParticipant && !showChat && (
        <button onClick={handleJoinChat} style={styles.chatButton}>
          Sohbete Katıl
        </button>
      )}

{!isParticipant ? (
        <button onClick={handleJoinEvent} style={styles.joinButton}>Katıl</button>
      ) : (
        <Link to={`/chat/${id}`} style={styles.chatButton}>Sohbete Katıl</Link>
      )}

      <Link to="/home" style={styles.link}>Ana Sayfaya Dön</Link>
    </div>
  );
}

// Düzenleme formu bileşeni
const EventEditForm = ({ event, onSave }) => {
  const [formData, setFormData] = useState({
    etkinlikAdi: event.name,
    aciklama: event.description,
    tarih: event.date,
    saat: event.time,
    sure: event.duration,
    konum:  `Latitude: ${event.latitude}, Longitude: ${event.longitude}`,
    kategori: event.Subcategory?.name,
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(formData).some((field) => !field)) {
      alert('Lütfen tüm alanları doldurun.');
      return;
    }
    const updatedEvent = {
      name: formData.etkinlikAdi,
      description: formData.aciklama,
      date: formData.tarih,
      time: formData.saat,
      duration: formData.sure,
      latitude: parseFloat(event.latitude), // Latitude'i doğru formatta gönderin
      longitude: parseFloat(event.longitude), // Longitude'i doğru formatta gönderin
      subcategory_id: event.Subcategory?.id, // Backend'in beklediği ID'yi ekleyin   
    };
    onSave(updatedEvent);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <label>
        Etkinlik Adı:
        <input
          type="text"
          name="etkinlikAdi"
          value={formData.etkinlikAdi}
          onChange={handleChange}
          style={styles.input}
        />
      </label>
      <label>
        Açıklama:
        <textarea
          name="aciklama"
          value={formData.aciklama}
          onChange={handleChange}
          style={styles.textarea}
        />
      </label>
      <label>
        Tarih:
        <input
          type="date"
          name="tarih"
          value={formData.tarih}
          onChange={handleChange}
          style={styles.input}
        />
      </label>
      <label>
        Saat:
        <input
          type="time"
          name="saat"
          value={formData.saat}
          onChange={handleChange}
          style={styles.input}
        />
      </label>
      <label>
        Süre:
        <input
          type="text"
          name="sure"
          value={formData.sure}
          onChange={handleChange}
          style={styles.input}
        />
      </label>
      <label>
        Konum:
        <input
          type="text"
          name="konum"
          value={formData.konum}
          onChange={handleChange}
          style={styles.input}
        />
      </label>
      <label>
        Kategori:
        <input
          type="text"
          name="kategori"
          value={formData.kategori}
          onChange={handleChange}
          style={styles.input}
        />
      </label>
      <button type="submit" style={styles.submitButton}>Kaydet</button>
    </form>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '20px',
  },
  joinButton: {
    display: 'inline-block',
    marginTop: '15px',
    padding: '10px 15px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  chatButton: {
    display: 'inline-block',
    marginTop: '15px',
    padding: '10px 15px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  editButton: {
    display: 'inline-block',
    marginTop: '15px',
    padding: '10px 15px',
    backgroundColor: '#ffc107',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '10px ', 
    },
  link: {
    display: 'inline-block',
    marginTop: '20px',
    padding: '10px 15px',
    backgroundColor: '#007bff',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '4px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginTop: '20px',
  },
  input: {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  textarea: {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    minHeight: '80px',
  },
  saveButton: {
    padding: '10px 15px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

export default EventDetail;
