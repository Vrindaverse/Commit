'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export interface HabitWeek {
  week: string;
  rate: number;
  done: number;
  total: number;
}

function HabitTooltip({
  active,
  payload,
  label,
  color,
}: {
  active?: boolean;
  payload?: { payload: HabitWeek }[];
  label?: string;
  color: string;
}) {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="neo-card px-3 py-2 text-xs">
        <p className="font-extrabold mb-1">Week of {label}</p>
        <p>{d.done}/{d.total} days</p>
        <p style={{ color }}>{d.rate}% completion</p>
      </div>
    );
  }
  return null;
}

export default function HabitChart({ weeks, color }: { weeks: HabitWeek[]; color: string }) {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={weeks} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E0DCD4" />
          <XAxis dataKey="week" tick={{ fontSize: 10, fontWeight: 700, fill: '#5C5C5C' }} interval={1} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 10, fontWeight: 700, fill: '#5C5C5C' }} tickFormatter={(v: number) => `${v}%`} />
          <Tooltip content={<HabitTooltip color={color} />} />
          <Bar dataKey="rate" fill={color} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
