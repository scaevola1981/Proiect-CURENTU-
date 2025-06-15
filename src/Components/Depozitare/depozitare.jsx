import React, { useEffect, useState } from 'react';
import Header from '../Header/header';

import styles from './depozitare.module.css';

const Depozitare = () => {
  const [containere, setContainere] = useState([]);
  const [stocBere, setStocBere] = useState([]);
  const [selectedContainer, setSelectedContainer] = useState(null);
  const [cantitate, setCantitate] = useState('');
  const [ambalaj, setAmbalaj] = useState('sticle-0.5L');
  const [numarUnitati, setNumarUnitati] = useState('');


  useEffect(() => {
    // Încarcă containerele din Productie
    const containereInitiale = [];
    for (let i = 1; i <= 6; i++) {
      const productieData = localStorage.getItem(`productieContainer_${i}`);
      if (productieData) {
        const productie = JSON.parse(productieData);
        containereInitiale.push({
          id: i,
          status: 'ocupat',
          retetaNume: productie.numeReteta,
          cantitate: parseFloat(productie.cantitate),
          data: productie.data,
        });
      }
    }
    setContainere(containereInitiale);

    // Încarcă stocul de bere
    const stoc = localStorage.getItem('stocBere');
    setStocBere(stoc ? JSON.parse(stoc) : []);

    // Restaurează starea temporară
    const temp = localStorage.getItem('depozitareTemp');
    if (temp) {
      const parsed = JSON.parse(temp);
      if (Date.now() - parsed.timestamp < 86400000) {
        setSelectedContainer(parsed.selectedContainer);
        setCantitate(parsed.cantitate);
        setAmbalaj(parsed.ambalaj);
        setNumarUnitati(parsed.numarUnitati);
      }
    }
  }, []);

  useEffect(() => {
    // Salvează starea temporară
    const stareaCurenta = {
      selectedContainer,
      cantitate,
      ambalaj,
      numarUnitati,
      timestamp: Date.now(),
    };
    localStorage.setItem('depozitareTemp', JSON.stringify(stareaCurenta));
  }, [selectedContainer, cantitate, ambalaj, numarUnitati]);

  const confirmaStocarea = () => {
    if (!selectedContainer || !cantitate || !numarUnitati || !ambalaj) {
      alert('Completați toate câmpurile!');
      return;
    }

    const cantitateNum = parseFloat(cantitate);
    const container = containere.find((c) => c.id === selectedContainer);
    if (cantitateNum > container.cantitate) {
      alert(`Cantitatea depășește stocul din container (${container.cantitate}L)!`);
      return;
    }

    const unitateLitri = ambalaj === 'sticle-0.5L' ? 0.5 : 50;
    const numarUnitatiNum = parseInt(numarUnitati);
    if (cantitateNum !== numarUnitatiNum * unitateLitri) {
      alert('Cantitatea totală nu corespunde cu numărul de unități!');
      return;
    }

    const lot = {
      id: stocBere.length + 1,
      retetaNume: container.retetaNume,
      cantitate: cantitateNum,
      ambalaj,
      numarUnitati: numarUnitatiNum,
      data: new Date().toISOString(),
    };

    const stocActualizat = [...stocBere, lot];
    localStorage.setItem('stocBere', JSON.stringify(stocActualizat));
    setStocBere(stocActualizat);

    // Actualizează containerul
    const productieData = JSON.parse(localStorage.getItem(`productieContainer_${selectedContainer}`));
    const cantitateRamasa = container.cantitate - cantitateNum;
    if (cantitateRamasa > 0) {
      localStorage.setItem(
        `productieContainer_${selectedContainer}`,
        JSON.stringify({ ...productieData, cantitate: cantitateRamasa })
      );
      setContainere(
        containere.map((c) =>
          c.id === selectedContainer ? { ...c, cantitate: cantitateRamasa } : c
        )
      );
    } else {
      localStorage.removeItem(`productieContainer_${selectedContainer}`);
      setContainere(containere.filter((c) => c.id !== selectedContainer));
    }

    alert('Lotul a fost adăugat în stoc!');
    resetFormular();
  };

  const scoateDinStoc = (lotId, cantitateScoasa, esteRebut) => {
    const lot = stocBere.find((l) => l.id === lotId);
    if (parseFloat(cantitateScoasa) > lot.cantitate) {
      alert('Cantitatea de scos depășește stocul!');
      return;
    }

    const stocActualizat = stocBere
      .map((l) =>
        l.id === lotId
          ? { ...l, cantitate: l.cantitate - parseFloat(cantitateScoasa), numarUnitati: Math.floor((l.cantitate - parseFloat(cantitateScoasa)) / (l.ambalaj === 'sticle-0.5L' ? 0.5 : 50)) }
          : l
      )
      .filter((l) => l.cantitate > 0);

    localStorage.setItem('stocBere', JSON.stringify(stocActualizat));
    setStocBere(stocActualizat);

    if (esteRebut) {
      const rebuturi = JSON.parse(localStorage.getItem('rebuturi') || '[]');
      rebuturi.push({
        id: rebuturi.length + 1,
        retetaNume: lot.retetaNume,
        cantitate: parseFloat(cantitateScoasa),
        ambalaj: lot.ambalaj,
        data: new Date().toISOString(),
      });
      localStorage.setItem('rebuturi', JSON.stringify(rebuturi));
    }

    alert(`Cantitate scoasă: ${cantitateScoasa}L (${esteRebut ? 'rebut' : 'livrat'})`);
  };

  const resetFormular = () => {
    if (window.confirm('Resetați formularul?')) {
      localStorage.removeItem('depozitareTemp');
      setSelectedContainer(null);
      setCantitate('');
      setAmbalaj('sticle-0.5L');
      setNumarUnitati('');
    }
  };

  return (
    <>
      <Header />
    <div className={styles.appContainer}>

      <div className={styles.content}>
      
        <div className={styles.container}>
          <h1 className={styles.title}>Gestionare Depozitare</h1>
          <div className={styles.containereGrid}>
            {containere.map((cont) => (
              <div
                key={cont.id}
                className={`${styles.containerCard} ${
                  selectedContainer === cont.id ? styles.containerSelectat : ''
                }`}
                onClick={() => setSelectedContainer(cont.id)}
              >
                <h4>Container {cont.id}</h4>
                <p>Rețetă: {cont.retetaNume}</p>
                <p>Cantitate: {cont.cantitate}L</p>
                <p>Data: {new Date(cont.data).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
          {selectedContainer && (
            <div className={styles.formGroup}>
              <label>Cantitate (litri):</label>
              <input
                type="number"
                value={cantitate}
                onChange={(e) => setCantitate(e.target.value)}
                className={styles.input}
                placeholder="Ex: 500"
              />
              <label>Tip ambalaj:</label>
              <select
                value={ambalaj}
                onChange={(e) => setAmbalaj(e.target.value)}
                className={styles.input}
              >
                <option value="sticle-0.5L">Sticle 0.5L</option>
                <option value="keg-50L">Keg 50L</option>
              </select>
              <label>Număr unități:</label>
              <input
                type="number"
                value={numarUnitati}
                onChange={(e) => setNumarUnitati(e.target.value)}
                className={styles.input}
                placeholder="Ex: 1000"
              />
              <button
                onClick={confirmaStocarea}
                className={styles.button}
                disabled={!cantitate || !numarUnitati}
              >
                Confirmă Stocarea
              </button>
              <button
                onClick={resetFormular}
                className={`${styles.button} ${styles.buttonDanger}`}
              >
                Resetare
              </button>
            </div>
          )}
          <div className={styles.stocContainer}>
            <h2>Stoc Curent</h2>
            <table className={styles.consumTable}>
              <thead>
                <tr>
                  <th>Rețetă</th>
                  <th>Ambalaj</th>
                  <th>Cantitate (L)</th>
                  <th>Unități</th>
                  <th>Data</th>
                  <th>Acțiuni</th>
                </tr>
              </thead>
              <tbody>
                {stocBere.map((lot) => (
                  <tr key={lot.id}>
                    <td>{lot.retetaNume}</td>
                    <td>{lot.ambalaj}</td>
                    <td>{lot.cantitate}</td>
                    <td>{lot.numarUnitati}</td>
                    <td>{new Date(lot.data).toLocaleDateString()}</td>
                    <td>
                      <button
                        onClick={() => {
                          const cant = prompt('Cantitate de livrat (L):');
                          if (cant) scoateDinStoc(lot.id, cant, false);
                        }}
                        className={styles.buttonSmall}
                      >
                        Livrare
                      </button>
                      <button
                        onClick={() => {
                          const cant = prompt('Cantitate rebut (L):');
                          if (cant) scoateDinStoc(lot.id, cant, true);
                        }}
                        className={styles.buttonSmall}
                      >
                        Rebut
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Depozitare;