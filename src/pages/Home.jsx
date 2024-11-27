import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import Header from '../components/Header';
import RecommendedEvents from '../components/RecommendedEvents';
import EventCategory from '../components/EventCategory';
import styles from '../styles/Home.module.css';

function Home() {
  const { user, authToken } = useAuth(); // AuthContext'ten kullanıcı bilgisini al
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [recommendedEvents, setRecommendedEvents] = useState([]); // Önerilen etkinlikler

  useEffect(() => {
    if (!authToken) {
      navigate('/login'); // Eğer authToken yoksa login sayfasına yönlendir
      return;
    }

    const fetchRecommendedEvents = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/interest/recommendations`, {
          headers: {
            Authorization: `Bearer ${authToken}`, // Token ile doğrulama
          },
        });

        if (!response.ok) {
          throw new Error('Önerilen etkinlikler alınamadı.');
        }

        const data = await response.json();
        setRecommendedEvents(data); // Veriyi state'e ata
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); // Yükleme durumunu kapat
      }
    };

    fetchRecommendedEvents();
  }, [authToken, navigate, user.id]);

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
      <p>Önerilen etkinlikleri burada görebileceksiniz.</p>

      {/* Kategorilere Göre Etkinlikler */}
      <EventCategory category="Konserler" events={[]} />
      <EventCategory category="Seminerler" events={[]} />

      {/* Önerilen Etkinlikler */}
      {recommendedEvents.length > 0 ? (
        <RecommendedEvents events={recommendedEvents} />
      ) : (
        <p>Henüz sizin için bir öneri bulunmuyor.</p>
      )}
    </div>
  );
}

export default Home;
