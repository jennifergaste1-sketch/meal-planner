import { useState, useEffect } from "react";

export default function MealPlanner() {
  // Récupérer les menus depuis le localStorage ou mettre par défaut
  const savedMeals = JSON.parse(localStorage.getItem("meals")) || {
    Lundi: { dejeuner: "Poulet rôti", diner: "Soupe de légumes" },
    Mardi: { dejeuner: "Pâtes bolognaises", diner: "Salade composée" },
    Mercredi: { dejeuner: "Poisson au four", diner: "Omelette" },
    Jeudi: { dejeuner: "Quiche lorraine", diner: "Riz sauté" },
    Vendredi: { dejeuner: "Pizza maison", diner: "Salade grecque" },
    Samedi: { dejeuner: "Hamburger", diner: "Tacos" },
    Dimanche: { dejeuner: "Lasagnes", diner: "Gratin dauphinois" },
  };

  const [meals, setMeals] = useState(savedMeals);

  // Sauvegarder les menus à chaque modification
  useEffect(() => {
    localStorage.setItem("meals", JSON.stringify(meals));
  }, [meals]);

  const handleChange = (day, type, value) => {
    setMeals((prev) => ({
      ...prev,
      [day]: { ...prev[day], [type]: value },
    }));
  };

  const shareContent = () => {
    let text = "📅 Planning repas\n\n";
    for (const [day, meal] of Object.entries(meals)) {
      text += `${day}: Déj. ${meal.dejeuner} | Dîner ${meal.diner}\n`;
    }
    navigator.clipboard.writeText(text)
      .then(() => alert("Le planning a été copié dans le presse-papier !"))
      .catch(() => alert("Impossible de copier dans le presse-papier"));
  };

  return (
    <div>
      <h1>Planning des repas</h1>
      {Object.entries(meals).map(([day, meal]) => (
        <div key={day} style={{ marginBottom: "15px" }}>
          <h2>{day}</h2>
          <label>Déjeuner: </label>
          <input
            type="text"
            value={meal.dejeuner}
            onChange={(e) => handleChange(day, "dejeuner", e.target.value)}
          />
          <label>Dîner: </label>
          <input
            type="text"
            value={meal.diner}
            onChange={(e) => handleChange(day, "diner", e.target.value)}
          />
        </div>
      ))}
      <button onClick={shareContent}>Copier le planning</button>
    </div>
  );
}