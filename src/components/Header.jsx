import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from '../styles/Header.module.css';
import { useAuth } from '../AuthContext.jsx';
import logo from '../assets/images.png'; // Logo dosyasını içeri aktarın
import NotificationComponent from './NotificationComponent'; // Yeni bildirim component'ini import ediyoruz


const Header = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  const navigate = useNavigate(); // useNavigate hook for navigation
  const { user, logout, authToken , userPoints } = useAuth(); // Get user and logout from AuthContext
  
  const [isAdmin, setIsAdmin] = useState(false); // Admin status flag

  // Update role and admin status when `user` changes
  useEffect(() => {
    if (user) {
      console.log("User object:", user); // Log user to verify role exists
      setIsAdmin(user.role === 'admin'); // Check if user is admin
    }
  }, [user]);

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    logout(); // Call the logout function from AuthContext
    navigate('/'); // Redirect to the homepage after logout
  };

  return (
    <header className={styles.header}>
      <NavLink to="/Home" className={styles.logo}>
        MyApp
      </NavLink>
      <nav className={`${styles.nav} ${menuOpen ? styles.open : ''}`}>
        <NavLink
          to="/Home"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          Profile
        </NavLink>

        {/* Admin Console link, visible only for admins */}
        {isAdmin && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            Admin Console
          </NavLink>
        )}
        
        {/* Logout butonuna CSS modülünü uygula */}
        <button className={styles.logoutButton} onClick={handleLogout}>Çıkış Yap</button>
  
        {/* Bildirim butonunu burada tutuyoruz */}
        <button className={styles.notificationButton} onClick={toggleNotifications}>
          Notifications
        </button>

        {/* Bildirim dropdown menüsü */}
        {showNotifications && (
          <div className={styles.notificationsDropdown}>
            <NotificationComponent /> {/* NotificationComponent burada gösteriliyor */}
          </div>
        )}
      </nav>

      {/* Kullanıcı puanlarını göster */}
      {!isAdmin && ( // Adminler için puan göstergesi kapalı
        <div className={styles.pointsDisplay}>
          <img src={logo} alt="Points" className={styles.pointsIcon} />
          {userPoints !== null ? (
            <span>{userPoints} Points</span>
          ) : (
            <span>Loading...</span>
          )}
        </div>
      )}

      {/* Adminlere özel mesaj */}
      {isAdmin && (
        <div className={styles.pointsDisplay}>
          <img src={logo} alt="Admin" className={styles.pointsIcon} />
          <span>Admin users do not have points.</span>
        </div>
      )}
      {/* Hamburger menu for mobile view */}
      <button className={styles.burgerButton} onClick={toggleMenu}>
        ☰
      </button>
    </header>
  );
};

export default Header;
