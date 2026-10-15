import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { TimeSeriesChart } from '../src/components/TimeSeriesChart.tsx';
test('chart exposes a keyboard inspector and breaks the line at missing days', () => {
  const html = renderToStaticMarkup(React.createElement(TimeSeriesChart, {label:'Sleep', data:[{day:'2026-10-01',value:70},{day:'2026-10-02',value:null},{day:'2026-10-03',value:80}], domain:[0,100]}));
  assert.match(html,/Inspect a day/); assert.match(html,/type="range"/); assert.match(html,/Gaps indicate missing observations/);
  const path = html.match(/<path d="([^"]*)"/)[1];
  assert.equal((path.match(/M/g)||[]).length,2); assert.equal((path.match(/L/g)||[]).length,0);
  assert.ok(!html.includes('NaN'));
});
test('empty and nonfinite series render an explicit status instead of invalid SVG', () => {
  for(const data of [[],[{day:'2026-10-01',value:null}],[{day:'2026-10-01',value:NaN}]]) {
    const html=renderToStaticMarkup(React.createElement(TimeSeriesChart,{label:'Sleep',data}));
    assert.match(html,/No observations available/); assert.ok(!html.includes('<svg'));
  }
});
