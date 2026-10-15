# Oura Stats Visualizer

A React + TypeScript library for Oura API v2 collections, reusable charts, and dashboards. The interactive gallery demonstrates the real data hook with original synthetic fixtures: no account, token, or personal health data is used.

## Explore the gallery

```powershell
npm ci
npm --prefix examples/demo-app ci
npm run build:demo
python -m http.server 4175
```

Open **http://localhost:4175/demo/dist/**. The complete static output is `demo/dist/`; copy that directory to any HTTP host, including a nested path. Runtime assets use relative URLs and the sample transport makes no network data requests.

The gallery includes four metrics, 7/14/30/60-day ranges, light/dark themes, a pointer and keyboard date inspector, an accessible data table, period comparisons, observation counts, CSV export, and a simulated readiness outage with recovery. Missing days remain gaps and never become zeroes. Every sample value is generated deterministically in `examples/demo-app/src/sample.ts`; the numbers do not describe a person or support medical conclusions.

## Library usage

```tsx
import { OuraDashboard } from 'oura-stats-visualizer';

<OuraDashboard
  accessToken={accessToken}
  useSandbox={false}
  startDate="2026-10-01"
  endDate="2026-10-15"
  collections={['sleep', 'readiness', 'activity']}
/>;
```

The existing API remains available. The current source also exports a resilient client, collection errors and refresh, a reusable `TimeSeriesChart`, and numeric summary helpers. These additions require building this checkout; they are not claimed as published to npm yet.

```tsx
import { useOuraData, TimeSeriesChart } from 'oura-stats-visualizer';

function SleepOverview({ accessToken }: { accessToken: string }) {
  const { data, loading, error, errors, refresh } = useOuraData({
    accessToken,
    startDate: '2026-10-01',
    endDate: '2026-10-15',
    useSandbox: false,
    collections: ['sleep', 'readiness'],
  });

  if (loading) return <p role="status">Loading…</p>;
  if (error) return <p role="alert">{error}</p>;
  return <>
    {errors.sleep && <p role="status">Sleep unavailable. <button onClick={refresh}>Retry</button></p>}
    <TimeSeriesChart
      label="Sleep score"
      unit="points"
      domain={[0, 100]}
      data={(data?.sleep || []).map(row => ({ day: row.day, value: row.score }))}
    />
  </>;
}
```

Provide a complete calendar sequence with `value: null` for missing days when chart gaps should be visible. `summarizeSeries` and `comparePeriods` exclude null/nonfinite observations and retain genuine zero values.

### Data-loading contract

- `data` retains successful collections even when another endpoint fails. Failed collections have an empty array and a corresponding entry in `errors`; an empty successful response has no error.
- `error` represents request-wide setup problems such as an invalid date range. `errors` maps individual collection names to safe request errors.
- Every collection follows `next_token` pagination. Repeated tokens or more than 100 pages become an explicit error instead of an infinite loop or silent truncation.
- Changing credentials, dates, collection selection, or transport cancels the previous request. Late responses cannot overwrite new data. Clearing the token clears previously loaded data.
- `refresh()` retries the selected collections. `collections` limits requested scopes/data. `fetchImpl` permits a custom transport; `timeoutMs` controls the per-collection deadline (default 15 seconds, including pagination).
- `fetchOuraData(options)` exposes the same loader outside React and accepts an `AbortSignal`. For standalone Node ESM, import it from `oura-stats-visualizer/dist/data/client.js`; the main entry point includes browser-oriented React charts.
- `useSandbox` defaults to `true` for compatibility. Set it to `false` explicitly for authorized production data. `ring_configuration` is skipped in sandbox mode. Heart-rate requests use UTC timestamps; endpoint range restrictions are surfaced as collection errors.

## Authentication

For new integrations, follow [Oura's OAuth documentation](https://cloud.ouraring.com/docs/authentication), which marks personal access tokens deprecated. Obtain an authorized access token through your application's authentication flow, request only needed scopes, and keep client secrets and refresh-token handling on your server. Never hardcode a production token in a public example.

The legacy auth helpers remain exported for compatibility; they do not implement a complete secure OAuth lifecycle. A production integration must validate its own random `state`, manage token expiry and refresh, and use a server proxy where browser access is unsuitable. The gallery intentionally exercises none of those live-account paths.

## Verification

```powershell
npm test
npm run build:demo
npx playwright install chromium --only-shell
npm run test:ui
```

Unit tests cover partial failures, pagination, invalid responses/dates, timeout and abort, auth clearing, stale response races, retry, missing observations, and SVG gaps. Browser tests cover actual gallery workflows, simulated outage recovery, CSV, keyboard inspection, no external data traffic, and both themes at 320/390/768/1440px.

React 18, a modern browser with Fetch/AbortController, and Node 18+ for standalone client execution are required. This project is independent of Oura and distributed under the ISC license.
