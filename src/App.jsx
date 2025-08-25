import React, { useState } from "react";
import MealPlanner from "./MealPlanner";
import Inventory from "./Inventory";
import ShoppingList from "./ShoppingList"; // si tu as déjà séparé la liste de courses

function App() {
  const [activeTab, setActiveTab] = useState("planning");

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* Onglets */}
      <div className="flex mb-4 border-b">
        <button
          onClick={() => setActiveTab("planning")}
          className={`flex-1 py-2 text-center ${
            activeTab === "planning" ? "border-b-2 border-blue-500 font-bold" : ""
          }`}
        >
          📅 Planning
        </button>
        <button
          onClick={() => setActiveTab("shopping")}
          className={`flex-1 py-2 text-center ${
            activeTab === "shopping" ? "border-b-2 border-blue-500 font-bold" : ""
          }`}
        >
          🛒 Courses
        </button>
        <button
          onClick={() => setActiveTab("inventory")}
          className={`flex-1 py-2 text-center ${
            activeTab === "inventory" ? "border-b-2 border-blue-500 font-bold" : ""
          }`}
        >
          🍳 Inventaire
        </button>
      </div>

      {/* Contenu selon l’onglet */}
      <div>
        {activeTab === "planning" && <MealPlanner />}
        {activeTab === "shopping" && <ShoppingList />}
        {activeTab === "inventory" && <Inventory />}
      </div>
    </div>
  );
}

export default App;