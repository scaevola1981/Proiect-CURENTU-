import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './home.module.css';

const Sidebar = ({ isOpen }) => {
  const navigate = useNavigate();
  
  const menuItems = [
    { title: 'Dashboard', path: '/' },
    { title: 'Materii Prime', path: '/materii-prime' },
    { title: 'Producție', path: '/productie' },
    { title: 'Ambalare', path: '/ambalare' },
    { title: 'Depozitare', path: '/depozitare' },
    { title: 'Rebuturi', path: '/rebuturi' },
    { title: 'Rapoarte', path: '/rapoarte' },
    { title: 'Setări', path: '/setari' }
  ];

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <div className={styles.logo}>
        <h2>Curentu</h2>
      </div>
      <ul className={styles.menu}>
        {menuItems.map((item, index) => (
          <li key={index} onClick={() => navigate(item.path)}>
            {item.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const camere = [
    { titlu: 'Materii Prime', descriere: 'Locul unde se înregistrează materiile brute la intrare.', path: '/materii-prime' },
    { titlu: 'Producție', descriere: 'Camera unde are loc transformarea în bere (rețetare).', path: '/productie' },
    { titlu: 'Ambalare', descriere: 'Ambalăm produsul finit în sticle și kag-uri.', path: '/ambalare' },
    { titlu: 'Depozitare', descriere: 'Aici stocăm berea ambalată, gata de livrare.', path: '/depozitare' },
    { titlu: 'Rebuturi', descriere: 'Evidențiem rebuturile și pierderile din proces.', path: '/rebuturi' },
  ];

  return (
    <div className={styles.layout}>
      <Sidebar isOpen={sidebarOpen} />
      <div className={`${styles.main} ${sidebarOpen ? styles.withSidebar : ''}`}>
        <div className={styles.header}>
          <button className={styles.menuButton} onClick={toggleSidebar}>
            ☰
          </button>
          <h1>CURENTU' Management System</h1>
        </div>
        <div className={styles.container}>
          <h2 className={styles.subtitle}>Informații generale despre camere</h2>
          <div className={styles.grid}>
            {camere.map((camera, idx) => (
              <div key={idx} className={styles.card} onClick={() => navigate(camera.path)}>
                <h3>{camera.titlu}</h3>
                <p>{camera.descriere}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
