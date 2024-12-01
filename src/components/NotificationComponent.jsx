import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext.jsx'; 

const NotificationComponent = () => {
  const [notifications, setNotifications] = useState([]); 
  const { authToken } = useAuth(); 

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/message/notifications', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`, 
          },
        });

        const data = await response.json(); 

        console.log('Fetched notifications:', data); 
  
        if (data.success && data.notifications) {
          setNotifications(data.notifications); 
        } else {
          console.error('Error fetching notifications:', data.message || 'Unknown error');
          setNotifications([]); 
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
        setNotifications([]);
      }
    };

    fetchNotifications(); 
  }, [authToken]); 

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
