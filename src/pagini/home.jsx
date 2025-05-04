// src/pagini/home.jsx
import React, { useEffect, useState } from 'react';
import styles from './Home.module.css';
import LoadData from '../Components/storage'

const Home = () => {
  const [inventory, setInventory] = useState({
    materiiPrime: [],
    productie: [],
    depozitare: [],
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    const data = loadData();
    setInventory({
      materiiPrime: data.materiiPrime || [],
      productie: data.productie || [],
      depozitare: data.depozitare || [],
    });
  }, []);

  return (
    <div className={styles.home}>
      <h1>Pagina Principală</h1>
      <p>Bine ai venit pe site! Aici vezi o privire de ansamblu asupra inventarului.</p>

      {/* Materii Prime Section */}
      <div className={styles.section}>
        <h2>Materii Prime</h2>
        {inventory.materiiPrime.length > 0 ? (
          <ul>
            {inventory.materiiPrime.map((item) => (
              <li key={item.id}>
                {item.name}: {item.quantity} {item.unit} (@ {item.cost} lei/kg)
              </li>
            ))}
          </ul>
        ) : (
          <p>Nu există materii prime înregistrate.</p>
        )}
      </div>

      {/* Productie Section */}
      <div className={styles.section}>
        <h2>Producție</h2>
        {inventory.productie.length > 0 ? (
          <ul>
            {inventory.productie.map((item) => (
              <li key={item.id}>
                {item.name || 'Lot'} - {item.quantity || 'N/A'} {item.unit || 'unități'}
              </li>
            ))}
          </ul>
        ) : (
          <p>Nu există loturi în producție.</p>
        )}
      </div>

      {/* Depozitare Section */}
      <div className={styles.section}>
        <h2>Depozitare</h2>
        {inventory.depozitare.length > 0 ? (
          <ul>
            {inventory.depozitare.map((item) => (
              <li key={item.id}>
                {item.name}: {item.quantity} {item.unit} în stoc
              </li>
            ))}
          </ul>
        ) : (
          <p>Nu există produse în depozit.</p>
        )}
      </div>
    </div>
  );
};

export default Home;