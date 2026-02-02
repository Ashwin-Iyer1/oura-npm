import React, { useState, useMemo } from 'react';
import { useOuraData } from 'oura-stats-visualizer';
import type { OuraData } from 'oura-stats-visualizer/dist/types'; 
import './Wrapped.css';

interface WrappedProps {
  accessToken: string;
  onClose: () => void;
  useSandbox?: boolean;
  baseUrl?: string;
  fallbackBaseUrl?: string;
}

interface Stats {
  avgSleepScore: number;
  totalHoursSlept: number;
  totalSteps: number;
  activeCalories: number;
  avgActivityScore: number;
  avgReadiness: number;
  stressfulDays: number;
  restoredDays: number;
  deepSleepHours: number;
}

const YEAR = 2025;
const START_DATE = `${YEAR}-01-01`;
const END_DATE = `${YEAR}-12-31`;

export const OuraYearWrapped: React.FC<WrappedProps> = ({ accessToken, onClose, useSandbox, baseUrl, fallbackBaseUrl }) => {
  const [fallbackToSandbox, setFallbackToSandbox] = useState(false);

  const effectiveSandbox = useSandbox || fallbackToSandbox;
  const effectiveBaseUrl = (fallbackToSandbox && fallbackBaseUrl) ? fallbackBaseUrl : baseUrl;

  const { data, loading, error } = useOuraData({ 
    accessToken, 
    startDate: START_DATE, 
    endDate: END_DATE, 
    useSandbox: effectiveSandbox,
    baseUrl: effectiveBaseUrl 
  });

  // Effect to handle fallback on error
  React.useEffect(() => {
    if (error && error.includes('400') && !useSandbox && !fallbackToSandbox) {
      console.warn("Wrapped: 400 Error detected, falling back to Sandbox mode.");
      setFallbackToSandbox(true);
    }
  }, [error, useSandbox, fallbackToSandbox]);

  const [slideIndex, setSlideIndex] = useState(0);

  const stats = useMemo(() => {
    if (!data) return null;
    return calculateStats(data);
  }, [data]);

  if (loading) return <div className="wrapped-loading">Crunching your {YEAR} numbers... 🤖</div>;
  if (error) return <div className="wrapped-error">Oops! Something went wrong: {error} <button onClick={onClose}>Close</button></div>;
  if (!stats) return <div className="wrapped-error">No data found for {YEAR}! <button onClick={onClose}>Close</button></div>;

  const slides = [
    <IntroSlide key="intro" year={YEAR} onNext={() => setSlideIndex(1)} />,
    <SleepSlide key="sleep" stats={stats} onNext={() => setSlideIndex(2)} />,
    <ActivitySlide key="activity" stats={stats} onNext={() => setSlideIndex(3)} />,
    <ReadinessSlide key="readiness" stats={stats} onNext={() => setSlideIndex(4)} />,
    <PersonaSlide key="persona" stats={stats} onNext={() => setSlideIndex(5)} />,
    <SummarySlide key="summary" stats={stats} onClose={onClose} />
  ];

  return (
    <div className="wrapped-container">
      <div className="wrapped-content">
        {slides[slideIndex]}
      </div>
      <div className="wrapped-progress">
        {slides.map((_, i) => (
          <div 
            key={i} 
            className={`progress-bar ${i === slideIndex ? 'active' : ''} ${i < slideIndex ? 'completed' : ''}`} 
          />
        ))}
      </div>
      <button className="close-button" onClick={onClose}>×</button>
    </div>
  );
};

// --- Helper Functions for Stats ---

function calculateStats(data: OuraData): Stats {
  // Sleep
  // Use data.sleep (DailySleep) which has 'score' and 'contributors'
  const sleepScores = data.sleep?.map(d => d.score).filter(s => s !== null && s !== undefined) || [];
  const avgSleepScore = average(sleepScores);
  
  // Total sleep is in seconds in contributors.total_sleep
  const totalSleepSeconds = data.sleep?.reduce((acc, curr) => acc + (curr.contributors?.total_sleep || 0), 0) || 0;
  const totalHoursSlept = Math.round(totalSleepSeconds / 3600);
  
  const deepSleepSeconds = data.sleep?.reduce((acc, curr) => acc + (curr.contributors?.deep_sleep || 0), 0) || 0;
  
  // Activity
  const totalSteps = data.activity?.reduce((acc, curr) => acc + curr.steps, 0) || 0;
  const activeCalories = data.activity?.reduce((acc, curr) => acc + curr.active_calories, 0) || 0;
  const avgActivityScore = average(data.activity?.map(d => d.score).filter((s): s is number => s !== null) || []);

  // Readiness
  const avgReadiness = average(data.readiness?.map(d => d.score).filter(s => s !== null) || []);
  
  // Stress
  const stressfulDays = data.daily_stress?.filter(d => d.day_summary === 'stressful').length || 0;
  const restoredDays = data.daily_stress?.filter(d => d.day_summary === 'restored').length || 0;

  return {
    avgSleepScore,
    totalHoursSlept,
    totalSteps,
    activeCalories,
    avgActivityScore,
    avgReadiness,
    stressfulDays,
    restoredDays,
    deepSleepHours: Math.round(deepSleepSeconds / 3600)
  };
}

function average(arr: number[]) {
  if (arr.length === 0) return 0;
  return Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
}

// --- Slide Components ---

const IntroSlide = ({ year, onNext }: { year: number, onNext: () => void }) => (
  <div className="slide intro-slide" onClick={onNext}>
    <h1>Your {year} Wrapped</h1>
    <p>Tap to reveal your hidden truths...</p>
    <div className="animate-bounce">👇</div>
  </div>
);

const SleepSlide = ({ stats, onNext }: { stats: Stats, onNext: () => void }) => {
  const isHibernator = stats.avgSleepScore > 85;
  const color = isHibernator ? '#4caf50' : '#ff9800'; 

  return (
    <div className="slide sleep-slide" onClick={onNext} style={{ '--accent': color } as React.CSSProperties}>
      <h2>Sleep</h2>
      <div className="stat-big">{stats.totalHoursSlept} hr</div>
      <p>Total time spent dreaming</p>
      
      <div className="insight-card">
        <p>Average Score: <strong>{stats.avgSleepScore}</strong></p>
        <p>{isHibernator ? "You're basically a bear. 🐻" : "Zombies fear you. 🧟"}</p>
      </div>
    </div>
  );
};

const ActivitySlide = ({ stats, onNext }: { stats: Stats, onNext: () => void }) => {
  const miles = Math.round(stats.totalSteps * 0.0008); 
  
  return (
    <div className="slide activity-slide" onClick={onNext}>
      <h2>Movement</h2>
      <div className="stat-big">{stats.totalSteps.toLocaleString()}</div>
      <p>Steps taken</p>
      
      <div className="insight-card">
        <p>That's roughly <strong>{miles} miles!</strong></p>
        <p>{miles > 500 ? "You could have walked to... well, somewhere far." : "A bit mostly stationary, aren't we?"}</p>
      </div>
    </div>
  );
};

const ReadinessSlide = ({ stats, onNext }: { stats: Stats, onNext: () => void }) => (
  <div className="slide readiness-slide" onClick={onNext}>
    <h2>Readiness</h2>
    <div className="stat-big">{stats.avgReadiness}</div>
    <p>Average Readiness Score</p>
    
    <div className="insight-card">
      <p>Restored Days: <strong>{stats.restoredDays}</strong></p>
      <p>Stressful Days: <strong>{stats.stressfulDays}</strong></p>
      <p>{stats.restoredDays > stats.stressfulDays ? "Zen master. 🧘" : "You need a vacation. 🏖️"}</p>
    </div>
  </div>
);

const PersonaSlide = ({ stats, onNext }: { stats: Stats, onNext: () => void }) => {
  let persona = "The Balanced Human";
  let description = "You keep things steady.";
  let emoji = "⚖️";

  if (stats.avgSleepScore > 90) {
    persona = "The Sleeping Beauty";
    description = "You have mastered the pillow arts.";
    emoji = "🛌";
  } else if (stats.totalSteps > 3000000) { 
    persona = "The Nomadic Wanderer";
    description = "Are you trying to escape?";
    emoji = "🏃";
  } else if (stats.stressfulDays > 100) {
    persona = "The Stress Ball";
    description = "Everything is fine. 🔥";
    emoji = "🔥";
  } else if (stats.avgReadiness > 88) {
    persona = "The Biohacker";
    description = "Optimal performance achieved.";
    emoji = "🦾";
  }

  return (
    <div className="slide persona-slide" onClick={onNext}>
      <h3>Your {YEAR} Persona</h3>
      <div className="persona-emoji">{emoji}</div>
      <h1 className="persona-title">{persona}</h1>
      <p>{description}</p>
    </div>
  );
};

const SummarySlide = ({ stats, onClose }: { stats: Stats, onClose: () => void }) => (
  <div className="slide summary-slide">
    <h2>{YEAR} at a Glance</h2>
    <div className="summary-grid">
      <div className="summary-item">
        <span>😴 Sleep</span>
        <strong>{stats.avgSleepScore}</strong>
      </div>
      <div className="summary-item">
        <span>👣 Steps</span>
        <strong>{stats.totalSteps.toLocaleString()}</strong>
      </div>
      <div className="summary-item">
        <span>🔋 Ready</span>
        <strong>{stats.avgReadiness}</strong>
      </div>
      <div className="summary-item">
        <span>🧘 Restored</span>
        <strong>{stats.restoredDays} days</strong>
      </div>
    </div>
    
    <button className="share-btn" onClick={() => alert("Screenshot this to share! (Or pretend to)")}>
      Share This
    </button>
    <button className="restart-btn" onClick={onClose}>
      Close
    </button>
  </div>
);
