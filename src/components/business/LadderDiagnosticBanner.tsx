import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';

const metaItems = [
  { value: '3分', label: '回答時間' },
  { value: '5問', label: '設問数' },
  { value: '即時', label: '結果表示' },
];

export function LadderDiagnosticBanner() {
  return (
    <section
      id="diagnostic"
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0f1e3d 0%, #1a2f5e 100%)',
      }}
    >
      {/* 薄いゴールドのアクセント */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 30% 50%, #c9a84c 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 md:py-20">
        <div className="grid md:grid-cols-5 gap-10 items-center">
          {/* 左テキスト (3/5) */}
          <div className="md:col-span-3">
            <span
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full mb-6"
              style={{
                backgroundColor: 'rgba(201, 168, 76, 0.15)',
                color: '#c9a84c',
              }}
            >
              <Search size={12} />
              無料診断ツール
            </span>

            <h2 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-bold text-white leading-tight mb-5">
              うちの外国人スタッフ、
              <br className="hidden sm:block" />
              特定技能1号・2号に移行できる？
            </h2>

            <p className="text-sm md:text-base text-white/70 leading-relaxed mb-8 max-w-xl">
              育成就労・技人国・留学生など、在籍中のスタッフの在留資格を選ぶだけで、特定技能1号への移行ルートから、特定技能2号取得に向けた準備計画まで「企業がやるべきこと」を一覧で確認できます。監理団体のご担当者が企業訪問時にそのまま使えるツールです。
            </p>

            <Link
              href="/business/existing-users/ladder/checker"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-[#1a2f5e] text-sm shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200"
              style={{ backgroundColor: '#c9a84c' }}
            >
              診断をはじめる（無料）
              <ArrowRight size={15} />
            </Link>

            <p className="text-xs text-white/40 mt-3">
              ログイン不要・スマホ対応
            </p>
          </div>

          {/* 右メタ数値 (2/5) */}
          <div className="md:col-span-2 flex flex-row md:flex-col gap-4">
            {metaItems.map((item) => (
              <div
                key={item.label}
                className="flex-1 rounded-xl p-5 text-center"
                style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
              >
                <p className="font-[family-name:var(--font-number)] text-2xl md:text-3xl font-bold text-white mb-1">
                  {item.value}
                </p>
                <p className="text-xs text-white/50">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
