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

  // Liste des courses modifiable
  const savedShoppingList = JSON.parse(localStorage.getItem("shoppingList")) || [
    "Tomates",
    "Poulet",
    "Pâtes",
    "Fromage",
  ];
  const [shoppingList, setShoppingList] = useState(savedShoppingList);
  const [newItem, setNewItem] = useState("");

  // Sauvegarder menus et liste de courses à chaque modification
  useEffect(() => {
    localStorage.setItem("meals", JSON.stringify(meals));
    localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
  }, [meals, shoppingList]);

  // Gestion des menus
  const handleChange = (day, type, value) => {
    setMeals((prev) => ({
      ...prev,
      [day]: { ...prev[day], [type]: value },
    }));
  };

  // Gestion de la liste des courses
  const addItem = () => {
    if (newItem.trim() !== "") {
      setShoppingList((prev) => [...prev, newItem.trim()]);
      setNewItem("");
    }
  };

  const removeItem = (index) => {
    setShoppingList((prev) => prev.filter((_, i) => i !== index));
  };

  const editItem = (index, value) => {
    setShoppingList((prev) =>
      prev.map((item, i) => (i === index ? value : item))
    );
  };

  // Bouton partager / copier
  const shareContent = () => {
    let text = "📅 Planning repas\n\n";
    for (const [day, meal] of Object.entries(meals)) {
      text += `${day}: Déj. ${meal.dejeuner} | Dîner ${meal.diner}\n`;
    }
    text += "\n🛒 Liste des courses:\n";
    shoppingList.forEach((item) => {
      text += `- ${item}\n`;
    });

    navigator.clipboard.writeText(text)
      .then(() => alert("Le planning et la liste ont été copiés !"))
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

      <h2>Liste des courses</h2>
      <ul>
        {shoppingList.map((item, index) => (
          <li key={index}>
            <input
              type="text"
              value={item}
              onChange={(e) => editItem(index, e.target.value)}
            />
            <button onClick={() => removeItem(index)}>Supprimer</button>
          </li>
        ))}
      </ul>
      <input
        type="text"
        placeholder="Nouvel item"
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
      />
      <button onClick={addItem}>Ajouter</button>

      <div style={{ marginTop: "20px" }}>
        <button onClick={shareContent}>Copier le planning + liste</button>
      </div>
    </div>
  );
}