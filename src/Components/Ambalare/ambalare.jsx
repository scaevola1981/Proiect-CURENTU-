import React from "react";
import styles from "../../pagini/home.module.css"; // Import shared styles

const Ambalare = () => {
  const items = [
    {
      id: 1,
      name: "Box",
      description: "A sturdy cardboard box for packaging.",
    },
    {
      id: 2,
      name: "Bubble Wrap",
      description: "Protective material for fragile items.",
    },
    {
      id: 3,
      name: "Tape",
      description: "Strong adhesive tape for sealing packages.",
    },
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.subtitle}>Ambalare</h1>
      <p>
        Explore our packaging options to ensure your items are safe and secure.
      </p>
      <ul className={styles.grid}>
        {items.map((item) => (
          <li key={item.id} className={styles.card}>
            <h2 className={styles.cardTitle}>{item.name}</h2>
            <p>{item.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Ambalare;
