import React from 'react';
import Sidebar from '../components/Sidebar.jsx';
import Dashboard from '../components/Dashboard.jsx';
import Summary from '../components/Summary.jsx';


function AdminPage() {
  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={styles.content}>
        <Dashboard />
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    height: '200vh',
  },
  content: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto',
  },
};

export default AdminPage;
