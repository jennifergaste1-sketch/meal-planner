import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

const daysOfWeek = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];

const Menus = () => {
  const [meals, setMeals] = useState({});

  // Charger depuis Firestore
  useEffect(() => {
    const fetchMeals = async () => {
      const mealsData = {};
      for (let day of daysOfWeek) {
        const querySnapshot = await getDocs(collection(db, "meals", day, "items"));
        mealsData[day] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      }
      setMeals(mealsData);
    };
    fetchMeals();
  }, []);

  // Ajouter un repas
  const addMeal = async (day, mealName) => {
    if (!mealName.trim()) return;
    const docRef = await addDoc(collection(db, "meals", day, "items"), {
      name: mealName,
    });
    setMeals((prev) => ({
      ...prev,
      [day]: [...(prev[day] || []), { id: docRef.id, name: mealName }],
    }));
  };

  // Supprimer un repas
  const deleteMeal = async (day, id) => {
    await deleteDoc(doc(db, "meals", day, "items", id));
    setMeals((prev) => ({
      ...prev,
      [day]: prev[day].filter((meal) => meal.id !== id),
    }));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>🗓️ Planning des repas de la semaine</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "20px",
        }}
      >
        {daysOfWeek.map((day) => (
          <div
            key={day}
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "10px",
              background: "#f9f9f9",
            }}
          >
            <h2>{day}</h2>
            <ul>
              {(meals[day] || []).map((meal) => (
                <li key={meal.id} style={{ marginBottom: "5px" }}>
                  {meal.name}
                  <button
                    onClick={() => deleteMeal(day, meal.id)}
                    style={{
                      marginLeft: "10px",
                      background: "red",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      padding: "2px 5px",
                      cursor: "pointer",
                    }}
                  >
                    ❌
                  </button>
                </li>
              ))}
            </ul>
            <input
              type="text"
              placeholder="Ajouter un repas"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addMeal(day, e.target.value);
                  e.target.value = "";
                }
              }}
              style={{
                padding: "5px",
                width: "90%",
                marginTop: "5px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menus;