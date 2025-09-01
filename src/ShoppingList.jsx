import { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";

function ShoppingList() {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState("");

  // Charger la liste depuis Firebase
  useEffect(() => {
    const fetchItems = async () => {
      const querySnapshot = await getDocs(collection(db, "shoppingList"));
      setItems(querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    };
    fetchItems();
  }, []);

  // Ajouter un item
  const addItem = async () => {
    if (!input.trim()) return;
    const docRef = await addDoc(collection(db, "shoppingList"), { name: input });
    setItems([...items, { id: docRef.id, name: input }]);
    setInput("");
  };

  // Supprimer un item
  const removeItem = async (id) => {
    await deleteDoc(doc(db, "shoppingList", id));
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div>
      <h2>🛒 Liste de courses</h2>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ajouter un ingrédient"
      />
      <button onClick={addItem}>Ajouter</button>

      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} <button onClick={() => removeItem(item.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ShoppingList;