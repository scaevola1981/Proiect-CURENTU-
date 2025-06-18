import React, { useEffect, useState } from "react";
import { adaugaSauSuplimenteazaMaterial, getMateriiPrime } from "../../LocalStorage/materiale";
import styles from "./materiiPrime.module.css";
import Header from "../Header/header";

const MateriiPrime = () => {
  const [materii, setMaterii] = useState([]);
  const [nouMaterial, setNouMaterial] = useState({
    denumire: "",
    cantitate: "",
    unitate: "",
    producator: "",
    codProdus: "",
    lot: "",
    tip: "",
    subcategorie: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Load materials from localStorage on component mount
  useEffect(() => {
    const loadMaterials = () => {
      setIsLoading(true);
      try {
        const storedMaterials = getMateriiPrime(); // Use utility function
        if (storedMaterials && Array.isArray(storedMaterials)) {
          const sortedMaterials = [...storedMaterials].sort((a, b) => a.id - b.id);
          setMaterii(sortedMaterials);
        } else {
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

    // Validate required fields
    if (!nouMaterial.denumire || !nouMaterial.cantitate || !nouMaterial.unitate) {
      alert("Denumire, Cantitate și Unitate sunt obligatorii!");
      return;
    }

    const cantitate = parseFloat(nouMaterial.cantitate);
    if (isNaN(cantitate) || cantitate <= 0) {
      alert("Cantitatea trebuie să fie un număr pozitiv!");
      return;
    }

    try {
      // Add or update material using utility function
      adaugaSauSuplimenteazaMaterial({
        id: editMode ? nouMaterial.id : undefined, // Include ID for updates
        denumire: nouMaterial.denumire,
        cantitate: cantitate,
        unitate: nouMaterial.unitate,
        producator: nouMaterial.producator,
        codProdus: nouMaterial.codProdus,
        lot: nouMaterial.lot,
        tip: nouMaterial.tip,
        subcategorie: nouMaterial.subcategorie,
      });

      // Refresh materials list
      setMaterii(getMateriiPrime());
      setNouMaterial({
        denumire: "",
        cantitate: "",
        unitate: "",
        producator: "",
        codProdus: "",
        lot: "",
        tip: "",
        subcategorie: "",
      });
      setEditMode(false);
    } catch (error) {
      console.error("Error saving material:", error);
      alert("A apărut o eroare la salvarea materialului!");
    }
  };

  // Delete material
  const deleteMaterial = (id) => {
    if (window.confirm("Sigur doriți să ștergeți acest material?")) {
      try {
        const updatedMaterials = materii.filter((m) => m.id !== id);
        localStorage.setItem("materiiPrime", JSON.stringify(updatedMaterials));
        setMaterii(updatedMaterials);
      } catch (error) {
        console.error("Error deleting material:", error);
        alert("A apărut o eroare la ștergerea materialului!");
      }
    }
  };

  // Delete all materials
  const deleteAllMaterials = () => {
    if (window.confirm("Sigur doriți să ștergeți TOATE materialele? Această acțiune este ireversibilă!")) {
      try {
        localStorage.setItem("materiiPrime", JSON.stringify([]));
        setMaterii([]);
        setEditMode(false);
        setNouMaterial({
          denumire: "",
          cantitate: "",
          unitate: "",
          producator: "",
          codProdus: "",
          lot: "",
          tip: "",
          subcategorie: "",
        });
        alert("Toate materialele au fost șterse!");
      } catch (error) {
        console.error("Error deleting all materials:", error);
        alert("A apărut o eroare la ștergerea tuturor materialelor!");
      }
    }
  };

  // Start editing material
  const startEditing = (material) => {
    setNouMaterial({
      id: material.id,
      denumire: material.denumire,
      cantitate: material.cantitate.toString(),
      unitate: material.unitate,
      producator: material.producator || "",
      codProdus: material.codProdus || "",
      lot: material.lot || "",
      tip: material.tip || "",
      subcategorie: material.subcategorie || "",
    });
    setEditMode(true);
  };

  // Cancel editing
  const cancelEditing = () => {
    setNouMaterial({
      denumire: "",
      cantitate: "",
      unitate: "",
      producator: "",
      codProdus: "",
      lot: "",
      tip: "",
      subcategorie: "",
    });
    setEditMode(false);
  };

  // Filter materials based on search term
  const filteredMaterials = materii.filter((material) =>
    material.denumire.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.producator?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.codProdus?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.lot?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.tip?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.subcategorie?.toLowerCase().includes(searchTerm.toLowerCase())
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

        {/* Toolbar with Search and Delete All Button */}
        <div className={styles.toolbar}>
          <input
            type="text"
            placeholder="Caută material..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <button
            className={styles.buttonDelete}
            onClick={deleteAllMaterials}
            title="Șterge toate materialele"
          >
            Șterge Toate
          </button>
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

            <input
              type="text"
              name="producator"
              placeholder="Producător"
              value={nouMaterial.producator}
              onChange={handleInputChange}
              className={styles.input}
            />

            <input
              type="text"
              name="codProdus"
              placeholder="Cod produs"
              value={nouMaterial.codProdus}
              onChange={handleInputChange}
              className={styles.input}
            />

            <input
              type="text"
              name="lot"
              placeholder="Lot"
              value={nouMaterial.lot}
              onChange={handleInputChange}
              className={styles.input}
            />

            <input
              type="text"
              name="tip"
              placeholder="Tip"
              value={nouMaterial.tip}
              onChange={handleInputChange}
              className={styles.input}
            />

            <input
              type="text"
              name="subcategorie"
              placeholder="Subcategorie"
              value={nouMaterial.subcategorie}
              onChange={handleInputChange}
              className={styles.input}
            />
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
                <th className={styles.headerCell}>Producător</th>
                <th className={styles.headerCell}>Cod Produs</th>
                <th className={styles.headerCell}>Lot</th>
                <th className={styles.headerCell}>Tip</th>
                <th className={styles.headerCell}>Subcategorie</th>
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
                    <td className={styles.cell}>{material.producator || "-"}</td>
                    <td className={styles.cell}>{material.codProdus || "-"}</td>
                    <td className={styles.cell}>{material.lot || "-"}</td>
                    <td className={styles.cell}>{material.tip || "-"}</td>
                    <td className={styles.cell}>{material.subcategorie || "-"}</td>
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
                  <td colSpan="10" className={styles.noResults}>
                    {materii.length === 0
                      ? "Nu există materiale în stoc. Adăugați un material nou."
                      : "Nu s-au găsit materiale care să corespundă căutării."}
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