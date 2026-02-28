import Link from 'next/link';

type Props = {
  industry?: string;
};

export function CostSimulatorCTA({ industry }: Props) {
  const href = industry
    ? `/business/cost-simulator`
    : '/business/cost-simulator';

  return (
    <div className="mt-8 p-6 bg-gradient-to-r from-[#1a2f5e] to-[#2a4a8e] rounded-xl text-center">
      <p className="text-white text-sm mb-3">
        {industry
          ? `${industry}の採用コストを具体的に試算しませんか？`
          : '外国人採用のコストを具体的に試算しませんか？'}
      </p>
      <Link
        href={href}
        className="inline-block px-6 py-3 bg-[#c9a84c] text-white rounded-lg font-medium hover:bg-[#c9a84c]/90 transition-colors text-sm"
      >
        この業種の採用コストを試算する →
      </Link>
    </div>
  );
}
