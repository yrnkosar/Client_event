import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChartBar, FaClipboardList, FaFileAlt, FaUsers, FaCalendarAlt } from 'react-icons/fa';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div style={{ ...styles.sidebar, width: isOpen ? '200px' : '50px' }}>
      <button onClick={toggleSidebar} style={styles.toggleButton}>
        {isOpen ? '◀' : '▶'}
      </button>
      {isOpen && <h2>Admin Paneli</h2>}
      <nav>
        <ul style={styles.navList}>
          <li style={styles.navItem}>
            <Link to="/admin/charts" style={styles.link}>
              <FaChartBar style={styles.icon} />
              {isOpen && <span>Grafikler</span>}
            </Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/admin/pending-events" style={styles.link}>
              <FaClipboardList style={styles.icon} />
              {isOpen && <span>Onay Bekleyen Etkinlikler</span>}
            </Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/admin/reports" style={styles.link}>
              <FaFileAlt style={styles.icon} />
              {isOpen && <span>Detaylı Rapor</span>}
            </Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/admin/users" style={styles.link}>
              <FaUsers style={styles.icon} />
              {isOpen && <span>Kullanıcı Listesi</span>}
            </Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/admin/events" style={styles.link}>
              <FaCalendarAlt style={styles.icon} />
              {isOpen && <span>Etkinlik Listesi</span>}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

const styles = {
  sidebar: {
    backgroundColor: '#333',
    color: '#fff',
    padding: '20px',
    transition: 'width 0.3s',
  },
  toggleButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    marginBottom: '10px',
  },
  navList: {
    listStyleType: 'none',
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    fontSize: '20px',
    marginRight: '10px',
  },
};

export default Sidebar;
