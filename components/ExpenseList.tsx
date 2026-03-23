import { Trash2, Edit3, Calendar } from 'lucide-react';

interface Expense {
  id: string;
  amount: number;
  description: string;
  date: string;
}

interface ListProps {
  items: Expense[];
  onDelete: (id: string) => void;
  onEdit: (item: Expense) => void;
}

export default function ExpenseList({ items, onDelete, onEdit }: ListProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Histori Terbaru</h2>
      {items.map((item) => (
        <div key={item.id} className="group bg-white/5 border border-white/10 p-4 rounded-2xl flex justify-between items-center hover:bg-white/[0.08] transition-all">
          <div className="flex flex-col">
            <span className="text-zinc-100 font-medium">{item.description}</span>
            <div className="flex items-center gap-2 text-[10px] text-zinc-500 mt-1">
              <Calendar size={12} />
              <span>{new Date(item.date).toLocaleDateString('id-ID')}</span>
              <span className="text-blue-400 font-semibold ml-2">Rp {Number(item.amount).toLocaleString('id-ID')}</span>
            </div>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => onEdit(item)} className="p-2 text-zinc-400 hover:text-amber-400 transition-colors"><Edit3 size={18} /></button>
            <button onClick={() => onDelete(item.id)} className="p-2 text-zinc-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
          </div>
        </div>
      ))}
      {items.length === 0 && <div className="text-center py-10 text-zinc-600 text-sm italic">Belum ada transaksi bulan ini.</div>}
    </div>
  );
}