"use client";

import Link from "next/link";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  ResponsiveContainer,
  YAxis,
} from "recharts";
import { useInView } from "./useInView";

const laborData = [
  { year: 1995, value: 8726 },
  { year: 2020, value: 7509 },
  { year: 2040, value: 6213 },
  { year: 2070, value: 4535 },
];

const trendData = [
  { year: 2012, count: 68 },
  { year: 2017, count: 128 },
  { year: 2021, count: 173 },
  { year: 2025, count: 257 },
];

const canDo = [
  "慢性的な人手不足の解消",
  "若年層の中長期戦力を確保",
  "海外展開・インバウンド対応力",
];

const cannotDo = [
  "日本人より安く雇うこと",
  "採用初日から即フル稼働",
  "全業種・全職種で無制限に活用",
];

function MiniLineChart() {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} className="h-[100px] w-full">
      {inView && (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={laborData}>
            <YAxis domain={[4000, 9000]} hide />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#1a2f5e"
              strokeWidth={2}
              dot={(props) => {
                const { cx, cy, index } = props as { cx?: number; cy?: number; index?: number };
                if (cx == null || cy == null) return <circle key={index} />;
                const isLast = index === laborData.length - 1;
                return (
                  <circle
                    key={index}
                    cx={cx}
                    cy={cy}
                    r={isLast ? 5 : 3}
                    fill={isLast ? "#c9a84c" : "#1a2f5e"}
                    stroke="none"
                  />
                );
              }}
              animationDuration={1200}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

function MiniBarChart() {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} className="h-[100px] w-full">
      {inView && (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={trendData}>
            <YAxis domain={[0, 290]} hide />
            <Bar
              dataKey="count"
              radius={[3, 3, 0, 0]}
              animationDuration={1200}
              fill="#1a2f5e"
              activeBar={false}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              shape={(props: any) => {
                const { x, y, width, height, index } = props;
                const isLast = index === trendData.length - 1;
                return (
                  <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    rx={3}
                    ry={3}
                    fill={isLast ? "#c9a84c" : "#1a2f5e"}
                  />
                );
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default function Step1Content() {
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {/* カード1: 労働力不足 */}
      <Link
        href="/business/hiring-guide/labor-shortage"
        className="group block overflow-hidden rounded-xl border-l-4 border-l-[var(--accent)] border border-[var(--border)] bg-[var(--surface)] transition-all hover:-translate-y-0.5 hover:shadow-lg"
      >
        <div className="p-5">
          <h3 className="mb-1 text-lg font-bold text-[var(--foreground)]">
            日本の労働力不足
          </h3>
          <p className="mb-3 text-xs text-[var(--muted-foreground)]">
            2070年に生産年齢人口は4,535万人へ
          </p>
          <MiniLineChart />
          <p className="mt-2 text-right text-xs text-[var(--accent)] font-medium group-hover:underline">
            詳しく見る →
          </p>
        </div>
      </Link>

      {/* カード2: 同業他社の動向 */}
      <Link
        href="/business/hiring-guide/trends"
        className="group block overflow-hidden rounded-xl border-l-4 border-l-[var(--accent)] border border-[var(--border)] bg-[var(--surface)] transition-all hover:-translate-y-0.5 hover:shadow-lg"
      >
        <div className="p-5">
          <h3 className="mb-1 text-lg font-bold text-[var(--foreground)]">
            同業他社の動向
          </h3>
          <p className="mb-3 text-xs text-[var(--muted-foreground)]">
            外国人労働者257万人時代（2025年）
          </p>
          <MiniBarChart />
          <p className="mt-2 text-right text-xs text-[var(--accent)] font-medium group-hover:underline">
            詳しく見る →
          </p>
        </div>
      </Link>

      {/* カード3: できること・できないこと */}
      <Link
        href="/business/hiring-guide/honest-guide"
        className="group block overflow-hidden rounded-xl border-l-4 border-l-[var(--accent)] border border-[var(--border)] bg-[var(--surface)] transition-all hover:-translate-y-0.5 hover:shadow-lg"
      >
        <div className="p-5">
          <h3 className="mb-2 text-lg font-bold text-[var(--foreground)]">
            できること・できないこと
          </h3>
          <div className="space-y-1.5">
            {canDo.map((t) => (
              <div key={t} className="flex items-center gap-2 text-xs">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] text-emerald-600">✓</span>
                <span className="text-[var(--foreground)]">{t}</span>
              </div>
            ))}
            {cannotDo.map((t) => (
              <div key={t} className="flex items-center gap-2 text-xs">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-red-100 text-[10px] text-red-500">✕</span>
                <span className="text-[var(--muted-foreground)]">{t}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-right text-xs text-[var(--accent)] font-medium group-hover:underline">
            詳しく見る →
          </p>
        </div>
      </Link>
    </div>
  );
}
