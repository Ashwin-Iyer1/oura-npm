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
import { DailyActivity, DailyReadiness, DailySleep } from '../types';

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
