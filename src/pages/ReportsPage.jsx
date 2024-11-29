import React from 'react';
import Charts from '../components/Charts'; // Import the Charts component

function Reports() {
  return (
    <div style={styles.section}>
      <h2>Detaylı Rapor</h2>
      <p>Yönetim için detaylı raporları burada görüntüleyebilirsiniz.</p>
      <Charts /> {/* Displaying charts on the reports page */}
    </div>
  );
}

const styles = {
  section: {
    marginBottom: '20px',
  },
};

export default Reports;
