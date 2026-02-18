'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getIcon } from '@/lib/icons';
import { useLang } from '@/contexts/LangContext';
import type { WorkerTopic } from '@/types/database';

type Props = {
  topics: WorkerTopic[];
  allTexts: Record<string, Record<string, string>>;
  theme: Record<string, string>;
};

const topicColorMap: Record<string, { bg: string; iconBg: string; text: string }> = {
  transfer:     { bg: 'rgba(239,246,255,0.7)', iconBg: '#dbeafe', text: '#1d4ed8' },
  housing:      { bg: 'rgba(240,253,244,0.7)', iconBg: '#dcfce7', text: '#15803d' },
  medical:      { bg: 'rgba(254,242,242,0.7)', iconBg: '#fee2e2', text: '#b91c1c' },
  labor_rights: { bg: 'rgba(250,245,255,0.7)', iconBg: '#f3e8ff', text: '#7e22ce' },
  visa:         { bg: 'rgba(238,242,255,0.7)', iconBg: '#e0e7ff', text: '#4338ca' },
  japanese:     { bg: 'rgba(254,252,232,0.7)', iconBg: '#fef9c3', text: '#a16207' },
  banking:      { bg: 'rgba(236,254,255,0.7)', iconBg: '#cffafe', text: '#0e7490' },
  daily_life:   { bg: 'rgba(255,247,237,0.7)', iconBg: '#ffedd5', text: '#c2410c' },
  emergency:    { bg: 'rgba(255,241,242,0.7)', iconBg: '#ffe4e6', text: '#be123c' },
  career:       { bg: 'rgba(240,253,250,0.7)', iconBg: '#ccfbf1', text: '#0f766e' },
};

const defaultColor = { bg: 'rgba(243,244,246,0.7)', iconBg: '#e5e7eb', text: '#374151' };

export function WorkerHomeClient({ topics, allTexts, theme }: Props) {
  const { lang } = useLang();

  const texts = allTexts[lang] ?? allTexts['ja'] ?? {};
  const jaTexts = allTexts['ja'] ?? {};

  return (
    <div>
      {/* ========================================
          Hero Section — Glassmorphism
          ======================================== */}
      <section className="relative overflow-hidden">
        {/* 背景グラデーション */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${theme['--wkr-primary'] || '#059669'} 0%, ${theme['--wkr-hero-bg'] || '#047857'} 40%, #0d9488 70%, #14b8a6 100%)`,
          }}
        />
        {/* 装飾的なぼかし円 */}
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-[-30%] left-[-10%] w-[400px] h-[400px] rounded-full bg-emerald-300/10 blur-3xl" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 py-20 md:py-28">
          {/* グラスモーフィズムパネル */}
          <div
            className="rounded-2xl p-8 sm:p-10 md:p-12 max-w-2xl mx-auto text-center animate-fade-in-up"
            style={{
              background: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(16px) saturate(1.4)',
              WebkitBackdropFilter: 'blur(16px) saturate(1.4)',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            }}
          >
            <h1 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-white mb-2">
              {texts.hero_title || jaTexts.hero_title || '日本での生活をサポートします'}
            </h1>
            {lang !== 'ja' && (
              <p className="text-white/60 text-sm mb-3">
                {jaTexts.hero_title || ''}
              </p>
            )}
            <p className="text-base sm:text-lg text-white/80 mb-2 leading-relaxed">
              {texts.hero_subtitle || jaTexts.hero_subtitle || ''}
            </p>
            <p className="text-xs text-white/50 tracking-wide">
              {texts.hero_note || jaTexts.hero_note || '11カ国語対応'}
            </p>
          </div>
        </div>
      </section>

      {/* ========================================
          Topics Grid — Glass Tiles
          ======================================== */}
      <section className="max-w-7xl mx-auto px-4 py-16 md:py-20">
        <div className="text-center mb-12">
          <h2 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-bold text-slate-900 mb-1">
            {texts.section_heading || jaTexts.section_heading || '生活課題サポート'}
          </h2>
          <p className="text-sm text-slate-400 mb-2">
            Life Support Topics
          </p>
          <p className="text-slate-500 text-sm md:text-base">
            {texts.section_desc || jaTexts.section_desc || 'あなたの困りごとを選んでください'}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {topics.map((topic, i) => {
            const Icon = getIcon(topic.icon);
            const colors = topicColorMap[topic.slug] || defaultColor;

            return (
              <Link
                key={topic.id}
                href={`/worker/topics/${topic.slug}`}
                className="group block rounded-2xl p-5 text-center bento-card animate-fade-in-up"
                style={{
                  animationDelay: `${i * 60}ms`,
                  background: colors.bg,
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  border: `1px solid ${colors.text}18`,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.6)',
                }}
              >
                <div
                  className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3"
                  style={{ backgroundColor: colors.iconBg }}
                >
                  {Icon && <Icon size={24} style={{ color: colors.text }} />}
                </div>
                <h3
                  className="font-bold text-sm leading-snug mb-0.5"
                  style={{ color: colors.text }}
                >
                  {topic.title_ja}
                </h3>
                <p
                  className="text-[11px] leading-snug opacity-60"
                  style={{ color: colors.text }}
                >
                  {topic.title_en || ''}
                </p>
                <div className="mt-3 flex justify-center">
                  <ArrowRight
                    size={15}
                    className="opacity-0 group-hover:opacity-70 transition-opacity"
                    style={{ color: colors.text }}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
