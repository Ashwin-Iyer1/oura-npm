import React, { useMemo } from 'react';
import { Group } from '@visx/group';
import { Bar } from '@visx/shape';
import { scaleTime, scaleLinear, scaleBand } from '@visx/scale';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { GridRows } from '@visx/grid';
import { Tooltip, TooltipWithBounds, defaultStyles as tooltipStyles } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { LinearGradient } from '@visx/gradient';
import { AreaClosed, LinePath } from '@visx/shape';
import { curveMonotoneX } from '@visx/curve';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { format, parseISO } from 'date-fns';
import { DailyActivity, DailyReadiness, DailySleep, DailyStress, DailySpO2, HeartRate, Workout, DailyResilience, DailyCardiovascularAge, VO2Max, Sleep, RingConfiguration, SleepTime, RestModePeriod, Session, Tag, EnhancedTag } from '../types';

// Types
interface ChartProps<T> {
  data: T[];
  darkMode?: boolean;
}

const getTheme = (darkMode: boolean) => ({
  background: darkMode ? '#000000' : '#ffffff',
  text: darkMode ? '#ffffff' : '#000000',
  grid: darkMode ? '#333333' : '#e0e0e0',
  tooltipBg: darkMode ? '#000000' : '#ffffff',
  tooltipColor: darkMode ? '#ffffff' : '#000000',
  tooltipBorder: darkMode ? '#ffffff' : '#cccccc',
  bar: darkMode ? '#ffffff' : '#000000',
  line: darkMode ? '#ffffff' : '#000000',
  areaGradientFrom: darkMode ? '#ffffff' : '#000000',
  areaGradientTo: darkMode ? '#000000' : '#ffffff',
});

// Helper for dates
const getX = (d: any) => new Date(d.day);

// --- Base Chart Component ---
const BaseChart = ({ 
  width, 
  height, 
  darkMode, 
  title, 
  children 
}: { 
  width: number; 
  height: number; 
  darkMode: boolean; 
  title: string; 
  children: React.ReactNode 
}) => {
  const theme = getTheme(darkMode);
  
  return (
    <div style={{ position: 'relative', height: '100%', width: '100%', overflow: 'hidden' }}>
      <div style={{ 
        position: 'absolute',
        top: 4,
        left: 8,
        color: theme.text,
        fontFamily: darkMode ? '"Courier New", Courier, monospace' : 'sans-serif',
        textTransform: 'uppercase',
        fontSize: '10px',
        fontWeight: 'bold',
        opacity: 0.8,
        zIndex: 10
      }}>
        {title}
      </div>
      <svg width={width} height={height}>
        <rect width={width} height={height} fill={theme.background} />
        {children}
      </svg>
    </div>
  );
};

// --- Activity Chart ---
export const ActivityChart: React.FC<ChartProps<DailyActivity>> = ({ data, darkMode = false }) => {
  const theme = getTheme(darkMode);
  
  return (
    <div style={{ width: '100%', height: '100%', minHeight: 0, overflow: 'hidden' }}>
      <ParentSize>
        {({ width, height }) => {
          if (width < 10 || height < 10) return null;
          
          // Compact Margins
          const margin = { top: 20, right: 10, bottom: 20, left: 30 };
          const xMax = width - margin.left - margin.right;
          const yMax = height - margin.top - margin.bottom;

          // Data Accessors
          const getSteps = (d: DailyActivity) => d.steps;
          
          // Scales
          const xScale = scaleBand<string>({
            range: [0, xMax],
            round: true,
            domain: data.map(d => d.day),
            padding: 0.2, // Tighter bars
          });
          
          const yScale = scaleLinear<number>({
            range: [yMax, 0],
            round: true,
            domain: [0, Math.max(...data.map(getSteps))],
          });

          return (
            <BaseChart width={width} height={height} darkMode={darkMode} title="STEPS">
              <Group left={margin.left} top={margin.top}>
                <GridRows scale={yScale} width={xMax} height={yMax} stroke={theme.grid} strokeDasharray="1 3" strokeWidth={0.5} />
                
                <AxisBottom
                  top={yMax}
                  scale={xScale}
                  tickFormat={(d) => format(parseISO(d), 'dd')}
                  stroke={theme.text}
                  tickStroke={theme.text}
                  tickLabelProps={() => ({
                    fill: theme.text,
                    fontSize: 8, // Very small font
                    textAnchor: 'middle',
                    fontFamily: darkMode ? '"Courier New", Courier, monospace' : 'sans-serif'
                  })}
                />
                
                <AxisLeft
                  scale={yScale}
                  stroke={theme.text}
                  tickStroke={theme.text}
                  numTicks={4}
                  tickLabelProps={() => ({
                    fill: theme.text,
                    fontSize: 8,
                    textAnchor: 'end',
                    dy: '0.33em',
                    fontFamily: darkMode ? '"Courier New", Courier, monospace' : 'sans-serif'
                  })}
                />

                {data.map((d) => {
                  const day = d.day;
                  const barWidth = xScale.bandwidth();
                  const barHeight = yMax - (yScale(getSteps(d)) ?? 0);
                  const barX = xScale(day);
                  const barY = yMax - barHeight;
                  return (
                    <Bar
                      key={`bar-${day}`}
                      x={barX}
                      y={barY}
                      width={barWidth}
                      height={barHeight}
                      fill={theme.bar}
                      fillOpacity={1}
                    />
                  );
                })}
              </Group>
            </BaseChart>
          );
        }}
      </ParentSize>
    </div>
  );
};

// --- Readiness Chart ---
export const ReadinessChart: React.FC<ChartProps<DailyReadiness>> = ({ data, darkMode = false }) => {
  const theme = getTheme(darkMode);

  return (
    <div style={{ width: '100%', height: '100%', minHeight: 0, overflow: 'hidden' }}>
      <ParentSize>
        {({ width, height }) => {
          if (width < 10 || height < 10) return null;
          
          const margin = { top: 20, right: 10, bottom: 20, left: 30 };
          const xMax = width - margin.left - margin.right;
          const yMax = height - margin.top - margin.bottom;

          const getScore = (d: DailyReadiness) => d.score;

          const xScale = scaleTime({
            range: [0, xMax],
            domain: [Math.min(...data.map(d => getX(d).getTime())), Math.max(...data.map(d => getX(d).getTime()))],
          });

          const yScale = scaleLinear<number>({
            range: [yMax, 0],
            domain: [40, 100], 
          });

          return (
            <BaseChart width={width} height={height} darkMode={darkMode} title="READINESS">
              <Group left={margin.left} top={margin.top}>
                <LinearGradient id="readiness-gradient" from={theme.areaGradientFrom} to={theme.areaGradientTo} toOpacity={0} fromOpacity={0.5} />
                
                <GridRows scale={yScale} width={xMax} height={yMax} stroke={theme.grid} strokeDasharray="1 3" strokeWidth={0.5} />
                
                <AxisBottom
                  top={yMax}
                  scale={xScale}
                  numTicks={5}
                  tickFormat={(d) => format(d as Date, 'dd')}
                  stroke={theme.text}
                  tickStroke={theme.text}
                  tickLabelProps={() => ({
                    fill: theme.text,
                    fontSize: 8,
                    textAnchor: 'middle',
                    fontFamily: darkMode ? '"Courier New", Courier, monospace' : 'sans-serif'
                  })}
                />
                
                <AxisLeft
                  scale={yScale}
                  stroke={theme.text}
                  tickStroke={theme.text}
                  numTicks={4}
                  tickLabelProps={() => ({
                    fill: theme.text,
                    fontSize: 8,
                    textAnchor: 'end',
                    dy: '0.33em',
                    fontFamily: darkMode ? '"Courier New", Courier, monospace' : 'sans-serif'
                  })}
                />

                <AreaClosed<DailyReadiness>
                  data={data}
                  x={d => xScale(getX(d)) ?? 0}
                  y={d => yScale(getScore(d) || 0) ?? 0}
                  yScale={yScale}
                  strokeWidth={0}
                  fill="url(#readiness-gradient)"
                  curve={curveMonotoneX}
                />

                <LinePath<DailyReadiness>
                  data={data}
                  x={d => xScale(getX(d)) ?? 0}
                  y={d => yScale(getScore(d) || 0) ?? 0}
                  stroke={theme.line}
                  strokeWidth={1} 
                  curve={curveMonotoneX}
                />
                
                {data.map((d, i) => (
                  <circle
                    key={i}
                    cx={xScale(getX(d))}
                    cy={yScale(getScore(d) || 0)}
                    r={1.5}
                    fill={theme.background}
                    stroke={theme.line}
                    strokeWidth={1}
                  />
                ))}
              </Group>
            </BaseChart>
          );
        }}
      </ParentSize>
    </div>
  );
};

// --- Sleep Chart ---
export const SleepChart: React.FC<ChartProps<DailySleep>> = ({ data, darkMode = false }) => {
  const theme = getTheme(darkMode);

  return (
    <div style={{ width: '100%', height: '100%', minHeight: 0, overflow: 'hidden' }}>
      <ParentSize>
        {({ width, height }) => {
          if (width < 10 || height < 10) return null;
          
          const margin = { top: 20, right: 10, bottom: 20, left: 30 };
          const xMax = width - margin.left - margin.right;
          const yMax = height - margin.top - margin.bottom;

          const getScore = (d: DailySleep) => d.score;

          const xScale = scaleBand<string>({
            range: [0, xMax],
            round: true,
            domain: data.map(d => d.day),
            padding: 0.2,
          });

          const yScale = scaleLinear<number>({
            range: [yMax, 0],
            domain: [0, 100],
          });

          return (
            <BaseChart width={width} height={height} darkMode={darkMode} title="SLEEP">
              <Group left={margin.left} top={margin.top}>
                <GridRows scale={yScale} width={xMax} height={yMax} stroke={theme.grid} strokeDasharray="1 3" strokeWidth={0.5} />
                
                <AxisBottom
                  top={yMax}
                  scale={xScale}
                  tickFormat={(d) => format(parseISO(d), 'dd')}
                  stroke={theme.text}
                  tickStroke={theme.text}
                  tickLabelProps={() => ({
                    fill: theme.text,
                    fontSize: 8,
                    textAnchor: 'middle',
                    fontFamily: darkMode ? '"Courier New", Courier, monospace' : 'sans-serif'
                  })}
                />
                
                <AxisLeft
                  scale={yScale}
                  stroke={theme.text}
                  tickStroke={theme.text}
                  numTicks={4}
                  tickLabelProps={() => ({
                    fill: theme.text,
                    fontSize: 8,
                    textAnchor: 'end',
                    dy: '0.33em',
                    fontFamily: darkMode ? '"Courier New", Courier, monospace' : 'sans-serif'
                  })}
                />

                {data.map((d) => {
                  const day = d.day;
                  const barWidth = xScale.bandwidth();
                  const barHeight = yMax - (yScale(getScore(d) || 0) ?? 0);
                  const barX = xScale(day);
                  const barY = yMax - barHeight;
                  return (
                    <Bar
                      key={`bar-${day}`}
                      x={barX}
                      y={barY}
                      width={barWidth}
                      height={barHeight}
                      fill={theme.bar}
                      fillOpacity={1}
                    />
                  );
                })}
              </Group>
            </BaseChart>
          );
        }}
      </ParentSize>
    </div>
  );
};

// --- Stress Chart ---
export const StressChart: React.FC<ChartProps<DailyStress>> = ({ data, darkMode = false }) => {
  const theme = getTheme(darkMode);
  
  return (
    <div style={{ width: '100%', height: '100%', minHeight: 0, overflow: 'hidden' }}>
      <ParentSize>
        {({ width, height }) => {
          if (width < 10 || height < 10) return null;
          
          const margin = { top: 20, right: 10, bottom: 20, left: 30 };
          const xMax = width - margin.left - margin.right;
          const yMax = height - margin.top - margin.bottom;

          const getStress = (d: DailyStress) => d.stress_high;
          
          const xScale = scaleBand<string>({
            range: [0, xMax],
            round: true,
            domain: data.map(d => d.day),
            padding: 0.2,
          });
          
          const yScale = scaleLinear<number>({
            range: [yMax, 0],
            round: true,
            domain: [0, Math.max(...data.map(getStress), 100)],
          });

          return (
            <BaseChart width={width} height={height} darkMode={darkMode} title="STRESS (HIGH)">
              <Group left={margin.left} top={margin.top}>
                <GridRows scale={yScale} width={xMax} height={yMax} stroke={theme.grid} strokeDasharray="1 3" strokeWidth={0.5} />
                <AxisBottom
                  top={yMax}
                  scale={xScale}
                  tickFormat={(d) => format(parseISO(d), 'dd')}
                  stroke={theme.text}
                  tickStroke={theme.text}
                  tickLabelProps={() => ({
                    fill: theme.text,
                    fontSize: 8,
                    textAnchor: 'middle',
                    fontFamily: darkMode ? '"Courier New", Courier, monospace' : 'sans-serif'
                  })}
                />
                <AxisLeft
                  scale={yScale}
                  stroke={theme.text}
                  tickStroke={theme.text}
                  numTicks={4}
                  tickLabelProps={() => ({
                    fill: theme.text,
                    fontSize: 8,
                    textAnchor: 'end',
                    dy: '0.33em',
                    fontFamily: darkMode ? '"Courier New", Courier, monospace' : 'sans-serif'
                  })}
                />
                {data.map((d) => {
                  const day = d.day;
                  const barWidth = xScale.bandwidth();
                  const barHeight = yMax - (yScale(getStress(d)) ?? 0);
                  const barX = xScale(day);
                  const barY = yMax - barHeight;
                  return (
                    <Bar
                      key={`bar-${day}`}
                      x={barX}
                      y={barY}
                      width={barWidth}
                      height={barHeight}
                      fill={theme.bar}
                      fillOpacity={1}
                    />
                  );
                })}
              </Group>
            </BaseChart>
          );
        }}
      </ParentSize>
    </div>
  );
};

// --- SpO2 Chart ---
export const SpO2Chart: React.FC<ChartProps<DailySpO2>> = ({ data, darkMode = false }) => {
  const theme = getTheme(darkMode);

  return (
    <div style={{ width: '100%', height: '100%', minHeight: 0, overflow: 'hidden' }}>
      <ParentSize>
        {({ width, height }) => {
          if (width < 10 || height < 10) return null;
          
          const margin = { top: 20, right: 10, bottom: 20, left: 30 };
          const xMax = width - margin.left - margin.right;
          const yMax = height - margin.top - margin.bottom;

          const getValue = (d: DailySpO2) => d.spo2_percentage?.average || 0;

          const xScale = scaleTime({
            range: [0, xMax],
            domain: [Math.min(...data.map(d => getX(d).getTime())), Math.max(...data.map(d => getX(d).getTime()))],
          });

          const yScale = scaleLinear<number>({
            range: [yMax, 0],
            domain: [90, 100], 
          });

          return (
            <BaseChart width={width} height={height} darkMode={darkMode} title="SpO2 %">
              <Group left={margin.left} top={margin.top}>
                <LinearGradient id="spo2-gradient" from={theme.areaGradientFrom} to={theme.areaGradientTo} toOpacity={0} fromOpacity={0.5} />
                <GridRows scale={yScale} width={xMax} height={yMax} stroke={theme.grid} strokeDasharray="1 3" strokeWidth={0.5} />
                
                <AxisBottom
                  top={yMax}
                  scale={xScale}
                  numTicks={5}
                  tickFormat={(d) => format(d as Date, 'dd')}
                  stroke={theme.text}
                  tickStroke={theme.text}
                  tickLabelProps={() => ({
                    fill: theme.text,
                    fontSize: 8,
                    textAnchor: 'middle',
                    fontFamily: darkMode ? '"Courier New", Courier, monospace' : 'sans-serif'
                  })}
                />
                
                <AxisLeft
                  scale={yScale}
                  stroke={theme.text}
                  tickStroke={theme.text}
                  numTicks={4}
                  tickLabelProps={() => ({
                    fill: theme.text,
                    fontSize: 8,
                    textAnchor: 'end',
                    dy: '0.33em',
                    fontFamily: darkMode ? '"Courier New", Courier, monospace' : 'sans-serif'
                  })}
                />

                <AreaClosed<DailySpO2>
                  data={data}
                  x={d => xScale(getX(d)) ?? 0}
                  y={d => yScale(getValue(d)) ?? 0}
                  yScale={yScale}
                  strokeWidth={0}
                  fill="url(#spo2-gradient)"
                  curve={curveMonotoneX}
                />

                <LinePath<DailySpO2>
                  data={data}
                  x={d => xScale(getX(d)) ?? 0}
                  y={d => yScale(getValue(d)) ?? 0}
                  stroke={theme.line}
                  strokeWidth={1} 
                  curve={curveMonotoneX}
                />
                
                {data.map((d, i) => (
                  <circle
                    key={i}
                    cx={xScale(getX(d))}
                    cy={yScale(getValue(d))}
                    r={1.5}
                    fill={theme.background}
                    stroke={theme.line}
                    strokeWidth={1}
                  />
                ))}
              </Group>
            </BaseChart>
          );
        }}
      </ParentSize>
    </div>
  );
};

// --- Heart Rate Chart ---
export const HeartRateChart: React.FC<ChartProps<HeartRate>> = ({ data, darkMode = false }) => {
  const theme = getTheme(darkMode);

  return (
    <div style={{ width: '100%', height: '100%', minHeight: 0, overflow: 'hidden' }}>
      <ParentSize>
        {({ width, height }) => {
          if (width < 10 || height < 10) return null;
          
          const margin = { top: 20, right: 10, bottom: 20, left: 30 };
          const xMax = width - margin.left - margin.right;
          const yMax = height - margin.top - margin.bottom;

          const getBpm = (d: HeartRate) => d.bpm;
          const getDate = (d: HeartRate) => parseISO(d.timestamp);

          // Need to filter valid dates or ensure data is sorted?
          // For sandbox, data might be sparse.
          
          const xScale = scaleTime({
            range: [0, xMax],
            domain: [Math.min(...data.map(d => getDate(d).getTime())) || 0, Math.max(...data.map(d => getDate(d).getTime())) || 0],
          });

          const yScale = scaleLinear<number>({
            range: [yMax, 0],
            domain: [Math.min(...data.map(getBpm)) * 0.9, Math.max(...data.map(getBpm)) * 1.1],
          });

          return (
            <BaseChart width={width} height={height} darkMode={darkMode} title="HEART RATE">
              <Group left={margin.left} top={margin.top}>
                <GridRows scale={yScale} width={xMax} height={yMax} stroke={theme.grid} strokeDasharray="1 3" strokeWidth={0.5} />
                
                <AxisBottom
                  top={yMax}
                  scale={xScale}
                  numTicks={5}
                  tickFormat={(d) => format(d as Date, 'HH:mm')}
                  stroke={theme.text}
                  tickStroke={theme.text}
                  tickLabelProps={() => ({
                    fill: theme.text,
                    fontSize: 8,
                    textAnchor: 'middle',
                    fontFamily: darkMode ? '"Courier New", Courier, monospace' : 'sans-serif'
                  })}
                />
                
                <AxisLeft
                  scale={yScale}
                  stroke={theme.text}
                  tickStroke={theme.text}
                  numTicks={4}
                  tickLabelProps={() => ({
                    fill: theme.text,
                    fontSize: 8,
                    textAnchor: 'end',
                    dy: '0.33em',
                    fontFamily: darkMode ? '"Courier New", Courier, monospace' : 'sans-serif'
                  })}
                />

                <LinePath<HeartRate>
                  data={data}
                  x={d => xScale(getDate(d)) ?? 0}
                  y={d => yScale(getBpm(d)) ?? 0}
                  stroke={theme.line}
                  strokeWidth={1} 
                  curve={curveMonotoneX}
                />
              </Group>
            </BaseChart>
          );
        }}
      </ParentSize>
    </div>
  );
};

// --- Workout Chart ---
export const WorkoutChart: React.FC<ChartProps<Workout>> = ({ data, darkMode = false }) => {
  const theme = getTheme(darkMode);
  
  return (
    <div style={{ width: '100%', height: '100%', minHeight: 0, overflow: 'hidden' }}>
      <ParentSize>
        {({ width, height }) => {
          if (width < 10 || height < 10) return null;
          
          const margin = { top: 20, right: 10, bottom: 20, left: 30 };
          const xMax = width - margin.left - margin.right;
          const yMax = height - margin.top - margin.bottom;

          const getCalories = (d: Workout) => d.calories;
          
          const xScale = scaleBand<string>({
            range: [0, xMax],
            round: true,
            domain: data.map(d => d.day),
            padding: 0.2,
          });
          
          const yScale = scaleLinear<number>({
            range: [yMax, 0],
            round: true,
            domain: [0, Math.max(...data.map(getCalories), 100)],
          });

          return (
            <BaseChart width={width} height={height} darkMode={darkMode} title="WORKOUT CALS">
              <Group left={margin.left} top={margin.top}>
                <GridRows scale={yScale} width={xMax} height={yMax} stroke={theme.grid} strokeDasharray="1 3" strokeWidth={0.5} />
                
                <AxisBottom
                  top={yMax}
                  scale={xScale}
                  tickFormat={(d) => format(parseISO(d), 'dd')}
                  stroke={theme.text}
                  tickStroke={theme.text}
                  tickLabelProps={() => ({
                    fill: theme.text,
                    fontSize: 8,
                    textAnchor: 'middle',
                    fontFamily: darkMode ? '"Courier New", Courier, monospace' : 'sans-serif'
                  })}
                />
                
                <AxisLeft
                  scale={yScale}
                  stroke={theme.text}
                  tickStroke={theme.text}
                  numTicks={4}
                  tickLabelProps={() => ({
                    fill: theme.text,
                    fontSize: 8,
                    textAnchor: 'end',
                    dy: '0.33em',
                    fontFamily: darkMode ? '"Courier New", Courier, monospace' : 'sans-serif'
                  })}
                />

                {data.map((d) => {
                  const day = d.day;
                  const barWidth = xScale.bandwidth();
                  const barHeight = yMax - (yScale(getCalories(d)) ?? 0);
                  const barX = xScale(day);
                  const barY = yMax - barHeight;
                  return (
                    <Bar
                      key={`bar-${day}`}
                      x={barX}
                      y={barY}
                      width={barWidth}
                      height={barHeight}
                      fill={theme.bar}
                      fillOpacity={1}
                    />
                  );
                })}
              </Group>
            </BaseChart>
          );
        }}
      </ParentSize>
    </div>
  );
};

// --- Resilience Chart ---
export const ResilienceChart: React.FC<ChartProps<DailyResilience>> = ({ data, darkMode = false }) => {
  const theme = getTheme(darkMode);

  return (
    <div style={{ width: '100%', height: '100%', minHeight: 0, overflow: 'hidden' }}>
      <ParentSize>
        {({ width, height }) => {
          if (width < 10 || height < 10) return null;
          
          const margin = { top: 20, right: 10, bottom: 20, left: 30 };
          const xMax = width - margin.left - margin.right;
          const yMax = height - margin.top - margin.bottom;

          const getContributor = (d: DailyResilience, key: keyof DailyResilience['contributors']) => d.contributors[key];

          const xScale = scaleTime({
            range: [0, xMax],
            domain: [Math.min(...data.map(d => getX(d).getTime())), Math.max(...data.map(d => getX(d).getTime()))],
          });

          const yScale = scaleLinear<number>({
            range: [yMax, 0],
            domain: [0, 100], 
          });

          return (
            <BaseChart width={width} height={height} darkMode={darkMode} title="RESILIENCE">
              <Group left={margin.left} top={margin.top}>
                <GridRows scale={yScale} width={xMax} height={yMax} stroke={theme.grid} strokeDasharray="1 3" strokeWidth={0.5} />
                
                <AxisBottom
                  top={yMax}
                  scale={xScale}
                  numTicks={5}
                  tickFormat={(d) => format(d as Date, 'dd')}
                  stroke={theme.text}
                  tickStroke={theme.text}
                  tickLabelProps={() => ({
                    fill: theme.text,
                    fontSize: 8,
                    textAnchor: 'middle',
                    fontFamily: darkMode ? '"Courier New", Courier, monospace' : 'sans-serif'
                  })}
                />
                
                <AxisLeft
                  scale={yScale}
                  stroke={theme.text}
                  tickStroke={theme.text}
                  numTicks={4}
                  tickLabelProps={() => ({
                    fill: theme.text,
                    fontSize: 8,
                    textAnchor: 'end',
                    dy: '0.33em',
                    fontFamily: darkMode ? '"Courier New", Courier, monospace' : 'sans-serif'
                  })}
                />

                {/* Sleep Recovery */}
                <LinePath<DailyResilience>
                  data={data}
                  x={d => xScale(getX(d)) ?? 0}
                  y={d => yScale(getContributor(d, 'sleep_recovery')) ?? 0}
                  stroke="#4facfe" // Blue
                  strokeWidth={1} 
                  curve={curveMonotoneX}
                />
                 {/* Daytime Recovery */}
                 <LinePath<DailyResilience>
                  data={data}
                  x={d => xScale(getX(d)) ?? 0}
                  y={d => yScale(getContributor(d, 'daytime_recovery')) ?? 0}
                  stroke="#00f2fe" // Cyan
                  strokeWidth={1} 
                  curve={curveMonotoneX}
                />
                 {/* Stress */}
                 <LinePath<DailyResilience>
                  data={data}
                  x={d => xScale(getX(d)) ?? 0}
                  y={d => yScale(getContributor(d, 'stress')) ?? 0}
                  stroke="#ff0844" // Red
                  strokeWidth={1} 
                  curve={curveMonotoneX}
                />
              </Group>
            </BaseChart>
          );
        }}
      </ParentSize>
    </div>
  );
};

// --- Cardiovascular Age Chart ---
export const CardioAgeChart: React.FC<ChartProps<DailyCardiovascularAge>> = ({ data, darkMode = false }) => {
  const theme = getTheme(darkMode);

  return (
    <div style={{ width: '100%', height: '100%', minHeight: 0, overflow: 'hidden' }}>
      <ParentSize>
        {({ width, height }) => {
          if (width < 10 || height < 10) return null;
          
          const margin = { top: 20, right: 10, bottom: 20, left: 30 };
          const xMax = width - margin.left - margin.right;
          const yMax = height - margin.top - margin.bottom;

          const getAge = (d: DailyCardiovascularAge) => d.vascular_age || 0;

          const xScale = scaleTime({
            range: [0, xMax],
            domain: [Math.min(...data.map(d => getX(d).getTime())), Math.max(...data.map(d => getX(d).getTime()))],
          });

          // Dynamic domain for age
          const ages = data.map(getAge).filter(a => a > 0);
          const minAge = Math.min(...ages);
          const maxAge = Math.max(...ages);
          
          const yScale = scaleLinear<number>({
            range: [yMax, 0],
            domain: [minAge - 5, maxAge + 5], 
          });

          return (
            <BaseChart width={width} height={height} darkMode={darkMode} title="VASCULAR AGE">
              <Group left={margin.left} top={margin.top}>
                <GridRows scale={yScale} width={xMax} height={yMax} stroke={theme.grid} strokeDasharray="1 3" strokeWidth={0.5} />
                
                <AxisBottom
                  top={yMax}
                  scale={xScale}
                  numTicks={5}
                  tickFormat={(d) => format(d as Date, 'dd')}
                  stroke={theme.text}
                  tickStroke={theme.text}
                  tickLabelProps={() => ({
                    fill: theme.text,
                    fontSize: 8,
                    textAnchor: 'middle',
                    fontFamily: darkMode ? '"Courier New", Courier, monospace' : 'sans-serif'
                  })}
                />
                
                <AxisLeft
                  scale={yScale}
                  stroke={theme.text}
                  tickStroke={theme.text}
                  numTicks={4}
                  tickLabelProps={() => ({
                    fill: theme.text,
                    fontSize: 8,
                    textAnchor: 'end',
                    dy: '0.33em',
                    fontFamily: darkMode ? '"Courier New", Courier, monospace' : 'sans-serif'
                  })}
                />

                <LinePath<DailyCardiovascularAge>
                  data={data}
                  x={d => xScale(getX(d)) ?? 0}
                  y={d => yScale(getAge(d)) ?? 0}
                  stroke={theme.line}
                  strokeWidth={1} 
                  curve={curveMonotoneX}
                />
                
                {data.map((d, i) => (
                  <circle
                    key={i}
                    cx={xScale(getX(d))}
                    cy={yScale(getAge(d))}
                    r={1.5}
                    fill={theme.background}
                    stroke={theme.line}
                    strokeWidth={1}
                  />
                ))}
              </Group>
            </BaseChart>
          );
        }}
      </ParentSize>
    </div>
  );
};

// --- VO2 Max Chart ---
export const VO2MaxChart: React.FC<ChartProps<VO2Max>> = ({ data, darkMode = false }) => {
  const theme = getTheme(darkMode);

  return (
    <div style={{ width: '100%', height: '100%', minHeight: 0, overflow: 'hidden' }}>
      <ParentSize>
        {({ width, height }) => {
          if (width < 10 || height < 10) return null;
          
          const margin = { top: 20, right: 10, bottom: 20, left: 30 };
          const xMax = width - margin.left - margin.right;
          const yMax = height - margin.top - margin.bottom;

          const getValue = (d: VO2Max) => d.vo2_max;

          const xScale = scaleTime({
            range: [0, xMax],
            domain: [Math.min(...data.map(d => getX(d).getTime())), Math.max(...data.map(d => getX(d).getTime()))],
          });

          const values = data.map(getValue);
          const minVal = Math.min(...values);
          const maxVal = Math.max(...values);
          
          const yScale = scaleLinear<number>({
            range: [yMax, 0],
            domain: [minVal - 5, maxVal + 5], 
          });

          return (
            <BaseChart width={width} height={height} darkMode={darkMode} title="VO2 MAX">
              <Group left={margin.left} top={margin.top}>
                <GridRows scale={yScale} width={xMax} height={yMax} stroke={theme.grid} strokeDasharray="1 3" strokeWidth={0.5} />
                
                <AxisBottom
                  top={yMax}
                  scale={xScale}
                  numTicks={5}
                  tickFormat={(d) => format(d as Date, 'dd')}
                  stroke={theme.text}
                  tickStroke={theme.text}
                  tickLabelProps={() => ({
                    fill: theme.text,
                    fontSize: 8,
                    textAnchor: 'middle',
                    fontFamily: darkMode ? '"Courier New", Courier, monospace' : 'sans-serif'
                  })}
                />
                
                <AxisLeft
                  scale={yScale}
                  stroke={theme.text}
                  tickStroke={theme.text}
                  numTicks={4}
                  tickLabelProps={() => ({
                    fill: theme.text,
                    fontSize: 8,
                    textAnchor: 'end',
                    dy: '0.33em',
                    fontFamily: darkMode ? '"Courier New", Courier, monospace' : 'sans-serif'
                  })}
                />

                <LinePath<VO2Max>
                  data={data}
                  x={d => xScale(getX(d)) ?? 0}
                  y={d => yScale(getValue(d)) ?? 0}
                  stroke="#ff1493"
                  strokeWidth={2} 
                  curve={curveMonotoneX}
                />
                
                {data.map((d, i) => (
                  <circle
                    key={i}
                    cx={xScale(getX(d))}
                    cy={yScale(getValue(d))}
                    r={2}
                    fill={theme.background}
                    stroke="#ff1493"
                    strokeWidth={1}
                  />
                ))}
              </Group>
            </BaseChart>
          );
        }}
      </ParentSize>
    </div>
  );
};

// --- Sleep Detail Chart (Stacked Durations) ---
export const SleepDetailChart: React.FC<ChartProps<Sleep>> = ({ data, darkMode = false }) => {
  const theme = getTheme(darkMode);

  return (
    <div style={{ width: '100%', height: '100%', minHeight: 0, overflow: 'hidden' }}>
      <ParentSize>
        {({ width, height }) => {
          if (width < 10 || height < 10) return null;
          
          const margin = { top: 20, right: 10, bottom: 20, left: 30 };
          const xMax = width - margin.left - margin.right;
          const yMax = height - margin.top - margin.bottom;

          const xScale = scaleBand<string>({
            range: [0, xMax],
            round: true,
            domain: data.map(d => d.day),
            padding: 0.2,
          });

          // Convert seconds to hours for better readability
          // Stack order: Deep, REM, Light, Awake
          const mm = (v: number) => v / 3600; 

          const yScale = scaleLinear<number>({
            range: [yMax, 0],
            round: true,
            domain: [0, Math.max(...data.map(d => mm(d.total_sleep_duration + d.awake_time)))],
          });

          return (
            <BaseChart width={width} height={height} darkMode={darkMode} title="SLEEP STAGES (HR)">
               <Group left={margin.left} top={margin.top}>
                <GridRows scale={yScale} width={xMax} height={yMax} stroke={theme.grid} strokeDasharray="1 3" strokeWidth={0.5} />
                
                <AxisBottom
                  top={yMax}
                  scale={xScale}
                  tickFormat={(d) => format(parseISO(d), 'dd')}
                  stroke={theme.text}
                  tickStroke={theme.text}
                  tickLabelProps={() => ({
                    fill: theme.text,
                    fontSize: 8,
                    textAnchor: 'middle',
                    fontFamily: darkMode ? '"Courier New", Courier, monospace' : 'sans-serif'
                  })}
                />
                <AxisLeft
                  scale={yScale}
                  stroke={theme.text}
                  tickStroke={theme.text}
                  numTicks={4}
                  tickLabelProps={() => ({
                    fill: theme.text,
                    fontSize: 8,
                    textAnchor: 'end',
                    dy: '0.33em',
                    fontFamily: darkMode ? '"Courier New", Courier, monospace' : 'sans-serif'
                  })}
                />

                {data.map((d) => {
                  const day = d.day;
                  const x = xScale(day) ?? 0;
                  const w = xScale.bandwidth();
                  
                  // Calculate heights
                  const deep = mm(d.deep_sleep_duration);
                  const rem = mm(d.rem_sleep_duration);
                  const light = mm(d.light_sleep_duration);
                  const awake = mm(d.awake_time);

                  // Stack bottoms
                  const yLines = [
                    { h: deep, fill: '#1f77b4' },  // Deep Blue
                    { h: rem, fill: '#aec7e8' },   // Light Blue
                    { h: light, fill: '#ffbb78' }, // Light Orange
                    { h: awake, fill: '#d62728' }  // Red (Awake)
                  ];

                  let currentY = yMax;
                  return (
                    <g key={`stack-${day}`}>
                       {yLines.map((item, idx) => {
                         const h = (item.h / (yScale.domain()[1] - yScale.domain()[0])) * yMax;
                         const y = currentY - h;
                         currentY = y;
                         return (
                           <rect key={idx} x={x} y={y} width={w} height={h} fill={item.fill} />
                         );
                       })}
                    </g>
                  );
                })}

              </Group>
            </BaseChart>
          );
        }}
      </ParentSize>
    </div>
  );
};

// --- Info Cards (Scrollable Lists or Simple Displays) ---
// Using a generic container style that matches the charts

const InfoCardContainer = ({ title, darkMode, children }: { title: string, darkMode: boolean, children: React.ReactNode }) => {
  const theme = getTheme(darkMode);
  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      backgroundColor: theme.background, 
      color: theme.text,
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ 
        position: 'absolute',
        top: 4,
        left: 8,
        fontFamily: darkMode ? '"Courier New", Courier, monospace' : 'sans-serif',
        textTransform: 'uppercase',
        fontSize: '10px',
        fontWeight: 'bold',
        opacity: 0.8,
        zIndex: 10
      }}>
        {title}
      </div>
      <div style={{ marginTop: 20, padding: 10, overflowY: 'auto', flex: 1, fontSize: '11px', fontFamily: darkMode ? '"Courier New", Courier, monospace' : 'sans-serif' }}>
        {children}
      </div>
    </div>
  );
};

export const RingConfigCard: React.FC<ChartProps<RingConfiguration>> = ({ data, darkMode = false }) => (
  <InfoCardContainer title="RING CONFIG" darkMode={darkMode}>
    {data.map((d, i) => (
      <div key={i} style={{ marginBottom: 8, borderBottom: '1px solid #333', paddingBottom: 4 }}>
        <div><strong>Color:</strong> {d.color}</div>
        <div><strong>Size:</strong> {d.size}</div>
        <div><strong>Firmware:</strong> {d.firmware_version}</div>
        <div><strong>Setup:</strong> {d.set_up_at.split('T')[0]}</div>
      </div>
    ))}
    {data.length === 0 && <div style={{ opacity: 0.5 }}>No Data</div>}
  </InfoCardContainer>
);

export const SleepTimeCard: React.FC<ChartProps<SleepTime>> = ({ data, darkMode = false }) => (
  <InfoCardContainer title="SLEEP WINDOWS" darkMode={darkMode}>
    {data.map((d, i) => (
       <div key={i} style={{ marginBottom: 8, borderBottom: '1px solid #333', paddingBottom: 4 }}>
         <div style={{opacity: 0.7}}>{d.day}</div>
         <div><strong>Status:</strong> {d.status}</div>
         {d.optimal_bedtime && (
           <div>
             Offset: {Math.round(d.optimal_bedtime.start_offset / 3600)}h - {Math.round(d.optimal_bedtime.end_offset / 3600)}h
           </div>
         )}
         <div style={{fontSize: '9px', fontStyle: 'italic'}}>{d.recommendation}</div>
       </div>
    ))}
    {data.length === 0 && <div style={{ opacity: 0.5 }}>No Data</div>}
  </InfoCardContainer>
);

export const RestModeCard: React.FC<ChartProps<RestModePeriod>> = ({ data, darkMode = false }) => (
  <InfoCardContainer title="REST MODE" darkMode={darkMode}>
     {data.map((d, i) => (
       <div key={i} style={{ marginBottom: 8, borderBottom: '1px solid #333', paddingBottom: 4 }}>
         <div>{d.start_day} -&gt; {d.end_day || 'Ongoing'}</div>
         {d.episodes.map((ep, k) => (
           <div key={k} style={{paddingLeft: 4, fontSize: '9px'}}>
             - {ep.tags.join(', ')}
           </div>
         ))}
       </div>
    ))}
    {data.length === 0 && <div style={{ opacity: 0.5 }}>No Rest Modes Active</div>}
  </InfoCardContainer>
);

export const SimpleListCard: React.FC<ChartProps<any> & { title: string, renderItem: (d: any) => React.ReactNode }> = ({ data, darkMode = false, title, renderItem }) => (
  <InfoCardContainer title={title} darkMode={darkMode}>
    {data.map((d, i) => (
      <div key={i} style={{ marginBottom: 6, borderBottom: '1px solid #333', paddingBottom: 2 }}>
        {renderItem(d)}
      </div>
    ))}
    {data.length === 0 && <div style={{ opacity: 0.5 }}>No Data</div>}
  </InfoCardContainer>
);
