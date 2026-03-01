'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SimulatorUserType, SimulatorMode } from '../lib/types';

type Props = {
  onStart: (userType: SimulatorUserType, mode: SimulatorMode) => void;
};

const USER_TYPE_OPTIONS: {
  value: SimulatorUserType;
  label: string;
  desc: string;
  icon: string;
}[] = [
  {
    value: 'kanri',
    label: '監理団体・登録支援機関',
    desc: '提案書PDFを作成し、企業様に提出できます',
    icon: '🏢',
  },
  {
    value: 'company',
    label: '受入企業',
    desc: '自社の採用コストを試算します',
    icon: '🏭',
  },
  {
    value: 'guest',
    label: 'まずは概算を知りたい',
    desc: '5問で概算コストを確認（1分）',
    icon: '⚡',
  },
];

const MODE_OPTIONS: {
  value: SimulatorMode;
  label: string;
  desc: string;
  icon: string;
}[] = [
  {
    value: 'quick',
    label: 'クイック試算',
    desc: '5問で概算（約1分）',
    icon: '⚡',
  },
  {
    value: 'detail',
    label: '詳細シミュレーション',
    desc: '条件を細かく設定（約5分）',
    icon: '📊',
  },
];

export function LandingGate({ onStart }: Props) {
  const [userType, setUserType] = useState<SimulatorUserType | null>(null);
  const [phase, setPhase] = useState<'userType' | 'mode'>('userType');

  const handleUserType = (type: SimulatorUserType) => {
    setUserType(type);
    if (type === 'guest') {
      onStart('guest', 'quick');
      return;
    }
    setPhase('mode');
  };

  const handleMode = (mode: SimulatorMode) => {
    if (!userType) return;
    onStart(userType, mode);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <AnimatePresence mode="wait">
          {phase === 'userType' && (
            <motion.div
              key="userType"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <h1 className="text-2xl md:text-3xl font-bold text-[#1a2f5e] mb-3">
                外国人採用コストシミュレーター
              </h1>
              <p className="text-gray-600 mb-8">
                あなたの立場を選んでください
              </p>

              <div className="grid gap-4">
                {USER_TYPE_OPTIONS.map(({ value, label, desc, icon }) => (
                  <button
                    key={value}
                    onClick={() => handleUserType(value)}
                    className="flex items-center gap-4 p-5 bg-white rounded-xl border-2 border-gray-200 hover:border-[#1a2f5e] hover:shadow-lg transition-all text-left group"
                  >
                    <span className="text-3xl">{icon}</span>
                    <div className="flex-1">
                      <div className="font-bold text-[#1a2f5e] group-hover:text-[#1a2f5e]">
                        {label}
                      </div>
                      <div className="text-sm text-gray-500 mt-0.5">{desc}</div>
                    </div>
                    <span className="text-gray-300 group-hover:text-[#c9a84c] transition-colors text-xl">
                      &rarr;
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {phase === 'mode' && (
            <motion.div
              key="mode"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <h2 className="text-xl md:text-2xl font-bold text-[#1a2f5e] mb-3">
                シミュレーション方法を選択
              </h2>
              <p className="text-gray-600 mb-8">
                {userType === 'kanri'
                  ? '監理団体・登録支援機関として試算します'
                  : '受入企業として試算します'}
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                {MODE_OPTIONS.map(({ value, label, desc, icon }) => (
                  <button
                    key={value}
                    onClick={() => handleMode(value)}
                    className="p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-[#1a2f5e] hover:shadow-lg transition-all text-center group"
                  >
                    <span className="text-4xl block mb-3">{icon}</span>
                    <div className="font-bold text-[#1a2f5e] text-lg">{label}</div>
                    <div className="text-sm text-gray-500 mt-1">{desc}</div>
                  </button>
                ))}
              </div>

              <button
                onClick={() => { setPhase('userType'); setUserType(null); }}
                className="mt-6 text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                &larr; 戻る
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
