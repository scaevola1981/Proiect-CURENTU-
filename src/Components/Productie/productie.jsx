import React, { useEffect, useState } from 'react';
import Header from '../Header/header';
import styles from './productie.module.css';
import reteteInitiale from '../../LocalStorage/reteteInitiale';

const Productie = () => {
  const [retete, setRetete] = useState([]);
  const [selectedReteta, setSelectedReteta] = useState(null);
  const [cantitateProdusa, setCantitateProdusa] = useState('');
  const [consumMateriale, setConsumMateriale] = useState([]);
  const [container, setContainer] = useState('');
  const [stocMateriale, setStocMateriale] = useState([]);
  const [materialeInsuficiente, setMaterialeInsuficiente] = useState([]);
  const [showWarning, setShowWarning] = useState(false);
  const [showMaterials, setShowMaterials] = useState(false);

  useEffect(() => {
    // Încarcă rețetele
    const reteteSalvate = localStorage.getItem('retete');
    setRetete(reteteSalvate ? JSON.parse(reteteSalvate) : reteteInitiale);
    
    // Încarcă stocul de materiale
    const materiiPrime = localStorage.getItem('materiiPrime');
    setStocMateriale(materiiPrime ? JSON.parse(materiiPrime) : []);
  }, []);

  const handleSelectReteta = (e) => {
    const retetaId = parseInt(e.target.value);
    const reteta = retete.find((r) => r.id === retetaId);
    setSelectedReteta(reteta || null);
    setConsumMateriale([]);
    setCantitateProdusa('');
    setMaterialeInsuficiente([]);
    setShowWarning(false);
    setShowMaterials(false);
  };

  const calculeazaConsum = () => {
    if (!selectedReteta || !cantitateProdusa || parseFloat(cantitateProdusa) <= 0) return;

    const factorScalare = parseFloat(cantitateProdusa) / selectedReteta.rezultat.cantitate;
    const materialeConsumate = selectedReteta.ingrediente.map((ingredient) => ({
      denumire: ingredient.denumire,
      cantitate: parseFloat((ingredient.cantitate * factorScalare).toFixed(2)),
      unitate: ingredient.unitate,
    }));

    setConsumMateriale(materialeConsumate);
    setShowMaterials(true);
    
    // Verifică disponibilitatea materialelor în stoc
    verificaStoc(materialeConsumate);
  };

  const verificaStoc = (materialeNecesare) => {
    const insuficiente = [];
    
    materialeNecesare.forEach(material => {
      const materialInStoc = stocMateriale.find(
        item => item.denumire.toLowerCase().trim() === material.denumire.toLowerCase().trim() &&
               item.unitate.toLowerCase().trim() === material.unitate.toLowerCase().trim()
      );
      
      if (!materialInStoc) {
        insuficiente.push({
          ...material,
          inStoc: 0,
          lipseste: material.cantitate
        });
      } else if (materialInStoc.cantitate < material.cantitate) {
        insuficiente.push({
          ...material,
          inStoc: materialInStoc.cantitate,
          lipseste: parseFloat((material.cantitate - materialInStoc.cantitate).toFixed(2))
        });
      }
    });
    
    setMaterialeInsuficiente(insuficiente);
    setShowWarning(insuficiente.length > 0);
  };

  const scadeDinStoc = (materialeConsumate) => {
    // Încarcă materialele actuale din localStorage
    const stoc = JSON.parse(localStorage.getItem('materiiPrime')) || [];
    
    // Creează un nou array pentru stocul actualizat
    const stocActualizat = [...stoc];
    
    // Pentru fiecare material consumat, găsește corespondentul în stoc și scade cantitatea
    materialeConsumate.forEach(materialConsumat => {
      // Caută materialul în stoc, indiferent de caz (case-insensitive)
      const indexInStoc = stocActualizat.findIndex(
        item => item.denumire.toLowerCase().trim() === materialConsumat.denumire.toLowerCase().trim() &&
               item.unitate.toLowerCase().trim() === materialConsumat.unitate.toLowerCase().trim()
      );
      
      if (indexInStoc !== -1) {
        // Dacă materialul există în stoc, scade cantitatea consumată
        const cantitateRamasa = parseFloat((stocActualizat[indexInStoc].cantitate - materialConsumat.cantitate).toFixed(2));
        
        // Asigură-te că stocul nu scade sub 0
        stocActualizat[indexInStoc].cantitate = Math.max(0, cantitateRamasa);
      }
    });
    
    // Salvează stocul actualizat în localStorage
    localStorage.setItem('materiiPrime', JSON.stringify(stocActualizat));
    
    // Actualizează stocul local pentru verificări ulterioare
    setStocMateriale(stocActualizat);
    
    return stocActualizat;
  };

  const confirmaProductia = () => {
    if (!selectedReteta || !cantitateProdusa || !container) {
      alert("Selectați rețeta, introduceți cantitatea și alegeți containerul!");
      return;
    }

    if (materialeInsuficiente.length > 0) {
      const confirmare = window.confirm(
        "Nu aveți suficiente materiale în stoc pentru această producție! Doriți să continuați oricum? " + 
        "(Stocul va ajunge la 0 pentru materialele insuficiente)"
      );
      if (!confirmare) return;
    }

    const factorScalare = parseFloat(cantitateProdusa) / selectedReteta.rezultat.cantitate;

    const materialeConsumate = selectedReteta.ingrediente.map((ingredient) => ({
      denumire: ingredient.denumire,
      cantitate: parseFloat((ingredient.cantitate * factorScalare).toFixed(2)),
      unitate: ingredient.unitate,
    }));

    // Actualizează consumMateriale pentru UI
    setConsumMateriale(materialeConsumate);

    // Scade materialele din stoc
    scadeDinStoc(materialeConsumate);

    // Înregistrează producția
    const productie = {
      retetaId: selectedReteta.id,
      numeReteta: selectedReteta.nume,
      cantitate: cantitateProdusa,
      container,
      materiale: materialeConsumate,
      data: new Date().toISOString(),
    };

    localStorage.setItem(
      `productieContainer_${container}`,
      JSON.stringify(productie)
    );

    alert(
      `Producție înregistrată în Containerul ${container}! Materialele au fost scăzute din stoc.`
    );

    // Resetare formulare
    setSelectedReteta(null);
    setCantitateProdusa('');
    setConsumMateriale([]);
    setContainer('');
    setMaterialeInsuficiente([]);
    setShowWarning(false);
    setShowMaterials(false);
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.title}>Planificare Producție</h1>

        <div className={styles.formGroup}>
          <label>Selectează Rețeta:</label>
          <select
            value={selectedReteta?.id || ''}
            onChange={handleSelectReteta}
            className={styles.select}
          >
            <option value="">-- Alege rețeta --</option>
            {retete.map((reteta) => (
              <option key={reteta.id} value={reteta.id}>
                {reteta.nume}
              </option>
            ))}
          </select>
        </div>

        {selectedReteta && (
          <>
            <div className={styles.formGroup}>
              <label>
                Cantitate de produs ({selectedReteta.rezultat.unitate}):
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={cantitateProdusa}
                onChange={(e) => setCantitateProdusa(e.target.value)}
                className={styles.input}
                placeholder={`Ex: ${selectedReteta.rezultat.cantitate}`}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Selectează containerul de fermentație:</label>
              <select
                value={container}
                onChange={(e) => setContainer(e.target.value)}
                className={styles.select}
              >
                <option value="">-- Alege containerul --</option>
                {[1, 2, 3, 4, 5, 6].map((nr) => (
                  <option key={nr} value={nr}>
                    Container {nr}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={calculeazaConsum}
              className={styles.button}
              disabled={!cantitateProdusa || parseFloat(cantitateProdusa) <= 0}
            >
              Calculează Consum
            </button>

            {showWarning && materialeInsuficiente.length > 0 && (
              <div className={styles.warningContainer}>
                <h3 className={styles.warningTitle}>Atenție! Materiale insuficiente:</h3>
                <table className={`${styles.consumTable} ${styles.warningTable}`}>
                  <thead>
                    <tr>
                      <th>Material</th>
                      <th>Necesar</th>
                      <th>În stoc</th>
                      <th>Lipsă</th>
                      <th>Unitate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {materialeInsuficiente.map((material, index) => (
                      <tr key={index} className={styles.warningRow}>
                        <td>{material.denumire}</td>
                        <td className={styles.quantity}>{material.cantitate}</td>
                        <td>{material.inStoc}</td>
                        <td className={styles.missingQuantity}>{material.lipseste}</td>
                        <td>{material.unitate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {showMaterials && (
              <div className={styles.consumContainer}>
                <h3>Materiale necesare:</h3>
                <table className={styles.consumTable}>
                  <thead>
                    <tr>
                      <th>Material</th>
                      <th>Cantitate</th>
                      <th>Unitate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {consumMateriale.map((material, index) => (
                      <tr key={index}>
                        <td>{material.denumire}</td>
                        <td className={styles.quantity}>{material.cantitate}</td>
                        <td>{material.unitate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {showMaterials && (
              <button
                onClick={confirmaProductia}
                className={styles.button}
                disabled={!cantitateProdusa || parseFloat(cantitateProdusa) <= 0 || !container}
              >
                Confirmă Producția
              </button>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Productie;