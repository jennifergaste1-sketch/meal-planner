import React, { useState } from "react";

const MealPlanner = () => {
  // Exemple de planning (déjeuner et dîner uniquement)
  const [meals] = useState({
    Lundi: { dejeuner: "Escalope poulet sauce crème pâtes", diner: "Saucisses purée" },
    Mardi: { dejeuner: "Sandwich jambon dinde fromage fondu", diner: "Steak haché haricots vert" },
    Mercredi: { dejeuner: "Cordons bleus semoule", diner: "Blans de poulet sauce curry riz" },
    Jeudi: { dejeuner: "Salade thon maïs tomates oeuf", diner: "Escalope poulet poêlée de légumes" },
    Vendredi: { dejeuner: "A définir", diner: "A définir" },
    Samedi: { dejeuner: "A définir", diner: "Pizza maison" },
    Dimanche: { dejeuner: "A définir", diner: "A définir" },
  });

  // Générer une liste de courses simple
  const [shoppingList] = useState([
    "Poulet",
    "Carottes",
    "Pâtes",
    "Tomates",
    "Fromage",
    "Laitue",
    "Oignons",
  ]);

  // Fonction de partage
  const shareContent = async () => {
    let text = "🗓️ Planning repas (Déjeuner & Dîner)\n\n";
    for (const [day, meal] of Object.entries(meals)) {
      text += `${day} : Déj. ${meal.dejeuner} | Dîner ${meal.diner}\n`;
    }
    text += "\n🛒 Liste de courses :\n" + shoppingList.join(", ");

    if (navigator.share) {
      try {
        await navigator.share({ title: "Planning Repas", text });
      } catch (err) {
        alert("Partage annulé.");
      }
    } else {
      alert("Le partage n'est pas supporté sur ce navigateur.");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>🍽️ Planning des repas</h1>

      {/* Affichage du planning */}
      {Object.entries(meals).map(([day, meal]) => (
        <div key={day}>
          <h2>{day}</h2>
          <p>Déjeuner : {meal.dejeuner}</p>
          <p>Dîner : {meal.diner}</p>
        </div>
      ))}

      <h2>🛒 Liste de courses</h2>
      <ul>
        {shoppingList.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      {/* Bouton de partage */}
      <button
        onClick={shareContent}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        📤 Partager
      </button>
    </div>
  );
};

export default MealPlanner;