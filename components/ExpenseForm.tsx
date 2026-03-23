interface FormProps {
  onSubmit: (e: React.FormEvent) => void;
  amount: string;
  setAmount: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  date: string;
  setDate: (val: string) => void;
  isEditing: boolean;
}

export default function ExpenseForm({ onSubmit, amount, setAmount, description, setDescription, date, setDate, isEditing }: FormProps) {
  return (
    <form onSubmit={onSubmit} className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-4 shadow-xl">
      <h2 className="text-sm font-medium text-zinc-300">{isEditing ? '⚡ Edit Catatan' : '📝 Catat Pengeluaran'}</h2>
      <div className="space-y-3">
        <input 
          required type="number" placeholder="Nominal (Rp)" 
          value={amount} onChange={(e) => setAmount(e.target.value)} 
          className="w-full bg-zinc-900/50 text-white p-3 rounded-xl border border-white/5 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" 
        />
        <input 
          required type="text" placeholder="Keperluan apa?" 
          value={description} onChange={(e) => setDescription(e.target.value)} 
          className="w-full bg-zinc-900/50 text-white p-3 rounded-xl border border-white/5 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" 
        />
        <input 
          required type="date" 
          value={date} onChange={(e) => setDate(e.target.value)} 
          className="w-full bg-zinc-900/50 text-white p-3 rounded-xl border border-white/5 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" 
        />
      </div>
      <button type="submit" className={`w-full p-3 rounded-xl font-bold transition-all ${isEditing ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'} text-white shadow-lg shadow-blue-900/20`}>
        {isEditing ? 'Update Data' : 'Simpan Pengeluaran'}
      </button>
    </form>
  );
}