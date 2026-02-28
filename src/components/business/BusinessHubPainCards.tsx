import {
  MessageSquareX,
  TrendingDown,
  FileQuestion,
  UserMinus,
  EyeOff,
  CircleDollarSign,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type PainCard = {
  icon: LucideIcon;
  title: string;
  body: string;
  emphasis: string;
};

const painCards: PainCard[] = [
  {
    icon: MessageSquareX,
    title: '指示が伝わらない',
    body: '日本語での業務指示が正確に伝わらず、作業ミスや手戻りが頻発。通訳を介しても現場のニュアンスが抜ける。',
    emphasis: '現場の生産性が30%低下するケースも',
  },
  {
    icon: TrendingDown,
    title: '仕事は覚えたが「やる気」が見えない',
    body: '技術は身についたのにモチベーションが低下。将来のキャリアパスが見えず、惰性で働いている様子。',
    emphasis: '離職の兆候は半年前から現れています',
  },
  {
    icon: FileQuestion,
    title: '在留資格の切替・更新が複雑',
    body: '特定技能への移行や育成就労の新制度対応など、手続きが煩雑で何から手をつければいいかわからない。',
    emphasis: '更新漏れは不法就労助長罪の対象に',
  },
  {
    icon: UserMinus,
    title: 'せっかく育てても定着しない',
    body: '在留期間の満了や待遇面の不満で離職。教育コストが積み上がるばかりで、人材が資産にならない。',
    emphasis: '1人あたりの育成コストは平均80〜120万円',
  },
  {
    icon: EyeOff,
    title: '管理体制が属人的で見えない',
    body: '監理団体やエージェントに任せきりで、自社の受入れ状況やコンプライアンスの実態を把握できていない。',
    emphasis: '担当者の退職で全てが止まるリスク',
  },
  {
    icon: CircleDollarSign,
    title: '制度変更でコストがどう変わるか不安',
    body: '法改正や制度変更のたびにコスト構造がどう変わるのか試算できない。動くに動けない状態。',
    emphasis: '2027年の育成就労制度で大幅変更予定',
  },
];

export function BusinessHubPainCards() {
  return (
    <section className="py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <span
            className="inline-block text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ color: '#c9a84c' }}
          >
            Common Pain Points
          </span>
          <h2 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            こんなお悩み、ありませんか？
          </h2>
          <p className="text-gray-500 text-sm md:text-base max-w-lg mx-auto">
            外国人材を受け入れている企業が共通して抱える課題です
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {painCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="bg-slate-50 rounded-xl p-6"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: '#eef2ff' }}
                >
                  <Icon size={22} strokeWidth={1.8} style={{ color: '#1a2f5e' }} />
                </div>
                <h3 className="font-bold mb-2" style={{ color: '#1a2f5e' }}>
                  {card.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-2">
                  {card.body}
                </p>
                <p className="text-xs font-bold" style={{ color: '#c9a84c' }}>
                  {card.emphasis}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
