export interface DailyActivity {
    id: string;
    day: string;
    score: number | null;
    active_calories: number;
    average_met_minutes: number;
    equivalent_walking_distance: number;
    high_activity_met_minutes: number;
    high_activity_time: number;
    steps: number;
    total_calories: number;
    timestamp: string;
}
export interface DailyReadiness {
    id: string;
    day: string;
    score: number;
    timestamp: string;
    contributors: {
        activity_balance: number;
        body_temperature: number;
        hrv_balance: number;
        previous_day_activity: number;
        previous_night: number;
        recovery_index: number;
        resting_heart_rate: number;
        sleep_balance: number;
    };
}
export interface DailySleep {
    id: string;
    day: string;
    score: number;
    timestamp: string;
    contributors: {
        deep_sleep: number;
        efficiency: number;
        latency: number;
        rem_sleep: number;
        restfulness: number;
        timing: number;
        total_sleep: number;
    };
}
export interface DailyStress {
    id: string;
    day: string;
    stress_high: number;
    recovery_high: number;
    day_summary: 'restored' | 'normal' | 'stressful' | null;
}
export interface DailySpO2 {
    id: string;
    day: string;
    spo2_percentage: {
        average: number;
    } | null;
    breathing_disturbance_index: number | null;
}
export interface DailyResilience {
    id: string;
    day: string;
    level: string;
    contributors: {
        sleep_recovery: number;
        daytime_recovery: number;
        stress: number;
    };
}
export interface DailyCardiovascularAge {
    day: string;
    vascular_age: number | null;
}
export interface HeartRate {
    bpm: number;
    source: string;
    timestamp: string;
}
export interface Sleep {
    id: string;
    day: string;
    key: string;
    average_breath: number;
    average_heart_rate: number;
    average_hrv: number;
    awake_time: number;
    bedtime_end: string;
    bedtime_start: string;
    deep_sleep_duration: number;
    efficiency: number;
    latency: number;
    light_sleep_duration: number;
    rem_sleep_duration: number;
    time_in_bed: number;
    total_sleep_duration: number;
    type: string;
    readiness_score_delta: number;
    sleep_score_delta: number;
    lowest_heart_rate: number;
}
export interface SleepTime {
    id: string;
    day: string;
    optimal_bedtime: {
        start_offset: number;
        end_offset: number;
    } | null;
    recommendation: string;
    status: string;
}
export interface Session {
    id: string;
    day: string;
    start_datetime: string;
    end_datetime: string;
    type: string;
    mood: string;
}
export interface Workout {
    id: string;
    day: string;
    activity: string;
    calories: number;
    distance: number;
    start_datetime: string;
    end_datetime: string;
    intensity: string;
    label: string | null;
    source: string;
}
export interface Tag {
    id: string;
    day: string;
    text: string;
    timestamp: string;
    tags: string[];
}
export interface EnhancedTag {
    id: string;
    tag_type_code: string;
    start_time: string;
    end_time: string | null;
    start_day: string;
    end_day: string | null;
    comment: string | null;
}
export interface RestModePeriod {
    id: string;
    start_day: string;
    end_day: string | null;
    start_time: string;
    end_time: string | null;
    episodes: {
        tags: string[];
        timestamp: string;
    }[];
}
export interface RingConfiguration {
    id: string;
    color: string;
    design: string;
    firmware_version: string;
    hardware_type: string;
    size: number;
    set_up_at: string;
}
export interface VO2Max {
    id: string;
    day: string;
    vo2_max: number;
    timestamp: string;
}
export interface OuraData {
    activity: DailyActivity[];
    readiness: DailyReadiness[];
    sleep: DailySleep[];
    daily_stress: DailyStress[];
    daily_spo2: DailySpO2[];
    daily_resilience: DailyResilience[];
    daily_cardiovascular_age: DailyCardiovascularAge[];
    heart_rate: HeartRate[];
    sleep_documents: Sleep[];
    sleep_time: SleepTime[];
    session: Session[];
    workout: Workout[];
    tag: Tag[];
    enhanced_tag: EnhancedTag[];
    rest_mode_period: RestModePeriod[];
    ring_configuration: RingConfiguration[];
    earliest_date?: string;
    vo2_max: VO2Max[];
}
