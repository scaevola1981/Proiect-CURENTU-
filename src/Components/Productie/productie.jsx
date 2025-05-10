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
  const [containere, setContainere] = useState([]);

  // Inițializare containere și verificare status cu detalii rețetă
  useEffect(() => {
    const containereInitiale = [
      { id: 1, capacitate: 1000, status: 'disponibil' },
      { id: 2, capacitate: 1000, status: 'disponibil' },
      { id: 3, capacitate: 1000, status: 'disponibil' },
      { id: 4, capacitate: 2000, status: 'disponibil' },
      { id: 5, capacitate: 2000, status: 'disponibil' },
      { id: 6, capacitate: 2000, status: 'disponibil' },
    ];

    const containereActualizate = containereInitiale.map((cont) => {
      const productieContainer = localStorage.getItem(
        `productieContainer_${cont.id}`
      );
      if (productieContainer) {
        const productie = JSON.parse(productieContainer);
        return {
          ...cont,
          status: 'ocupat',
          retetaNume: productie.numeReteta,
          cantitate: productie.cantitate,
        };
      }
      return cont;
    });

    setContainere(containereActualizate);
  }, []);

  // Salvare automată a stării curente
  useEffect(() => {
    const stareaCurenta = {
      selectedReteta,
      cantitateProdusa,
      consumMateriale,
      container,
      materialeInsuficiente,
      showWarning,
      showMaterials,
      timestamp: Date.now(),
    };
    localStorage.setItem('productieTemp', JSON.stringify(stareaCurenta));
  }, [
    selectedReteta,
    cantitateProdusa,
    consumMateriale,
    container,
    materialeInsuficiente,
    showWarning,
    showMaterials,
  ]);

  // Restaurare stării la încărcarea componentei
  useEffect(() => {
    const stareaSalvata = localStorage.getItem('productieTemp');
    if (stareaSalvata) {
      const parsed = JSON.parse(stareaSalvata);
      if (Date.now() - parsed.timestamp < 86400000) {
        setSelectedReteta(parsed.selectedReteta);
        setCantitateProdusa(parsed.cantitateProdusa);
        setConsumMateriale(parsed.consumMateriale);
        setContainer(parsed.container);
        setMaterialeInsuficiente(parsed.materialeInsuficiente);
        setShowWarning(parsed.showWarning);
        setShowMaterials(parsed.showMaterials);
      } else {
        localStorage.removeItem('productieTemp');
      }
    }

    const reteteSalvate = localStorage.getItem('retete');
    setRetete(reteteSalvate ? JSON.parse(reteteSalvate) : reteteInitiale);

    const materiiPrime = localStorage.getItem('materiiPrime');
    setStocMateriale(materiiPrime ? JSON.parse(materiiPrime) : []);
  }, []);

  const clearTempState = () => {
    if (window.confirm('Sigur doriți să ștergeți datele temporare?')) {
      localStorage.removeItem('productieTemp');
      setSelectedReteta(null);
      setCantitateProdusa('');
      setConsumMateriale([]);
      setContainer('');
      setMaterialeInsuficiente([]);
      setShowWarning(false);
      setShowMaterials(false);
    }
  };

  const calculeazaConsum = () => {
    if (
      !selectedReteta ||
      !cantitateProdusa ||
      parseFloat(cantitateProdusa) <= 0
    )
      return;

    const factorScalare =
      parseFloat(cantitateProdusa) / selectedReteta.rezultat.cantitate;
    const materialeConsumate = selectedReteta.ingrediente.map((ingredient) => ({
      denumire: ingredient.denumire,
      cantitate: parseFloat((ingredient.cantitate * factorScalare).toFixed(2)),
      unitate: ingredient.unitate,
    }));

    setConsumMateriale(materialeConsumate);
    setShowMaterials(true);
    verificaStoc(materialeConsumate);
  };

  const gasesteMaterialInStoc = (denumireMaterial, unitateMaterial) => {
    const unitateCautata = unitateMaterial.toLowerCase().trim();
    const denumireCautata = denumireMaterial
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .replace(/\s+/g, '');

    for (const material of stocMateriale) {
      const denumireStoc = material.denumire
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .replace(/\s+/g, '');

      if (material.unitate.toLowerCase().trim() === unitateCautata) {
        if (
          denumireStoc.includes(denumireCautata) ||
          denumireCautata.includes(denumireStoc)
        ) {
          return material;
        }
      }
    }

    return null;
  };

  const verificaStoc = (materialeNecesare) => {
    const INSUFICIENTE = [];

    materialeNecesare.forEach((material) => {
      const materialInStoc = gasesteMaterialInStoc(
        material.denumire,
        material.unitate
      );

      if (!materialInStoc) {
        INSUFICIENTE.push({
          ...material,
          inStoc: 0,
          lipseste: material.cantitate,
        });
      } else if (materialInStoc.cantitate < material.cantitate) {
        INSUFICIENTE.push({
          ...material,
          inStoc: materialInStoc.cantitate,
          lipseste: parseFloat(
            (material.cantitate - materialInStoc.cantitate).toFixed(2)
          ),
        });
      }
    });

    setMaterialeInsuficiente(INSUFICIENTE);
    setShowWarning(INSUFICIENTE.length > 0);
  };

  const scadeDinStoc = (materialeConsumate) => {
    const stoc = JSON.parse(localStorage.getItem('materiiPrime')) || [];
    const stocActualizat = [...stoc];

    materialeConsumate.forEach((materialConsumat) => {
      const materialInStoc = gasesteMaterialInStoc(
        materialConsumat.denumire,
        materialConsumat.unitate
      );

      if (materialInStoc) {
        const indexInStoc = stocActualizat.findIndex(
          (item) => item.id === materialInStoc.id
        );
        if (indexInStoc !== -1) {
          const cantitateRamasa =
            stocActualizat[indexInStoc].cantitate - materialConsumat.cantitate;
          stocActualizat[indexInStoc].cantitate = Math.max(0, cantitateRamasa);
        }
      }
    });

    localStorage.setItem('materiiPrime', JSON.stringify(stocActualizat));
    setStocMateriale(stocActualizat);
    return stocActualizat;
  };

  const adaugaInStoc = (materialeConsumate) => {
    const stoc = JSON.parse(localStorage.getItem('materiiPrime')) || [];
    const stocActualizat = [...stoc];

    materialeConsumate.forEach((materialConsumat) => {
      const materialInStoc = gasesteMaterialInStoc(
        materialConsumat.denumire,
        materialConsumat.unitate
      );

      if (materialInStoc) {
        const indexInStoc = stocActualizat.findIndex(
          (item) => item.id === materialInStoc.id
        );
        if (indexInStoc !== -1) {
          stocActualizat[indexInStoc].cantitate += materialConsumat.cantitate;
        }
      } else {
        const newId = stocActualizat.length > 0 ? Math.max(...stocActualizat.map(m => m.id)) + 1 : 1;
        stocActualizat.push({
          id: newId,
          denumire: materialConsumat.denumire.trim(),
          cantitate: materialConsumat.cantitate,
          unitate: materialConsumat.unitate.trim(),
        });
      }
    });

    localStorage.setItem('materiiPrime', JSON.stringify(stocActualizat));
    setStocMateriale(stocActualizat);
    return stocActualizat;
  };

  const confirmaProductia = () => {
    localStorage.removeItem('productieTemp');

    if (!selectedReteta || !cantitateProdusa || !container) {
      alert('Selectați rețeta, introduceți cantitatea și alegeți containerul!');
      return;
    }

    if (materialeInsuficiente.length > 0) {
      const confirmare = window.confirm(
        'Nu aveți suficiente materiale în stoc pentru această producție! Doriți să continuați oricum? ' +
          '(Stocul va ajunge la 0 pentru materialele insuficiente)'
      );
      if (!confirmare) return;
    }

    const factorScalare =
      parseFloat(cantitateProdusa) / selectedReteta.rezultat.cantitate;
    const materialeConsumate = selectedReteta.ingrediente.map((ingredient) => ({
      denumire: ingredient.denumire,
      cantitate: parseFloat((ingredient.cantitate * factorScalare).toFixed(2)),
      unitate: ingredient.unitate,
    }));

    setConsumMateriale(materialeConsumate);
    scadeDinStoc(materialeConsumate);

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

    const containereActualizate = containere.map((cont) => {
      if (cont.id.toString() === container) {
        return {
          ...cont,
          status: 'ocupat',
          retetaNume: selectedReteta.nume,
          cantitate: cantitateProdusa,
        };
      }
      return cont;
    });
    setContainere(containereActualizate);

    alert(
      `Producție înregistrată în Containerul ${container}! Materialele au fost scăzute din stoc.`
    );

    setSelectedReteta(null);
    setCantitateProdusa('');
    setConsumMateriale([]);
    setContainer('');
    setMaterialeInsuficiente([]);
    setShowWarning(false);
    setShowMaterials(false);
  };

  const golireContainer = (containerId) => {
    const confirmGolire = window.confirm(`Sigur doriți să goliți Containerul ${containerId}?`);
    if (!confirmGolire) return;

    const productieData = localStorage.getItem(`productieContainer_${containerId}`);
    if (!productieData) {
      alert('Nu există date de producție pentru acest container.');
      return;
    }

    const isMistake = window.confirm(
      'A fost o greșeală în această producție?\n' +
      'Apăsați "OK" dacă doriți să anulați producția și să returnați materialele în stoc.\n' +
      'Apăsați "Cancel" dacă fermentatorul a fost golit fizic și materialele nu trebuie returnate.'
    );

    if (isMistake) {
      const productie = JSON.parse(productieData);
      const materialeConsumate = productie.materiale;
      adaugaInStoc(materialeConsumate);
      localStorage.removeItem(`productieContainer_${containerId}`);

      const containereActualizate = containere.map((cont) => {
        if (cont.id === containerId) {
          return { ...cont, status: 'disponibil', retetaNume: '', cantitate: '' };
        }
        return cont;
      });
      setContainere(containereActualizate);

      alert(`Containerul ${containerId} a fost golit, iar materialele au fost returnate în stoc. Containerul este acum disponibil.`);
    } else {
      localStorage.removeItem(`productieContainer_${containerId}`);

      const containereActualizate = containere.map((cont) => {
        if (cont.id === containerId) {
          return { ...cont, status: 'disponibil', retetaNume: '', cantitate: '' };
        }
        return cont;
      });
      setContainere(containereActualizate);

      alert(`Containerul ${containerId} a fost golit și este acum disponibil. Materialele utilizate nu au fost returnate în stoc.`);
    }
  };

  const afiseazaInfoContainer = (containerId) => {
    const productieData = localStorage.getItem(
      `productieContainer_${containerId}`
    );
    if (productieData) {
      const productie = JSON.parse(productieData);
      alert(
        `Container ${containerId}\n` +
          `Rețetă: ${productie.numeReteta}\n` +
          `Cantitate: ${productie.cantitate}\n` +
          `Data: ${new Date(productie.data).toLocaleDateString()}`
      );
    }
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.title}>Planificare Producție</h1>
        <div className={styles.reteteContainer}>
          {retete.map((reteta) => (
            <div
              key={reteta.id}
              className={`${styles.retetaCard} ${
                selectedReteta?.id === reteta.id ? styles.selectedReteta : ''
              }`}
              style={{
                backgroundImage: `url(/imagini${reteta.image})`,
              }}
              onClick={() => {
                setSelectedReteta(reteta);
                setConsumMateriale([]);
                setCantitateProdusa('');
                setMaterialeInsuficiente([]);
                setShowWarning(false);
                setShowMaterials(false);
              }}
            >
              <h3>{reteta.nume}</h3>
              <p>Concentrație must: {reteta.concentratieMust}</p>
              <p>Concentrație alcool: {reteta.concentratieAlcool}</p>
              <p>
                Producție standard: {reteta.rezultat.cantitate}{' '}
                {reteta.rezultat.unitate}
              </p>
            </div>
          ))}
        </div>
        <div className={styles.formGroup}>
          <h2>Containere fermentație:</h2>
          <div className={styles.containereGrid}>
            {containere.map((cont) => (
              <div
                key={cont.id}
                className={`${styles.containerCard} 
                  ${
                    cont.status !== 'disponibil'
                      ? styles.containerIndisponibil
                      : ''
                  } 
                  ${
                    container === cont.id.toString()
                      ? styles.containerSelectat
                      : ''
                  }`}
                onClick={() => {
                  if (cont.status === 'disponibil') {
                    setContainer(cont.id.toString());
                  } else if (cont.status === 'ocupat') {
                    afiseazaInfoContainer(cont.id);
                  }
                }}
              >
                <img
                  src="/imagini/fermentator.png"
                  alt={`Container de fermentație ${cont.id}`}
                  className={styles.containerImage}
                />
                <div className={styles.containerContent}>
                  <div className={styles.containerIcon}>
                    {cont.status === 'disponibil' ? '✓' : '🍺'}
                  </div>
                  <h4>Container {cont.id}</h4>
                  <p>Capacitate: {cont.capacitate}L</p>
                  <p className={styles.containerStare}>
                    {cont.status === 'disponibil'
                      ? 'Disponibil'
                      : `Ocupat - ${cont.retetaNume} (${cont.cantitate})`}
                  </p>
                  {cont.status === 'ocupat' && (
                    <button
                      className={`${styles.button} ${styles.buttonSmall}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        golireContainer(cont.id);
                      }}
                    >
                      Golire
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedReteta && (
          <>
            <div className={styles.formGroup}>
              <label>
                Cantitate de produs (litri):
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

            <button
              onClick={calculeazaConsum}
              className={styles.button}
              disabled={!cantitateProdusa || parseFloat(cantitateProdusa) <= 0}
              style={{ marginTop: '10px' }}
            >
              Calculează Consum
            </button>

            {showMaterials && (
              <>
                {showWarning && materialeInsuficiente.length > 0 && (
                  <div className={styles.warningContainer}>
                    <h3 className={styles.warningTitle}>
                      Atenție! Materiale insuficiente:
                    </h3>
                    <table
                      className={`${styles.consumTable} ${styles.warningTable}`}
                    >
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
                            <td className={styles.quantity}>
                              {material.cantitate}
                            </td>
                            <td>{material.inStoc}</td>
                            <td className={styles.missingQuantity}>
                              {material.lipseste}
                            </td>
                            <td>{material.unitate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

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
                          <td className={styles.quantity}>
                            {material.cantitate}
                          </td>
                          <td>{material.unitate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button
                  onClick={confirmaProductia}
                  className={styles.button}
                  disabled={
                    !cantitateProdusa ||
                    parseFloat(cantitateProdusa) <= 0 ||
                    !container
                  }
                  style={{ marginTop: '20px' }}
                >
                  Confirmă Producția
                </button>

                <button
                  onClick={clearTempState}
                  className={`${styles.button} ${styles.buttonDanger}`}
                  style={{ marginBottom: '20px' }}
                >
                  Resetare Date Temporare
                </button>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Productie;