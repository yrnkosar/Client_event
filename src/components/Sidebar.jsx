import React, { useState } from 'react';
import { Link , useNavigate} from 'react-router-dom';
import { FaChartBar, FaClipboardList, FaFileAlt, FaUsers, FaCalendarAlt, FaCog, FaUser, FaSignOutAlt } from 'react-icons/fa';
import styles from '../styles/Sidebar.module.css'; 
import { useAuth } from '../AuthContext.jsx';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  const handleLogout = () => {
    logout(); 
    navigate('/');
  };
  return (
    <div className={styles.sidebar} style={{ width: isOpen ? '200px' : '50px' }}>
      <button onClick={toggleSidebar} className={styles.toggleButton}>
        {isOpen ? '◀' : '▶'}
      </button>
      {isOpen && <h2 className={styles.sidebarTitle}>Admin Paneli</h2>}
      <nav>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <Link to="/admin/pending-events" className={styles.link}>
              <FaClipboardList className={styles.icon} />
              {isOpen && <span>Onay Bekleyenler</span>}
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link to="/admin/users" className={styles.link}>
              <FaUsers className={styles.icon} />
              {isOpen && <span>Kullanıcı Listesi</span>}
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link to="/admin/events" className={styles.link}>
              <FaCalendarAlt className={styles.icon} />
              {isOpen && <span>Etkinlik Listesi</span>}
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link to="/admin/categories" className={styles.link}>
              <FaCog className={styles.icon} />
              {isOpen && <span>Kategori Ekle</span>}
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link to="/profile" className={styles.link}>
              <FaUser className={styles.icon} />
              {isOpen && <span>Profilim</span>}
            </Link>
          </li>
          <li className={styles.navItem}>
            <button onClick={handleLogout} className={styles.logoutButton}>
              <FaSignOutAlt className={styles.icon} />
              {isOpen && <span>Çıkış Yap</span>}
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}


export default Sidebar;
