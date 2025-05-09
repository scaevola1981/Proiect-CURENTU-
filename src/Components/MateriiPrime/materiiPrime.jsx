import React, { useEffect, useState } from "react";
import "../../LocalStorage/materiale"; // This initializes localStorage with default materials
import styles from "./materiiPrime.module.css";
import Header from "../Header/header";

const MateriiPrime = () => {
  const [materii, setMaterii] = useState([]);
  const [nouMaterial, setNouMaterial] = useState({
    denumire: "",
    cantitate: "",
    unitate: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
 
  // Load materials from localStorage on component mount
  useEffect(() => {
    const loadMaterials = () => {
      setIsLoading(true);
      try {
        const storedMaterials = localStorage.getItem("materiiPrime");
        if (storedMaterials) {
          const parsedMaterials = JSON.parse(storedMaterials);
          // Sort materials by ID for consistent display
          const sortedMaterials = [...parsedMaterials].sort((a, b) => a.id - b.id);
          setMaterii(sortedMaterials);
        } else {
          // If no materials found, initialize with empty array
          setMaterii([]);
        }
      } catch (error) {
        console.error("Error loading materials:", error);
        setMaterii([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadMaterials();
  }, []);

  

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNouMaterial({ ...nouMaterial, [name]: value });
  };

  // Add or update material
  const handleMaterialSubmit = (e) => {
    e.preventDefault();
    
    if (!nouMaterial.denumire || !nouMaterial.cantitate || !nouMaterial.unitate) {
      alert("Toate câmpurile sunt obligatorii!");
      return;
    }

    const denumireLowerCase = nouMaterial.denumire.toLowerCase().trim();
    const unitateLowerCase = nouMaterial.unitate.toLowerCase().trim();
    const cantitate = parseFloat(nouMaterial.cantitate);

    if (isNaN(cantitate) || cantitate <= 0) {
      alert("Cantitatea trebuie să fie un număr pozitiv!");
      return;
    }

    let updatedMaterials;
    
    if (editMode) {
      // Update existing material
      updatedMaterials = materii.map(m => 
        m.id === nouMaterial.id ? { 
          ...nouMaterial, 
          cantitate: parseFloat(nouMaterial.cantitate) 
        } : m
      );
    } else {
      // Add new material
      const existingMaterial = materii.find(m => 
        m.denumire.toLowerCase().trim() === denumireLowerCase &&
        m.unitate.toLowerCase().trim() === unitateLowerCase
      );

      if (existingMaterial) {
        // Merge with existing material
        updatedMaterials = materii.map(m => 
          m.id === existingMaterial.id ? { 
            ...m, 
            cantitate: m.cantitate + cantitate 
          } : m
        );
      } else {
        // Create new material
        const newId = materii.length > 0 ? Math.max(...materii.map(m => m.id)) + 1 : 1;
        updatedMaterials = [
          ...materii,
          {
            id: newId,
            denumire: nouMaterial.denumire.trim(),
            cantitate: cantitate,
            unitate: nouMaterial.unitate.trim()
          }
        ];
      }
    }

    // Save to localStorage and state
    localStorage.setItem("materiiPrime", JSON.stringify(updatedMaterials));
    setMaterii(updatedMaterials);
    setNouMaterial({ denumire: "", cantitate: "", unitate: "" });
    setEditMode(false);
  };

  // Delete material
  const deleteMaterial = (id) => {
    if (window.confirm("Sigur doriți să ștergeți acest material?")) {
      const updatedMaterials = materii.filter(m => m.id !== id);
      localStorage.setItem("materiiPrime", JSON.stringify(updatedMaterials));
      setMaterii(updatedMaterials);
    }
  };

  // Start editing material
  const startEditing = (material) => {
    setNouMaterial({
      id: material.id,
      denumire: material.denumire,
      cantitate: material.cantitate.toString(),
      unitate: material.unitate
    });
    setEditMode(true);
  };

  // Cancel editing
  const cancelEditing = () => {
    setNouMaterial({ denumire: "", cantitate: "", unitate: "" });
    setEditMode(false);
  };

  // Filter materials based on search term
  const filteredMaterials = materii.filter(material =>
    material.denumire.toLowerCase().includes(searchTerm.toLowerCase())
    
  );

  if (isLoading) {
    return (
      <>
        <Header />
        <div className={styles.container}>
          <p>Se încarcă datele...</p>
        </div>
      </>
    );

  }

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.titlu}>Materii Prime Disponibile</h1>

        {/* Search Bar */}
        <div className={styles.toolbar}>
          <input
            type="text"
            placeholder="Caută material..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {/* Add/Edit Form */}
        <form onSubmit={handleMaterialSubmit} className={styles.formular}>
          <div className={styles.formRow}>
            <input
              type="text"
              name="denumire"
              placeholder="Denumire material"
              value={nouMaterial.denumire}
              onChange={handleInputChange}
              className={styles.input}
              list="materiale-disponibile"
              required
            />
            <datalist id="materiale-disponibile">
              {materii.map((m) => (
                <option key={m.id} value={m.denumire} />
              ))}
            </datalist>

            <input
              type="number"
              name="cantitate"
              placeholder="Cantitate"
              value={nouMaterial.cantitate}
              onChange={handleInputChange}
              className={styles.input}
              step="0.01"
              min="0"
              required
            />

            <input
              type="text"
              name="unitate"
              placeholder="Unitate"
              value={nouMaterial.unitate}
              onChange={handleInputChange}
              className={styles.input}
              list="unitati-disponibile"
              required
            />
            <datalist id="unitati-disponibile">
              <option value="kg" />
              <option value="g" />
              <option value="l" />
              <option value="ml" />
              <option value="buc" />
              <option value="pachete" />
            </datalist>
          </div>

          <div className={styles.formButtons}>
            {editMode ? (
              <>
                <button type="submit" className={styles.buttonUpdate}>
                  Actualizează
                </button>
                <button 
                  type="button" 
                  className={styles.buttonCancel} 
                  onClick={cancelEditing}
                >
                  Anulează
                </button>
              </>
            ) : (
              <button type="submit" className={styles.button}>
                Adaugă
              </button>
            )}
          </div>
        </form>

        {/* Materials Table */}
        <div className={styles.tabelContainer}>
          <table className={styles.tabel}>
            <thead>
              <tr>
                <th className={styles.headerCell}>#</th>
                <th className={styles.headerCell}>Denumire</th>
                <th className={styles.headerCell}>Cantitate</th>
                <th className={styles.headerCell}>Unitate</th>
                <th className={styles.headerCell}>Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {filteredMaterials.length > 0 ? (
                filteredMaterials.map((material) => (
                  <tr key={material.id} className={styles.row}>
                    <td className={styles.cell}>{material.id}</td>
                    <td className={styles.cell}>{material.denumire}</td>
                    <td className={styles.cell}>{material.cantitate}</td>
                    <td className={styles.cell}>{material.unitate}</td>
                    <td className={styles.cellActions}>
                      <button
                        onClick={() => startEditing(material)}
                        className={styles.buttonEdit}
                      >
                        Editează
                      </button>
                      <button
                        onClick={() => deleteMaterial(material.id)}
                        className={styles.buttonDelete}
                      >
                        Șterge
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className={styles.noResults}>
                    {materii.length === 0 ? 
                      "Nu există materiale în stoc. Adăugați un material nou." : 
                      "Nu s-au găsit materiale care să corespundă căutării."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default MateriiPrime;
