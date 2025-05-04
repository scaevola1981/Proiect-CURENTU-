import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './header.module.css';





const Header = () => {
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo} onClick={() => navigate('/')}>
          CURENTU'
        </div>

        <nav className={styles.navBar}>
          <div
            className={styles.navLink}
            onClick={() => navigate('/materii-prime')}
          >
            Materii Prime
          </div>
          <div
            className={styles.navLink}
            onClick={() => navigate('/productie')}
          >
            Producție
          </div>
          <div className={styles.navLink} onClick={() => navigate('/ambalare')}>
            Ambalare
          </div>
          <div
            className={styles.navLink}
            onClick={() => navigate('/depozitare')}
          >
            Depozitare
          </div>
          <div className={styles.navLink} onClick={() => navigate('/rebuturi')}>
            Rebuturi
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
