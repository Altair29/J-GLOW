"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useInView } from "./useInView";

const data = [
  { name: "30人未満", value: 63.1, color: "#1a2f5e" },
  { name: "30〜99人", value: 17.2, color: "#c9a84c" },
  { name: "100〜499人", value: 9.9, color: "#6b7280" },
  { name: "500人以上", value: 3.0, color: "#d1d5db" },
  { name: "その他・不明", value: 7.5, color: "#e5e7eb" },
];

export default function CompanySizeChart() {
  const { ref, inView } = useInView(0.2);

  return (
    <div ref={ref}>
      <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
          <div className="relative" style={{ width: 240, height: 240 }}>
            {inView && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    dataKey="value"
                    animationDuration={1200}
                    stroke="#fff"
                    strokeWidth={2}
                  >
                    {data.map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            )}
            {/* 中央テキスト */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-xs text-[var(--muted-foreground)]">
                外国人雇用の主役は
              </p>
              <p className="text-sm font-bold text-[var(--foreground)]">
                中小企業
              </p>
            </div>
          </div>

          {/* 凡例 */}
          <div className="space-y-2">
            {data.map((d) => (
              <div key={d.name} className="flex items-center gap-3">
                <span
                  className="inline-block h-3 w-3 shrink-0 rounded-sm"
                  style={{ backgroundColor: d.color }}
                />
                <span className="text-sm text-[var(--foreground)]">
                  {d.name}
                </span>
                <span className="text-sm font-bold text-[var(--foreground)]">
                  {d.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="mt-3 text-xs text-gray-400">
        出典：厚生労働省「外国人雇用状況」届出状況（2025年10月末時点）
      </p>
    </div>
  );
}
