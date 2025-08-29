import React, { useState } from "react";

function ShoppingList() {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState("");

  const addItem = () => {
    if (input.trim() === "") return;
    setItems([...items, { text: input, done: false }]);
    setInput("");
  };

  const toggleItem = (index) => {
    const newItems = [...items];
    newItems[index].done = !newItems[index].done;
    setItems(newItems);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  return (
    <div>
      <h2>📝 Liste de courses</h2>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ajouter un ingrédient"
      />
      <button onClick={addItem}>Ajouter</button>

      <ul>
        {items.map((item, index) => (
          <li
            key={index}
            style={{
              textDecoration: item.done ? "line-through" : "none",
              cursor: "pointer",
            }}
          >
            <span onClick={() => toggleItem(index)}>{item.text}</span>
            <button onClick={() => removeItem(index)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ShoppingList;