'use client';

import type { SimulatorOrgPreset } from '@/types/database';

type Props = {
  presets: SimulatorOrgPreset[];
  onLoad: (preset: SimulatorOrgPreset) => void;
  onDelete: (id: string) => void;
  activePresetId: string | null;
};

export function PresetManager({ presets, onLoad, onDelete, activePresetId }: Props) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">保存済みプリセット</label>
      <div className="flex flex-wrap gap-2">
        {presets.map((p) => (
          <div
            key={p.id}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm ${
              activePresetId === p.id
                ? 'border-[#c9a84c] bg-[#c9a84c]/10 text-[#8a6d2b]'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <button onClick={() => onLoad(p)} className="hover:underline">
              {p.preset_name}
            </button>
            {p.org_name && (
              <span className="text-xs text-gray-400">({p.org_name})</span>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`「${p.preset_name}」を削除しますか？`)) onDelete(p.id);
              }}
              className="text-gray-300 hover:text-red-500 text-xs ml-1"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
