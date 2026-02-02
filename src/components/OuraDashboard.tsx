import React, { useState } from 'react';
import { useOuraData } from '../hooks/useOuraData';
import { 
  ActivityChart, ReadinessChart, SleepChart, StressChart, SpO2Chart, 
  HeartRateChart, WorkoutChart, ResilienceChart, CardioAgeChart,
  VO2MaxChart, SleepDetailChart, RingConfigCard, SleepTimeCard, 
  RestModeCard, SimpleListCard
} from './Charts';

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
    gap: '16px', 
    alignItems: 'center', 
    border: borderStyle,
    padding: '8px 12px',
    backgroundColor: '#ffffff',
    color: '#333'
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
    height: '250px', // Fixed height to prevent infinite growth with ParentSize
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden'
  } : {
    border: borderStyle, 
    padding: '15px', 
    borderRadius: '8px', 
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    gridColumn: `span ${span}`,
    height: '300px',
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
    backgroundColor: '#fff',
    color: '#333'
  });

  const headerTextStyle = darkMode ? {
    textTransform: 'uppercase' as const,
    letterSpacing: '2px',
    fontSize: '14px',
    margin: 0,
    color: '#fff'
  } : {
    textTransform: 'uppercase' as const,
    letterSpacing: '2px',
    fontSize: '14px',
    margin: 0,
    color: '#333',
    fontWeight: 'bold'
  };

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
    backgroundColor: '#fff',
    color: '#333',
    border: '1px solid #ccc',
    padding: '2px 6px',
    fontFamily: 'inherit',
    marginLeft: '8px',
    outline: 'none',
    fontSize: '11px',
    borderRadius: 0
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
        {/* Core Daily Stats */}
        <div style={cardStyle(4)}>
          <ActivityChart data={data.activity} darkMode={darkMode} />
        </div>
        <div style={cardStyle(4)}>
          <ReadinessChart data={data.readiness} darkMode={darkMode} />
        </div>
        <div style={cardStyle(4)}>
          <SleepChart data={data.sleep} darkMode={darkMode} />
        </div>
        
        {/* Secondary Daily Stats */}
        {data.daily_stress && data.daily_stress.length > 0 && (
          <div style={cardStyle(4)}>
            <StressChart data={data.daily_stress} darkMode={darkMode} />
          </div>
        )}
        
        {data.daily_spo2 && data.daily_spo2.length > 0 && (
          <div style={cardStyle(4)}>
            <SpO2Chart data={data.daily_spo2} darkMode={darkMode} />
          </div>
        )}
        
        {data.heart_rate && data.heart_rate.length > 0 && (
          <div style={cardStyle(4)}>
            <HeartRateChart data={data.heart_rate} darkMode={darkMode} />
          </div>
        )}
        
        {/* Workouts & Resilience */}
        {data.workout && data.workout.length > 0 && (
          <div style={cardStyle(4)}>
            <WorkoutChart data={data.workout} darkMode={darkMode} />
          </div>
        )}

        {data.daily_resilience && data.daily_resilience.length > 0 && (
          <div style={cardStyle(4)}>
            <ResilienceChart data={data.daily_resilience} darkMode={darkMode} />
          </div>
        )}
        
        {/* Advanced Metrics */}
        {data.daily_cardiovascular_age && data.daily_cardiovascular_age.length > 0 && (
          <div style={cardStyle(4)}>
            <CardioAgeChart data={data.daily_cardiovascular_age} darkMode={darkMode} />
          </div>
        )}
        
        {data.vo2_max && data.vo2_max.length > 0 && (
           <div style={cardStyle(4)}>
             <VO2MaxChart data={data.vo2_max} darkMode={darkMode} />
           </div>
        )}

        {data.sleep_documents && data.sleep_documents.length > 0 && (
           <div style={cardStyle(4)}>
             <SleepDetailChart data={data.sleep_documents} darkMode={darkMode} />
           </div>
        )}
        
        {/* Cards & Lists */}
        {(data.sleep_time && data.sleep_time.length > 0) && (
            <div style={cardStyle(4)}>
                <SleepTimeCard data={data.sleep_time} darkMode={darkMode} />
            </div>
        )}

        {(data.ring_configuration && data.ring_configuration.length > 0) && (
             <div style={cardStyle(4)}>
                 <RingConfigCard data={data.ring_configuration} darkMode={darkMode} />
             </div>
        )}

        {/* Combined Events List for Tags, Sessions, Rest Mode */}
        <div style={cardStyle(4)}>
            <RestModeCard data={data.rest_mode_period || []} darkMode={darkMode} />
        </div>

        <div style={cardStyle(4)}>
            <SimpleListCard 
                title="SESSIONS" 
                darkMode={darkMode} 
                data={data.session || []} 
                renderItem={(s) => (
                    <div>
                        <span style={{opacity:0.7, marginRight:6}}>{s.day}</span>
                        <strong>{s.type}</strong> ({s.mood})
                    </div>
                )}
            />
        </div>

        <div style={cardStyle(4)}>
             <SimpleListCard 
                title="TAGS" 
                darkMode={darkMode} 
                data={data.tag || []} 
                renderItem={(t) => (
                    <div>
                         <span style={{opacity:0.7, marginRight:6}}>{t.day}</span>
                         {t.text && <span>{t.text} </span>}
                         {t.tags?.length > 0 && <span style={{color: '#888'}}>[{t.tags.join(', ')}]</span>}
                    </div>
                )}
            />
        </div>

         <div style={cardStyle(4)}>
             <SimpleListCard 
                title="ENHANCED TAGS" 
                darkMode={darkMode} 
                data={data.enhanced_tag || []} 
                renderItem={(t) => (
                    <div>
                         <span style={{opacity:0.7, marginRight:6}}>{t.start_day}</span>
                         <strong>{t.tag_type_code}</strong>
                         {t.comment && <div>"{t.comment}"</div>}
                    </div>
                )}
            />
        </div>
      </div>
    </div>
  );
};
