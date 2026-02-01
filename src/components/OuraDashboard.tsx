import React, { useState } from 'react';
import { useOuraData } from '../hooks/useOuraData';
import { ActivityChart, ReadinessChart, SleepChart } from './Charts';

interface OuraDashboardProps {
  accessToken: string;
  startDate?: string;
  endDate?: string;
  useSandbox?: boolean;
  baseUrl?: string;
  darkMode?: boolean;
}

export const OuraDashboard: React.FC<OuraDashboardProps> = ({ 
  accessToken, 
  startDate: initialStartDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
  endDate: initialEndDate = new Date().toISOString().split('T')[0],
  useSandbox = true,
  baseUrl,
  darkMode = false
}) => {
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  
  const { data, loading, error } = useOuraData({ accessToken, startDate, endDate, useSandbox, baseUrl });

  if (loading) return <div>Loading Oura Data...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
  if (!data) return <div>No data available</div>;

  const containerStyle = darkMode ? {
    backgroundColor: '#050505',
    color: '#a0a0a0',
    fontFamily: '"Courier New", Courier, monospace',
    padding: '20px',
    minHeight: '100%'
  } : {
    padding: '20px',
    fontFamily: 'sans-serif'
  };

  const headerStyle = darkMode ? {
    textTransform: 'uppercase' as const,
    letterSpacing: '2px',
    color: '#fff',
    borderBottom: '1px solid #333',
    paddingBottom: '10px',
    marginBottom: '20px'
  } : {};

  const inputStyle = darkMode ? {
    backgroundColor: '#000',
    color: '#00ff9d',
    border: '1px solid #333',
    padding: '5px 10px',
    fontFamily: 'inherit',
    marginLeft: '5px'
  } : {
    marginLeft: '5px'
  };

  const cardStyle = darkMode ? {
    backgroundColor: '#000',
    border: '1px solid #333',
    padding: '15px', 
    borderRadius: '4px'
  } : {
    border: '1px solid #ddd', 
    padding: '15px', 
    borderRadius: '8px', 
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Oura Ring Stats Dashboard</h2>
      
      <div style={{ marginBottom: '20px', display: 'flex', gap: '20px', alignItems: 'center' }}>
        <label>
          START DATE:
          <input 
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)} 
            style={inputStyle}
          />
        </label>
        <label>
          END DATE:
          <input 
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)} 
            style={inputStyle}
          />
        </label>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        <div style={cardStyle}>
          <ActivityChart data={data.activity} darkMode={darkMode} />
        </div>
        <div style={cardStyle}>
          <ReadinessChart data={data.readiness} darkMode={darkMode} />
        </div>
        <div style={cardStyle}>
          <SleepChart data={data.sleep} darkMode={darkMode} />
        </div>
      </div>
    </div>
  );
};
