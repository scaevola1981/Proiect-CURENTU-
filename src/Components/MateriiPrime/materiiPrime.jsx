import React, { useEffect, useState } from "react";
import "../../LocalStorage/materiale"; // inițializează dacă e gol
import styles from "./materiiPrime.module.css";

const MateriiPrime = () => {
  const [materii, setMaterii] = useState([]);
  const [nouMaterial, setNouMaterial] = useState({
    denumire: "",
    cantitate: "",
    unitate: "",
  });

  useEffect(() => {
    const stocate = localStorage.getItem("materiiPrime");
    if (stocate) {
      setMaterii(JSON.parse(stocate));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNouMaterial({ ...nouMaterial, [name]: value });
  };

  const adaugaMaterial = (e) => {
    e.preventDefault();
    if (!nouMaterial.denumire || !nouMaterial.cantitate || !nouMaterial.unitate) return;

    const idNou = materii.length ? materii[materii.length - 1].id + 1 : 1;
    const nou = { ...nouMaterial, id: idNou, cantitate: parseFloat(nouMaterial.cantitate) };

    const actualizat = [...materii, nou];
    setMaterii(actualizat);
    localStorage.setItem("materiiPrime", JSON.stringify(actualizat));

    setNouMaterial({ denumire: "", cantitate: "", unitate: "" });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.titlu}>Materii Prime Disponibile</h1>

      <form onSubmit={adaugaMaterial} className={styles.formular}>
        <input
          type="text"
          name="denumire"
          placeholder="Denumire"
          value={nouMaterial.denumire}
          onChange={handleInputChange}
          className={styles.input}
        />
        <input
          type="number"
          name="cantitate"
          placeholder="Cantitate"
          value={nouMaterial.cantitate}
          onChange={handleInputChange}
          className={styles.input}
        />
        <input
          type="text"
          name="unitate"
          placeholder="Unitate"
          value={nouMaterial.unitate}
          onChange={handleInputChange}
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          Adaugă
        </button>
      </form>

      <table className={styles.tabel}>
        <thead>
          <tr>
            <th className={styles.headerCell}>#</th>
            <th className={styles.headerCell}>Denumire</th>
            <th className={styles.headerCell}>Cantitate</th>
            <th className={styles.headerCell}>Unitate</th>
          </tr>
        </thead>
        <tbody>
          {materii.map((m) => (
            <tr key={m.id} className={styles.row}>
              <td className={styles.cell}>{m.id}</td>
              <td className={styles.cell}>{m.denumire}</td>
              <td className={styles.cell}>{m.cantitate}</td>
              <td className={styles.cell}>{m.unitate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MateriiPrime;