import React, { useState } from 'react';

interface BarDataPoint {
  label: string;
  value: number;
  subValue?: number;
}

export const BarChart: React.FC<{
  data: BarDataPoint[];
  height?: number;
  valuePrefix?: string;
  className?: string;
}> = ({ data, height = 180, valuePrefix = '₹', className = '' }) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const chartHeight = height - 40; // leave space for labels

  return (
    <div className={`w-full flex flex-col ${className}`} role="img" aria-label="Revenue Bar Chart">
      <div className="relative flex items-end justify-between gap-2 pt-6" style={{ height }}>
        {data.map((item, idx) => {
          const barHeight = (item.value / maxValue) * chartHeight;
          const isHovered = hoverIndex === idx;

          return (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center group relative h-full justify-end cursor-pointer"
              onMouseEnter={() => setHoverIndex(idx)}
              onMouseLeave={() => setHoverIndex(null)}
            >
              {/* Tooltip */}
              {isHovered && (
                <div className="absolute -top-6 bg-ink text-white text-[10px] font-mono py-1 px-2 rounded shadow-floating whitespace-nowrap z-20 pointer-events-none animate-fade-up">
                  {valuePrefix}
                  {item.value.toLocaleString()}
                  {item.subValue ? ` (${item.subValue} orders)` : ''}
                </div>
              )}

              {/* Bar SVG */}
              <div
                className={`w-full max-w-[28px] rounded-t-sm transition-all duration-200 ${
                  isHovered ? 'bg-primary-hover brightness-110' : 'bg-primary'
                }`}
                style={{ height: Math.max(barHeight, 4) }}
              />

              {/* X Axis Label */}
              <div className="text-[11px] font-medium text-text-muted mt-2 tracking-tight">
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface LineDataPoint {
  label: string;
  value: number;
}

export const LineChart: React.FC<{
  data: LineDataPoint[];
  height?: number;
  strokeColor?: string;
  fillColor?: string;
  className?: string;
}> = ({
  data,
  height = 160,
  strokeColor = '#2B2F8F',
  fillColor = 'rgba(43, 47, 143, 0.12)',
  className = '',
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (data.length === 0) return null;

  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const minValue = Math.min(...data.map((d) => d.value), 0);
  const range = maxValue - minValue || 1;

  const width = 400;
  const chartHeight = height - 35;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * (width - 40) + 20;
    const y = chartHeight - ((d.value - minValue) / range) * (chartHeight - 30) + 15;
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`;

  return (
    <div className={`w-full relative ${className}`} role="img" aria-label="Performance Line Chart">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.25" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Soft grid lines */}
        <line x1="20" y1={chartHeight / 2} x2={width - 20} y2={chartHeight / 2} stroke="#E2E5EA" strokeDasharray="3 3" />
        <line x1="20" y1={chartHeight} x2={width - 20} y2={chartHeight} stroke="#E2E5EA" />

        {/* Area */}
        <path d={areaD} fill="url(#lineGrad)" />

        {/* Line */}
        <path d={pathD} fill="none" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        {/* Points */}
        {points.map((p, idx) => (
          <g key={idx} onMouseEnter={() => setHoveredIndex(idx)} onMouseLeave={() => setHoveredIndex(null)}>
            <circle
              cx={p.x}
              cy={p.y}
              r={hoveredIndex === idx ? 6 : 4}
              fill="#FFFFFF"
              stroke={strokeColor}
              strokeWidth="2.5"
              className="cursor-pointer transition-all duration-150"
            />
            {/* Axis text */}
            <text
              x={p.x}
              y={height - 8}
              textAnchor="middle"
              className="text-[10px] fill-[#6B7180] font-sans font-medium"
            >
              {p.label}
            </text>
          </g>
        ))}
      </svg>

      {hoveredIndex !== null && (
        <div
          className="absolute bg-ink text-white text-[11px] font-mono py-1 px-2.5 rounded shadow-floating pointer-events-none -top-2 transform -translate-x-1/2"
          style={{ left: `${(points[hoveredIndex].x / width) * 100}%` }}
        >
          {data[hoveredIndex].value} sessions
        </div>
      )}
    </div>
  );
};

export const Meter: React.FC<{
  percentage: number;
  label: string;
  color?: string;
  subLabel?: string;
}> = ({ percentage, label, color = '#127A4B', subLabel }) => {
  const radius = 38;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex items-center gap-4 p-3 bg-surface rounded-md border border-border">
      <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
        <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
          <circle
            stroke="#EEF0F3"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke={color}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease-in-out' }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        <span className="absolute font-mono font-bold text-sm text-text-primary">
          {percentage}%
        </span>
      </div>
      <div>
        <div className="font-semibold text-text-primary text-sm">{label}</div>
        {subLabel && <div className="text-xs text-text-muted mt-0.5">{subLabel}</div>}
      </div>
    </div>
  );
};
