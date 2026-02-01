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
    color: '#e0e0e0',
    fontFamily: '"Courier New", Courier, monospace',
    padding: '4px',
    minHeight: '100vh',
    boxSizing: 'border-box' as const,
    fontSize: '11px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px'
  } : {
    padding: '20px',
    fontFamily: 'sans-serif'
  };

  const borderStyle = darkMode ? '1px solid #333' : '1px solid #ddd';

  const controlBarStyle = darkMode ? {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    border: borderStyle,
    padding: '8px 12px',
    backgroundColor: '#050505'
  } : {
    display: 'flex', 
    gap: '20px', 
    alignItems: 'center', 
    marginBottom: '20px'
  };

  const gridContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    gap: '4px',
    flex: 1
  };

  const cardStyle = (span: number = 4) => (darkMode ? {
    backgroundColor: '#050505',
    border: borderStyle,
    padding: '2px', // Minimal padding
    gridColumn: `span ${span}`,
    minHeight: '200px',
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden'
  } : {
    border: '1px solid #ddd', 
    padding: '15px', 
    borderRadius: '8px', 
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    gridColumn: `span ${span}`
  });

  const headerTextStyle = darkMode ? {
    textTransform: 'uppercase' as const,
    letterSpacing: '2px',
    fontSize: '14px',
    margin: 0,
    color: '#fff'
  } : {};

  const inputStyle = darkMode ? {
    backgroundColor: '#000',
    color: '#fff',
    border: '1px solid #333',
    padding: '2px 6px',
    fontFamily: 'inherit',
    marginLeft: '8px',
    outline: 'none',
    fontSize: '11px',
    borderRadius: 0
  } : {
    marginLeft: '5px'
  };

  return (
    <div style={containerStyle}>
      <div style={controlBarStyle}>
        <h2 style={headerTextStyle}>OURA_STATS_VISUALIZER</h2>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: '16px' }}>
          <label style={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: '10px', color: '#888' }}>
            START_DATE
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)} 
              style={inputStyle}
            />
          </label>
          <label style={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: '10px', color: '#888' }}>
            END_DATE
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)} 
              style={inputStyle}
            />
          </label>
        </div>
      </div>

      <div style={gridContainerStyle}>
        <div style={cardStyle(4)}>
          <ActivityChart data={data.activity} darkMode={darkMode} />
        </div>
        <div style={cardStyle(4)}>
          <ReadinessChart data={data.readiness} darkMode={darkMode} />
        </div>
        <div style={cardStyle(4)}>
          <SleepChart data={data.sleep} darkMode={darkMode} />
        </div>
        
        {/* Placeholder for future detailed stats or heatmaps to fill the dense grid */}
        <div style={{ ...cardStyle(12), minHeight: '150px', justifyContent: 'center', alignItems: 'center', color: '#333' }}>
          <span style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: '10px' }}>NO_ADDITIONAL_DATA_STREAM</span>
        </div>
      </div>
    </div>
  );
};
