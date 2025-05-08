import { useState, useEffect } from 'react';
import { MateriiPrimeContext } from '../contexts/MateriiPrimeContext';

export const MateriiPrimeProvider = ({ children }) => {
  const [materiiPrime, setMateriiPrime] = useState([]);

  useEffect(() => {
    const stocate = localStorage.getItem('materiiPrime');
    if (stocate) {
      setMateriiPrime(JSON.parse(stocate));
    }
  }, []);

  // Save to localStorage on update
  useEffect(() => {
    localStorage.setItem('materiiPrime', JSON.stringify(materiiPrime));
  }, [materiiPrime]);

  return (
    <MateriiPrimeContext.Provider value={{ materiiPrime, setMateriiPrime }}>
      {children}
    </MateriiPrimeContext.Provider>
  );
};
