import React from 'react';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MateriiPrime from './Components/MateriiPrime/materiiPrime';
import Productie from './Components/Productie/productie';
import Ambalare from './Components/Ambalare/ambalare';
import Depozitare from './Components/Depozitare/depozitare';
import Rebuturi from './Components/Rebuturi/rebuturi';
import reteteInitiale from './LocalStorage/reteteInitiale';
// import MateriiPrimeTabel from './Components/MateriiPrimeTabel/materiiPrimeTabel';   

import Home from './pagini/home';

const App = () => {
  const [retete, setRetete] = useState([]);

  useEffect(() => {
    // Resetăm complet localStorage pentru rețete pentru a evita duplicate sau probleme
    localStorage.removeItem('retete');
    
    // Salvăm direct rețetele inițiale într-o singură operație
    localStorage.setItem('retete', JSON.stringify(reteteInitiale));
    console.log('Rețete inițiale încărcate direct:', reteteInitiale.length);
    
    // Actualizăm starea
    setRetete(reteteInitiale);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home retete={retete}/>} />
        <Route path="/materii-prime" element={<MateriiPrime />} />
        <Route path="/productie" element={<Productie retete={retete} />} />
        <Route path="/ambalare" element={<Ambalare />} />
        <Route path="/depozitare" element={<Depozitare />} />
        <Route path="/rebuturi" element={<Rebuturi />} />
        {/* <Route path="/materii-prime-tabel" element={<MateriiPrimeTabel />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
