import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, doc, setDoc, deleteDoc, onSnapshot } from "firebase/firestore";

export default function Inventory() {
  const [items,setItems]=useState([]);
  const [name,setName]=useState("");
  const [qty,setQty]=useState(1);

  useEffect(()=>{
    const unsub = onSnapshot(collection(db,"inventory"), snap=>{
      const list=[];
      snap.forEach(d=>list.push({id:d.id,...d.data()}));
      list.sort((a,b)=>Number(a.inStock)-Number(b.inStock)||a.name.localeCompare(b.name));
      setItems(list);
    });
    return ()=>unsub();
  },[]);

  const addItem = async ()=>{
    const clean = name.trim();
    if(!clean) return;
    const id = clean.toLowerCase().replace(/\s+/g,"-");
    await setDoc(doc(db,"inventory",id),{
      name:clean,
      quantity:Number(qty)||1,
      inStock:true
    });
    setName(""); setQty(1);
  };

  const toggle = async(id,inStock)=>{ await setDoc(doc(db,"inventory",id),{...items.find(it=>it.id===id),inStock:!inStock}) };
  const changeQty = async(id,quantity)=>{ await setDoc(doc(db,"inventory",id),{...items.find(it=>it.id===id),quantity:Number(quantity)||0}) };
  const remove = async(id)=>{ await deleteDoc(doc(db,"inventory",id)) };

  return (
    <div className="p-4 rounded-2xl bg-white shadow mt-6">
      <h2 className="text-2xl font-bold mb-4 text-center">🍳 Inventaire cuisine</h2>
      <div className="flex gap-2 mb-4">
        <input className="flex-1 p-2 border rounded" placeholder="Ajouter un ingrédient" value={name} onChange={e=>setName(e.target.value)}/>
        <input type="number" min={0} className="w-24 p-2 border rounded" value={qty} onChange={e=>setQty(e.target.value)}/>
        <button onClick={addItem} className="px-4 py-2 rounded bg-green-600 text-white">➕ Ajouter</button>
      </div>
      <ul className="space-y-2">
        {items.map(it=>(
          <li key={it.id} className={`flex items-center justify-between p-2 border rounded ${it.inStock?"bg-green-50":"bg-red-50"}`}>
            <div className="flex items-center gap-3">
              <button onClick={()=>toggle(it.id,it.inStock)} className="px-2 py-1 rounded border">{it.inStock?"✅":"❌"}</button>
              <span className="font-medium">{it.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="number" min={0} className="w-20 p-1 border rounded" value={it.quantity} onChange={e=>changeQty(it.id,e.target.value)}/>
              <button onClick={()=>remove(it.id)} className="px-2 py-1 rounded text-red-600 border border-red-400">Suppr</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}