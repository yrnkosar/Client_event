import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import Header from '../components/Header';
import ProfileEditForm from '../components/ProfileEditForm';
import { Link,useParams, useNavigate } from 'react-router-dom';
import styles from '../styles/Profile.module.css';
import MapComponent from '../components/MapComponent.jsx';
import UserPoints from '../components/UserPoints'; // Puan bileşenini içe aktar

const Profile = () => {
  const { id } = useParams(); // Dinamik user ID
  const { authToken } = useAuth();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [createdEvents, setCreatedEvents] = useState([]);
  const [participatedEvents, setParticipatedEvents] = useState([]);
  const navigate = useNavigate();  // Initialize navigate
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/user/profile', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          console.error('Kullanıcı verisi alınamadı');
        }
      } catch (error) {
        console.error('Veri alırken hata oluştu:', error);
      }
    };

    const fetchUserEvents = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/user/user-events', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCreatedEvents(data.createdEvents);
          setParticipatedEvents(data.participatedEvents);
        } else {
          console.error('Etkinlik verisi alınamadı');
        }
      } catch (error) {
        console.error('Etkinlik verisi alırken hata oluştu:', error);
      }
    };

    if (authToken) {
      fetchUserData();
      fetchUserEvents();
    }
  }, [authToken]);


  const handleSave = async (updatedUser) => {
    try {
      const response = await fetch('http://localhost:3000/api/user/profile', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setIsEditing(false);
      } else {
        console.error('Kullanıcı güncellenemedi');
      }
    } catch (error) {
      console.error('Veri güncellerken hata oluştu:', error);
    }
  };

  if (!user) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <>
      <Header />
      <div className={styles.profileHeader}>
        <h1>Profilim</h1>
      </div>
      <div className={styles.profileContainer}>
        {!isEditing ? (
          <>
            <div className={styles.profileDetails}>
            <img
             src={user.profile_picture_url || 'default-avatar.jpg'} // Ensure the field name is correct
             alt="User Profile"
             className={styles.profilePicture}
             />
              <div className={styles.userInfo}>
                <p><strong>Kullanıcı Adı:</strong> {user.username}</p>
                <p><strong>Ad:</strong> {user.first_name}</p>
                <p><strong>Soyad:</strong> {user.last_name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Doğum Tarihi:</strong> {user.birth_date}</p>
                <p><strong>Cinsiyet:</strong> {user.gender}</p>
                <p><strong>Telefon:</strong> {user.phone_number}</p>

                {/* Harita Bileşeni */}
                <p><strong>Konum:</strong></p>
                {user.location_latitude && user.location_longitude ? (
                  <MapComponent
                    latitude={user.location_latitude}
                    longitude={user.location_longitude}
                  />
                ) : (
                  <p>Konum bilgisi mevcut değil.</p>
                )}
              </div>
              <Link to="/profile/edit">
                <button className={styles.editProfileButton}>Profili Düzenle</button>
              </Link>
            </div>
              {/* Kullanıcı Puanları */}
            <div className={styles.userPoints}>
              <UserPoints />
            </div>

             {/* Add the Create Event Button */}
             <div className={styles.createEventButtonContainer}>
              <button
                className={styles.createEventButton}
                onClick={() => navigate('/event-add')} // Navigate to the event creation page
              >
                Etkinlik Oluştur
              </button>
            </div>
              {/* Katıldığı Etkinlikler */}
            <div className={styles.userEvents}>
              <h3>Katıldığınız Etkinlikler</h3>
              {participatedEvents.length > 0 ? (
                <table className={styles.eventTable}>
                  <thead>
                    <tr>
                      <th>Etkinlik Adı</th>
                      <th>Tarih</th>
                      <th>Alt Kategori</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participatedEvents.map(({ Event }) => (
                      <tr key={Event.id}>
                        <td>
                          <Link to={`/event/${Event.id}`} className={styles.eventLink}>
                            {Event.name}
                          </Link>
                        </td>
                        <td>{new Date(Event.date).toLocaleDateString()}</td>
                        <td>{Event.Subcategory.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>Henüz katıldığınız bir etkinlik yok.</p>
              )}
            </div>

            {/* Oluşturduğunuz Etkinlikler */}
            <div className={styles.userCreatedEvents}>
              <h3>Oluşturduğunuz Etkinlikler</h3>
              {createdEvents.length > 0 ? (
                <table className={styles.eventTable}>
                  <thead>
                    <tr>
                      <th>Etkinlik Adı</th>
                      <th>Tarih</th>
                      <th>Alt Kategori</th>
                    </tr>
                  </thead>
                  <tbody>
                    {createdEvents.map((event) => (
                      <tr key={event.id}>
                        <td>
                          <Link to={`/event/${event.id}`} className={styles.eventLink}>
                            {event.name}
                          </Link>
                        </td>
                        <td>{new Date(event.date).toLocaleDateString()}</td>
                        <td>{event.Subcategory.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>Henüz oluşturduğunuz bir etkinlik yok.</p>
              )}
            </div>
          </>
        ) : (
          <ProfileEditForm user={user} onSave={handleSave} />
        )}
      </div>
    </>
  );
};

export default Profile;
