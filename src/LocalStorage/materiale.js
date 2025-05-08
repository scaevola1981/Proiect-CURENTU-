// LocalStorage/materiale.js

// Verificăm dacă există deja materiale în LocalStorage
// Dacă nu, inițializăm cu câteva materiale implicite
if (!localStorage.getItem("materiiPrime")) {
    const materialeImplicite = [
      {
        id: 1,
        denumire: "Malt Pale Ale",
        cantitate: 300,
        unitate: "kg"
      },
      {
        id: 2,
        denumire: "Malt",
        cantitate: 300,
        unitate: "kg"
      },
      {
        id: 3,
        denumire: "Drojdie Fermentis BE-256",
        cantitate: 80,
        unitate: "kg"
      },
      {
        id: 4,
        denumire: "Dropie Fermentis F-2",
        cantitate: 50,
        unitate: "kg"
      },
      {
        id: 5,
        denumire: "Hamei AMAREALA",
        cantitate: 50,
        unitate: "kg"
      },
      {
        id: 6,
        denumire: "Hamei AROMA",
        cantitate: 30,
        unitate: "kg"
      },
      {
        id: 7,
        denumire: "Irish moss",
        cantitate: 20,
        unitate: "pachete"
      },
   
      {
        id: 8,
        denumire: "Zahăr brun",
        cantitate: 25,
        unitate: "kg"
      }
    ];
  
    localStorage.setItem("materiiPrime", JSON.stringify(materialeImplicite));
  }
  
  export default {};
  