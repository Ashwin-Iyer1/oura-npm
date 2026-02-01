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
    backgroundColor: '#000000',
    color: '#ffffff',
    fontFamily: '"Courier New", Courier, monospace', // Tech/Mono look
    padding: '20px',
    minHeight: '100vh', // Ensure full height
    boxSizing: 'border-box' as const
  } : {
    padding: '20px',
    fontFamily: 'sans-serif'
  };

  const headerStyle = darkMode ? {
    textTransform: 'uppercase' as const,
    letterSpacing: '4px',
    color: '#ffffff',
    borderBottom: '1px solid #ffffff',
    paddingBottom: '16px',
    marginBottom: '32px',
    fontSize: '24px',
    fontWeight: 'normal'
  } : {};

  const inputStyle = darkMode ? {
    backgroundColor: '#000000',
    color: '#ffffff',
    border: '1px solid #333333',
    padding: '8px 12px',
    fontFamily: 'inherit',
    marginLeft: '10px',
    outline: 'none',
    boxShadow: 'none',
    borderRadius: '0'
  } : {
    marginLeft: '5px'
  };

  const cardStyle = darkMode ? {
    backgroundColor: '#000000',
    border: '1px solid #333333',
    padding: '24px', 
    borderRadius: '0' // Sharp edges for monochrome/tech look
  } : {
    border: '1px solid #ddd', 
    padding: '15px', 
    borderRadius: '8px', 
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Oura Ring Stats Dashboard</h2>
      
      <div style={{ marginBottom: '32px', display: 'flex', gap: '32px', alignItems: 'center' }}>
        <label style={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: '12px', color: darkMode ? '#888' : 'inherit' }}>
          START DATE:
          <input 
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)} 
            style={inputStyle}
          />
        </label>
        <label style={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: '12px', color: darkMode ? '#888' : 'inherit' }}>
          END DATE:
          <input 
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)} 
            style={inputStyle}
          />
        </label>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
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
