import { useMemo, useState } from 'react';
import { useOuraData, TimeSeriesChart, comparePeriods, summarizeSeries } from 'oura-stats-visualizer';
import type { OuraCollection } from 'oura-stats-visualizer';
import { END_DAY, shiftDay, metrics, createSampleTransport, metricSeries, formatMetric } from './sample';
import type { MetricId } from './sample';
import './App.css';

const collections: OuraCollection[] = ['activity', 'readiness', 'sleep', 'sleep_documents'];
const dateLabel = (day: string) => new Date(`${day}T12:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });

export default function App() {
  const [days, setDays] = useState(30);
  const [selected, setSelected] = useState<MetricId>('sleep');
  const [dark, setDark] = useState(false);
  const [failure, setFailure] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const fetchImpl = useMemo(() => createSampleTransport(failure), [failure]);
  const { data, loading, error, errors, refresh } = useOuraData({ accessToken: 'synthetic-demo-only', startDate: shiftDay(END_DAY, -days * 2 + 1), endDate: END_DAY, useSandbox: true, baseUrl: '/synthetic/usercollection', collections, fetchImpl });
  const metric = metrics.find(item => item.id === selected)!;
  const current = metricSeries(data, selected, END_DAY, days);
  const previous = metricSeries(data, selected, shiftDay(END_DAY, -days), days);
  const comparison = comparePeriods(current, previous);
  const unavailable = errors[metric.collection as OuraCollection];
  const fullDays = metrics.map(item => ({ ...item, summary: summarizeSeries(metricSeries(data, item.id, END_DAY, days)) }));
  const recovered = () => { if (failure) setFailure(false); else refresh(); };

  function exportCsv() {
    if (!data) return;
    const series = metrics.map(item => metricSeries(data, item.id, END_DAY, days));
    const rows = [['date', 'sleep_score', 'readiness_score', 'steps', 'sleep_hours', 'provenance'], ...current.map((point, index) => [point.day, ...series.map(values => values[index].value === null ? '' : String(values[index].value)), 'fictional generated sample'])];
    const csv = rows.map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'oura-fictional-sample.csv'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return <div className={`app ${dark ? 'dark' : ''}`}>
    <a className="skip" href="#dashboard">Skip to dashboard</a>
    <header className="header"><a className="wordmark" href="https://github.com/Ashwin-Iyer1/oura-npm"><span className="ring-mark" aria-hidden="true"/>oura<span className="wordmark-detail">stats / visualizer</span></a><div className="header-actions"><a href="https://www.npmjs.com/package/oura-stats-visualizer" target="_blank" rel="noopener noreferrer">React library ↗</a><button type="button" onClick={() => setDark(value => !value)} aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}>{dark ? '☼' : '◐'}</button></div></header>
    <main className="shell"><section className="hero"><div><p className="eyebrow"><span/> A clearer view of your everyday</p><h1>Small rhythms.<br/><em>A bigger picture.</em></h1><p className="hero-copy">Sleep, movement, and recovery, in perspective. A thoughtful interface for exploring the patterns behind the numbers.</p></div><div className="sample-card"><div className="orbital" aria-hidden="true"><span/><span/><span/></div><p className="eyebrow">The interactive collection</p><h2>Made for a closer look.</h2><p>Explore a fictional 120-day dataset with the same typed data loader used by the library.</p><span className="sample-badge">Synthetic data · No account required</span></div></section>

    <section id="dashboard" className="dashboard" tabIndex={-1} aria-labelledby="dashboard-title"><div className="dashboard-heading"><div><p className="eyebrow">Your sample at a glance</p><h2 id="dashboard-title">The daily overview.</h2><p className="date-range">{dateLabel(shiftDay(END_DAY, -days + 1))} – {dateLabel(END_DAY)}, 2026</p></div><div className="range-control" role="group" aria-label="Date range">{[7,14,30,60].map(value => <button key={value} type="button" aria-pressed={days === value} onClick={() => setDays(value)}>{value} days</button>)}</div></div>
      <div className="sample-disclosure"><span aria-hidden="true">✳</span><p>Every value is generated for this demo. No personal health data, Oura connection, or medical interpretation.</p></div>
      <div className="metric-grid" aria-label="Choose a metric">{fullDays.map(item => { const failed = errors[item.collection as OuraCollection]; return <button type="button" key={item.id} className={`metric-card ${selected === item.id ? 'selected' : ''}`} onClick={() => setSelected(item.id)} aria-pressed={selected === item.id} style={{ '--metric-color': item.color } as React.CSSProperties}><span className="metric-label">{item.label}<span className="metric-symbol" aria-hidden="true">{item.id === 'sleep' ? '☾' : item.id === 'readiness' ? '◌' : item.id === 'steps' ? '↗' : '◷'}</span></span><span className="metric-value">{loading ? '…' : failed ? '—' : formatMetric(item.summary.mean, item.id)}<small>{item.unit}</small></span><span className="metric-caption">{loading ? 'Loading sample…' : failed ? 'Collection unavailable' : `${item.summary.count} of ${days} days observed`}</span></button>; })}</div>

      <article className="chart-card"><div className="chart-heading"><div><p className="eyebrow">Follow the rhythm</p><h3>{metric.label}</h3><p>{metric.description}</p></div><button type="button" className="quiet-button" onClick={() => setShowTable(value => !value)} aria-expanded={showTable} aria-controls="sample-table">{showTable ? 'Hide data table' : 'View data table'}</button></div>
        {loading ? <div className="chart-state" role="status"><span className="loading-line"/>Loading the sample collections…</div> : error ? <div className="chart-state" role="alert"><h4>Could not load this range.</h4><p>{error}</p><button type="button" onClick={refresh}>Try again</button></div> : unavailable ? <div className="chart-state error-state" role="status"><span aria-hidden="true">↻</span><h4>Readiness is taking a moment.</h4><p>This simulated endpoint returned HTTP 503. Sleep and movement are still available.</p><button type="button" className="solid-button" onClick={recovered}>Restore collection</button></div> : <TimeSeriesChart key={`${selected}-${days}`} data={current} label={metric.label} unit={metric.unit} domain={metric.domain} color={metric.color} darkMode={dark} formatValue={value => formatMetric(value, selected)}/>}
        <div className="chart-foot"><span><i style={{ background: metric.color }}/>Daily observation</span><span>Gaps stay visible. Missing days are never zero.</span></div>
        {showTable && <div id="sample-table" className="table-wrap"><table><caption>Fictional {metric.label.toLowerCase()} observations · {metric.unit}</caption><thead><tr><th scope="col">Date</th><th scope="col">Value</th><th scope="col">Status</th></tr></thead><tbody>{current.map(point => <tr key={point.day}><th scope="row">{dateLabel(point.day)}</th><td>{formatMetric(point.value, selected)}</td><td>{point.value === null ? 'Missing observation' : 'Synthetic sample'}</td></tr>)}</tbody></table></div>}
      </article>

      <div className="insight-grid"><article className="insight-card"><p className="eyebrow">A fair comparison</p><h3>{comparison.difference === null || loading ? '—' : `${comparison.difference > 0 ? '+' : ''}${selected === 'duration' ? comparison.difference.toFixed(1) : Math.round(comparison.difference).toLocaleString()}`}<small>{metric.unit}</small></h3><p>Change in the observed mean versus the preceding {days} days. This is a descriptive difference, not a causal explanation.</p><span>{loading ? 'Loading observations…' : `${comparison.current.count} current · ${comparison.previous.count} previous observations`}</span></article><article className="insight-card"><p className="eyebrow">Keep the context</p><h3>{loading ? '—' : `${comparison.current.count}/${days}`}<small>days</small></h3><p>{unavailable ? 'This collection is temporarily unavailable. Other collections continue to work.' : comparison.current.missing ? `${comparison.current.missing} missing ${comparison.current.missing === 1 ? 'observation is' : 'observations are'} excluded from the average. The line breaks where a day is missing.` : 'Every day in this range has an observation. The selected metric uses its own scale and unit.'}</p><span>Complete dates · No silent imputation</span></article><article className="insight-card engineering-card"><p className="eyebrow">Built for imperfect data</p><h3>One issue.<br/>Not a blank screen.</h3><p>Try an unavailable readiness endpoint. Other collections keep their results.</p><button type="button" className="quiet-button" aria-pressed={failure} onClick={() => { setFailure(value => !value); if (!failure) setSelected('readiness'); }}>{failure ? 'Restore readiness endpoint' : 'Simulate a sync issue'} <span aria-hidden="true">↗</span></button></article></div>
      <div className="data-actions"><p role="status">{loading ? 'Fetching paginated sample collections…' : Object.keys(errors).length ? `${Object.keys(errors).length} collection unavailable · other results preserved` : 'Sample loaded locally · no network data requests'}</p><button type="button" className="quiet-button" disabled={!data || loading} onClick={exportCsv}>Export sample CSV ↓</button></div>
    </section>

    <section className="build-section"><div><p className="eyebrow">Beyond the dashboard</p><h2>A library to build on.</h2><p>Typed collections, reusable charts, and a data layer that can handle missing scopes, paginated responses, and changing date ranges.</p><div className="build-links"><a href="https://github.com/Ashwin-Iyer1/oura-npm" target="_blank" rel="noopener noreferrer">Explore the source ↗</a><a href="https://www.npmjs.com/package/oura-stats-visualizer" target="_blank" rel="noopener noreferrer">View the package ↗</a></div></div><div className="code-card"><span>React + TypeScript</span><pre><code>{`const { data, errors, refresh } = useOuraData({\n  accessToken,\n  startDate,\n  endDate,\n  collections: ['sleep', 'readiness', 'activity'],\n  useSandbox: false,\n});\n\n// A failed collection has its own error.\n// Successful collections remain available.`}</code></pre></div></section>
    </main><footer className="footer"><span>Oura Stats Visualizer · An independent project by Ashwin Iyer</span><span>Not affiliated with Oura · Fictional demonstration data</span></footer>
  </div>;
}
