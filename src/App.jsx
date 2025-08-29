import React, { useState } from "react";
import Menus from "./Menus";
import ShoppingList from "./ShoppingList";

function App() {
  const [activeTab, setActiveTab] = useState("menus");

  return (
    <div>
      <nav>
        <button onClick={() => setActiveTab("menus")}>📅 Menus</button>
        <button onClick={() => setActiveTab("shopping")}>🛒 Liste de courses</button>
      </nav>

      <div>
        {activeTab === "menus" && <Menus />}
        {activeTab === "shopping" && <ShoppingList />}
      </div>
    </div>
  );
}

export default App;