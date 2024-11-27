import React from 'react';

function Summary() {
  return (
    <div style={styles.summary}>
      <h2>Özet Bilgi</h2>
      <p>Toplam Etkinlik: 120</p>
      <p>Toplam Kullanıcı: 300</p>
      <p>Bu ay oluşturulan etkinlikler: 15</p>
      {/* İstediğiniz ek bilgileri buraya ekleyin */}
    </div>
  );
}

const styles = {
  summary: {
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    marginBottom: '20px',
    backgroundColor: '#f9f9f9',
  },
};

export default Summary;
