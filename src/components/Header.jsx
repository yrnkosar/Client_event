import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from '../styles/Header.module.css';
import { useAuth } from '../AuthContext.jsx';
import logo from '../assets/images.png'; 
import NotificationComponent from './NotificationComponent'; 


const Header = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  const navigate = useNavigate();
  const { user, logout, authToken , userPoints } = useAuth(); 
  
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      console.log("User object:", user); 
      setIsAdmin(user.role === 'admin'); 
    }
  }, [user]);

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    logout(); 
    navigate('/'); 
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
        
        <button className={styles.logoutButton} onClick={handleLogout}>Çıkış Yap</button>
  
       
        <button className={styles.notificationButton} onClick={toggleNotifications}>
          Notifications
        </button>

       
        {showNotifications && (
          <div className={styles.notificationsDropdown}>
            <NotificationComponent /> 
          </div>
        )}
      </nav>

      
      {!isAdmin && ( 
        <div className={styles.pointsDisplay}>
          <img src={logo} alt="Points" className={styles.pointsIcon} />
          {userPoints !== null ? (
            <span>{userPoints} Points</span>
          ) : (
            <span>Loading...</span>
          )}
        </div>
      )}

     
      {isAdmin && (
        <div className={styles.pointsDisplay}>
          <img src={logo} alt="Admin" className={styles.pointsIcon} />
          <span>Admin users do not have points.</span>
        </div>
      )}
     
      <button className={styles.burgerButton} onClick={toggleMenu}>
        ☰
      </button>
    </header>
  );
};

export default Header;
