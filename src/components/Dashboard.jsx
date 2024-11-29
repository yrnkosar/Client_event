import React from 'react';
import Charts from './Charts.jsx';
import PendingEvents from './PendingEvents.jsx';
import Reports from '../pages/ReportsPage.jsx';
import UserList from '../pages/UserListPage.jsx';
import EventList from './EventList.jsx';
import Summary from './Summary.jsx';
function Dashboard() {
  return (
    <div style={styles.dashboard}>
      <h1>Admin Paneli</h1> 
      <Summary />
      <Charts />
    
     
     
    </div>
  );
}

const styles = {
  dashboard: {
    flex: 1,
    padding: '20px',
    overflowY: 'scroll',
  },
};

export default Dashboard;
