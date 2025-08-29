import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, doc, setDoc, onSnapshot } from "firebase/firestore";

const days = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"];
const types = ["Déjeuner","Dîner"];

const getCalories = (mealName) => {
  if (!mealName) return 0;
  const defaults = {
    "Pâtes bolo":500,
    "Salade":200,
    "Poulet rôti":400,
    "Omelette":250,
    "Riz + légumes":350,
    "Soupe":180
  };
  return defaults[mealName.trim()] ?? 350;
};

export default function MealPlanner() {
  const [meals, setMeals] = useState({});

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "meals"), (snap) => {
      const data = {};
      snap.forEach((d) => data[d.id] = d.data().meal || "");
      setMeals(data);
    });
    return () => unsub();
  }, []);

  const updateMeal = async(day,type,value) => {
    const id = `${day}-${type}`;
    setMeals(prev=>({...prev,[id]:value}));
    await setDoc(doc(db,"meals",id),{meal:value});
  };

  return (
    <div className="p-4 rounded-2xl bg-white shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">📅 Planning des repas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {days.map(day=>(
          <div key={day} className="p-4 border rounded-xl bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-lg">{day}</h3>
              <span className="text-sm text-gray-600">
                {(getCalories(meals[`${day}-Déjeuner`]) || 0) + (getCalories(meals[`${day}-Dîner`]) || 0)} kcal / jour
              </span>
            </div>
            {types.map(type=>{
              const id = `${day}-${type}`;
              return (
                <div key={id} className="mb-3">
                  <label className="block text-sm font-medium mb-1">{type}</label>
                  <input
                    value={meals[id] || ""}
                    onChange={e=>updateMeal(day,type,e.target.value)}
                    placeholder={`Ajouter un repas pour ${type}`}
                    className="w-full p-2 border rounded focus:outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {meals[id]?`${getCalories(meals[id])} kcal`:"—"}
                  </p>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}