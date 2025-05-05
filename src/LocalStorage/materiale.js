// localStorage/materiale.js

const materiiPrime = [
    {
      id: 1,
      denumire: "Malț Pale",
      unitate: "kg",
      cantitate: 100
    },
    {
      id: 2,
      denumire: "Malț Caramel",
      unitate: "kg",
      cantitate: 50
    },
    {
      id: 3,
      denumire: "Hamei Saaz",
      unitate: "g",
      cantitate: 2000
    },
    {
      id: 4,
      denumire: "Hamei Cascade",
      unitate: "g",
      cantitate: 1500
    },
    {
      id: 5,
      denumire: "Drojdie Ale",
      unitate: "kg",
      cantitate: 10
    },
    {
      id: 6,
      denumire: "Apa",
      unitate: "L",
      cantitate: 10000
    },
    {
      id: 7,
      denumire: "Zahăr pentru carbonatare",
      unitate: "kg",
      cantitate: 20
    }
  ];
  
  // Salvează doar dacă nu există deja în localStorage
  if (!localStorage.getItem("materiiPrime")) {
    localStorage.setItem("materiiPrime", JSON.stringify(materiiPrime));
  }
  
  export default materiiPrime;
  