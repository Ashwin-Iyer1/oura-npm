export interface DailyActivity {
  id: string;
  day: string;
  timestamp: string;
  score: number | null;
  active_calories: number;
  average_met_minutes: number;
  equivalent_walking_distance: number;
  high_activity_met_minutes: number;
  high_activity_time: number;
  inactivity_alerts: number;
  low_activity_met_minutes: number;
  low_activity_time: number;
  medium_activity_met_minutes: number;
  medium_activity_time: number;
  meters_to_target: number;
  non_wear_time: number;
  resting_time: number;
  sedentary_met_minutes: number;
  sedentary_time: number;
  steps: number;
  target_calories: number;
  target_meters: number;
  total_calories: number;
}

export interface DailyReadiness {
  id: string;
  day: string;
  timestamp: string;
  score: number | null;
  temperature_deviation: number | null;
  temperature_trend_deviation: number | null;
}

export interface DailySleep {
  id: string;
  day: string;
  timestamp: string;
  score: number | null;
  contributors: {
    deep_sleep?: number;
    efficiency?: number;
    latency?: number;
    rem_sleep?: number;
    restfulness?: number;
    timing?: number;
    total_sleep?: number;
  };
}

export interface OuraData {
  activity: DailyActivity[];
  readiness: DailyReadiness[];
  sleep: DailySleep[];
}
