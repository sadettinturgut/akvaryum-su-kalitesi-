
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { WaterQualityData, Parameter } from '../types';

interface HistoryChartProps {
  data: WaterQualityData[];
  parameter: Parameter;
}

const PARAMETER_DETAILS: Record<Parameter, { name: string; color: string; domain: [number, number] | [string, string] }> = {
    temperature: { name: 'Sıcaklık (°C)', color: '#fb923c', domain: ['dataMin - 1', 'dataMax + 1']},
    ph: { name: 'pH Seviyesi', color: '#4ade80', domain: [6, 9] },
    ammonia: { name: 'Amonyak (ppm)', color: '#f87171', domain: [0, 1] },
    nitrite: { name: 'Nitrit (ppm)', color: '#c084fc', domain: [0, 1] },
    nitrate: { name: 'Nitrat (ppm)', color: '#60a5fa', domain: [0, 50] },
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const time = new Date(label).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    return (
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-3 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg">
        <p className="text-slate-500 dark:text-slate-400 text-sm">{`Zaman: ${time}`}</p>
        <p className="font-bold" style={{ color: payload[0].color }}>{`${payload[0].name}: ${payload[0].value.toFixed(3)}`}</p>
      </div>
    );
  }
  return null;
};

const HistoryChart: React.FC<HistoryChartProps> = ({ data, parameter }) => {
  const chartDetails = PARAMETER_DETAILS[parameter];

  const formattedData = useMemo(() => {
    return data.map(d => ({
        timestamp: d.timestamp,
        value: d[parameter]
    }));
  }, [data, parameter]);

  return (
    <div className="bg-white dark:bg-slate-850 p-4 sm:p-6 rounded-lg shadow-md dark:shadow-lg h-96">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">{chartDetails.name} Geçmişi</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData} margin={{ top: 5, right: 20, left: -10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
          <XAxis 
            dataKey="timestamp" 
            tickFormatter={(timeStr) => new Date(timeStr).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
            className="stroke-slate-500 dark:stroke-slate-400"
            tick={{ fill: 'currentColor', fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            className="stroke-slate-500 dark:stroke-slate-400"
            tick={{ fill: 'currentColor', fontSize: 12 }}
            domain={chartDetails.domain}
            allowDataOverflow={true}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{paddingTop: 20}} />
          <Line 
            type="monotone" 
            dataKey="value" 
            name={chartDetails.name}
            stroke={chartDetails.color} 
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, fill: chartDetails.color, className: 'stroke-slate-100 dark:stroke-slate-850', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HistoryChart;