import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const repas = ["Déjeuner", "Dîner"];

const MealPlanner = () => {
  const [menus, setMenus] = useState(
    jours.reduce((acc, jour) => {
      acc[jour] = { Déjeuner: "", Dîner: "" };
      return acc;
    }, {})
  );

  // Charger les menus depuis Firestore
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const ref = doc(db, "mealPlanner", "menus");
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();

          // Vérifie que chaque jour contient bien Déjeuner et Dîner
          const completeData = jours.reduce((acc, jour) => {
            acc[jour] = {
              Déjeuner: data[jour]?.Déjeuner || "",
              Dîner: data[jour]?.Dîner || "",
            };
            return acc;
          }, {});

          setMenus(completeData);
        }
      } catch (error) {
        console.error("Erreur de chargement :", error);
      }
    };
    fetchMenus();
  }, []);

  // Sauvegarde automatique quand on modifie un champ
  const handleChange = async (jour, r, value) => {
    const updatedMenus = {
      ...menus,
      [jour]: { ...menus[jour], [r]: value },
    };
    setMenus(updatedMenus);

    const ref = doc(db, "mealPlanner", "menus");
    await setDoc(ref, updatedMenus);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Planificateur de menus</h2>
      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th className="border p-2">Jour</th>
            {repas.map((r) => (
              <th key={r} className="border p-2">{r}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {jours.map((jour) => (
            <tr key={jour}>
              <td className="border p-2 font-semibold">{jour}</td>
              {repas.map((r) => (
                <td key={r} className="border p-2">
                  <input
                    type="text"
                    value={menus[jour][r]}
                    onChange={(e) => handleChange(jour, r, e.target.value)}
                    className="w-full border p-1"
                    placeholder={`Ajouter ${r}`}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MealPlanner;