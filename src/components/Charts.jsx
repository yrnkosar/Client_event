import React, { useEffect, useState, useContext } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { useAuth } from '../AuthContext';  // Importing useAuth hook

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function Charts() {
  const { authToken, userPoints } = useAuth();  // Access authToken and userPoints from context
  const [barData, setBarData] = useState(null);
  const [pieData, setPieData] = useState(null);
  const [demographicsData, setDemographicsData] = useState(null); // For demographics data
  const [loading, setLoading] = useState(true);

  // Fetching data from the backend
  useEffect(() => {
    const fetchData = async () => {
      if (!authToken) return;  // Don't fetch if no token exists

      try {
        const headers = { Authorization: `Bearer ${authToken}` };

        const [usersRes, eventsRes, monthRes, categoryRes, demographicsRes] = await Promise.all([
          fetch('http://localhost:3000/api/admin/total-users', { headers }),
          fetch('http://localhost:3000/api/admin/total-events', { headers }),
          fetch('http://localhost:3000/api/admin/events-by-month', { headers }),
          fetch('http://localhost:3000/api/admin/events-by-category', { headers }),
          fetch('http://localhost:3000/api/admin/age-gender-demographics', { headers })
        ]);

        const [usersData, eventsData, monthData, categoryData, demographicsDataResponse] = await Promise.all([
          usersRes.json(),
          eventsRes.json(),
          monthRes.json(),
          categoryRes.json(),
          demographicsRes.json(),
        ]);

        // Handling the demographics data
        const demographicsAgeGroups = ['15-30', '31-45', '46-60', '60+'];
        const maleCounts = demographicsAgeGroups.map(ageGroup => {
          const ageGroupData = demographicsDataResponse.ageDemographics.filter(item => item.age_group === ageGroup && (item.gender === 'Erkek' || item.gender === 'male'));
          return ageGroupData.length > 0 ? ageGroupData.reduce((acc, item) => acc + item.count, 0) : 0;  // Summing counts for each group
        });
        const femaleCounts = demographicsAgeGroups.map(ageGroup => {
          const ageGroupData = demographicsDataResponse.ageDemographics.filter(item => item.age_group === ageGroup && (item.gender === 'Kadın' || item.gender === 'female'));
          return ageGroupData.length > 0 ? ageGroupData.reduce((acc, item) => acc + item.count, 0) : 0;  // Summing counts for each group
        });

        setDemographicsData({
          labels: demographicsAgeGroups,
          datasets: [
            {
              label: 'Erkek',
              data: maleCounts,
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
            },
            {
              label: 'Kadın',
              data: femaleCounts,
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
            },
          ],
        });

        setBarData({
          labels: monthData.eventsByMonth.map(item => item.month),
          datasets: [
            {
              label: 'Etkinlik Sayısı',
              data: monthData.eventsByMonth.map(item => item.count),
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
          ],
        });

        // Handle the category data for pie chart
        if (categoryData && categoryData.eventsByCategory) {
          setPieData({
            labels: categoryData.eventsByCategory.map(item => item.name),
            datasets: [
              {
                data: categoryData.eventsByCategory.map(item => item.count),
                backgroundColor: [
                  'rgba(255, 99, 132, 0.6)',
                  'rgba(54, 162, 235, 0.6)',
                  'rgba(255, 206, 86, 0.6)',
                  'rgba(75, 192, 192, 0.6)',
                  'rgba(153, 102, 255, 0.6)',
                  'rgba(255, 159, 64, 0.6)',
                  'rgba(0, 255, 255, 0.6)',
                  'rgba(0, 128, 0, 0.6)',
                  'rgba(128, 0, 128, 0.6)',
                  'rgba(255, 165, 0, 0.6)',
                  'rgba(128, 128, 0, 0.6)',
                ],
              },
            ],
          });
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [authToken]);  // Adding authToken as a dependency ensures the component re-fetches if the token changes

  if (loading) {
    return <div>Loading...</div>;
  }

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
      <div style={styles.chartContainer}>
        <h3>Yaş ve Cinsiyet Demografisi</h3>
        <Bar data={demographicsData} /> {/* Bar chart for demographics */}
      </div>
      <div style={styles.userPointsContainer}>
        <h3>Kullanıcı Puanları</h3>
        <p>Toplam Puan: {userPoints}</p>
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
  userPointsContainer: {
    marginTop: '20px',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#fff',
  },
};

export default Charts;
