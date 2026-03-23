'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { LogOut, Wallet } from 'lucide-react';

// Import Komponen Modular kita
import ChartSection from '@/components/ChartSection';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseList from '@/components/ExpenseList';

export default function Home() {
  const [session, setSession] = useState<any>(null);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // State untuk Form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    // Check session saat pertama kali load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchExpenses(session.user.id);
      else setLoading(false);
    });

    // Listener untuk perubahan auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchExpenses(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchExpenses = async (userId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/expenses?userId=${userId}`);
      const data = await res.json();
      setExpenses(data || []);
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (type: 'login' | 'register') => {
    if (type === 'register') {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) alert(error.message);
      else alert('Cek email untuk verifikasi atau silakan login jika sudah aktif!');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert(error.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    const payload = {
      user_id: session.user.id,
      amount: Number(amount),
      description,
      date,
    };

    const url = editId ? `/api/expenses/${editId}` : '/api/expenses';
    const method = editId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setEditId(null);
        setAmount('');
        setDescription('');
        // Paksa refresh data setelah input berhasil
        await fetchExpenses(session.user.id);
        alert("Data berhasil disimpan!");
      } else {
        const err = await response.json();
        alert("Gagal simpan: " + err.error);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Hapus catatan ini?')) {
      await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
      fetchExpenses(session.user.id);
    }
  };

  const handleEdit = (item: any) => {
    setEditId(item.id);
    setAmount(item.amount.toString());
    setDescription(item.description);
    setDate(item.date);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Proses data untuk Chart (Akumulasi per bulan)
  const chartData = expenses.reduce((acc: any[], curr: any) => {
    const monthName = new Date(curr.date).toLocaleString('id-ID', { month: 'short' });
    const existing = acc.find(item => item.name === monthName);
    if (existing) existing.total += Number(curr.amount);
    else acc.push({ name: monthName, total: Number(curr.amount) });
    return acc;
  }, []).reverse();

  if (loading && session) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-500">Memuat Data...</div>;

  // --- VIEW: LOGIN ---
  if (!session) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm bg-white/[0.03] backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-600/20 rounded-2xl text-blue-500">
              <Wallet size={32} />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-zinc-100 mb-2 text-center">CatatDuit</h1>
          <p className="text-zinc-500 text-center text-sm mb-8">Kelola pengeluaranmu dengan gaya minimalis.</p>
          
          <div className="space-y-4">
            <input 
              type="email" placeholder="Email" 
              value={email}
              className="w-full bg-zinc-900 text-white p-4 rounded-xl border border-white/5 focus:border-blue-500 transition-all outline-none"
              onChange={(e) => setEmail(e.target.value)} 
            />
            <input 
              type="password" placeholder="Password" 
              value={password}
              className="w-full bg-zinc-900 text-white p-4 rounded-xl border border-white/5 focus:border-blue-500 transition-all outline-none"
              onChange={(e) => setPassword(e.target.value)} 
            />
            <div className="flex gap-3 pt-2">
              <button onClick={() => handleAuth('login')} className="flex-1 bg-blue-600 text-white p-4 rounded-xl font-bold hover:bg-blue-700 active:scale-95 transition-all">Login</button>
              <button onClick={() => handleAuth('register')} className="flex-1 bg-zinc-800 text-zinc-300 p-4 rounded-xl font-bold hover:bg-zinc-700 active:scale-95 transition-all">Daftar</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW: DASHBOARD (MOBILE FIRST) ---
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 pb-24">
      <div className="max-w-md mx-auto p-5 space-y-8">
        
        {/* Header */}
        <header className="flex justify-between items-center py-2">
          <div>
            <h1 className="text-xl font-bold text-white">Halo, Salman!</h1>
            <p className="text-xs text-zinc-500">Pantau pengeluaranmu hari ini.</p>
          </div>
          <button 
            onClick={() => supabase.auth.signOut()} 
            className="p-3 bg-zinc-900 rounded-2xl text-zinc-500 hover:text-red-400 transition-colors"
          >
            <LogOut size={20} />
          </button>
        </header>

        {/* 1. Dashboard Chart */}
        <ChartSection data={chartData} />

        {/* 2. Form Input/Edit */}
        <ExpenseForm 
          onSubmit={handleSubmit}
          amount={amount} setAmount={setAmount}
          description={description} setDescription={setDescription}
          date={date} setDate={setDate}
          isEditing={!!editId}
        />

        {/* 3. History List */}
        <ExpenseList 
          items={expenses} 
          onDelete={handleDelete} 
          onEdit={handleEdit} 
        />

      </div>
    </div>
  );
}