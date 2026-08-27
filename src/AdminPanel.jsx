import React, { useEffect, useState } from 'react';
import { db } from "./firebase";
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";

export default function AdminPanel({ onBack }) {
  const [arizalar, setArizalar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'Yangi', 'Bog\'lanildi'

  // Real-time rejimda Firestore'dan arizalarni olish
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "arizalar"), (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setArizalar(list);
      setLoading(false);
    }, (error) => {
      console.error("Xatolik:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Maqomni yangilash (Status Update)
  const handleStatusChange = async (id, newStatus) => {
    try {
      const docRef = doc(db, "arizalar", id);
      await updateDoc(docRef, { status: newStatus });
    } catch (e) {
      alert("Xatolik yuz berdi: " + e.message);
    }
  };

  // O'qituvchiga biriktirish (Assign Teacher)
  const handleAssignTeacher = async (id, teacherName) => {
    try {
      const docRef = doc(db, "arizalar", id);
      await updateDoc(docRef, { assignedTeacher: teacherName });
    } catch (e) {
      alert("Xatolik yuz berdi: " + e.message);
    }
  };

  // Arizani o'chirish
  const handleDelete = async (id) => {
    if (window.confirm("Rostdan ham ushbu arizani o'chirmoqchimisiz?")) {
      try {
        await deleteDoc(doc(db, "arizalar", id));
      } catch (e) {
        alert("Xatolik yuz berdi: " + e.message);
      }
    }
  };

  const filteredArizalar = arizalar.filter(item => {
    if (filter === 'all') return true;
    return (item.status || 'Yangi') === filter;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto flex justify-between items-center pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-amber-500">Lingo Admin & O'qituvchilar Paneli</h1>
          <p className="text-xs text-slate-400 mt-1">Kelib tushgan tumandagi va onlayn arizalarni boshqarish</p>
        </div>
        <button 
          onClick={onBack}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg text-sm font-medium transition">
          ← Bosh sahifaga qaytish
        </button>
      </div>

      {/* Filterlar & Statistika */}
      <div className="max-w-7xl mx-auto my-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
          <p className="text-xs text-slate-400 uppercase font-semibold">Jami Arizalar</p>
          <h3 className="text-3xl font-extrabold text-white mt-1">{arizalar.length}</h3>
        </div>
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
          <p className="text-xs text-slate-400 uppercase font-semibold">Yangi</p>
          <h3 className="text-3xl font-extrabold text-amber-400 mt-1">
            {arizalar.filter(a => !a.status || a.status === 'Yangi').length}
          </h3>
        </div>
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
          <p className="text-xs text-slate-400 uppercase font-semibold">Bog'lanildi</p>
          <h3 className="text-3xl font-extrabold text-blue-400 mt-1">
            {arizalar.filter(a => a.status === 'Bog\'lanildi').length}
          </h3>
        </div>
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
          <p className="text-xs text-slate-400 uppercase font-semibold">Qabul qilindi</p>
          <h3 className="text-3xl font-extrabold text-green-400 mt-1">
            {arizalar.filter(a => a.status === 'Qabul qilindi').length}
          </h3>
        </div>
      </div>

      {/* Jadvallar (Table) */}
      <div className="max-w-7xl mx-auto bg-slate-800/80 rounded-xl border border-slate-700 overflow-hidden shadow-2xl">
        <div className="p-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
          <h2 className="font-bold text-slate-200">Arizalar Ro'yxati</h2>
          <div className="flex space-x-2 text-xs">
            <button 
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition ${filter === 'all' ? 'bg-amber-500 text-slate-900 font-bold' : 'bg-slate-700 text-slate-300'}`}>
              Barchasi
            </button>
            <button 
              onClick={() => setFilter('Yangi')}
              className={`px-3 py-1.5 rounded-lg transition ${filter === 'Yangi' ? 'bg-amber-500 text-slate-900 font-bold' : 'bg-slate-700 text-slate-300'}`}>
              Yangi
            </button>
            <button 
              onClick={() => setFilter('Bog\'lanildi')}
              className={`px-3 py-1.5 rounded-lg transition ${filter === 'Bog\'lanildi' ? 'bg-amber-500 text-slate-900 font-bold' : 'bg-slate-700 text-slate-300'}`}>
              Bog'lanildi
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400">Ma'lumotlar yuklanmoqda...</div>
        ) : filteredArizalar.length === 0 ? (
          <div className="p-8 text-center text-slate-400">Arizalar mavjud emas.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/60 text-xs uppercase text-slate-400 border-b border-slate-700">
                <tr>
                  <th className="p-4">O'quvchi Ismi</th>
                  <th className="p-4">Telefon</th>
                  <th className="p-4">Tanlangan Kurs</th>
                  <th className="p-4">Maqom (Status)</th>
                  <th className="p-4">Biriktirilgan O'qituvchi</th>
                  <th className="p-4 text-center">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {filteredArizalar.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-700/30 transition">
                    <td className="p-4 font-semibold text-white">{item.ism}</td>
                    <td className="p-4 text-amber-400">{item.telefon}</td>
                    <td className="p-4">{item.kurs}</td>
                    <td className="p-4">
                      <select 
                        value={item.status || 'Yangi'}
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                        className="bg-slate-900 border border-slate-600 text-xs rounded-lg px-2 py-1 text-slate-200 focus:outline-none focus:border-amber-500">
                        <option value="Yangi">🔴 Yangi</option>
                        <option value="Bog'lanildi">🟡 Bog'lanildi</option>
                        <option value="Qabul qilindi">🟢 Qabul qilindi</option>
                        <option value="Bekor qilindi">⚪ Bekor qilindi</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <input 
                        type="text" 
                        placeholder="O'qituvchi ismi..."
                        defaultValue={item.assignedTeacher || ''}
                        onBlur={(e) => handleAssignTeacher(item.id, e.target.value)}
                        className="bg-slate-900 border border-slate-600 text-xs rounded-lg px-2 py-1 text-slate-200 w-full focus:outline-none focus:border-amber-500"
                      />
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="text-red-400 hover:text-red-300 text-xs font-semibold px-2 py-1 bg-red-500/10 rounded border border-red-500/20 transition">
                        O'chirish
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}