import React, { useState, useEffect } from "react";

const suggestions = [
  "Pâtes bolognaises",
  "Salade composée",
  "Poulet rôti",
  "Soupe de légumes",
  "Pizza maison",
  "Poisson au four",
  "Curry de légumes",
  "Burgers maison",
  "Tacos",
  "Quiche lorraine",
];

export default function MealPlanner() {
  // Charger depuis le localStorage au démarrage
  const [meals, setMeals] = useState(() => {
    const saved = localStorage.getItem("meals");
    return saved
      ? JSON.parse(saved)
      : {
          Lundi: { déjeuner: "", dîner: "" },
          Mardi: { déjeuner: "", dîner: "" },
          Mercredi: { déjeuner: "", dîner: "" },
          Jeudi: { déjeuner: "", dîner: "" },
          Vendredi: { déjeuner: "", dîner: "" },
          Samedi: { déjeuner: "", dîner: "" },
          Dimanche: { déjeuner: "", dîner: "" },
        };
  });

  const [shoppingList, setShoppingList] = useState(() => {
    const saved = localStorage.getItem("shoppingList");
    return saved ? JSON.parse(saved) : [];
  });

  // Sauvegarde automatique
  useEffect(() => {
    localStorage.setItem("meals", JSON.stringify(meals));
  }, [meals]);

  useEffect(() => {
    localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
  }, [shoppingList]);

  // Modifier un repas
  const handleMealChange = (day, type, value) => {
    setMeals({
      ...meals,
      [day]: { ...meals[day], [type]: value },
    });
  };

  // Suggestion aléatoire
  const suggestMeal = (day, type) => {
    const random = suggestions[Math.floor(Math.random() * suggestions.length)];
    handleMealChange(day, type, random);
  };

  // Gestion de la liste de courses
  const addItem = () => {
    const item = prompt("Ajouter un ingrédient :");
    if (item) {
      setShoppingList([...shoppingList, { text: item, done: false }]);
    }
  };

  const toggleItem = (index) => {
    const newList = [...shoppingList];
    newList[index].done = !newList[index].done;
    setShoppingList(newList);
  };

  const deleteItem = (index) => {
    setShoppingList(shoppingList.filter((_, i) => i !== index));
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>🍴 Planificateur de repas</h1>

      {Object.keys(meals).map((day) => (
        <div
          key={day}
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "10px",
            marginBottom: "15px",
            background: "#f9f9f9",
          }}
        >
          <h2>{day}</h2>
          <div>
            <strong>Déjeuner :</strong>
            <input
              type="text"
              value={meals[day].déjeuner}
              onChange={(e) =>
                handleMealChange(day, "déjeuner", e.target.value)
              }
              style={{ marginLeft: "10px" }}
            />
            <button onClick={() => suggestMeal(day, "déjeuner")}>
              🎲 Suggestion
            </button>
          </div>
          <div style={{ marginTop: "5px" }}>
            <strong>Dîner :</strong>
            <input
              type="text"
              value={meals[day].dîner}
              onChange={(e) => handleMealChange(day, "dîner", e.target.value)}
              style={{ marginLeft: "33px" }}
            />
            <button onClick={() => suggestMeal(day, "dîner")}>
              🎲 Suggestion
            </button>
          </div>
        </div>
      ))}

      <h2>🛒 Liste de courses</h2>
      <ul>
        {shoppingList.map((item, index) => (
          <li key={index} style={{ marginBottom: "5px" }}>
            <input
              type="checkbox"
              checked={item.done}
              onChange={() => toggleItem(index)}
            />
            <span
              style={{
                marginLeft: "8px",
                textDecoration: item.done ? "line-through" : "none",
              }}
            >
              {item.text}
            </span>
            <button
              onClick={() => deleteItem(index)}
              style={{ marginLeft: "10px", color: "red" }}
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
      <button onClick={addItem}>➕ Ajouter un ingrédient</button>
    </div>
  );
}