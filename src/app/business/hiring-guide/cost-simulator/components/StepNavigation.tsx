'use client';

const STEPS = [
  { num: 1, label: '企業情報' },
  { num: 2, label: '採用計画' },
  { num: 3, label: '自社環境' },
  { num: 4, label: '団体情報' },
];

type Props = {
  currentStep: number;
  onGoToStep: (step: number) => void;
  canProceed: boolean[]; // index 0=always true, 1=step1 valid, 2=step2 valid, 3=step3 valid
};

export function StepNavigation({ currentStep, onGoToStep, canProceed }: Props) {
  return (
    <div className="flex items-center justify-center mb-6 gap-1 md:gap-2">
      {STEPS.map(({ num, label }, i) => {
        const isActive = num === currentStep;
        const isDone = num < currentStep;
        const canGo = isDone || (num <= currentStep && canProceed.slice(0, num).every(Boolean));

        return (
          <div key={num} className="flex items-center">
            {i > 0 && (
              <div
                className={`hidden md:block w-8 h-0.5 mx-1 ${
                  isDone ? 'bg-[#c9a84c]' : 'bg-gray-200'
                }`}
              />
            )}
            <button
              onClick={() => canGo && onGoToStep(num)}
              disabled={!canGo}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#1a2f5e] text-white'
                  : isDone
                    ? 'bg-[#c9a84c]/10 text-[#c9a84c] hover:bg-[#c9a84c]/20 cursor-pointer'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <span
                className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                  isActive
                    ? 'bg-white text-[#1a2f5e]'
                    : isDone
                      ? 'bg-[#c9a84c] text-white'
                      : 'bg-gray-300 text-white'
                }`}
              >
                {isDone ? '✓' : num}
              </span>
              <span className="hidden md:inline">{label}</span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
