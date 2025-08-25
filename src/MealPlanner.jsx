import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";

const MealPlanner = () => {
  const [meals, setMeals] = useState({});
  const [items, setItems] = useState([]); // 🔹 Liste de courses
  const [newItem, setNewItem] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔹 Charger repas + courses depuis Firebase
  useEffect(() => {
    const unsubMeals = onSnapshot(collection(db, "meals"), (snapshot) => {
      const data = {};
      snapshot.forEach((doc) => {
        data[doc.id] = doc.data().meal;
      });
      setMeals(data);
    });

    const unsubItems = onSnapshot(collection(db, "shopping"), (snapshot) => {
      const list = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setItems(list);
      setLoading(false);
    });

    return () => {
      unsubMeals();
      unsubItems();
    };
  }, []);

  // 🔹 Modifier un repas
  const updateMeal = async (day, type, value) => {
    const mealId = `${day}-${type}`;
    setMeals((prev) => ({ ...prev, [mealId]: value }));

    await setDoc(doc(db, "meals", mealId), {
      meal: value,
    });
  };

  // 🔹 Ajouter un article dans la liste de courses
  const addItem = async () => {
    if (!newItem.trim()) return;
    const id = newItem.toLowerCase().replace(/\s+/g, "-");
    await setDoc(doc(db, "shopping", id), {
      name: newItem,
      done: false,
    });
    setNewItem("");
  };

  // 🔹 Marquer comme fait / non fait
  const toggleItem = async (id, done) => {
    await setDoc(doc(db, "shopping", id), { done: !done }, { merge: true });
  };

  // 🔹 Supprimer un article
  const deleteItem = async (id) => {
    await deleteDoc(doc(db, "shopping", id));
  };

  const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
  const types = ["Déjeuner", "Dîner"];

  if (loading) return <p className="text-center mt-4">Chargement...</p>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">🍽️ Planning des repas</h1>

      {/* 🔹 Planning des repas */}
      <div className="grid gap-4 mb-8">
        {days.map((day) => (
          <div key={day} className="p-4 border rounded-xl shadow">
            <h2 className="font-semibold text-lg mb-2">{day}</h2>
            {types.map((type) => {
              const mealId = `${day}-${type}`;
              return (
                <div key={mealId} className="mb-2">
                  <label className="block text-sm font-medium">{type}</label>
                  <input
                    type="text"
                    value={meals[mealId] || ""}
                    onChange={(e) => updateMeal(day, type, e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder={`Ajouter un repas pour ${type}`}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* 🔹 Liste de courses collaborative */}
      <h2 className="text-xl font-bold mb-4">🛒 Liste de courses</h2>
      <div className="flex mb-4">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          className="flex-1 p-2 border rounded-l"
          placeholder="Ajouter un ingrédient..."
        />
        <button
          onClick={addItem}
          className="bg-green-500 text-white px-4 rounded-r"
        >
          ➕
        </button>
      </div>

      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className={`flex justify-between items-center p-2 border rounded ${
              item.done ? "bg-green-100 line-through" : ""
            }`}
          >
            <span onClick={() => toggleItem(item.id, item.done)} className="cursor-pointer">
              {item.name}
            </span>
            <button
              onClick={() => deleteItem(item.id)}
              className="text-red-500 font-bold"
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MealPlanner;