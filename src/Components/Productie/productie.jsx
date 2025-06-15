import React, { useEffect, useState, useCallback } from 'react';
import Header from '../Header/header';
import styles from './productie.module.css';
import reteteInitiale from '../../LocalStorage/reteteInitiale';

const Productie = () => {
  const [retete, setRetete] = useState([]);
  const [selectedReteta, setSelectedReteta] = useState(null);
  const [cantitateProdusa, setCantitateProdusa] = useState('');
  const [consumMateriale, setConsumMateriale] = useState([]);
  const [consumAmbalaje, setConsumAmbalaje] = useState([]);
  const [container, setContainer] = useState('');
  const [stocMateriale, setStocMateriale] = useState([]);
  const [stocAmbalaje, setStocAmbalaje] = useState([]);
  const [materialeInsuficiente, setMaterialeInsuficiente] = useState([]);
  const [ambalajeInsuficiente, setAmbalajeInsuficiente] = useState([]);
  const [showWarning, setShowWarning] = useState(false);
  const [showMaterials, setShowMaterials] = useState(false);
  const [containere, setContainere] = useState([]);

  // Inițializare containere și stoc ambalaje
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
      const productieContainer = localStorage.getItem(`productieContainer_${cont.id}`);
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

    // Inițializare stoc ambalaje
    const ambalajeInitiale = [
      { id: 1, tip: 'Sticlă 0.5L', cantitate: 1000, unitate: 'buc' },
      { id: 2, tip: 'KEG 50L', cantitate: 50, unitate: 'buc' },
      { id: 3, tip: 'Etichetă', cantitate: 2000, unitate: 'buc' },
      { id: 4, tip: 'Capac', cantitate: 1500, unitate: 'buc' },
    ];

    const ambalajeSalvate = localStorage.getItem('stocAmbalaje');
    if (!ambalajeSalvate) {
      localStorage.setItem('stocAmbalaje', JSON.stringify(ambalajeInitiale));
      setStocAmbalaje(ambalajeInitiale);
    } else {
      setStocAmbalaje(JSON.parse(ambalajeSalvate));
    }
  }, []);

  // Salvare automată a stării curente
  useEffect(() => {
    const stareaCurenta = {
      selectedReteta,
      cantitateProdusa,
      consumMateriale,
      consumAmbalaje,
      container,
      materialeInsuficiente,
      ambalajeInsuficiente,
      showWarning,
      showMaterials,
      timestamp: Date.now(),
    };
    localStorage.setItem('productieTemp', JSON.stringify(stareaCurenta));
  }, [
    selectedReteta,
    cantitateProdusa,
    consumMateriale,
    consumAmbalaje,
    container,
    materialeInsuficiente,
    ambalajeInsuficiente,
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
        setConsumAmbalaje(parsed.consumAmbalaje || []);
        setContainer(parsed.container);
        setMaterialeInsuficiente(parsed.materialeInsuficiente);
        setAmbalajeInsuficiente(parsed.ambalajeInsuficiente || []);
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

  const clearTempState = useCallback(() => {
    if (window.confirm('Sigur doriți să ștergeți datele temporare?')) {
      localStorage.removeItem('productieTemp');
      setSelectedReteta(null);
      setCantitateProdusa('');
      setConsumMateriale([]);
      setConsumAmbalaje([]);
      setContainer('');
      setMaterialeInsuficiente([]);
      setAmbalajeInsuficiente([]);
      setShowWarning(false);
      setShowMaterials(false);
    }
  }, []);

  const gasesteMaterialInStoc = useCallback((denumireMaterial, unitateMaterial) => {
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
  }, [stocMateriale]);

  const gasesteAmbalajInStoc = useCallback((tipAmbalaj) => {
    return stocAmbalaje.find((ambalaj) => ambalaj.tip === tipAmbalaj);
  }, [stocAmbalaje]);

  const verificaStoc = useCallback((materialeNecesare) => {
    const insuficiente = [];

    materialeNecesare.forEach((material) => {
      const materialInStoc = gasesteMaterialInStoc(
        material.denumire,
        material.unitate
      );

      if (!materialInStoc) {
        insuficiente.push({
          ...material,
          inStoc: 0,
          lipseste: material.cantitate,
        });
      } else if (materialInStoc.cantitate < material.cantitate) {
        insuficiente.push({
          ...material,
          inStoc: materialInStoc.cantitate,
          lipseste: parseFloat(
            (material.cantitate - materialInStoc.cantitate).toFixed(2)
          ),
        });
      }
    });

    setMaterialeInsuficiente(insuficiente);
    setShowWarning(insuficiente.length > 0 || ambalajeInsuficiente.length > 0);
  }, [ambalajeInsuficiente, gasesteMaterialInStoc]);

  const verificaStocAmbalaje = useCallback((ambalajeNecesare) => {
    const insuficiente = [];

    ambalajeNecesare.forEach((ambalaj) => {
      const ambalajInStoc = gasesteAmbalajInStoc(ambalaj.tip);

      if (!ambalajInStoc) {
        insuficiente.push({
          ...ambalaj,
          inStoc: 0,
          lipseste: ambalaj.cantitate,
        });
      } else if (ambalajInStoc.cantitate < ambalaj.cantitate) {
        insuficiente.push({
          ...ambalaj,
          inStoc: ambalajInStoc.cantitate,
          lipseste: ambalaj.cantitate - ambalajInStoc.cantitate,
        });
      }
    });

    setAmbalajeInsuficiente(insuficiente);
    setShowWarning(materialeInsuficiente.length > 0 || insuficiente.length > 0);
  }, [materialeInsuficiente, gasesteAmbalajInStoc]);

  const calculeazaConsum = useCallback(() => {
    if (!selectedReteta || !cantitateProdusa || parseFloat(cantitateProdusa) <= 0) return;

    // Calcul consum materiale
    const factorScalare = parseFloat(cantitateProdusa) / selectedReteta.rezultat.cantitate;
    const materialeConsumate = selectedReteta.ingrediente.map((ingredient) => ({
      denumire: ingredient.denumire,
      cantitate: parseFloat((ingredient.cantitate * factorScalare).toFixed(2)),
      unitate: ingredient.unitate,
    }));

    setConsumMateriale(materialeConsumate);
    verificaStoc(materialeConsumate);

    // Calcul consum ambalaje
    const cantitateLitri = parseFloat(cantitateProdusa);
    const sticleNecesare = Math.ceil(cantitateLitri / 0.5); // Presupunem sticle de 0.5L
    const kegNecesare = Math.floor(cantitateLitri / 50); // Presupunem KEG de 50L
    const ambalajeNecesare = [
      { tip: 'Sticlă 0.5L', cantitate: sticleNecesare, unitate: 'buc' },
      { tip: 'KEG 50L', cantitate: kegNecesare, unitate: 'buc' },
      { tip: 'Etichetă', cantitate: sticleNecesare, unitate: 'buc' },
      { tip: 'Capac', cantitate: sticleNecesare, unitate: 'buc' },
    ];

    setConsumAmbalaje(ambalajeNecesare);
    verificaStocAmbalaje(ambalajeNecesare);

    setShowMaterials(true);
  }, [selectedReteta, cantitateProdusa, verificaStoc, verificaStocAmbalaje]);

  // Apel automat pentru recalculare când se schimbă containerul sau cantitatea
  useEffect(() => {
    if (container && cantitateProdusa && selectedReteta) {
      calculeazaConsum();
    }
  }, [container, cantitateProdusa, selectedReteta, calculeazaConsum]);

  const scadeDinStoc = useCallback((materialeConsumate) => {
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
  }, [gasesteMaterialInStoc]);

  const scadeDinStocAmbalaje = useCallback((ambalajeConsumate) => {
    const stoc = JSON.parse(localStorage.getItem('stocAmbalaje')) || [];
    const stocActualizat = [...stoc];

    ambalajeConsumate.forEach((ambalaj) => {
      const ambalajInStoc = gasesteAmbalajInStoc(ambalaj.tip);

      if (ambalajInStoc) {
        const indexInStoc = stocActualizat.findIndex(
          (item) => item.id === ambalajInStoc.id
        );
        if (indexInStoc !== -1) {
          const cantitateRamasa =
            stocActualizat[indexInStoc].cantitate - ambalaj.cantitate;
          stocActualizat[indexInStoc].cantitate = Math.max(0, cantitateRamasa);
        }
      }
    });

    localStorage.setItem('stocAmbalaje', JSON.stringify(stocActualizat));
    setStocAmbalaje(stocActualizat);
    return stocActualizat;
  }, [gasesteAmbalajInStoc]);

  const adaugaInStoc = useCallback((materialeConsumate) => {
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
        const newId = stocActualizat.length > 0 ? Math.max(...stocActualizat.map((m) => m.id)) + 1 : 1;
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
  }, [gasesteMaterialInStoc]);

  const adaugaInStocAmbalaje = useCallback((ambalajeConsumate) => {
    const stoc = JSON.parse(localStorage.getItem('stocAmbalaje')) || [];
    const stocActualizat = [...stoc];

    ambalajeConsumate.forEach((ambalaj) => {
      const ambalajInStoc = gasesteAmbalajInStoc(ambalaj.tip);

      if (ambalajInStoc) {
        const indexInStoc = stocActualizat.findIndex(
          (item) => item.id === ambalajInStoc.id
        );
        if (indexInStoc !== -1) {
          stocActualizat[indexInStoc].cantitate += ambalaj.cantitate;
        }
      } else {
        const newId = stocActualizat.length > 0 ? Math.max(...stocActualizat.map((a) => a.id)) + 1 : 1;
        stocActualizat.push({
          id: newId,
          tip: ambalaj.tip.trim(),
          cantitate: ambalaj.cantitate,
          unitate: ambalaj.unitate.trim(),
        });
      }
    });

    localStorage.setItem('stocAmbalaje', JSON.stringify(stocActualizat));
    setStocAmbalaje(stocActualizat);
    return stocActualizat;
  }, [gasesteAmbalajInStoc]);

  const confirmaProductia = useCallback(() => {
    localStorage.removeItem('productieTemp');

    if (!selectedReteta || !cantitateProdusa || !container) {
      alert('Selectați rețeta, introduceți cantitatea și alegeți containerul!');
      return;
    }

    if (materialeInsuficiente.length > 0 || ambalajeInsuficiente.length > 0) {
      const confirmare = window.confirm(
        'Nu aveți suficiente materiale sau ambalaje în stoc pentru această producție! Doriți să continuați oricum? ' +
          '(Stocul va ajunge la 0 pentru materialele/ambalajele insuficiente)'
      );
      if (!confirmare) return;
    }

    const factorScalare = parseFloat(cantitateProdusa) / selectedReteta.rezultat.cantitate;
    const materialeConsumate = selectedReteta.ingrediente.map((ingredient) => ({
      denumire: ingredient.denumire,
      cantitate: parseFloat((ingredient.cantitate * factorScalare).toFixed(2)),
      unitate: ingredient.unitate,
    }));

    const cantitateLitri = parseFloat(cantitateProdusa);
    const sticleNecesare = Math.ceil(cantitateLitri / 0.5);
    const kegNecesare = Math.floor(cantitateLitri / 50);
    const ambalajeConsumate = [
      { tip: 'Sticlă 0.5L', cantitate: sticleNecesare, unitate: 'buc' },
      { tip: 'KEG 50L', cantitate: kegNecesare, unitate: 'buc' },
      { tip: 'Etichetă', cantitate: sticleNecesare, unitate: 'buc' },
      { tip: 'Capac', cantitate: sticleNecesare, unitate: 'buc' },
    ];

    setConsumMateriale(materialeConsumate);
    setConsumAmbalaje(ambalajeConsumate);
    scadeDinStoc(materialeConsumate);
    scadeDinStocAmbalaje(ambalajeConsumate);

    const productie = {
      retetaId: selectedReteta.id,
      numeReteta: selectedReteta.nume,
      cantitate: cantitateProdusa,
      container,
      materiale: materialeConsumate,
      ambalaje: ambalajeConsumate,
      data: new Date().toISOString(),
    };

    localStorage.setItem(`productieContainer_${container}`, JSON.stringify(productie));

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
      `Producție înregistrată în Containerul ${container}! Materialele și ambalajele au fost scăzute din stoc.`
    );

    setSelectedReteta(null);
    setCantitateProdusa('');
    setConsumMateriale([]);
    setConsumAmbalaje([]);
    setContainer('');
    setMaterialeInsuficiente([]);
    setAmbalajeInsuficiente([]);
    setShowWarning(false);
    setShowMaterials(false);
  }, [
    selectedReteta,
    cantitateProdusa,
    container,
    materialeInsuficiente,
    ambalajeInsuficiente,
    scadeDinStoc,
    scadeDinStocAmbalaje,
    containere,
  ]);

  const golireContainer = useCallback((containerId) => {
    const productieData = localStorage.getItem(`productieContainer_${containerId}`);
    if (!productieData) {
      alert('Nu există date de producție pentru acest container.');
      return;
    }

    const productie = JSON.parse(productieData);
    const cantitateRamasa = parseFloat(productie.cantitate);

    const cantitateDeGolit = prompt(
      `Introduceți cantitatea de golit (litri)\nCantitate disponibilă: ${cantitateRamasa} litri`,
      cantitateRamasa
    );

    if (!cantitateDeGolit || isNaN(cantitateDeGolit) || parseFloat(cantitateDeGolit) <= 0) {
      return;
    }

    const cantitateDeGolitNum = parseFloat(cantitateDeGolit);

    if (cantitateDeGolitNum > cantitateRamasa) {
      alert(`Nu puteți goli mai mult decât există în container! Cantitate disponibilă: ${cantitateRamasa} litri`);
      return;
    }

    const isMistake = window.confirm(
      'A fost o greșeală în această producție?\n' +
        'Apăsați "OK" dacă doriți să anulați producția și să returnați materialele și ambalajele în stoc.\n' +
        'Apăsați "Cancel" dacă fermentatorul a fost golit fizic și materialele/ambalajele nu trebuie returnate.'
    );

    const factorReturnare = cantitateDeGolitNum / cantitateRamasa;

    if (isMistake) {
      const materialeConsumate = productie.materiale.map((material) => ({
        ...material,
        cantitate: parseFloat((material.cantitate * factorReturnare).toFixed(2)),
      }));
      adaugaInStoc(materialeConsumate);

      const ambalajeConsumate = productie.ambalaje.map((ambalaj) => ({
        ...ambalaj,
        cantitate: Math.ceil(ambalaj.cantitate * factorReturnare),
      }));
      adaugaInStocAmbalaje(ambalajeConsumate);
    }

    if (cantitateDeGolitNum < cantitateRamasa) {
      const cantitateNoua = cantitateRamasa - cantitateDeGolitNum;

      const productieActualizata = {
        ...productie,
        cantitate: cantitateNoua,
        materiale: productie.materiale.map((material) => ({
          ...material,
          cantitate: parseFloat((material.cantitate * (1 - factorReturnare)).toFixed(2)),
        })),
        ambalaje: productie.ambalaje.map((ambalaj) => ({
          ...ambalaj,
          cantitate: Math.ceil(ambalaj.cantitate * (1 - factorReturnare)),
        })),
      };

      localStorage.setItem(`productieContainer_${containerId}`, JSON.stringify(productieActualizata));

      setContainere((prevContainere) =>
        prevContainere.map((cont) =>
          cont.id === containerId ? { ...cont, cantitate: cantitateNoua } : cont
        )
      );

      alert(`Au fost goliți ${cantitateDeGolitNum} litri din Containerul ${containerId}. Au rămas ${cantitateNoua} litri.`);
    } else {
      localStorage.removeItem(`productieContainer_${containerId}`);

      setContainere((prevContainere) =>
        prevContainere.map((cont) =>
          cont.id === containerId
            ? { ...cont, status: 'disponibil', retetaNume: '', cantitate: '' }
            : cont
        )
      );

      alert(`Containerul ${containerId} a fost golit complet și este acum disponibil.`);
    }
  }, [adaugaInStoc, adaugaInStocAmbalaje]);

  const afiseazaInfoContainer = useCallback((containerId) => {
    const productieData = localStorage.getItem(`productieContainer_${containerId}`);
    if (productieData) {
      const productie = JSON.parse(productieData);
      alert(
        `Container ${containerId}\n` +
          `Rețetă: ${productie.numeReteta}\n` +
          `Cantitate: ${productie.cantitate}\n` +
          `Data: ${new Date(productie.data).toLocaleDateString()}\n` +
          `Ambalaje: \n${productie.ambalaje.map((a) => `${a.tip}: ${a.cantitate} ${a.unitate}`).join('\n')}`
      );
    }
  }, []);

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
                backgroundImage: `url(/imagini/${reteta.image})`,
              }}
              onClick={() => {
                setSelectedReteta(reteta);
                setConsumMateriale([]);
                setConsumAmbalaje([]);
                setCantitateProdusa('');
                setMaterialeInsuficiente([]);
                setAmbalajeInsuficiente([]);
                setShowWarning(false);
                setShowMaterials(false);
              }}
            >
              <h3>{reteta.nume}</h3>
              <p>Concentrație must: {reteta.concentratieMust}</p>
              <p>Concentrație alcool: {reteta.concentratieAlcool}</p>
              <p>
                Producție standard: {reteta.rezultat.cantitate} {reteta.rezultat.unitate}
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
                className={`${styles.containerCard} ${
                  cont.status !== 'disponibil' ? styles.containerIndisponibil : ''
                } ${container === cont.id.toString() ? styles.containerSelectat : ''}`}
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
          <div>
            <div className={styles.formGroup}>
              <label>Cantitate de produs (litri):</label>
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

            {showMaterials && (
              <div>
                {showWarning && materialeInsuficiente.length > 0 && (
                  <div className={styles.warningContainer}>
                    <h3 className={styles.warningTitle}>Atenție! Materiale insuficiente:</h3>
                    <table className={styles.consumTable}>
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
                          <tr key={index}>
                            <td>{material.denumire}</td>
                            <td>{material.cantitate}</td>
                            <td>{material.inStoc}</td>
                            <td>{material.lipseste}</td>
                            <td>{material.unitate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {showWarning && ambalajeInsuficiente.length > 0 && (
                  <div className={styles.warningContainer}>
                    <h3 className={styles.warningTitle}>Atenție! Ambalaje insuficiente:</h3>
                    <table className={styles.consumTable}>
                      <thead>
                        <tr>
                          <th>Tip</th>
                          <th>Necesar</th>
                          <th>În stoc</th>
                          <th>Lipsă</th>
                          <th>Unitate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ambalajeInsuficiente.map((item, index) => (
                          <tr key={index}>
                            <td>{item.tip}</td>
                            <td>{item.cantitate}</td>
                            <td>{item.inStoc}</td>
                            <td>{item.lipseste}</td>
                            <td>{item.unitate}</td>
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
                          <td>{material.cantitate}</td>
                          <td>{material.unitate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className={styles.consumContainer}>
                  <h3>Ambalaje necesare:</h3>
                  <table className={styles.consumTable}>
                    <thead>
                      <tr>
                        <th>Tip</th>
                        <th>Cantitate</th>
                        <th>Unitate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {consumAmbalaje.map((ambalaj, index) => (
                        <tr key={index}>
                          <td>{ambalaj.tip}</td>
                          <td>{ambalaj.cantitate}</td>
                          <td>{ambalaj.unitate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button
                  onClick={confirmaProductia}
                  className={styles.button}
                  disabled={!cantitateProdusa || parseFloat(cantitateProdusa) <= 0 || !container}
                  style={{ marginTop: '20px' }}
                >
                  Confirmă Producția
                </button>

                <button
                  onClick={clearTempState}
                  className={`${styles.button} ${styles.buttonDanger}`}
                  style={{ marginTop: '20px' }}
                >
                  Resetare Date Temporare
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Productie;