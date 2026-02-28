'use client';

import { useState, Fragment } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, ChevronDown, ExternalLink } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

/* ========================================
   データ定義
   ======================================== */
type Industry = {
  name: string;
  slug: string;
  ikusei: boolean;
  tokutei1: boolean;
  tokutei2: boolean;
  tenseki: '1年' | '2年' | '―';
  note: string;
};

const industries: Industry[] = [
  { name: '介護', slug: 'kaigo', ikusei: true, tokutei1: true, tokutei2: false, tenseki: '2年', note: '2号対象外・介護ビザが代替' },
  { name: 'ビルクリーニング', slug: 'biru', ikusei: true, tokutei1: true, tokutei2: false, tenseki: '1年', note: '2号対象外' },
  { name: '工業製品製造業', slug: 'kogyo', ikusei: true, tokutei1: true, tokutei2: true, tenseki: '2年', note: '' },
  { name: '建設', slug: 'kensetsu', ikusei: true, tokutei1: true, tokutei2: true, tenseki: '2年', note: '' },
  { name: '造船・舶用工業', slug: 'zosen', ikusei: true, tokutei1: true, tokutei2: true, tenseki: '2年', note: '' },
  { name: '自動車整備', slug: 'jidosha-seib', ikusei: true, tokutei1: true, tokutei2: true, tenseki: '2年', note: '' },
  { name: '航空', slug: 'koku', ikusei: false, tokutei1: true, tokutei2: true, tenseki: '―', note: '育成就労対象外' },
  { name: '宿泊', slug: 'shukuhaku', ikusei: true, tokutei1: true, tokutei2: false, tenseki: '1年', note: '2号対象外' },
  { name: '農業', slug: 'nogyo', ikusei: true, tokutei1: true, tokutei2: true, tenseki: '1年', note: '' },
  { name: '漁業', slug: 'gyogyo', ikusei: true, tokutei1: true, tokutei2: true, tenseki: '1年', note: '' },
  { name: '飲食料品製造業', slug: 'inshoku', ikusei: true, tokutei1: true, tokutei2: true, tenseki: '1年', note: '' },
  { name: '外食業', slug: 'gaishoku', ikusei: true, tokutei1: true, tokutei2: false, tenseki: '1年', note: '2号対象外' },
  { name: '鉄道', slug: 'tetsudo', ikusei: true, tokutei1: true, tokutei2: true, tenseki: '1年', note: '' },
  { name: '林業', slug: 'ringyo', ikusei: true, tokutei1: true, tokutei2: true, tenseki: '1年', note: '' },
  { name: '木材産業', slug: 'mokuzai', ikusei: true, tokutei1: true, tokutei2: true, tenseki: '1年', note: '' },
  { name: 'リネンサプライ', slug: 'linen', ikusei: true, tokutei1: true, tokutei2: false, tenseki: '1年', note: '育成就労新規追加分野' },
  { name: '物流倉庫', slug: 'butsuryu', ikusei: true, tokutei1: true, tokutei2: true, tenseki: '1年', note: '育成就労新規追加分野' },
  { name: '資源循環', slug: 'shigen', ikusei: true, tokutei1: true, tokutei2: true, tenseki: '1年', note: '育成就労新規追加分野' },
  { name: '自動車運送業', slug: 'jidosha-unso', ikusei: false, tokutei1: true, tokutei2: true, tenseki: '―', note: '育成就労対象外' },
];

type StepData = {
  title: string;
  badge: string;
  sub: string;
  details: string[];
  color: string;
};

const steps: StepData[] = [
  {
    title: '育成就労',
    badge: '最長3年',
    sub: '日本語 A1→A2 / 17分野対象',
    details: [
      '技能実習に代わる新制度。未経験の外国人が日本で働きながら技能を習得。',
      '在留期間：最長3年',
      '入国時の日本語：A1（JLPT N5相当）',
      '修了時の目標：A2（JLPT N4相当）',
      '一定条件のもとで転籍（転職）が可能',
    ],
    color: '#1a2f5e',
  },
  {
    title: '特定技能1号',
    badge: '最長5年',
    sub: '日本語 A2以上 / 19分野対象',
    details: [
      '一定の技能と日本語力を持つ外国人が即戦力として就労する在留資格。',
      '在留期間：通算5年まで',
      '技能試験＋日本語試験に合格が必要',
      '育成就労修了者は試験の一部が免除',
      '家族の帯同は不可',
      '転職は同一分野内で自由',
    ],
    color: '#2d5a9e',
  },
  {
    title: '特定技能2号',
    badge: '期間制限なし',
    sub: '家族帯同可 / 一部分野のみ',
    details: [
      '熟練した技能を持つ外国人が長期就労できる在留資格。',
      '在留期間：制限なし（更新可能）',
      '家族（配偶者・子）の帯同が可能',
      '永住権申請の道も開かれる',
      '介護・ビルクリーニング等は対象外',
    ],
    color: '#c9a84c',
  },
];

const chartData = [
  { name: '工業製品製造業', ikusei: 119700, tokutei: 199500 },
  { name: '建設', ikusei: 123500, tokutei: 76000 },
  { name: '飲食料品製造業', ikusei: 61400, tokutei: 133500 },
  { name: '介護', ikusei: 33800, tokutei: 126900 },
  { name: '農業', ikusei: 26300, tokutei: 73300 },
  { name: '外食業', ikusei: 5300, tokutei: 50000 },
  { name: 'ビルクリーニング', ikusei: 7300, tokutei: 32200 },
  { name: '造船・舶用工業', ikusei: 13500, tokutei: 23400 },
  { name: '自動車運送業', ikusei: 0, tokutei: 22100 },
  { name: '宿泊', ikusei: 5200, tokutei: 14800 },
  { name: '自動車整備', ikusei: 9900, tokutei: 9400 },
  { name: '物流倉庫', ikusei: 6900, tokutei: 11400 },
  { name: '漁業', ikusei: 2600, tokutei: 14800 },
  { name: 'リネンサプライ', ikusei: 3400, tokutei: 4300 },
  { name: '木材産業', ikusei: 2200, tokutei: 4500 },
  { name: '航空', ikusei: 0, tokutei: 4900 },
  { name: '資源循環', ikusei: 3600, tokutei: 900 },
  { name: '鉄道', ikusei: 1100, tokutei: 2900 },
  { name: '林業', ikusei: 500, tokutei: 900 },
];

type FilterType = 'all' | 'ikusei' | 'tenseki2';
type SortKey = 'default' | 'name' | 'ikusei' | 'tokutei1' | 'tokutei2' | 'tenseki';

/* ========================================
   メインコンポーネント
   ======================================== */
export default function IndustryOverviewPage() {
  const router = useRouter();
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortKey, setSortKey] = useState<SortKey>('default');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  /* フィルター */
  const filtered = industries.filter((r) => {
    if (filter === 'ikusei') return r.ikusei;
    if (filter === 'tenseki2') return r.tenseki === '2年';
    return true;
  });

  /* ソート */
  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  const sorted = sortKey === 'default'
    ? filtered
    : [...filtered].sort((a, b) => {
        let cmp = 0;
        switch (sortKey) {
          case 'name':
            cmp = a.name.localeCompare(b.name);
            break;
          case 'ikusei':
            cmp = (a.ikusei ? 1 : 0) - (b.ikusei ? 1 : 0);
            break;
          case 'tokutei1':
            cmp = (a.tokutei1 ? 1 : 0) - (b.tokutei1 ? 1 : 0);
            break;
          case 'tokutei2':
            cmp = (a.tokutei2 ? 1 : 0) - (b.tokutei2 ? 1 : 0);
            break;
          case 'tenseki': {
            const tv = (v: string) => (v === '2年' ? 2 : v === '1年' ? 1 : 0);
            cmp = tv(a.tenseki) - tv(b.tenseki);
            break;
          }
        }
        return sortDir === 'desc' ? -cmp : cmp;
      });

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <span className="text-gray-300 ml-1 text-[10px]">⇅</span>;
    return (
      <span className="ml-1 text-[10px]" style={{ color: '#c9a84c' }}>
        {sortDir === 'asc' ? '▲' : '▼'}
      </span>
    );
  }

  return (
    <div style={{ backgroundColor: '#f8f7f4' }}>
      {/* ========================================
          ヒーロー
          ======================================== */}
      <section
        className="py-16 sm:py-20 text-white"
        style={{ background: 'linear-gradient(135deg, #0f1e3d 0%, #1a2f5e 100%)' }}
      >
        <div className="max-w-5xl mx-auto px-6">
          <nav className="text-sm text-blue-200 mb-6">
            <Link href="/business" className="hover:text-white transition-colors">
              企業向けトップ
            </Link>
            <span className="mx-2">&gt;</span>
            <Link href="/business/articles" className="hover:text-white transition-colors">
              分野別ガイド
            </Link>
            <span className="mx-2">&gt;</span>
            <span>制度比較マップ</span>
          </nav>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-3">
            19分野 制度比較マップ
          </h1>
          <p className="text-blue-200 text-sm sm:text-base max-w-2xl leading-relaxed mb-10">
            全分野の制度対応・転籍制限・受入規模を一画面で比較
          </p>

          {/* ヒーロー統計 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: '19分野', label: '特定技能対象' },
              { value: '17分野', label: '育成就労対象' },
              { value: '2027年4月', label: '育成就労 施行' },
              { value: '出典', label: '2026年1月23日 閣議決定「分野別運用方針」' },
            ].map((s) => (
              <div key={s.value} className="bg-white/10 rounded-xl px-4 py-4 backdrop-blur-sm">
                <p className="text-xl sm:text-2xl font-bold text-white mb-1">{s.value}</p>
                <p className="text-[11px] text-blue-200 leading-snug">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================
          セクション1: キャリアパスフロー
          ======================================== */}
      <section className="py-14 md:py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-3" style={{ color: '#1a2f5e' }}>
            キャリアパスの流れ
          </h2>
          <p className="text-sm text-gray-500 text-center mb-10 max-w-lg mx-auto">
            育成就労 → 特定技能1号 → 特定技能2号と段階的にステップアップ
          </p>

          <div className="flex flex-col md:flex-row gap-4 md:gap-0 items-stretch">
            {steps.map((step, i) => (
              <Fragment key={step.title}>
                <div
                  className="flex-1 rounded-xl border border-gray-200 bg-white cursor-pointer hover:shadow-lg transition-all duration-200 overflow-hidden"
                  onClick={() => setExpandedStep(expandedStep === i ? null : i)}
                >
                  {/* ヘッダーバー */}
                  <div className="px-5 py-1.5 text-white text-xs font-bold tracking-wider" style={{ backgroundColor: step.color }}>
                    STEP {i + 1}
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold" style={{ color: '#1a2f5e' }}>
                        {step.title}
                      </h3>
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full text-white" style={{ backgroundColor: step.color }}>
                        {step.badge}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{step.sub}</p>

                    <button className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: step.color }}>
                      {expandedStep === i ? '閉じる' : '詳しく見る'}
                      <ChevronDown size={14} className={`transition-transform duration-200 ${expandedStep === i ? 'rotate-180' : ''}`} />
                    </button>

                    {/* 展開詳細 */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        expandedStep === i ? 'max-h-80 opacity-100 mt-3' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="border-t border-gray-100 pt-3 space-y-1.5">
                        {step.details.map((d, j) => (
                          <p key={j} className={`text-sm leading-relaxed ${j === 0 ? 'text-gray-700 mb-2' : 'text-gray-500'}`}>
                            {j > 0 ? `・${d}` : d}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ステップ間の矢印 */}
                {i < steps.length - 1 && (
                  <div className="flex items-center justify-center md:px-3 py-2 md:py-0">
                    <ArrowRight size={20} className="rotate-90 md:rotate-0" style={{ color: '#c9a84c' }} />
                  </div>
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================
          セクション2: 分野別 制度対照表
          ======================================== */}
      <section className="py-14 md:py-20" style={{ backgroundColor: '#fff' }}>
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-3" style={{ color: '#1a2f5e' }}>
            分野別 制度対照表
          </h2>
          <p className="text-sm text-gray-500 text-center mb-8 max-w-lg mx-auto">
            各行をクリックすると分野別の詳細ガイドに遷移します
          </p>

          {/* フィルタータブ */}
          <div className="flex flex-wrap gap-2 mb-6">
            {([
              { key: 'all' as FilterType, label: '全分野' },
              { key: 'ikusei' as FilterType, label: '育成就労対象のみ' },
              { key: 'tenseki2' as FilterType, label: '転籍制限2年' },
            ]).map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  filter === f.key
                    ? 'text-white shadow-md'
                    : 'text-gray-500 bg-white border border-gray-200 hover:border-gray-300'
                }`}
                style={filter === f.key ? { backgroundColor: '#1a2f5e' } : undefined}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* テーブル */}
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th
                    className="px-4 py-3 font-bold cursor-pointer hover:bg-gray-100 transition-colors whitespace-nowrap"
                    style={{ color: '#1a2f5e' }}
                    onClick={() => handleSort('name')}
                  >
                    分野名<SortIcon col="name" />
                  </th>
                  <th
                    className="px-3 py-3 font-bold cursor-pointer hover:bg-gray-100 transition-colors text-center whitespace-nowrap"
                    style={{ color: '#1a2f5e' }}
                    onClick={() => handleSort('ikusei')}
                  >
                    育成就労<SortIcon col="ikusei" />
                  </th>
                  <th
                    className="px-3 py-3 font-bold cursor-pointer hover:bg-gray-100 transition-colors text-center whitespace-nowrap"
                    style={{ color: '#1a2f5e' }}
                    onClick={() => handleSort('tokutei1')}
                  >
                    特定技能1号<SortIcon col="tokutei1" />
                  </th>
                  <th
                    className="px-3 py-3 font-bold cursor-pointer hover:bg-gray-100 transition-colors text-center whitespace-nowrap"
                    style={{ color: '#1a2f5e' }}
                    onClick={() => handleSort('tokutei2')}
                  >
                    特定技能2号<SortIcon col="tokutei2" />
                  </th>
                  <th
                    className="px-3 py-3 font-bold cursor-pointer hover:bg-gray-100 transition-colors text-center whitespace-nowrap"
                    style={{ color: '#1a2f5e' }}
                    onClick={() => handleSort('tenseki')}
                  >
                    転籍制限<SortIcon col="tenseki" />
                  </th>
                  <th className="px-4 py-3 font-bold whitespace-nowrap" style={{ color: '#1a2f5e' }}>
                    備考
                  </th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((row) => (
                  <tr
                    key={row.slug}
                    className="border-t border-gray-100 cursor-pointer hover:bg-[#1a2f5e]/[0.04] transition-colors"
                    onClick={() => router.push(`/business/articles/${row.slug}`)}
                  >
                    <td className="px-4 py-3 font-semibold whitespace-nowrap" style={{ color: '#1a2f5e' }}>
                      {row.name}
                    </td>
                    <td className="px-3 py-3 text-center">{row.ikusei ? '✅' : '❌'}</td>
                    <td className="px-3 py-3 text-center">{row.tokutei1 ? '✅' : '❌'}</td>
                    <td className="px-3 py-3 text-center">{row.tokutei2 ? '✅' : '❌'}</td>
                    <td className="px-3 py-3 text-center font-semibold">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                          row.tenseki === '2年'
                            ? 'bg-red-50 text-red-700'
                            : row.tenseki === '1年'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {row.tenseki}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-gray-400 mt-3">
            {sorted.length} / {industries.length} 分野を表示中
          </p>
        </div>
      </section>

      {/* ========================================
          セクション3: 受入規模の可視化
          ======================================== */}
      <section className="py-14 md:py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-3" style={{ color: '#1a2f5e' }}>
            分野別 受入見込数
          </h2>
          <p className="text-sm text-gray-500 text-center mb-10 max-w-lg mx-auto">
            育成就労と特定技能1号の受入見込数を比較
          </p>

          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
            <ResponsiveContainer width="100%" height={760}>
              <BarChart layout="vertical" data={chartData} margin={{ top: 5, right: 100, left: 10, bottom: 5 }}>
                <XAxis
                  type="number"
                  tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)}
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={110}
                  tick={{ fontSize: 12, fill: '#1a2f5e', fontWeight: 600 }}
                />
                <Tooltip
                  formatter={(value: number | undefined) => value != null ? `${value.toLocaleString()}人` : '—'}
                  labelStyle={{ color: '#1a2f5e', fontWeight: 700 }}
                  contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb' }}
                />
                <Legend
                  wrapperStyle={{ fontSize: 12 }}
                />
                <Bar dataKey="ikusei" stackId="a" fill="#1a2f5e" name="育成就労" radius={[0, 0, 0, 0]} />
                <Bar
                  dataKey="tokutei"
                  stackId="a"
                  fill="#c9a84c"
                  name="特定技能"
                  radius={[0, 4, 4, 0]}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  label={(props: any) => {
                    const { x, y, width, height, index } = props;
                    const d = chartData[index as number];
                    const total = d.ikusei + d.tokutei;
                    return (
                      <text
                        x={x + width + 8}
                        y={y + height / 2}
                        fill="#374151"
                        fontSize={12}
                        dominantBaseline="central"
                      >
                        {total.toLocaleString()}人
                      </text>
                    );
                  }}
                >
                  {chartData.map((_, i) => (
                    <Cell key={i} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-xs text-gray-400 mt-4 leading-relaxed max-w-2xl mx-auto">
            ※ 数値は2026年1月23日 閣議決定「分野別運用方針」に基づく
            令和11年3月末（2029年3月末）までの受入れ見込数です。
            育成就労は令和9年4月（2027年4月）からの受入れ。
            <br />
            出典：出入国在留管理庁・厚生労働省
          </p>
        </div>
      </section>

      {/* ========================================
          セクション4: 関連リンク
          ======================================== */}
      <section className="py-14 md:py-20" style={{ backgroundColor: '#fff' }}>
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-8" style={{ color: '#1a2f5e' }}>
            関連情報
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                title: '分野別ガイド一覧',
                desc: '19分野それぞれの詳細情報を確認',
                href: '/business/articles',
                external: false,
              },
              {
                title: '育成就労ロードマップ',
                desc: '2027年施行に向けた準備スケジュール',
                href: '/business/roadmap',
                external: false,
              },
              {
                title: '採用コストシミュレーター',
                desc: '分野・在留資格別のコストを試算',
                href: '/business/cost-simulator',
                external: false,
              },
              {
                title: '出入国在留管理庁',
                desc: '制度の公式情報・最新の運用要領',
                href: 'https://www.moj.go.jp/isa/index.html',
                external: true,
              },
            ].map((link) => {
              const inner = (
                <div className="flex items-start gap-4 p-5 rounded-xl border border-gray-200 bg-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 h-full">
                  <div className="flex-1">
                    <h3 className="font-bold text-sm mb-1 flex items-center gap-1.5" style={{ color: '#1a2f5e' }}>
                      {link.title}
                      {link.external && <ExternalLink size={12} className="text-gray-400" />}
                    </h3>
                    <p className="text-xs text-gray-500">{link.desc}</p>
                  </div>
                  <ArrowRight size={16} className="shrink-0 mt-0.5" style={{ color: '#c9a84c' }} />
                </div>
              );

              if (link.external) {
                return (
                  <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">
                    {inner}
                  </a>
                );
              }
              return (
                <Link key={link.href} href={link.href}>
                  {inner}
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
