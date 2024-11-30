import React, { useState } from 'react';
import { Link , useNavigate} from 'react-router-dom';
import { FaChartBar, FaClipboardList, FaFileAlt, FaUsers, FaCalendarAlt, FaCog, FaUser, FaSignOutAlt } from 'react-icons/fa';

import { useAuth } from '../AuthContext.jsx';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const { logout } = useAuth(); // AuthContext'ten logout fonksiyonunu al
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  const handleLogout = () => {
    logout(); // AuthContext'teki logout fonksiyonunu çağır
    navigate('/'); // Ana sayfaya yönlendir
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
            <Link to="/admin/pending-events" style={styles.link}>
              <FaClipboardList style={styles.icon} />
              {isOpen && <span>Onay Bekleyenler</span>}
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
          <li style={styles.navItem}>
            <Link to="/admin/categories" style={styles.link}>
              <FaCog style={styles.icon} />
              {isOpen && <span>Kategori Ekle</span>}
            </Link>
          </li>
          {/* Profil butonu */}
          <li style={styles.navItem}>
            <Link to="/profile" style={styles.link}>
              <FaUser style={styles.icon} />
              {isOpen && <span>Profilim</span>}
            </Link>
          </li>
          {/* Çıkış yapma butonu */}
          <li style={styles.navItem}>
            <button onClick={handleLogout} style={styles.logoutButton}>
              <FaSignOutAlt style={styles.icon} />
              {isOpen && <span>Çıkış Yap</span>}
            </button>
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
  logoutButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    fontSize: '20px',
    marginRight: '10px',
  },
};

export default Sidebar;
