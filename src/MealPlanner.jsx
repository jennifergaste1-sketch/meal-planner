import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";

const DAYS = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"];

// objet local complet par défaut
const makeEmptyWeek = () =>
  DAYS.reduce((acc, d) => {
    acc[d] = { dejeuner: "", diner: "" };
    return acc;
  }, {});

export default function MealPlanner() {
  const [meals, setMeals] = useState(makeEmptyWeek());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const col = collection(db, "meals");
        const snap = await getDocs(col);

        // Si la collection est vide, on la crée (documents par jour)
        if (snap.empty) {
          const init = makeEmptyWeek();
          await Promise.all(
            DAYS.map((d) => setDoc(doc(db, "meals", d), init[d]))
          );
          setMeals(init);
          setLoading(false);
          return;
        }

        // On reconstruit l'objet semaine en acceptant d'anciennes clés ("déjeuner"/"dîner")
        const byId = {};
        snap.forEach((s) => {
          const data = s.data() || {};
          byId[s.id] = {
            dejeuner: data.dejeuner ?? data["déjeuner"] ?? "",
            diner: data.diner ?? data["dîner"] ?? "",
          };
        });

        const merged = makeEmptyWeek();
        DAYS.forEach((d) => {
          if (byId[d]) merged[d] = byId[d];
        });

        setMeals(merged);
      } catch (e) {
        console.error("Erreur Firestore:", e);
        // on garde l'affichage local quand même
        setMeals((m) => ({ ...m }));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const saveDay = async (day, next) => {
    setMeals((prev) => ({ ...prev, [day]: next }));
    // On écrit avec des clés sans accent pour éviter les soucis
    await setDoc(doc(db, "meals", day), {
      dejeuner: next.dejeuner || "",
      diner: next.diner || "",
    });
  };

  const handleChange = (day, key, value) => {
    const next = { ...meals[day], [key]: value };
    saveDay(day, next);
  };

  if (loading) return <div className="p-4">Chargement…</div>;

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: 16 }}>
      <h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 12 }}>
        Planning des repas
      </h2>

      {DAYS.map((day) => (
        <div
          key={day}
          style={{
            marginBottom: 16,
            padding: 12,
            border: "1px solid #ddd",
            borderRadius: 12,
            background: "#fff",
          }}
        >
          <h3 style={{ margin: 0, marginBottom: 8 }}>{day}</h3>

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
            <label style={{ minWidth: 80 }}>Déjeuner =</label>
            <input
              type="text"
              value={meals[day]?.dejeuner ?? ""}
              onChange={(e) => handleChange(day, "dejeuner", e.target.value)}
              style={{ flex: 1, border: "1px solid #ccc", borderRadius: 8, padding: 8 }}
              placeholder="Ex : Pâtes bolo"
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
            <label style={{ minWidth: 80 }}>Dîner =</label>
            <input
              type="text"
              value={meals[day]?.diner ?? ""}
              onChange={(e) => handleChange(day, "diner", e.target.value)}
              style={{ flex: 1, border: "1px solid #ccc", borderRadius: 8, padding: 8 }}
              placeholder="Ex : Salade composée"
            />
          </div>
        </div>
      ))}
    </div>
  );
}