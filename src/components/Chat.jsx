// src/components/Chat.jsx
import React, { useState, useEffect } from 'react';

function Chat({ eventId, senderId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const exampleMessages = [
      { mesajId: 1, gondericiId: "123", etkinlikId: eventId, mesajMetni: "Merhaba! Etkinliğe katılan var mı?", gonderimZamani: "2024-11-05T10:15:00" },
      { mesajId: 2, gondericiId: "456", etkinlikId: eventId, mesajMetni: "Ben katılıyorum, çok heyecanlıyım!", gonderimZamani: "2024-11-05T10:17:00" },
    ];
    setMessages(exampleMessages);
  }, [eventId]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        mesajId: messages.length + 1,
        gondericiId: senderId,
        etkinlikId: eventId,
        mesajMetni: newMessage,
        gonderimZamani: new Date().toISOString(),
      };

      setMessages((prevMessages) => [...prevMessages, message]);
      setNewMessage('');
    }
  };

  return (
    <div style={styles.chatContainer}>
      <h2 style={styles.chatTitle}>Etkinlik Sohbeti</h2>
      <div style={styles.messageList}>
        {messages.map((msg) => (
          <div
            key={msg.mesajId}
            style={{
              ...styles.message,
              alignSelf: msg.gondericiId === senderId ? 'flex-end' : 'flex-start',
              backgroundColor: msg.gondericiId === senderId ? '#DCF8C6' : '#ECECEC',
            }}
          >
            {msg.gondericiId !== senderId && (
              <p style={styles.sender}>Gönderen ID: {msg.gondericiId}</p>
            )}
            <p style={styles.messageText}>{msg.mesajMetni}</p>
            <p style={styles.time}>{new Date(msg.gonderimZamani).toLocaleTimeString()}</p>
          </div>
        ))}
      </div>
      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Mesajınızı yazın..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleSendMessage} style={styles.sendButton}>Gönder</button>
      </div>
    </div>
  );
}

const styles = {
  chatContainer: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  },
  chatTitle: {
    fontSize: '18px',
    textAlign: 'center',
    marginBottom: '10px',
    color: '#333',
  },
  messageList: {
    maxHeight: '300px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '10px',
  },
  message: {
    maxWidth: '80%',
    padding: '10px',
    borderRadius: '12px',
    fontSize: '14px',
    color: '#333',
    display: 'inline-block',
  },
  sender: {
    fontSize: '0.9em',
    fontWeight: 'bold',
    color: '#555',
    marginBottom: '5px',
  },
  messageText: {
    margin: 0,
  },
  time: {
    fontSize: '0.8em',
    color: '#666',
    textAlign: 'right',
    marginTop: '5px',
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: '10px',
    borderRadius: '20px',
    border: '1px solid #ccc',
    marginRight: '10px',
  },
  sendButton: {
    padding: '10px 15px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
  },
};

export default Chat;
