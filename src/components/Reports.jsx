import React from 'react';

function Reports() {
  return (
    <div style={styles.section}>
      <h2>Detaylı Rapor</h2>
      <p>Yönetim için detaylı raporları burada görüntüleyebilirsiniz.</p>
      {/* Raporların listesi */}
    </div>
  );
}

const styles = {
  section: {
    marginBottom: '20px',
  },
};

export default Reports;
