import React, { useId, useState } from 'react';
import type { DailyPoint } from '../data/series';

export interface TimeSeriesChartProps {
  data: readonly DailyPoint[];
  label: string;
  unit?: string;
  domain?: readonly [number, number];
  color?: string;
  darkMode?: boolean;
  formatValue?: (value: number) => string;
}

/** Responsive SVG with truthful gaps and an equivalent keyboard date inspector. */
export function TimeSeriesChart({ data, label, unit = '', domain, color = '#688b7a', darkMode = false, formatValue = value => value.toFixed(0) }: TimeSeriesChartProps) {
  const id = useId();
  const [selected, setSelected] = useState<number | null>(null);
  const valid = data.filter(point => point.value !== null && Number.isFinite(point.value));
  const minimum = domain?.[0] ?? 0;
  const maximum = domain?.[1] ?? Math.max(1, ...valid.map(point => point.value as number)) * 1.1;
  const width = 900, height = 280, left = 44, right = 18, top = 18, bottom = 34;
  const x = (index: number) => left + (data.length <= 1 ? (width - left - right) / 2 : index / (data.length - 1) * (width - left - right));
  const y = (value: number) => top + (1 - (value - minimum) / Math.max(1, maximum - minimum)) * (height - top - bottom);
  const index = Math.min(selected ?? data.length - 1, data.length - 1);
  const point = data[index];
  const ink = darkMode ? '#dce5e3' : '#334947';
  const muted = darkMode ? '#9caeab' : '#657d76';
  const grid = darkMode ? '#293c39' : '#dce5df';
  let path = '', connected = false;
  data.forEach((point, index) => {
    if (point.value === null || !Number.isFinite(point.value)) { connected = false; return; }
    path += `${connected ? 'L' : 'M'}${x(index).toFixed(2)},${y(point.value).toFixed(2)} `;
    connected = true;
  });
  const formatDay = (day: string) => new Date(`${day}T12:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
  if (!valid.length) return <p role="status" style={{ padding: 32, color: muted }}>No observations available for {label.toLowerCase()} in this range.</p>;
  return <div style={{ color: ink, width: '100%' }}>
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', display: 'block', overflow: 'visible' }} role="img" aria-labelledby={`${id}-title ${id}-desc`} onPointerMove={event => {
      const rect = event.currentTarget.getBoundingClientRect();
      const relative = (event.clientX - rect.left) / rect.width * width;
      setSelected(Math.max(0, Math.min(data.length - 1, Math.round((relative - left) / (width - left - right) * (data.length - 1)))));
    }}>
      <title id={`${id}-title`}>{`${label} over ${data.length} days`}</title><desc id={`${id}-desc`}>Gaps indicate missing observations. Use the date slider below to inspect each value.</desc>
      {[0, 1, 2, 3, 4].map(step => { const value = minimum + (maximum - minimum) * step / 4; return <g key={step}><line x1={left} x2={width-right} y1={y(value)} y2={y(value)} stroke={grid} strokeDasharray="3 5"/><text x={left - 10} y={y(value) + 4} textAnchor="end" fill={muted} fontSize={11}>{formatValue(value)}</text></g>; })}
      <path d={path} stroke={color} fill="none" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round"/>
      {data.map((point, pointIndex) => point.value !== null && Number.isFinite(point.value) ? <circle key={point.day} cx={x(pointIndex)} cy={y(point.value)} r={pointIndex === index ? 5 : data.length <= 14 ? 2.5 : 0} fill={color}/> : null)}
      {point && <line x1={x(index)} x2={x(index)} y1={top} y2={height-bottom} stroke={muted} strokeDasharray="3 5" opacity={.6}/>}
      {[0, Math.floor((data.length - 1)/2), data.length-1].filter((value, index, all) => all.indexOf(value) === index).map(tick => <text key={tick} x={x(tick)} y={height-9} fill={muted} fontSize={11} textAnchor={tick === 0 ? 'start' : tick === data.length-1 ? 'end' : 'middle'}>{formatDay(data[tick].day)}</text>)}
    </svg>
    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 16, fontSize: 12, marginTop: 12 }}>
      <label htmlFor={`${id}-inspect`}>Inspect a day</label>
      <input id={`${id}-inspect`} type="range" min={0} max={Math.max(0, data.length-1)} value={Math.max(0,index)} onChange={event => setSelected(Number(event.target.value))} aria-valuetext={point ? `${formatDay(point.day)}: ${point.value === null ? 'No observation' : `${formatValue(point.value)} ${unit}`}` : 'No data'} style={{ accentColor: color, flex: '1 1 140px', maxWidth: 260 }}/>
      <output htmlFor={`${id}-inspect`} style={{ marginLeft: 'auto', color: muted }}>{point ? `${formatDay(point.day)} · ${point.value === null ? 'No observation' : `${formatValue(point.value)} ${unit}`}` : 'No data'}</output>
    </div>
  </div>;
}
