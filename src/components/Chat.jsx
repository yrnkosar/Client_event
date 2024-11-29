import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext'; // AuthContext'i kullanarak token'ı alacağız
import styles from '../styles/Chat.module.css';

const ChatComponent = ({ eventId }) => {
  const { authToken } = useAuth();  // AuthContext'ten token alınır
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mesajları çekme işlemi
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`http://localhost:3000/api/messages/event/${eventId}/messages`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`,  // Token'ı Authorization başlığına ekliyoruz
          },
        });

        if (!response.ok) {
          throw new Error('Mesajlar alınırken bir hata oluştu.');
        }

        const data = await response.json();
        setMessages(data); // Gelen mesajları set ediyoruz
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (authToken) {
      fetchMessages();
    }
  }, [eventId, authToken]);

  // Yeni mesaj gönderme işlemi
  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const message = {
        gondericiId: 1, // Kullanıcı ID'sini eklemelisiniz
        etkinlikId: eventId,
        mesajMetni: newMessage,
        gonderimZamani: new Date().toISOString(),
      };

      try {
        const response = await fetch(`http://localhost:3000/api/messages/${eventId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,  // Token'ı Authorization başlığına ekliyoruz
          },
          body: JSON.stringify(message),
        });

        if (!response.ok) {
          throw new Error('Mesaj gönderilirken bir hata oluştu.');
        }

        const data = await response.json();
        setMessages((prevMessages) => [...prevMessages, data]);
        setNewMessage('');
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  if (error) {
    return <div>Hata: {error}</div>;
  }

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messagesContainer}>
        {messages.map((message) => (
          <div key={message.id} className={styles.message}>
            <p><strong>{message.sender.username}:</strong> {message.text}</p>
            <p><small>{new Date(message.sendTime).toLocaleString()}</small></p>
          </div>
        ))}
      </div>

      <div className={styles.inputContainer}>
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Mesajınızı yazın..."
        />
        <button onClick={handleSendMessage}>Gönder</button>
      </div>
    </div>
  );
};

export default ChatComponent;
