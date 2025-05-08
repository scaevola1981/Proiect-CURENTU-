import reteteInitiale from './reteteInitiale';

// Salvează o rețetă nouă
export const salveazaReteta = (retetaNoua) => {
  // Obținem rețetele existente sau inițializăm un array gol
  const retete = JSON.parse(localStorage.getItem('retete')) || [];
  // Adăugăm rețeta nouă
  retete.push(retetaNoua);
  // Salvăm array-ul actualizat în localStorage
  localStorage.setItem('retete', JSON.stringify(retete));
  console.log(`Rețeta "${retetaNoua.nume}" a fost salvată cu succes.`);
  return retete; // Returnăm array-ul actualizat pentru ușurința utilizării
};

// Citește toate rețetele
export const iaToateRetetele = () => {
  try {
    const reteteSalvate = localStorage.getItem('retete');
    
    // Dacă există rețete în localStorage, le returnăm
    if (reteteSalvate) {
      const reteteArray = JSON.parse(reteteSalvate);
      console.log(`${reteteArray.length} rețete găsite în localStorage.`);
      return reteteArray;
    }
    
    // Dacă nu există rețete în localStorage, returnăm rețetele inițiale
    console.log('Nu există rețete în localStorage, se returnează rețetele inițiale.');
    return reteteInitiale;
  } catch (error) {
    console.error('Eroare la citirea rețetelor:', error);
    return reteteInitiale; // În caz de eroare, returnăm rețetele inițiale
  }
};

// Șterge o rețetă după nume
export const stergeReteta = (nume) => {
  const retete = JSON.parse(localStorage.getItem('retete')) || [];
  const filtrate = retete.filter((reteta) => reteta.nume !== nume);
  localStorage.setItem('retete', JSON.stringify(filtrate));
  console.log(`Rețeta "${nume}" a fost ștearsă.`);
  return filtrate; // Returnăm array-ul actualizat
};

// Șterge toate rețetele (resetare)
export const reseteazaRetete = () => {
  localStorage.removeItem('retete');
  console.log('Toate rețetele au fost șterse din localStorage.');
};

// 🔁 Încarcă rețetele oficiale în localStorage
export const incarcaReteteleInitiale = () => {
  // Mai întâi resetăm rețetele
  reseteazaRetete();
  // Apoi salvăm rețetele inițiale
  localStorage.setItem('retete', JSON.stringify(reteteInitiale));
  console.log(`${reteteInitiale.length} rețete inițiale au fost încărcate în localStorage.`);
  return reteteInitiale; // Returnăm rețetele inițiale pentru confirmare
};

  

  