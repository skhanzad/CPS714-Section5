import React, { useEffect, useState } from 'react'; import api from '../services/api'; import ItemForm from '../components/ItemForm';
export default function Dashboard(){
  const [items,setItems]=useState([]); const [q,setQ]=useState(''); const [status,setStatus]=useState(''); const [editing,setEditing]=useState(null);
  const load=async()=>{ const res=await api.get('/items',{params:{q,status}}); setItems(res.data);}; useEffect(()=>{load()},[]);
  const save=async(form)=>{ if(editing){ await api.patch(`/items/${editing._id}`,form); setEditing(null);} else { await api.post('/items',form);} await load(); };
  const remove=async(id)=>{ if(!confirm('Delete this item?'))return; await api.delete(`/items/${id}`); await load(); };
  const checkout=async(id)=>{ await api.post('/loans/checkout',{item_id:id,member_id:'M001'}); await load(); };
  const checkin=async(id)=>{ await api.post('/loans/checkin',{item_id:id}); await load(); };
  const setRFID=async(id)=>{ const rfid=prompt('Enter RFID value:'); if(!rfid)return; await api.post(`/items/${id}/rfid`,{rfid}); await load(); };
  return (<div>
    <h2>Inventory</h2>
    <div style={{display:'flex',gap:8,marginBottom:12}}>
      <input placeholder="Search title/author…" value={q} onChange={e=>setQ(e.target.value)}/>
      <select value={status} onChange={e=>setStatus(e.target.value)}>
        <option value="">All</option><option>AVAILABLE</option><option>CHECKED_OUT</option><option>ON_HOLD</option><option>LOST</option>
      </select><button onClick={load}>Search</button>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
      <div>
        <table width="100%" border="1" cellPadding="6" style={{borderCollapse:'collapse'}}>
          <thead><tr><th>Title</th><th>Author</th><th>Format</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>{items.map(it=>(
            <tr key={it._id}>
              <td>{it.title}</td><td>{it.author}</td><td>{it.mediaFormat}</td><td>{it.status}</td>
              <td style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                <button onClick={()=>setEditing(it)}>Edit</button>
                <button onClick={()=>remove(it._id)}>Delete</button>
                {it.status==='AVAILABLE'?<button onClick={()=>checkout(it._id)}>Checkout</button>:<button onClick={()=>checkin(it._id)}>Checkin</button>}
                <button onClick={()=>setRFID(it._id)}>Set RFID</button>
              </td>
            </tr>))}</tbody>
        </table>
      </div>
      <div>
        <h3>{editing?'Edit Item':'Add Item'}</h3>
        <ItemForm onSave={save} initial={editing}/>
      </div>
    </div>
  </div>);}