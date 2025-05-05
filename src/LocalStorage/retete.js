// retete.js

// Salvează o rețetă nouă
export const salveazaReteta = (retetaNoua) => {
    const retete = JSON.parse(localStorage.getItem('retete')) || [];
    retete.push(retetaNoua);
    localStorage.setItem('retete', JSON.stringify(retete));
  };
  
  // Citește toate rețetele
  export const iaToateRetetele = () => {
    return JSON.parse(localStorage.getItem('retete')) || [];
  };
  
  // Șterge o rețetă după nume
  export const stergeReteta = (nume) => {
    const retete = JSON.parse(localStorage.getItem('retete')) || [];
    const filtrate = retete.filter((reteta) => reteta.nume !== nume);
    localStorage.setItem('retete', JSON.stringify(filtrate));
  };
  
  // Șterge toate rețetele (resetare)
  export const reseteazaRetete = () => {
    localStorage.removeItem('retete');
  };
  