"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
  Label,
} from "recharts";
import { useInView } from "./useInView";

const data = [
  { year: "1990", value: 8590, type: "actual" },
  { year: "1995", value: 8726, type: "actual" },
  { year: "2000", value: 8638, type: "actual" },
  { year: "2010", value: 8103, type: "actual" },
  { year: "2020", value: 7509, type: "actual" },
  { year: "2025", value: 7261, type: "forecast" },
  { year: "2030", value: 7008, type: "forecast" },
  { year: "2040", value: 6213, type: "forecast" },
  { year: "2050", value: 5540, type: "forecast" },
  { year: "2070", value: 4535, type: "forecast" },
];

const actualData = data.map((d) => ({
  ...d,
  actual: d.type === "actual" ? d.value : undefined,
  forecast: d.type === "forecast" || d.year === "2020" ? d.value : undefined,
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomDot(props: any) {
  const { cx, cy, payload } = props;
  if (!cx || !cy) return null;

  const isPeak = payload.year === "1995";
  const isCurrent = payload.year === "2020";
  const isEnd = payload.year === "2070";

  if (isPeak || isCurrent || isEnd) {
    return (
      <g>
        <circle
          cx={cx}
          cy={cy}
          r={6}
          fill={isEnd ? "#dc2626" : isPeak ? "#c9a84c" : "#1a2f5e"}
          stroke="#fff"
          strokeWidth={2}
        />
        <text
          x={cx}
          y={cy - 16}
          textAnchor="middle"
          className="text-xs font-bold"
          fill={isEnd ? "#dc2626" : isPeak ? "#c9a84c" : "#1a2f5e"}
          fontSize={12}
        >
          {isEnd
            ? "4,535万人"
            : isPeak
              ? "ピーク 8,726万人"
              : "現在地 7,509万人"}
        </text>
      </g>
    );
  }

  return <circle cx={cx} cy={cy} r={3} fill="#1a2f5e" stroke="none" />;
}

export default function LaborPopulationChart() {
  const { ref, inView } = useInView(0.2);

  return (
    <div ref={ref}>
      <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="min-w-[600px]" style={{ height: 400 }}>
          {inView && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={actualData}
                margin={{ top: 40, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  tickLine={false}
                />
                <YAxis
                  domain={[3000, 10000]}
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v: number) =>
                    `${(v / 1000).toFixed(0)}千万`
                  }
                />
                <ReferenceLine x="2020" stroke="#94a3b8" strokeDasharray="3 3">
                  <Label
                    value="実績 ← → 推計"
                    position="top"
                    offset={10}
                    fill="#94a3b8"
                    fontSize={11}
                  />
                </ReferenceLine>
                {/* 実績線 */}
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#1a2f5e"
                  strokeWidth={3}
                  dot={<CustomDot />}
                  connectNulls={false}
                  animationDuration={1500}
                />
                {/* 推計線 */}
                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke="#c9a84c"
                  strokeWidth={3}
                  strokeDasharray="8 4"
                  dot={<CustomDot />}
                  connectNulls={false}
                  animationDuration={1500}
                  animationBegin={800}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
      <p className="mt-3 text-xs text-gray-400">
        出典：国立社会保障・人口問題研究所「日本の将来推計人口（令和5年推計）」（2023年4月公表）
      </p>
    </div>
  );
}
