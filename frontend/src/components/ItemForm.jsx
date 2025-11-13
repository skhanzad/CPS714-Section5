import React, { useState, useEffect } from 'react';
export default function ItemForm({ onSave, initial }){
  const [form, setForm] = useState(initial || { title:'', author:'', mediaFormat:'BOOK', location:'', barcode:'' });
  useEffect(()=>setForm(initial || { title:'', author:'', mediaFormat:'BOOK', location:'', barcode:'' }), [initial]);
  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  return (<form onSubmit={e=>{e.preventDefault(); onSave(form);}} style={{display:'grid',gap:8}}>
    <input name="title" placeholder="Title" value={form.title} onChange={onChange} required/>
    <input name="author" placeholder="Author" value={form.author} onChange={onChange}/>
    <select name="mediaFormat" value={form.mediaFormat} onChange={onChange}>
      <option>BOOK</option><option>DVD</option><option>MAGAZINE</option><option>AUDIOBOOK</option>
    </select>
    <input name="location" placeholder="Location (e.g., SHELF-A1)" value={form.location} onChange={onChange}/>
    <input name="barcode" placeholder="Barcode" value={form.barcode} onChange={onChange}/>
    <button type="submit">Save</button>
  </form>);}