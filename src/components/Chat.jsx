import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import styles from '../styles/Chat.module.css';

const ChatComponent = ({ eventId }) => {
  const { authToken, user } = useAuth(); 
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      setError(null);
    
      try {
        const response = await fetch(`http://localhost:3000/api/message/event/${eventId}/messages`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });
    
        if (!response.ok) {
          throw new Error('Mesajlar alınırken bir hata oluştu.');
        }
    
        const data = await response.json();
    
        if (Array.isArray(data.messages)) {
          const formattedMessages = data.messages.map((message) => ({
            ...message,
            sender: message.User || { id: null, username: 'Kullanıcı Bilinmiyor' }, 
          }));
          setMessages(formattedMessages);
        } else {
          console.error('API yanıtı beklenen formatta değil:', data);
          setMessages([]);
        }
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

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
        const message = {
            senderId: user.id, 
            eventId: eventId,
            messageText: newMessage,
            sendTime: new Date().toISOString(),
        };

        try {
            const response = await fetch(`http://localhost:3000/api/message/send-message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify(message),
            });

            if (!response.ok) {
                throw new Error('Mesaj gönderilirken bir hata oluştu.');
            }

            const data = await response.json();
            console.log("Yeni mesaj API yanıtı:", data);

            const newMessageData = {
                id: data.id || data.data.id,
                sender: {
                    id: user.id, 
                    username: user.username, 
                },
                message_text: data.message_text || data.data.message_text, 
                sent_time: data.sent_time || data.data.sent_time, 
            };

            setMessages((prevMessages) => [...prevMessages, newMessageData]);
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
      <p>
        <strong>{message.sender?.username || 'Kullanıcı Bilinmiyor'}:</strong> {message.message_text}
      </p>
      {message.sent_time && (
        <p>
          <small>{new Date(message.sent_time).toLocaleString()}</small>
        </p>
      )}
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
