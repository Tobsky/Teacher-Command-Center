import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface DataPoint {
  label: string;
  value: number;
  subLabel?: string;
}

interface PerformanceChartProps {
  data: DataPoint[];
  title: string;
  subtitle?: string;
  color?: string; // hex color
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ 
  data, 
  title, 
  subtitle,
  color = '#3b82f6' // Default blue-500
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-slate-800/50 rounded-xl border border-slate-700/50 text-slate-500">
        <p>No performance data available.</p>
      </div>
    );
  }

  // Chart Dimensions
  const width = 800;
  const height = 300;
  const padding = 40;
  const graphWidth = width - padding * 2;
  const graphHeight = height - padding * 2;

  // Scales
  const maxY = 100;
  const minY = 0;
  
  const getX = (index: number) => padding + (index / (data.length - 1 || 1)) * graphWidth;
  const getY = (value: number) => height - padding - (value / maxY) * graphHeight;

  // Path Generation
  const points = data.map((d, i) => `${getX(i)},${getY(d.value)}`).join(' ');
  const areaPoints = `${getX(0)},${height - padding} ${points} ${getX(data.length - 1)},${height - padding}`;

  // Trend Calculation
  const firstVal = data[0].value;
  const lastVal = data[data.length - 1].value;
  const diff = lastVal - firstVal;
  const trendLabel = diff > 0 ? `+${diff.toFixed(1)}%` : `${diff.toFixed(1)}%`;
  const TrendIcon = diff > 0 ? TrendingUp : (diff < 0 ? TrendingDown : Minus);
  const trendColor = diff > 0 ? 'text-emerald-400' : (diff < 0 ? 'text-red-400' : 'text-slate-400');

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">{title}</h3>
          {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${trendColor} bg-slate-900/50 px-3 py-1 rounded-full border border-slate-700`}>
          <TrendIcon size={16} />
          <span>{trendLabel} over period</span>
        </div>
      </div>

      <div className="relative w-full aspect-[21/9] min-h-[250px]">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          {/* Gradients */}
          <defs>
            <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid Lines */}
          {[0, 25, 50, 75, 100].map((tick) => (
            <g key={tick}>
              <line 
                x1={padding} 
                y1={getY(tick)} 
                x2={width - padding} 
                y2={getY(tick)} 
                stroke="#334155" 
                strokeWidth="1" 
                strokeDasharray="4 4"
              />
              <text 
                x={padding - 10} 
                y={getY(tick) + 4} 
                textAnchor="end" 
                className="fill-slate-500 text-[10px] font-mono"
              >
                {tick}
              </text>
            </g>
          ))}

          {/* Area Fill */}
          <polygon points={areaPoints} fill={`url(#gradient-${title})`} />

          {/* Line */}
          <polyline 
            points={points} 
            fill="none" 
            stroke={color} 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="drop-shadow-lg"
          />

          {/* Data Points */}
          {data.map((d, i) => (
            <g key={i} className="group">
              <circle
                cx={getX(i)}
                cy={getY(d.value)}
                r={hoveredPoint === i ? 6 : 4}
                fill="#0f172a"
                stroke={color}
                strokeWidth="2"
                className="transition-all duration-200 cursor-pointer"
                onMouseEnter={() => setHoveredPoint(i)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
              {/* X Axis Labels (only first, last, and hover) */}
              {(i === 0 || i === data.length - 1 || hoveredPoint === i) && (
                 <text
                   x={getX(i)}
                   y={height - padding + 20}
                   textAnchor="middle"
                   className={`fill-slate-400 text-[10px] font-mono transition-opacity ${hoveredPoint === i ? 'font-bold fill-white' : ''}`}
                 >
                   {d.label}
                 </text>
              )}
            </g>
          ))}
        </svg>

        {/* Tooltip Overlay */}
        {hoveredPoint !== null && (
          <div 
            className="absolute bg-slate-900/90 border border-slate-600 rounded-lg p-3 text-xs shadow-xl backdrop-blur-sm pointer-events-none transform -translate-x-1/2 -translate-y-full transition-all duration-75 z-10"
            style={{ 
              left: `${(getX(hoveredPoint) / width) * 100}%`, 
              top: `${(getY(data[hoveredPoint].value) / height) * 100}%`,
              marginTop: '-12px'
            }}
          >
            <div className="font-bold text-white mb-1">{data[hoveredPoint].label}</div>
            <div className="text-slate-300">{data[hoveredPoint].subLabel}</div>
            <div className="text-emerald-400 font-mono font-bold mt-1 text-base">
              {data[hoveredPoint].value}%
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceChart;
