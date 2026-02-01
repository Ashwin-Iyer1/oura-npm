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
    <div style={{ position: 'relative' }}>
      <h3 style={{ 
        textAlign: 'left', 
        marginBottom: 20, 
        color: theme.text,
        fontFamily: darkMode ? '"Courier New", Courier, monospace' : 'sans-serif',
        textTransform: 'uppercase',
        letterSpacing: '2px',
        fontSize: '16px',
        fontWeight: 'normal',
        borderBottom: `1px solid ${darkMode ? '#333' : '#eee'}`,
        paddingBottom: '10px'
      }}>
        {title}
      </h3>
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
    <ParentSize>
      {({ width, height }) => {
        if (width < 10) return null;
        
        // Margins
        const margin = { top: 20, right: 30, bottom: 40, left: 50 };
        const xMax = width - margin.left - margin.right;
        const yMax = height - margin.top - margin.bottom;

        // Data Accessors
        const getSteps = (d: DailyActivity) => d.steps;
        
        // Scales
        const xScale = scaleBand<string>({
          range: [0, xMax],
          round: true,
          domain: data.map(d => d.day),
          padding: 0.4,
        });
        
        const yScale = scaleLinear<number>({
          range: [yMax, 0],
          round: true,
          domain: [0, Math.max(...data.map(getSteps))],
        });

        return (
          <BaseChart width={width} height={350} darkMode={darkMode} title="Steps (Activity)">
            <Group left={margin.left} top={margin.top}>
              <GridRows scale={yScale} width={xMax} height={yMax} stroke={theme.grid} strokeDasharray="2 2" />
              
              <AxisBottom
                top={yMax}
                scale={xScale}
                tickFormat={(d) => format(parseISO(d), 'dd')}
                stroke={theme.text}
                tickStroke={theme.text}
                tickLabelProps={() => ({
                  fill: theme.text,
                  fontSize: 10,
                  textAnchor: 'middle',
                  fontFamily: darkMode ? '"Courier New", Courier, monospace' : 'sans-serif'
                })}
              />
              
              <AxisLeft
                scale={yScale}
                stroke={theme.text}
                tickStroke={theme.text}
                tickLabelProps={() => ({
                  fill: theme.text,
                  fontSize: 10,
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
                    fillOpacity={0.9}
                  />
                );
              })}
            </Group>
          </BaseChart>
        );
      }}
    </ParentSize>
  );
};

// --- Readiness Chart ---
export const ReadinessChart: React.FC<ChartProps<DailyReadiness>> = ({ data, darkMode = false }) => {
  const theme = getTheme(darkMode);

  return (
    <ParentSize>
      {({ width, height }) => {
        if (width < 10) return null;
        
        const margin = { top: 20, right: 30, bottom: 40, left: 50 };
        const xMax = width - margin.left - margin.right;
        const yMax = height - margin.top - margin.bottom;

        const getScore = (d: DailyReadiness) => d.score;

        const xScale = scaleTime({
          range: [0, xMax],
          domain: [Math.min(...data.map(d => getX(d).getTime())), Math.max(...data.map(d => getX(d).getTime()))],
        });

        const yScale = scaleLinear<number>({
          range: [yMax, 0],
          domain: [40, 100], // Readiness usually 0-100, but zoomed in looks better
        });

        return (
          <BaseChart width={width} height={350} darkMode={darkMode} title="Readiness Score">
            <Group left={margin.left} top={margin.top}>
              <LinearGradient id="area-gradient" from={theme.areaGradientFrom} to={theme.areaGradientTo} toOpacity={0} fromOpacity={0.2} />
              
              <GridRows scale={yScale} width={xMax} height={yMax} stroke={theme.grid} strokeDasharray="2 2" />
              
              <AxisBottom
                top={yMax}
                scale={xScale}
                numTicks={5}
                tickFormat={(d) => format(d as Date, 'MMM dd')}
                stroke={theme.text}
                tickStroke={theme.text}
                tickLabelProps={() => ({
                  fill: theme.text,
                  fontSize: 10,
                  textAnchor: 'middle',
                  fontFamily: darkMode ? '"Courier New", Courier, monospace' : 'sans-serif'
                })}
              />
              
              <AxisLeft
                scale={yScale}
                stroke={theme.text}
                tickStroke={theme.text}
                tickLabelProps={() => ({
                  fill: theme.text,
                  fontSize: 10,
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
                fill="url(#area-gradient)"
                curve={curveMonotoneX}
              />

              <LinePath<DailyReadiness>
                data={data}
                x={d => xScale(getX(d)) ?? 0}
                y={d => yScale(getScore(d) || 0) ?? 0}
                stroke={theme.line}
                strokeWidth={1.5}
                curve={curveMonotoneX}
              />
              
              {/* Data Points */}
              {data.map((d, i) => (
                <circle
                  key={i}
                  cx={xScale(getX(d))}
                  cy={yScale(getScore(d) || 0)}
                  r={3}
                  fill={theme.background}
                  stroke={theme.line}
                  strokeWidth={1.5}
                />
              ))}
            </Group>
          </BaseChart>
        );
      }}
    </ParentSize>
  );
};

// --- Sleep Chart ---
export const SleepChart: React.FC<ChartProps<DailySleep>> = ({ data, darkMode = false }) => {
  const theme = getTheme(darkMode);

  return (
    <ParentSize>
      {({ width, height }) => {
        if (width < 10) return null;
        
        const margin = { top: 20, right: 30, bottom: 40, left: 50 };
        const xMax = width - margin.left - margin.right;
        const yMax = height - margin.top - margin.bottom;

        const getScore = (d: DailySleep) => d.score;

        const xScale = scaleBand<string>({
          range: [0, xMax],
          round: true,
          domain: data.map(d => d.day),
          padding: 0.4,
        });

        const yScale = scaleLinear<number>({
          range: [yMax, 0],
          domain: [0, 100],
        });

        return (
          <BaseChart width={width} height={350} darkMode={darkMode} title="Sleep Score">
            <Group left={margin.left} top={margin.top}>
              <GridRows scale={yScale} width={xMax} height={yMax} stroke={theme.grid} strokeDasharray="2 2" />
              
              <AxisBottom
                top={yMax}
                scale={xScale}
                tickFormat={(d) => format(parseISO(d), 'dd')}
                stroke={theme.text}
                tickStroke={theme.text}
                tickLabelProps={() => ({
                  fill: theme.text,
                  fontSize: 10,
                  textAnchor: 'middle',
                  fontFamily: darkMode ? '"Courier New", Courier, monospace' : 'sans-serif'
                })}
              />
              
              <AxisLeft
                scale={yScale}
                stroke={theme.text}
                tickStroke={theme.text}
                tickLabelProps={() => ({
                  fill: theme.text,
                  fontSize: 10,
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
                    fillOpacity={0.8}
                    rx={2}
                  />
                );
              })}
            </Group>
          </BaseChart>
        );
      }}
    </ParentSize>
  );
};
