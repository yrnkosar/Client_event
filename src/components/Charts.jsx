import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function Charts() {
  // Örnek veri
  const barData = {
    labels: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs'],
    datasets: [
      {
        label: 'Etkinlik Sayısı',
        data: [12, 19, 10, 5, 2],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const pieData = {
    labels: ['Konferans', 'Workshop', 'Sosyal', 'Diğer'],
    datasets: [
      {
        data: [30, 20, 25, 25],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
        ],
      },
    ],
  };

  return (
    <div style={styles.charts}>
      <h2>Grafikler</h2>
      <div style={styles.chartContainer}>
        <h3>Etkinlik Sayısı - Tarih Bazlı</h3>
        <Bar data={barData} />
      </div>
      <div style={styles.chartContainer}>
        <h3>Kategorilere Göre Etkinlik Dağılımı</h3>
        <Pie data={pieData} />
      </div>
    </div>
  );
}

const styles = {
  charts: {
    padding: '20px',
    backgroundColor: '#f0f0f0',
    borderRadius: '8px',
  },
  chartContainer: {
    marginBottom: '20px',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#fff',
  },
};

export default Charts;
