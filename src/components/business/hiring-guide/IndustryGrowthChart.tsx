"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { useInView } from "./useInView";

const data = [
  { industry: "医療・福祉", growth: 25.6 },
  { industry: "宿泊・飲食サービス", growth: 17.1 },
  { industry: "建設業", growth: 16.1 },
  { industry: "製造業（最多・63万人）", growth: 5.3 },
];

const opacities = [1, 0.85, 0.7, 0.5];

export default function IndustryGrowthChart() {
  const { ref, inView } = useInView(0.2);

  return (
    <div ref={ref}>
      <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="min-w-[500px]" style={{ height: 280 }}>
          {inView && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 10, right: 60, left: 10, bottom: 10 }}
              >
                <XAxis
                  type="number"
                  domain={[0, 30]}
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v: number) => `${v}%`}
                />
                <YAxis
                  type="category"
                  dataKey="industry"
                  width={160}
                  tick={{ fontSize: 12, fill: "#0f172a" }}
                  tickLine={false}
                  axisLine={false}
                />
                <Bar
                  dataKey="growth"
                  radius={[0, 4, 4, 0]}
                  animationDuration={1200}
                  barSize={28}
                >
                  {data.map((_, i) => (
                    <Cell
                      key={i}
                      fill="#1a2f5e"
                      opacity={opacities[i]}
                    />
                  ))}
                  <LabelList
                    dataKey="growth"
                    position="right"
                    formatter={(v) => `+${v ?? 0}%`}
                    style={{ fontSize: 12, fill: "#1a2f5e", fontWeight: 700 }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
      <p className="mt-3 text-xs text-gray-400">
        出典：厚生労働省「外国人雇用状況」届出状況（2025年10月末時点）前年比伸び率
      </p>
    </div>
  );
}
