import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext.jsx'; // AuthContext'i kullanarak kullanıcı bilgilerine erişim

const NotificationComponent = () => {
  const [notifications, setNotifications] = useState([]); // Bildirimler için state
  const { authToken } = useAuth(); // Token'ı AuthContext'ten alıyoruz

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/message/notifications', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`, // Token'ı gönderiyoruz
          },
        });

        const data = await response.json(); // Yanıtı JSON'a çeviriyoruz

        console.log('Fetched notifications:', data); // API'den gelen veriyi kontrol ediyoruz

        // API yanıtının doğru olduğunu kontrol edelim
        if (data.success && data.notifications) {
          setNotifications(data.notifications); // Bildirimleri state'e kaydediyoruz
        } else {
          console.error('Error fetching notifications:', data.message || 'Unknown error');
          setNotifications([]); // Hata durumunda bildirimleri boş tutuyoruz
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
        setNotifications([]); // Hata durumunda bildirimleri boş tutuyoruz
      }
    };

    fetchNotifications(); // Bildirimleri çekmeye başlıyoruz
  }, [authToken]); // Token her değiştiğinde bildirimleri tekrar çek

  return (
    <div>
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <div key={notification.id} className="notification">
            <p><strong>{notification.User.username}</strong>: {notification.message_text}</p>
            <p><strong>Event:</strong> {notification.Event.name}</p>
            <p><strong>Sent Time:</strong> {new Date(notification.sent_time).toLocaleString()}</p>
          </div>
        ))
      ) : (
        <p>No new notifications</p>
      )}
    </div>
  );
};

export default NotificationComponent;
