import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartProps {
  data: { name: string; total: number }[];
}

export default function ChartSection({ data }: ChartProps) {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl h-60 shadow-lg">
      <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Akumulasi Bulanan</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis hide />
          <Tooltip 
            cursor={{fill: 'rgba(255,255,255,0.05)'}} 
            contentStyle={{backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '12px', fontSize: '12px'}}
          />
          <Bar dataKey="total" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={30} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}