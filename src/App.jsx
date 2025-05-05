import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MateriiPrime from './Components/MateriiPrime/materiiPrime';
import Productie from './Components/Productie/productie';
import Ambalare from './Components/Ambalare/ambalare';
import Depozitare from './Components/Depozitare/depozitare';
import Rebuturi from './Components/Rebuturi/rebuturi';

import Home from './pagini/home';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/materii-prime" element={<MateriiPrime />} />
        <Route path="/productie" element={<Productie />} />
        <Route path="/ambalare" element={<Ambalare />} />
        <Route path="/depozitare" element={<Depozitare />} />
        <Route path="/rebuturi" element={<Rebuturi />} />
      </Routes>
    </Router>
  );
};

export default App;
