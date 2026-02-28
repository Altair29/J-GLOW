"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { useInView } from "./useInView";

const data = [
  { year: "2012", count: 68.2 },
  { year: "2014", count: 78.8 },
  { year: "2016", count: 108.4 },
  { year: "2017", count: 127.9 },
  { year: "2018", count: 146.1 },
  { year: "2019", count: 165.9 },
  { year: "2020", count: 172.4 },
  { year: "2021", count: 172.7 },
  { year: "2022", count: 182.3 },
  { year: "2023", count: 204.9 },
  { year: "2024", count: 230.3 },
];

export default function ForeignWorkerChart() {
  const { ref, inView } = useInView(0.2);

  return (
    <div ref={ref}>
      <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <p className="mb-4 text-center text-sm font-bold text-[var(--accent)]">
          15年で約3.4倍
        </p>
        <div className="min-w-[600px]" style={{ height: 350 }}>
          {inView && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 30, right: 20, left: 20, bottom: 10 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  vertical={false}
                />
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 260]}
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v: number) => `${v}万`}
                />
                <Bar
                  dataKey="count"
                  radius={[4, 4, 0, 0]}
                  animationDuration={1200}
                >
                  {data.map((_, i) => (
                    <Cell
                      key={i}
                      fill={i === data.length - 1 ? "#c9a84c" : "#1a2f5e"}
                    />
                  ))}
                  <LabelList
                    dataKey="count"
                    position="top"
                    formatter={(v) => `${v ?? ""}`}
                    style={{ fontSize: 10, fill: "#64748b" }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
        <p className="mt-2 text-center text-xs text-[var(--muted-foreground)]">
          単位：万人
        </p>
      </div>
      <p className="mt-3 text-xs text-gray-400">
        出典：厚生労働省「外国人雇用状況」届出状況（各年10月末時点）
      </p>
    </div>
  );
}
