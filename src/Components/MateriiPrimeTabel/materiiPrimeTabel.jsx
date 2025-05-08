// components/MateriiPrimeTable.jsx
import React, { useEffect, useState } from "react";

const MateriiPrimeTabel = () => {
  const [materiiPrime, setMateriiPrime] = useState([]);

  useEffect(() => {
    const savedData = localStorage.getItem("materiiPrime");
    if (savedData) {
      setMateriiPrime(JSON.parse(savedData));
    }
  }, []);

  return (
    <div>
      <h2>Materii Prime</h2>
      <table>
        <thead>
          <tr>
            <th>Denumire</th>
            <th>Cantitate</th>
            <th>Unitate</th>
          </tr>
        </thead>
        <tbody>
          {materiiPrime.map((material) => (
            <tr key={material.id}>
              <td>{material.denumire}</td>
              <td>{material.cantitate}</td>
              <td>{material.unitate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MateriiPrimeTabel;
