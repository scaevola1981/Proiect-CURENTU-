


export const scadeDinStoc = (materialeConsumate) => {
    const stoc = JSON.parse(localStorage.getItem('materiiPrime')) || [];
    const stocActualizat = [...stoc];
  
    materialeConsumate.forEach(materialConsumat => {
      const indexInStoc = stocActualizat.findIndex(
        item => item.denumire.toLowerCase().trim() === materialConsumat.denumire.toLowerCase().trim() &&
                item.unitate.toLowerCase().trim() === materialConsumat.unitate.toLowerCase().trim()
      );
  
      if (indexInStoc !== -1) {
        const cantitateRamasa = parseFloat((stocActualizat[indexInStoc].cantitate - materialConsumat.cantitate).toFixed(2));
        stocActualizat[indexInStoc].cantitate = Math.max(0, cantitateRamasa);
  
        if (stocActualizat[indexInStoc].cantitate === 0) {
          console.warn(`Stocul pentru ${materialConsumat.denumire} (${materialConsumat.unitate}) s-a epuizat!`);
        } else if (stocActualizat[indexInStoc].cantitate < 5) {
          console.warn(`Stoc scăzut pentru ${materialConsumat.denumire} (${materialConsumat.unitate}): ${stocActualizat[indexInStoc].cantitate}`);
        }
      } else {
        console.error(`Materialul ${materialConsumat.denumire} (${materialConsumat.unitate}) nu a fost găsit în stoc!`);
      }
    });
  
    localStorage.setItem('materiiPrime', JSON.stringify(stocActualizat));
    return stocActualizat;
  };
  