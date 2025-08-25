import React from "react";
import ReactDOM from "react-dom/client";
import MealPlanner from "./MealPlanner.jsx"; // on importe ton fichier

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MealPlanner />
  </React.StrictMode>
);