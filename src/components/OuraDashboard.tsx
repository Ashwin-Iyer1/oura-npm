import React, { useState } from 'react';
import { useOuraData } from '../hooks/useOuraData';
import { ActivityChart, ReadinessChart, SleepChart } from './Charts';

interface OuraDashboardProps {
  accessToken: string;
  startDate?: string;
  endDate?: string;
  useSandbox?: boolean;
  baseUrl?: string;
}

export const OuraDashboard: React.FC<OuraDashboardProps> = ({ 
  accessToken, 
  startDate: initialStartDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
  endDate: initialEndDate = new Date().toISOString().split('T')[0],
  useSandbox = true,
  baseUrl
}) => {
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  
  const { data, loading, error } = useOuraData({ accessToken, startDate, endDate, useSandbox, baseUrl });

  if (loading) return <div>Loading Oura Data...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
  if (!data) return <div>No data available</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Oura Ring Stats Dashboard</h2>
      
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <label>
          Start Date:
          <input 
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)} 
            style={{ marginLeft: '5px' }}
          />
        </label>
        <label>
          End Date:
          <input 
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)} 
            style={{ marginLeft: '5px' }}
          />
        </label>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <ActivityChart data={data.activity} />
        </div>
        <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <ReadinessChart data={data.readiness} />
        </div>
        <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <SleepChart data={data.sleep} />
        </div>
      </div>
    </div>
  );
};
