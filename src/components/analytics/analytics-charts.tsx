'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Flame, BookOpen } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area,
} from 'recharts';
import NeoCard from '@/components/shared/neo-card';

const CustomTooltip = memo(function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { color?: string; name?: string; value?: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="neo-card px-3 py-2 text-xs">
      <p className="font-extrabold mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-medium">
          {p.name}: {p.value}
          {p.name?.toLowerCase().includes('hour') ? 'h' : ''}
        </p>
      ))}
    </div>
  );
});

export interface AnalyticsChartsProps {
  productivityTrend: { day: string; hours: number }[];
  learningHours: { month: string; hours: number }[];
  goalCompletion: { month: string; completed: number; total: number }[];
  habits: { habit: string; streak: number }[];
  weeklyDistribution: { day: string; tasks: number; completed: number }[];
}

export default function AnalyticsCharts({
  productivityTrend,
  learningHours,
  goalCompletion,
  habits,
  weeklyDistribution,
}: AnalyticsChartsProps) {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[
          {
            color: '#B8D8F8',
            title: 'Productivity Trend',
            icon: <TrendingUp size={18} />,
            chart: (
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={productivityTrend}>
                  <defs>
                    <linearGradient id="prodGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#B8D8F8" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#B8D8F8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0ECE4" />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fontWeight: 600 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="hours" stroke="#B8D8F8" fill="url(#prodGrad)" strokeWidth={3} animationDuration={600} animationEasing="ease-out" />
                </AreaChart>
              </ResponsiveContainer>
            ),
          },
          {
            color: '#CDEAC0',
            title: 'Learning Hours',
            icon: <BookOpen size={18} />,
            chart: (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={learningHours}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0ECE4" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fontWeight: 600 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="hours" fill="#CDEAC0" stroke="#2D2D2D" strokeWidth={2} radius={[6, 6, 0, 0]} animationDuration={600} animationEasing="ease-out" />
                </BarChart>
              </ResponsiveContainer>
            ),
          },
          {
            color: '#F7E8A4',
            title: 'Goal Completion',
            icon: <Target size={18} />,
            chart: (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={goalCompletion}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0ECE4" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fontWeight: 600 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="completed" fill="#CDEAC0" stroke="#2D2D2D" strokeWidth={2} radius={[6, 6, 0, 0]} name="Completed" animationDuration={600} animationEasing="ease-out" />
                  <Bar dataKey="total" fill="#F7E8A4" stroke="#2D2D2D" strokeWidth={2} radius={[6, 6, 0, 0]} name="Total" animationDuration={600} animationEasing="ease-out" />
                </BarChart>
              </ResponsiveContainer>
            ),
          },
          {
            color: '#F8C8C8',
            title: 'Habit Streaks',
            icon: <Flame size={18} />,
            chart: (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={habits} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0ECE4" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis dataKey="habit" type="category" tick={{ fontSize: 12, fontWeight: 600 }} width={80} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="streak" fill="#F8C8C8" stroke="#2D2D2D" strokeWidth={2} radius={[0, 6, 6, 0]} name="Streak" animationDuration={600} animationEasing="ease-out" />
                </BarChart>
              </ResponsiveContainer>
            ),
          },
        ].map((item, i) => (
          <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 + i * 0.06, ease: 'easeOut' }}>
            <NeoCard color={item.color}>
              <div className="flex items-center gap-3 mb-4">
                {item.icon}
                <h3 className="text-sm font-extrabold">{item.title}</h3>
              </div>
              {item.chart}
            </NeoCard>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.4, ease: 'easeOut' }} className="mt-6">
        <NeoCard color="#DCCEF5">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp size={18} />
            <h3 className="text-sm font-extrabold">Weekly Distribution</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0ECE4" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fontWeight: 600 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="tasks" stroke="#B8D8F8" strokeWidth={3} dot={{ r: 5, stroke: '#2D2D2D', strokeWidth: 2 }} name="Total Tasks" animationDuration={600} animationEasing="ease-out" />
              <Line type="monotone" dataKey="completed" stroke="#CDEAC0" strokeWidth={3} dot={{ r: 5, stroke: '#2D2D2D', strokeWidth: 2 }} name="Completed" animationDuration={600} animationEasing="ease-out" />
            </LineChart>
          </ResponsiveContainer>
        </NeoCard>
      </motion.div>
    </>
  );
}
