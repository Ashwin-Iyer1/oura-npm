# Oura Stats Visualizer

A plug-and-play React library for visualizing data from the Oura Ring V2 API.

![Charts Preview](https://via.placeholder.com/800x400?text=Oura+Stats+Visualizer+Demo)

## Features is includes

- **Ready-to-use Dashboard**: A complete `OuraDashboard` component that fetches and visualizes data.
- **Individual Charts**: `ActivityChart`, `ReadinessChart`, and `SleepChart` components exportable for custom layouts.
- **TypeScript Support**: Full typing for Oura V2 API responses.
- **Date Range Support**: Easily configurable start and end dates.

## Installation

```bash
npm install oura-stats-visualizer
# or
yarn add oura-stats-visualizer
```

## Usage

### Full Dashboard

The easiest way to get started is using the `OuraDashboard` component. You just need to provide a Personal Access Token.

```tsx
import { OuraDashboard } from 'oura-stats-visualizer';

function App() {
  return (
    <OuraDashboard 
      accessToken="YOUR_PERSONAL_ACCESS_TOKEN" 
    />
  );
}
```

### Custom Implementation

You can also use the `useOuraData` hook and singular chart components to build your own view.

```tsx
import { useOuraData, SleepChart, ActivityChart } from 'oura-stats-visualizer';

function MyHealthPage() {
  const { data, loading, error } = useOuraData({
    accessToken: 'YOUR_TOKEN',
    startDate: '2023-01-01',
    endDate: '2023-01-31'
  });

  if (loading) return <div>Loading...</div>;
  if (!data) return null;

  return (
    <div>
      <h1>My Sleep</h1>
      <SleepChart data={data.sleep} />
      
      <h1>My Activity</h1>
      <ActivityChart data={data.activity} />
    </div>
  );
}
```

## Requirements

- React 18+
- Oura Personal Access Token (get one [here](https://cloud.ouraring.com/personal-access-tokens))

## License

ISC
