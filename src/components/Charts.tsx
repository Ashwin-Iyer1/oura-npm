import React from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, ComposedChart
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { DailyActivity, DailyReadiness, DailySleep } from '../types';

interface ChartProps<T> {
  data: T[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ backgroundColor: '#fff', border: '1px solid #ccc', padding: '10px' }}>
        <p>{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const ActivityChart: React.FC<ChartProps<DailyActivity>> = ({ data }) => {
  // Sort data by day
  const sortedData = [...data].sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime());
  
  return (
    <div style={{ width: '100%', height: 300 }}>
      <h3>Activity Trends</h3>
      <ResponsiveContainer>
        <ComposedChart data={sortedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="day" 
            tickFormatter={(str) => format(parseISO(str), 'MMM d')}
          />
          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar yAxisId="left" dataKey="steps" fill="#8884d8" name="Steps" />
          <Line yAxisId="right" type="monotone" dataKey="active_calories" stroke="#82ca9d" name="Active Cal" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export const ReadinessChart: React.FC<ChartProps<DailyReadiness>> = ({ data }) => {
  const sortedData = [...data].sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime());

  return (
    <div style={{ width: '100%', height: 300 }}>
      <h3>Readiness Score</h3>
      <ResponsiveContainer>
        <LineChart data={sortedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="day" 
            tickFormatter={(str) => format(parseISO(str), 'MMM d')}
          />
          <YAxis domain={[0, 100]} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line type="monotone" dataKey="score" stroke="#ff7300" name="Readiness Score" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const SleepChart: React.FC<ChartProps<DailySleep>> = ({ data }) => {
  const sortedData = [...data].sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime());
  
  // Prepare data for stacked chart (convert seconds to hours for better readability?)
  // Or just keep seconds. Let's convert to hours roughly for axis, but maybe just use raw now.
  // Actually, seconds is too big numbers. Let's just use score and total sleep.
  const processedData = sortedData.map(d => ({
    ...d,
    total_sleep_hours: d.contributors.total_sleep ? (d.contributors.total_sleep / 3600).toFixed(1) : 0,
    deep_sleep_hours: d.contributors.deep_sleep ? (d.contributors.deep_sleep / 3600).toFixed(1) : 0,
    rem_sleep_hours: d.contributors.rem_sleep ? (d.contributors.rem_sleep / 3600).toFixed(1) : 0,
  }));

  return (
    <div style={{ width: '100%', height: 300 }}>
      <h3>Sleep Score & Duration</h3>
      <ResponsiveContainer>
        <ComposedChart data={processedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="day" 
            tickFormatter={(str) => format(parseISO(str), 'MMM d')}
          />
          <YAxis yAxisId="left" orientation="left" domain={[0, 100]} stroke="#8884d8"/>
          <YAxis yAxisId="right" orientation="right" unit="h" stroke="#82ca9d"/>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar yAxisId="left" dataKey="score" fill="#8884d8" name="Sleep Score" />
          <Line yAxisId="right" type="monotone" dataKey="total_sleep_hours" stroke="#82ca9d" name="Total Sleep (h)" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
