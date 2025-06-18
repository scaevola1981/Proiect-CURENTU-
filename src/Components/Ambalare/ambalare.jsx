import React, { useEffect, useState } from "react";
import Header from "../Header/header";
import styles from "./ambalare.module.css"; // Ensure this CSS module exists
import { getMateriiPrime, saveMateriiPrime } from "../../LocalStorage/materiale";

const Ambalare = () => {
  const [containere, setContainere] = useState([]);
  const [containerSelectat, setContainerSelectat] = useState(null);
  const [detaliiAmbalare, setDetaliiAmbalare] = useState({
    tipAmbalaj: "sticla", // sticla sau keg
    volumAmbalaj: 0.5, // L pentru sticle sau keg-uri
    sticlePerCutie: 12, // pentru sticle
    etichetaFata: true,
    etichetaSpate: false,
    necesarCalculat: null,
  });
  const [stocAmbalaje, setStocAmbalaje] = useState({
    sticle: { 0.33: 0, 0.5: 0, 0.75: 0 },
    kegs: { 10: 0, 20: 0, 30: 0, 50: 0 },
    cutii: { 6: 0, 12: 0, 24: 0 },
    dopuri: 0,
    etichete: { fata: 0, spate: 0 },
  });
  const [showAddStock, setShowAddStock] = useState(false);
  const [ambalareJurnal, setAmbalareJurnal] = useState([]);
  const [showJurnal, setShowJurnal] = useState(false);

  function extrageStocAmbalajeDinMateriiPrime(materii) {
    const getCant = (denumire, unitate) => {
      const mat = materii.find(
        (m) =>
          m.denumire.trim().toLowerCase() === denumire.trim().toLowerCase() &&
          m.unitate.trim().toLowerCase() === unitate.trim().toLowerCase()
      );
      return mat ? Number(mat.cantitate) : 0;
    };

    return {
      sticle: {
        0.33: getCant("Sticlă 0.33L", "buc"),
        0.5: getCant("Sticlă 0.5L", "buc"),
        0.75: getCant("Sticlă 0.75L", "buc"),
      },
      kegs: {
        10: getCant("Keg 10L", "buc"),
        20: getCant("Keg 20L", "buc"),
        30: getCant("Keg 30L", "buc"),
        50: getCant("Keg 50L", "buc"),
      },
      cutii: {
        6: getCant("cutii", "buc"),
        12: getCant("cutii", "buc"),
        24: getCant("cutii", "buc"),
      },
      dopuri: getCant("Capac", "buc"),
      etichete: {
        fata: getCant("Etichetă față", "buc"),
        spate: getCant("Etichetă spate", "buc"),
      },
    };
  }

  // Load initial data
  useEffect(() => {
    // Load containers from localStorage
    const containereActualizate = [];
    for (let i = 1; i <= 6; i++) {
      const productieData = localStorage.getItem(`productieContainer_${i}`);
      if (productieData) {
        try {
          const productie = JSON.parse(productieData);
          containereActualizate.push({
            id: i,
            status: "ocupat",
            cantitate: parseFloat(productie.cantitate),
            retetaNume: productie.numeReteta,
            data: new Date(productie.data).toLocaleDateString(),
          });
        } catch (error) {
          console.error(`Error parsing productieContainer_${i}:`, error);
        }
      }
    }
    setContainere(containereActualizate);

    // Load raw materials stock
    try {
      const materii = getMateriiPrime();
      setStocAmbalaje(extrageStocAmbalajeDinMateriiPrime(materii));
    } catch (error) {
      console.error("Error loading materii prime:", error);
    }

    // Load packaging journal
    try {
      const jurnalSalvat = localStorage.getItem("ambalareJurnal");
      if (jurnalSalvat) {
        setAmbalareJurnal(JSON.parse(jurnalSalvat));
      }
    } catch (error) {
      console.error("Error loading ambalareJurnal:", error);
    }
  }, []);

  // Save stock and journal when they change
  useEffect(() => {
    try {
      localStorage.setItem("stocAmbalaje", JSON.stringify(stocAmbalaje));
    } catch (error) {
      console.error("Error saving stocAmbalaje:", error);
    }
  }, [stocAmbalaje]);

  useEffect(() => {
    try {
      localStorage.setItem("ambalareJurnal", JSON.stringify(ambalareJurnal));
    } catch (error) {
      console.error("Error saving ambalareJurnal:", error);
    }
  }, [ambalareJurnal]);

  const selecteazaContainer = (container) => {
    setContainerSelectat(container);
    calculeazaNecesar(container, detaliiAmbalare);
  };

  const actualizeazaOptiuni = (field, value) => {
    const optiuniActualizate = { ...detaliiAmbalare, [field]: value };
    setDetaliiAmbalare(optiuniActualizate);

    if (containerSelectat) {
      calculeazaNecesar(containerSelectat, optiuniActualizate);
    }
  };

  const calculeazaNecesar = (container, optiuni) => {
    const { tipAmbalaj, volumAmbalaj, sticlePerCutie, etichetaFata, etichetaSpate } = optiuni;
    const cantitateL = container.cantitate;

    let necesar = {
      cantitateL,
      tipAmbalaj,
      volumAmbalaj,
    };

    if (tipAmbalaj === "sticla") {
    const numarSticle = Math.ceil(cantitateL / volumAmbalaj);
      necesar.numarSticle = numarSticle;
      necesar.numarDopuri = numarSticle;
      necesar.numarCutii = Math.ceil(numarSticle / sticlePerCutie);
      necesar.sticlePerCutie = sticlePerCutie;
      necesar.numarEticheteFata = etichetaFata ? numarSticle : 0;
      necesar.numarEticheteSpate = etichetaSpate ? numarSticle : 0;

      necesar.stocSuficient =
        stocAmbalaje.sticle[volumAmbalaj] >= numarSticle &&
        stocAmbalaje.dopuri >= numarSticle &&
        stocAmbalaje.cutii[sticlePerCutie] >= necesar.numarCutii &&
        (!etichetaFata || stocAmbalaje.etichete.fata >= numarSticle) &&
        (!etichetaSpate || stocAmbalaje.etichete.spate >= numarSticle);
    } else if (tipAmbalaj === "keg") {
      const numarKeguri = Math.ceil(cantitateL / volumAmbalaj);
      necesar.numarKeguri = numarKeguri;
      necesar.stocSuficient = stocAmbalaje.kegs[volumAmbalaj] >= numarKeguri;
    }

    setDetaliiAmbalare((prevState) => ({
      ...prevState,
      necesarCalculat: necesar,
    }));
    return necesar;
  };

  const executaAmbalarea = () => {
    if (!containerSelectat || !detaliiAmbalare.necesarCalculat) return;

    const necesar = detaliiAmbalare.necesarCalculat;
    const confirmare = window.confirm(
      necesar.stocSuficient
        ? `Confirmați ambalarea berii din Containerul ${containerSelectat.id}?`
        : `Stoc insuficient pentru ambalare! Doriți să continuați și să scădeți din stoc ce este disponibil?`
    );

    if (!confirmare) return;

    // Update raw materials stock
    try {
      const materii = getMateriiPrime();
      const denumireBere = containerSelectat.retetaNume;
      const index = materii.findIndex(
        (m) => m.denumire.trim().toLowerCase() === denumireBere.trim().toLowerCase()
      );
      if (index !== -1) {
        materii[index].cantitate = Math.max(0, materii[index].cantitate - containerSelectat.cantitate);
        saveMateriiPrime(materii);
      }
    } catch (error) {
      console.error("Error updating materii prime:", error);
    }

    // Update packaging stock
    const stocNou = { ...stocAmbalaje };

    if (necesar.tipAmbalaj === "sticla") {
      stocNou.sticle[necesar.volumAmbalaj] = Math.max(
        0,
        stocNou.sticle[necesar.volumAmbalaj] - necesar.numarSticle
      );
      stocNou.dopuri = Math.max(0, stocNou.dopuri - necesar.numarDopuri);
      stocNou.cutii[necesar.sticlePerCutie] = Math.max(
        0,
        stocNou.cutii[necesar.sticlePerCutie] - necesar.numarCutii
      );

      if (detaliiAmbalare.etichetaFata) {
        stocNou.etichete.fata = Math.max(0, stocNou.etichete.fata - necesar.numarEticheteFata);
      }
      if (detaliiAmbalare.etichetaSpate) {
        stocNou.etichete.spate = Math.max(0, stocNou.etichete.spate - necesar.numarEticheteSpate);
      }
    } else if (necesar.tipAmbalaj === "keg") {
      stocNou.kegs[necesar.volumAmbalaj] = Math.max(
        0,
        stocNou.kegs[necesar.volumAmbalaj] - necesar.numarKeguri
      );
    }

    setStocAmbalaje(stocNou);

    // Add to journal
    const intrareJurnal = {
      data: new Date().toISOString(),
      containerId: containerSelectat.id,
      reteta: containerSelectat.retetaNume,
      cantitateL: containerSelectat.cantitate,
      ...necesar,
    };

    setAmbalareJurnal((prev) => [intrareJurnal, ...prev]);

    // Free the container
    localStorage.removeItem(`productieContainer_${containerSelectat.id}`);

    // Update containers list
    setContainere((prev) => prev.filter((c) => c.id !== containerSelectat.id));

    // Reset selection
    setContainerSelectat(null);
    setDetaliiAmbalare((prev) => ({ ...prev, necesarCalculat: null }));

    alert(`Ambalare finalizată! Containerul ${containerSelectat.id} a fost eliberat.`);
  };

  const adaugaStoc = (tip, subTip, cantitate) => {
    if (!cantitate || isNaN(cantitate) || cantitate <= 0) return;

    const stocNou = { ...stocAmbalaje };

    if (tip === "sticle") {
      stocNou.sticle[subTip] += parseInt(cantitate);
    } else if (tip === "kegs") {
      stocNou.kegs[subTip] += parseInt(cantitate);
    } else if (tip === "cutii") {
      stocNou.cutii[subTip] += parseInt(cantitate);
    } else if (tip === "dopuri") {
      stocNou.dopuri += parseInt(cantitate);
    } else if (tip === "etichete") {
      stocNou.etichete[subTip] += parseInt(cantitate);
    }

    setStocAmbalaje(stocNou);
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.title}>Ambalare Bere</h1>

        <div className={styles.sectionsContainer}>
          {/* Containers Section */}
          <div className={styles.section}>
            <h2>Containere cu bere disponibilă pentru ambalare</h2>
            {containere.length === 0 ? (
              <div className={styles.emptyMessage}>
                Nu există containere cu bere disponibilă pentru ambalare.
              </div>
            ) : (
              <div className={styles.containereGrid}>
                {containere.map((container) => (
                  <div
                    key={container.id}
                    className={`${styles.containerCard} ${
                      containerSelectat?.id === container.id ? styles.containerSelectat : ""
                    }`}
                    onClick={() => selecteazaContainer(container)}
                  >
                    <img
                      src="/imagini/fermentator.png"
                      alt={`Container ${container.id}`}
                      className={styles.containerImage}
                    />
                    <div className={styles.containerContent}>
                      <h4>Container {container.id}</h4>
                      <p>
                        <strong>{container.retetaNume}</strong>
                      </p>
                      <p>Cantitate: {container.cantitate}L</p>
                      <p>Data: {container.data}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Packaging Options Section */}
          {containerSelectat && (
            <div className={styles.section}>
              <h2>Opțiuni ambalare pentru Container {containerSelectat.id}</h2>
              <div className={styles.formGroup}>
                <label>Tip ambalaj:</label>
                <div className={styles.radioGroup}>
                  <label>
                    <input
                      type="radio"
                      value="sticla"
                      checked={detaliiAmbalare.tipAmbalaj === "sticla"}
                      onChange={() => actualizeazaOptiuni("tipAmbalaj", "sticla")}
                    />
                    Sticle
                  </label>
                  <label>
                    <input
                      type="radio"
 wholeness
                      value="keg"
                      checked={detaliiAmbalare.tipAmbalaj === "keg"}
                      onChange={() => actualizeazaOptiuni("tipAmbalaj", "keg")}
                    />
                    Keg-uri
                  </label>
                </div>
              </div>

              {detaliiAmbalare.tipAmbalaj === "sticla" && (
                <>
                  <div className={styles.formGroup}>
                    <label>Volum sticlă (L):</label>
                    <select
                      value={detaliiAmbalare.volumAmbalaj}
                      onChange={(e) =>
                        actualizeazaOptiuni("volumAmbalaj", parseFloat(e.target.value))
                      }
                      className={styles.select}
                    >
                      <option value={0.33}>0.33L</option>
                      <option value={0.5}>0.5L</option>
                      <option value={0.75}>0.75L</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Sticle per cutie:</label>
                    <select
                      value={detaliiAmbalare.sticlePerCutie}
                      onChange={(e) =>
                        actualizeazaOptiuni("sticlePerCutie", parseInt(e.target.value))
                      }
                      className={styles.select}
                    >
                      <option value={6}>6 sticle</option>
                      <option value={12}>12 sticle</option>
                      <option value={24}>24 sticle</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Etichete:</label>
                    <div className={styles.checkboxGroup}>
                      <label>
                        <input
                          type="checkbox"
                          checked={detaliiAmbalare.etichetaFata}
                          onChange={(e) =>
                            actualizeazaOptiuni("etichetaFata", e.target.checked)
                          }
                        />
                        Etichetă față
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={detaliiAmbalare.etichetaSpate}
                          onChange={(e) =>
                            actualizeazaOptiuni("etichetaSpate", e.target.checked)
                          }
                        />
                        Etichetă spate
                      </label>
                    </div>
                  </div>
                </>
              )}

              {detaliiAmbalare.tipAmbalaj === "keg" && (
                <div className={styles.formGroup}>
                  <label>Volum keg (L):</label>
                  <select
                    value={detaliiAmbalare.volumAmbalaj}
                    onChange={(e) =>
                      actualizeazaOptiuni("volumAmbalaj", parseFloat(e.target.value))
                    }
                    className={styles.select}
                  >
                    <option value={10}>10L</option>
                    <option value={20}>20L</option>
                    <option value={30}>30L</option>
                    <option value={50}>50L</option>
                  </select>
                </div>
              )}

              {detaliiAmbalare.necesarCalculat && (
                <div
                  className={`${styles.necesarContainer} ${
                    !detaliiAmbalare.necesarCalculat.stocSuficient
                      ? styles.stocInsuficient
                      : ""
                  }`}
                >
                  <h3>Necesar materiale:</h3>
                  {detaliiAmbalare.tipAmbalaj === "sticla" ? (
                    <div>
                      <p>
                        Sticle {detaliiAmbalare.volumAmbalaj}L:{" "}
                        <strong>{detaliiAmbalare.necesarCalculat.numarSticle}</strong> buc
                      </p>
                      <p>
                        Dopuri: <strong>{detaliiAmbalare.necesarCalculat.numarDopuri}</strong> buc
                      </p>
                      <p>
                        Cutii de {detaliiAmbalare.sticlePerCutie}:{" "}
                        <strong>{detaliiAmbalare.necesarCalculat.numarCutii}</strong> buc
                      </p>
                      {detaliiAmbalare.etichetaFata && (
                        <p>
                          Etichete față:{" "}
                          <strong>{detaliiAmbalare.necesarCalculat.numarEticheteFata}</strong> buc
                        </p>
                      )}
                      {detaliiAmbalare.etichetaSpate && (
                        <p>
                          Etichete spate:{" "}
                          <strong>{detaliiAmbalare.necesarCalculat.numarEticheteSpate}</strong> buc
                        </p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p>
                        Keg-uri {detaliiAmbalare.volumAmbalaj}L:{" "}
                        <strong>{detaliiAmbalare.necesarCalculat.numarKeguri}</strong> buc
                      </p>
                    </div>
                  )}

                  {!detaliiAmbalare.necesarCalculat.stocSuficient && (
                    <div className={styles.avertisment}>
                      <p>⚠️ Stoc insuficient pentru ambalare!</p>
                    </div>
                  )}

                  <button className={styles.button} onClick={executaAmbalarea}>
                    Execută ambalarea
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Stock Section */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Stoc materiale ambalare</h2>
              <button
                className={`${styles.button} ${styles.smallButton}`}
                onClick={() => setShowAddStock(!showAddStock)}
              >
                {showAddStock ? "Ascunde" : "Adaugă stoc"}
              </button>
            </div>

            <div className={styles.stockGrid}>
              <div className={styles.stockCard}>
                <h4>Sticle</h4>
                <p>0.33L: <strong>{stocAmbalaje.sticle["0.33"]}</strong> buc</p>
                <p>0.5L: <strong>{stocAmbalaje.sticle["0.5"]}</strong> buc</p>
                <p>0.75L: <strong>{stocAmbalaje.sticle["0.75"]}</strong> buc</p>
              </div>
              <div className={styles.stockCard}>
                <h4>Keg-uri</h4>
                <p>10L: <strong>{stocAmbalaje.kegs["10"]}</strong> buc</p>
                <p>20L: <strong>{stocAmbalaje.kegs["20"]}</strong> buc</p>
                <p>30L: <strong>{stocAmbalaje.kegs["30"]}</strong> buc</p>
                <p>50L: <strong>{stocAmbalaje.kegs["50"]}</strong> buc</p>
              </div>
              <div className={styles.stockCard}>
 Xtremes
                <h4>Cutii</h4>
                <p>6 sticle: <strong>{stocAmbalaje.cutii["6"]}</strong> buc</p>
                <p>12 sticle: <strong>{stocAmbalaje.cutii["12"]}</strong> buc</p>
                <p>24 sticle: <strong>{stocAmbalaje.cutii["24"]}</strong> buc</p>
              </div>
              <div className={styles.stockCard}>
                <h4>Alte materiale</h4>
                <p>Dopuri: <strong>{stocAmbalaje.dopuri}</strong> buc</p>
                <p>Etichete față: <strong>{stocAmbalaje.etichete.fata}</strong> buc</p>
                <p>Etichete spate: <strong>{stocAmbalaje.etichete.spate}</strong> buc</p>
              </div>
            </div>

            {showAddStock && (
              <div className={styles.addStockForm}>
                <h3>Adaugă în stoc</h3>
                <div className={styles.stockFormGrid}>
                  <div className={styles.stockFormColumn}>
                    <h4>Sticle</h4>
                    <div className={styles.stockFormItem}>
                      <label>0.33L:</label>
                      <input
                        type="number"
                        min="0"
                        className={styles.smallInput}
                        onBlur={(e) =>
                          e.target.value && adaugaStoc("sticle", 0.33, e.target.value)
                        }
                      />
                    </div>
                    <div className={styles.stockFormItem}>
                      <label>0.5L:</label>
                      <input
                        type="number"
                        min="0"
                        className={styles.smallInput}
                        onBlur={(e) =>
                          e.target.value && adaugaStoc("sticle", 0.5, e.target.value)
                        }
                      />
                    </div>
                    <div className={styles.stockFormItem}>
                      <label>0.75L:</label>
                      <input
                        type="number"
                        min="0"
                        className={styles.smallInput}
                        onBlur={(e) =>
                          e.target.value && adaugaStoc("sticle", 0.75, e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className={styles.stockFormColumn}>
                    <h4>Keg-uri</h4>
                    <div className={styles.stockFormItem}>
                      <label>10L:</label>
                      <input
                        type="number"
                        min="0"
                        className={styles.smallInput}
                        onBlur={(e) =>
                          e.target.value && adaugaStoc("kegs", 10, e.target.value)
                        }
                      />
                    </div>
                    <div className={styles.stockFormItem}>
                      <label>20L:</label>
                      <input
                        type="number"
                        min="0"
                        className={styles.smallInput}
                        onBlur={(e) =>
                          e.target.value && adaugaStoc("kegs", 20, e.target.value)
                        }
                      />
                    </div>
                    <div className={styles.stockFormItem}>
                      <label>30L:</label>
                      <input
                        type="number"
                        min="0"
                        className={styles.smallInput}
                        onBlur={(e) =>
                          e.target.value && adaugaStoc("kegs", 30, e.target.value)
                        }
                      />
                    </div>
                    <div className={styles.stockFormItem}>
                      <label>50L:</label>
                      <input
                        type="number"
                        min="0"
                        className={styles.smallInput}
                        onBlur={(e) =>
                          e.target.value && adaugaStoc("kegs", 50, e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className={styles.stockFormColumn}>
                    <h4>Cutii</h4>
                    <div className={styles.stockFormItem}>
                      <label>6 sticle:</label>
                      <input
                        type="number"
                        min="0"
                        className={styles.smallInput}
                        onBlur={(e) =>
                          e.target.value && adaugaStoc("cutii", 6, e.target.value)
                        }
                      />
                    </div>
                    <div className={styles.stockFormItem}>
                      <label>12 sticle:</label>
                      <input
                        type="number"
                        min="0"
                        className={styles.smallInput}
                        onBlur={(e) =>
                          e.target.value && adaugaStoc("cutii", 12, e.target.value)
                        }
                      />
                    </div>
                    <div className={styles.stockFormItem}>
                      <label>24 sticle:</label>
                      <input
                        type="number"
                        min="0"
                        className={styles.smallInput}
                        onBlur={(e) =>
                          e.target.value && adaugaStoc("cutii", 24, e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className={styles.stockFormColumn}>
                    <h4>Alte materiale</h4>
                    <div className={styles.stockFormItem}>
                      <label>Dopuri:</label>
                      <input
                        type="number"
                        min="0"
                        className={styles.smallInput}
                        onBlur={(e) =>
                          e.target.value && adaugaStoc("dopuri", null, e.target.value)
                        }
                      />
                    </div>
                    <div className={styles.stockFormItem}>
                      <label>Etichete față:</label>
                      <input
                        type="number"
                        min="0"
                        className={styles.smallInput}
                        onBlur={(e) =>
                          e.target.value && adaugaStoc("etichete", "fata", e.target.value)
                        }
                      />
                    </div>
                    <div className={styles.stockFormItem}>
                      <label>Etichete spate:</label>
                      <input
                        type="number"
                        min="0"
                        className={styles.smallInput}
                        onBlur={(e) =>
                          e.target.value && adaugaStoc("etichete", "spate", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Journal Section */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Jurnal ambalare</h2>
              <button
                className={`${styles.button} ${styles.smallButton}`}
                onClick={() => setShowJurnal(!showJurnal)}
              >
                {showJurnal ? "Ascunde" : "Afișează"}
              </button>
            </div>
            {showJurnal && (
              <div className={styles.jurnalContainer}>
                {ambalareJurnal.length === 0 ? (
                  <div className={styles.emptyMessage}>
                    Nu există înregistrări în jurnalul de ambalare.
                  </div>
                ) : (
                  <table className={styles.jurnalTable}>
                    <thead>
                      <tr>
                        <th>Data</th>
                        <th>Container</th>
                        <th>Rețetă</th>
                        <th>Cantitate</th>
                        <th>Tip ambalaj</th>
                        <th>Detalii</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ambalareJurnal.map((intrare, index) => (
                        <tr key={index}>
                          <td>{new Date(intrare.data).toLocaleDateString()}</td>
                          <td>{intrare.containerId}</td>
                          <td>{intrare.reteta}</td>
                          <td>{intrare.cantitateL}L</td>
                          <td>{intrare.tipAmbalaj === "sticla" ? "Sticle" : "Keg-uri"}</td>
                          <td>
                            {intrare.tipAmbalaj === "sticla" ? (
                              <>
                                {intrare.numarSticle} sticle de {intrare.volumAmbalaj}L,{" "}
                                {intrare.numarCutii} cutii
                              </>
                            ) : (
                              <>
                                {intrare.numarKeguri} keg-uri de {intrare.volumAmbalaj}L
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Ambalare;