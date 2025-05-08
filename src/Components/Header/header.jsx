import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styles from './header.module.css';

const Header = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const location = useLocation();
  
  // Close mobile menu when route changes
  useEffect(() => {
    setShowMobileMenu(false);
  }, [location]);

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <NavLink to="/" className={styles.logo}>
          CURENTU<span>'</span>
        </NavLink>
        
        <button 
          className={styles.mobileMenuButton} 
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          ☰
        </button>
        
        <ul className={`${styles.navMenu} ${showMobileMenu ? styles.show : ''}`}>
          <li className={styles.navItem}>
            <NavLink 
              to="/materii-prime" 
              className={({isActive}) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            >
              Materii Prime
            </NavLink>
          </li>
          <li className={styles.navItem}>
            <NavLink 
              to="/productie" 
              className={({isActive}) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            >
              Producție
            </NavLink>
          </li>
          <li className={styles.navItem}>
            <NavLink 
              to="/ambalare" 
              className={({isActive}) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            >
              Ambalare
            </NavLink>
          </li>
          <li className={styles.navItem}>
            <NavLink 
              to="/depozitare" 
              className={({isActive}) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            >
              Depozitare
            </NavLink>
          </li>
          <li className={styles.navItem}>
            <NavLink 
              to="/rebuturi" 
              className={({isActive}) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            >
              Rebuturi
            </NavLink>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;