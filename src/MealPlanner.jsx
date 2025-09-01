// src/MealPlanner.jsx
import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";

const jours = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];

function MealPlanner() {
  const [menus, setMenus] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const semaine = {};
        const querySnapshot = await getDocs(collection(db, "menus"));
        querySnapshot.forEach((docSnap) => {
          semaine[docSnap.id] = docSnap.data();
        });

        // Si vide → on initialise
        if (Object.keys(semaine).length === 0) {
          jours.forEach((jour) => {
            semaine[jour] = { dejeuner: "", diner: "" };
          });
        }

        setMenus(semaine);
      } catch (error) {
        console.error("Erreur de chargement :", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = async (jour, champ, valeur) => {
    const updated = {
      ...menus,
      [jour]: { ...menus[jour], [champ]: valeur },
    };
    setMenus(updated);
    await setDoc(doc(db, "menus", jour), updated[jour]);
  };

  return (
    <div>
      <h2>Planificateur de repas</h2>
      {jours.map((jour) => (
        <div key={jour} style={{ marginBottom: "1rem" }}>
          <h3>{jour}</h3>
          <input
            type="text"
            placeholder="Déjeuner"
            value={menus[jour]?.dejeuner || ""}
            onChange={(e) => handleChange(jour, "dejeuner", e.target.value)}
          />
          <input
            type="text"
            placeholder="Dîner"
            value={menus[jour]?.diner || ""}
            onChange={(e) => handleChange(jour, "diner", e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}

export default MealPlanner;