import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartData,
  ChartOptions,
  ScriptableContext
} from 'chart.js';
import { Chart, Line } from 'react-chartjs-2';
import { format, parseISO } from 'date-fns';
import { DailyActivity, DailyReadiness, DailySleep } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartProps<T> {
  data: T[];
  darkMode?: boolean;
}

const THEME = {
  light: {
    textColor: '#666',
    gridColor: 'rgba(0, 0, 0, 0.05)',
    tooltipBg: 'rgba(255, 255, 255, 0.9)',
    tooltipText: '#333',
    borderColor: '#e5e5e5',
    colors: {
      primary: 'rgba(136, 132, 216, 0.5)',
      primaryBorder: 'rgb(136, 132, 216)',
      secondary: 'rgba(130, 202, 157, 0.5)',
      secondaryBorder: 'rgb(130, 202, 157)',
      accent: 'rgba(255, 115, 0, 0.2)',
      accentBorder: 'rgb(255, 115, 0)',
    }
  },
  dark: {
    textColor: '#a0a0a0',
    gridColor: '#333',
    tooltipBg: '#050505',
    tooltipText: '#00ff9d',
    borderColor: '#333',
    colors: {
      primary: 'rgba(0, 243, 255, 0.2)', // Neon Cyan
      primaryBorder: '#00f3ff',
      secondary: 'rgba(0, 255, 157, 0.2)', // Neon Green
      secondaryBorder: '#00ff9d',
      accent: 'rgba(255, 0, 85, 0.2)',   // Neon Pink
      accentBorder: '#ff0055',
    }
  }
};

const getCommonOptions = (darkMode: boolean): ChartOptions => {
  const theme = darkMode ? THEME.dark : THEME.light;
  
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: theme.textColor,
          font: {
            family: darkMode ? '"Courier New", Courier, monospace' : undefined
          }
        }
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: theme.tooltipBg,
        titleColor: theme.tooltipText,
        bodyColor: theme.tooltipText,
        borderColor: theme.borderColor,
        borderWidth: 1,
        titleFont: {
            family: darkMode ? '"Courier New", Courier, monospace' : undefined
        },
        bodyFont: {
            family: darkMode ? '"Courier New", Courier, monospace' : undefined
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: theme.textColor,
          font: {
             family: darkMode ? '"Courier New", Courier, monospace' : undefined
          }
        }
      },
      y: {
        grid: {
          color: theme.gridColor,
          tickBorderDash: darkMode ? [5, 5] : [],
        },
        ticks: {
          color: theme.textColor,
          font: {
             family: darkMode ? '"Courier New", Courier, monospace' : undefined
          }
        },
        border: {
            dash: darkMode ? [5, 5] : [],
            color: theme.borderColor
        }
      }
    }
  };
};

export const ActivityChart: React.FC<ChartProps<DailyActivity>> = ({ data, darkMode = false }) => {
  const sortedData = [...data].sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime());
  const theme = darkMode ? THEME.dark : THEME.light;

  const chartData: ChartData<'bar' | 'line'> = {
    labels: sortedData.map(d => format(parseISO(d.day), 'MMM d')),
    datasets: [
      {
        type: 'bar' as const,
        label: 'Steps',
        data: sortedData.map(d => d.steps),
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primaryBorder,
        borderWidth: 1,
        yAxisID: 'y',
        order: 2,
      },
      {
        type: 'line' as const,
        label: 'Active Calories',
        data: sortedData.map(d => d.active_calories),
        borderColor: theme.colors.secondaryBorder,
        backgroundColor: theme.colors.secondary,
        borderWidth: 2,
        tension: 0.4,
        yAxisID: 'y1',
        order: 1,
        pointBackgroundColor: theme.colors.secondaryBorder,
        pointBorderColor: '#000',
      },
    ],
  };

  const options: ChartOptions<'bar' | 'line'> = {
    ...(getCommonOptions(darkMode) as any),
    scales: {
      ...getCommonOptions(darkMode).scales,
      y: {
        ...getCommonOptions(darkMode).scales?.y,
        type: 'linear',
        display: true,
        position: 'left',
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
            color: theme.textColor,
            font: {
                family: darkMode ? '"Courier New", Courier, monospace' : undefined
            }
        },
        border: {
            display: false // hide right border
        }
      },
    },
  };

  return (
    <div style={{ width: '100%', height: 350, padding: '10px' }}>
      <h3 style={{
        marginBottom: 10, 
        textAlign: 'center', 
        color: theme.textColor,
        fontFamily: darkMode ? '"Courier New", Courier, monospace' : undefined,
        textTransform: darkMode ? 'uppercase' : 'none',
        letterSpacing: darkMode ? '2px' : 'normal'
      }}>Activity Trends</h3>
      <div style={{ position: 'relative', height: '300px' }}>
        <Chart type='bar' data={chartData} options={options} />
      </div>
    </div>
  );
};

export const ReadinessChart: React.FC<ChartProps<DailyReadiness>> = ({ data, darkMode = false }) => {
  const sortedData = [...data].sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime());
  const theme = darkMode ? THEME.dark : THEME.light;

  const chartData: ChartData<'line'> = {
    labels: sortedData.map(d => format(parseISO(d.day), 'MMM d')),
    datasets: [
      {
        label: 'Readiness Score',
        data: sortedData.map(d => d.score),
        borderColor: theme.colors.accentBorder,
        backgroundColor: (context: ScriptableContext<'line'>) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          if (darkMode) {
              gradient.addColorStop(0, 'rgba(255, 0, 85, 0.5)');
              gradient.addColorStop(1, 'rgba(255, 0, 85, 0)');
          } else {
              gradient.addColorStop(0, 'rgba(255, 115, 0, 0.2)');
              gradient.addColorStop(1, 'rgba(255, 115, 0, 0)');
          }
          return gradient;
        },
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: theme.colors.accentBorder,
        pointBorderColor: darkMode ? '#000' : '#fff',
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    ...(getCommonOptions(darkMode) as any),
    scales: {
      ...getCommonOptions(darkMode).scales,
      y: {
        ...getCommonOptions(darkMode).scales?.y,
        min: 40,
        max: 100,
      }
    }
  };

  return (
    <div style={{ width: '100%', height: 350, padding: '10px' }}>
      <h3 style={{
        marginBottom: 10, 
        textAlign: 'center', 
        color: theme.textColor,
        fontFamily: darkMode ? '"Courier New", Courier, monospace' : undefined,
        textTransform: darkMode ? 'uppercase' : 'none',
        letterSpacing: darkMode ? '2px' : 'normal'
      }}>Readiness Score</h3>
      <div style={{ position: 'relative', height: '300px' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export const SleepChart: React.FC<ChartProps<DailySleep>> = ({ data, darkMode = false }) => {
  const sortedData = [...data].sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime());
  const theme = darkMode ? THEME.dark : THEME.light;

  const chartData: ChartData<'bar' | 'line'> = {
    labels: sortedData.map(d => format(parseISO(d.day), 'MMM d')),
    datasets: [
      {
        type: 'bar' as const,
        label: 'Sleep Score',
        data: sortedData.map(d => d.score),
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primaryBorder,
        borderWidth: 1,
        yAxisID: 'y',
        order: 2,
      },
      {
        type: 'line' as const,
        label: 'Total Sleep (h)',
        data: sortedData.map(d => d.contributors.total_sleep ? (d.contributors.total_sleep / 3600) : 0),
        borderColor: theme.colors.secondaryBorder,
        backgroundColor: theme.colors.secondary,
        borderWidth: 2,
        tension: 0.4,
        yAxisID: 'y1',
        order: 1,
        pointBackgroundColor: theme.colors.secondaryBorder,
        pointBorderColor: darkMode ? '#000' : '#fff',
      },
    ],
  };

  const options: ChartOptions<'bar' | 'line'> = {
    ...(getCommonOptions(darkMode) as any),
    scales: {
      ...getCommonOptions(darkMode).scales,
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        min: 0,
        max: 100,
        ...getCommonOptions(darkMode).scales?.y,
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: 'Hours',
          color: theme.textColor,
          font: {
            family: darkMode ? '"Courier New", Courier, monospace' : undefined
          }
        },
        ticks: {
            color: theme.textColor,
            font: {
                family: darkMode ? '"Courier New", Courier, monospace' : undefined
            }
        },
        border: {
            display: false
        }
      },
    },
  };

  return (
    <div style={{ width: '100%', height: 350, padding: '10px' }}>
      <h3 style={{
        marginBottom: 10, 
        textAlign: 'center', 
        color: theme.textColor,
        fontFamily: darkMode ? '"Courier New", Courier, monospace' : undefined,
        textTransform: darkMode ? 'uppercase' : 'none',
        letterSpacing: darkMode ? '2px' : 'normal'
      }}>Sleep Score & Duration</h3>
      <div style={{ position: 'relative', height: '300px' }}>
        <Chart type='bar' data={chartData} options={options} />
      </div>
    </div>
  );
};
