'use client';

type Props = {
  currentStep: number;
  onGoToStep: (step: number) => void;
  canProceed: boolean[];
  labels?: string[];
};

const DEFAULT_LABELS = ['企業情報', '採用計画', '自社環境', '団体情報'];

export function StepNavigation({ currentStep, onGoToStep, canProceed, labels }: Props) {
  const stepLabels = labels ?? DEFAULT_LABELS;
  const steps = stepLabels.map((label, i) => ({ num: i + 1, label }));

  return (
    <div className="flex items-center justify-center mb-6 gap-1 md:gap-2">
      {steps.map(({ num, label }, i) => {
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
