import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom'; 
import styles from '../styles/ProfileEditForm.module.css';
import MapComponent from '../components/MapComponent.jsx';

const ProfileEditForm = ({ onSave }) => {
  const { authToken } = useAuth();
  const navigate = useNavigate(); 

  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    birth_date: '',
    gender: '',
    phone_number: '',
    location_latitude: '',
    location_longitude: '',
    profile_picture_url: '',
  });

 
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/user/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setFormData({
            username: data.username || '',
            first_name: data.first_name || '',
            last_name: data.last_name || '',
            email: data.email || '',
            birth_date: data.birth_date || '',
            gender: data.gender || '',
            phone_number: data.phone_number || '',
            location_latitude: data.location_latitude || '',
            location_longitude: data.location_longitude || '',
            profile_picture_url: data.profile_picture_url || 'default-avatar.jpg',
          });
        } else {
          console.error('Kullanıcı verileri alınamadı.');
        }
      } catch (error) {
        console.error('Veri alınırken hata oluştu:', error);
      }
    };

    fetchUserData();
  }, [authToken]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/user/update-profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        if (onSave && typeof onSave === 'function') {
          onSave(updatedUser); 
        }
        navigate('/profile');
      } else {
        console.error('Kullanıcı bilgileri güncellenemedi.');
      }
    } catch (error) {
      console.error('Veri güncellenirken hata oluştu:', error);
    }
  };

  
  if (!formData.username) return <div>Loading...</div>;

  return (
    <div className={styles.profileEditForm}>
      <h2>Profilini Düzenle</h2>
      <form onSubmit={(e) => e.preventDefault()}>

        <div className={styles.formGroup}>
          <label htmlFor="username">Kullanıcı Adı</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="first_name">Ad</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="last_name">Soyad</label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="birth_date">Doğum Tarihi</label>
          <input
            type="date"
            id="birth_date"
            name="birth_date"
            value={formData.birth_date}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="gender">Cinsiyet</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="male">Erkek</option>
            <option value="female">Kadın</option>
            <option value="other">Diğer</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="phone_number">Telefon</label>
          <input
            type="text"
            id="phone_number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="location">Konum</label>
          {formData.location_latitude && formData.location_longitude ? (
            <MapComponent
              latitude={formData.location_latitude}
              longitude={formData.location_longitude}
            />
          ) : (
            <p>Konum bilgisi mevcut değil.</p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="profile_picture_url">Profil Resmi URL:</label>
          <input
            type="text"
            id="profile_picture_url"
            name="profile_picture_url"
            value={formData.profile_picture_url}
            onChange={handleChange}
          />
        </div>

        <button type="button" onClick={handleSave} className={styles.saveButton}>
          Kaydet
        </button>
      </form>
    </div>
  );
};

export default ProfileEditForm;
