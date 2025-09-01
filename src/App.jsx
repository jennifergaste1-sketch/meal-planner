import { useState } from "react";
import MealPlanner from "./MealPlanner";
import ShoppingList from "./ShoppingList";

function App() {
  const [activeTab, setActiveTab] = useState("menus");

  return (
    <div className="app">
      <h1>🍽️ Planificateur de repas</h1>

      {/* Navigation */}
      <nav style={{ marginBottom: "20px" }}>
        <button onClick={() => setActiveTab("menus")}>Menus</button>
        <button onClick={() => setActiveTab("courses")}>Courses</button>
      </nav>

      {/* Contenu */}
      {activeTab === "menus" && <MealPlanner />}
      {activeTab === "courses" && <ShoppingList />}
    </div>
  );
}

export default App;