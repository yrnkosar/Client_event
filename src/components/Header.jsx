import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from '../styles/Header.module.css';
import { useAuth } from '../AuthContext.jsx';
import logo from '../assets/images.png'; // Logo dosyasını içeri aktarın
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
        
        <button className={styles.link} onClick={handleLogout}>
          Logout
        </button>
        <button className={styles.notificationButton} onClick={toggleNotifications}>
          Notifications
        </button>

        {/* Notifications Dropdown */}
        {showNotifications && (
          <div className={styles.notificationsDropdown}>
            <p>You have new messages!</p>
          </div>
        )}
      </nav>
      {/* Display user points */}
      <div className={styles.pointsDisplay}>
      <img
  src={logo}
  alt="Points"
  className={styles.pointsIcon}
/>
        {userPoints !== null ? <span>{userPoints} Points</span> : <span>Loading...</span>}
      </div>
      {/* Hamburger menu for mobile view */}
      <button className={styles.burgerButton} onClick={toggleMenu}>
        ☰
      </button>
    </header>
  );
};

export default Header;
