'use client';

import { useState, useCallback } from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  pdf,
} from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import type { AllInputsV1 as AllInputs, AllInputs as AllInputsV2, CostBreakdown, Step4Data, DiagnosisItem, ActionStep } from '../lib/types';
import { diagnoseInputs, generateActionPlan, getIndustryBenchmarkComparison, calcRiskScenarios } from '../lib/calculate';
import { JP_HIRING_BENCHMARKS, ADDITIONAL_RISKS, INDUSTRIES_V2 } from '../lib/constants';

/* ========================================
   フォント登録
   ======================================== */

Font.register({
  family: 'NotoSansJP',
  fonts: [
    { src: '/fonts/NotoSansJP-Regular.otf', fontWeight: 'normal' },
    { src: '/fonts/NotoSansJP-Bold.otf', fontWeight: 'bold' },
  ],
});

/* ========================================
   スタイル
   ======================================== */

const createStyles = (brandColor: string) =>
  StyleSheet.create({
    page: { fontFamily: 'NotoSansJP', fontSize: 9, padding: 40, color: '#333' },
    // 表紙
    coverPage: { fontFamily: 'NotoSansJP', padding: 0 },
    coverHeader: { backgroundColor: brandColor, height: 250, justifyContent: 'center', alignItems: 'center', padding: 40 },
    coverTitle: { fontSize: 24, color: '#fff', fontWeight: 'bold', textAlign: 'center' },
    coverSubtitle: { fontSize: 12, color: '#fff', opacity: 0.8, marginTop: 8, textAlign: 'center' },
    coverMeta: { padding: 40, flex: 1, justifyContent: 'flex-end' },
    coverMetaRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    coverMetaLabel: { fontSize: 10, color: '#666' },
    coverMetaValue: { fontSize: 12, fontWeight: 'bold' },
    // 共通
    sectionTitle: { fontSize: 14, fontWeight: 'bold', color: brandColor, marginBottom: 12, borderBottomWidth: 2, borderBottomColor: brandColor, paddingBottom: 4 },
    subTitle: { fontSize: 11, fontWeight: 'bold', color: brandColor, marginBottom: 8, marginTop: 16 },
    bodyText: { fontSize: 9, color: '#333', lineHeight: 1.6, marginBottom: 8 },
    // テーブル
    table: { marginBottom: 16 },
    tableHeader: { flexDirection: 'row', backgroundColor: brandColor, padding: 6 },
    tableHeaderText: { color: '#fff', fontWeight: 'bold', fontSize: 8 },
    tableRow: { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#e2e8f0', padding: 5 },
    tableRowAlt: { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#e2e8f0', padding: 5, backgroundColor: '#f8fafc' },
    tableTotalRow: { flexDirection: 'row', borderTopWidth: 1.5, borderTopColor: brandColor, padding: 6, backgroundColor: `${brandColor}10` },
    cellLabel: { flex: 3, fontSize: 8 },
    cellAmount: { flex: 2, fontSize: 8, textAlign: 'right', fontWeight: 'bold' },
    cellWide: { flex: 4, fontSize: 8 },
    cellNarrow: { flex: 1.5, fontSize: 8, textAlign: 'right' },
    // ヒーロー数字
    heroBox: { backgroundColor: brandColor, borderRadius: 8, padding: 16, marginBottom: 16, alignItems: 'center' },
    heroNumber: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
    heroLabel: { fontSize: 9, color: '#fff', opacity: 0.8, marginTop: 4 },
    // KPIカード
    kpiRow: { flexDirection: 'row', marginBottom: 12, gap: 8 },
    kpiCard: { flex: 1, borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 6, padding: 10, alignItems: 'center' },
    kpiValue: { fontSize: 16, fontWeight: 'bold', color: brandColor },
    kpiLabel: { fontSize: 7, color: '#666', marginTop: 4 },
    // タイムライン
    timelineRow: { flexDirection: 'row', marginBottom: 8 },
    timelineDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8, marginTop: 2 },
    timelineLabel: { fontSize: 8, color: '#666', width: 80 },
    timelineText: { fontSize: 9, flex: 1 },
    // 診断・リスクカード
    diagCard: { borderWidth: 1, borderRadius: 6, padding: 10, marginBottom: 8 },
    diagTitle: { fontSize: 9, fontWeight: 'bold', color: '#333', marginBottom: 4 },
    diagDesc: { fontSize: 8, color: '#555', lineHeight: 1.5 },
    // アクションプラン
    phaseHeader: { backgroundColor: brandColor, borderRadius: 4, padding: 6, marginBottom: 6, marginTop: 12 },
    phaseHeaderText: { fontSize: 9, fontWeight: 'bold', color: '#fff' },
    taskRow: { flexDirection: 'row', marginBottom: 4, paddingLeft: 8 },
    taskBullet: { fontSize: 8, color: brandColor, marginRight: 6, width: 10 },
    taskLabel: { fontSize: 8, color: '#333', flex: 1 },
    // フッター
    footer: { position: 'absolute', bottom: 20, left: 40, right: 40, flexDirection: 'row', justifyContent: 'space-between' },
    footerText: { fontSize: 7, color: '#999' },
    disclaimer: { fontSize: 7, color: '#999', marginTop: 12, textAlign: 'center' },
    // 注意バナー
    noticeBanner: { backgroundColor: '#fffbeb', borderWidth: 1, borderColor: '#f59e0b', borderRadius: 6, padding: 8, marginBottom: 12 },
    noticeText: { fontSize: 8, color: '#92400e' },
  });

function formatYen(n: number): string {
  return `¥${n.toLocaleString()}`;
}

function formatMidYen(min: number, max: number): string {
  const mid = Math.round((min + max) / 2);
  return formatYen(mid);
}

function rangeText(min: number, max: number): string {
  if (min === 0 && max === 0) return '—';
  if (min === max) return formatYen(min);
  return `${formatYen(min)} 〜 ${formatYen(max)}`;
}

function formatManYen(n: number): string {
  return `約${Math.round(n / 10000)}万円`;
}

/* ========================================
   PDF Document
   ======================================== */

type PdfProps = {
  inputs: AllInputs;
  allInputs?: AllInputsV2;
  breakdowns: CostBreakdown[];
  step4: Step4Data;
  isProposalMode: boolean;
};

function CostSimulatorPdf({ inputs, allInputs, breakdowns, step4, isProposalMode }: PdfProps) {
  const brandColor = step4.brandColor || '#1a2f5e';
  const s = createStyles(brandColor);
  const today = new Date().toLocaleDateString('ja-JP');
  const orgName = step4.orgName || 'J-GLOW';
  const docTitle = isProposalMode ? `外国人採用コスト試算 提案書` : 'J-GLOW 試算レポート';
  const primary = breakdowns[0];
  const hasIkusei = breakdowns.some((b) => b.visaType === 'ikusei');

  // 業種ベンチマーク
  const benchmark = primary ? getIndustryBenchmarkComparison(
    inputs.step1.industry,
    primary.initialTotal,
    primary.monthlyTotal,
  ) : null;

  // 日本人採用比較
  const industryDef = INDUSTRIES_V2.find((i) => i.label === inputs.step1.industry || i.id === inputs.step1.industry);
  const jpBenchmark = industryDef ? JP_HIRING_BENCHMARKS[industryDef.id] : JP_HIRING_BENCHMARKS['other'];

  // 診断
  const diagnosisItems: DiagnosisItem[] = allInputs ? diagnoseInputs(allInputs, breakdowns) : [];

  // アクションプラン
  const actionPlan: ActionStep[] = allInputs ? generateActionPlan(allInputs) : [];

  // リスクシナリオ
  const riskScenarios = primary ? calcRiskScenarios(
    inputs.step2.headcount,
    primary.initialTotal,
  ) : [];

  // 総ページ数計算
  const totalPages = isProposalMode ? 8 : 6;

  return (
    <Document>
      {/* P1: 表紙 */}
      <Page size="A4" style={s.coverPage}>
        <View style={s.coverHeader}>
          <Text style={s.coverTitle}>{docTitle}</Text>
          <Text style={s.coverSubtitle}>
            {isProposalMode ? `${orgName}` : '外国人雇用コストシミュレーター'}
          </Text>
        </View>
        <View style={s.coverMeta}>
          {inputs.step1.companyName && (
            <View style={s.coverMetaRow}>
              <Text style={s.coverMetaLabel}>企業名</Text>
              <Text style={s.coverMetaValue}>{inputs.step1.companyName}</Text>
            </View>
          )}
          <View style={s.coverMetaRow}>
            <Text style={s.coverMetaLabel}>業種</Text>
            <Text style={s.coverMetaValue}>{inputs.step1.industry}</Text>
          </View>
          <View style={s.coverMetaRow}>
            <Text style={s.coverMetaLabel}>採用人数</Text>
            <Text style={s.coverMetaValue}>{inputs.step2.headcount}人</Text>
          </View>
          {isProposalMode && step4.orgContact && (
            <View style={s.coverMetaRow}>
              <Text style={s.coverMetaLabel}>担当</Text>
              <Text style={s.coverMetaValue}>{step4.orgContact}</Text>
            </View>
          )}
          <View style={s.coverMetaRow}>
            <Text style={s.coverMetaLabel}>作成日</Text>
            <Text style={s.coverMetaValue}>{today}</Text>
          </View>
        </View>
        <View style={s.footer}>
          <Text style={s.footerText}>{orgName}</Text>
          <Text style={s.footerText}>1 / {totalPages}</Text>
        </View>
      </Page>

      {/* P2: エグゼクティブサマリー */}
      <Page size="A4" style={s.page}>
        <Text style={s.sectionTitle}>エグゼクティブサマリー</Text>

        {hasIkusei && (
          <View style={s.noticeBanner}>
            <Text style={s.noticeText}>
              育成就労制度は2027年施行予定の新制度です。本試算は概算であり、施行時に費用体系が変更される可能性があります。
            </Text>
          </View>
        )}

        {/* KPI 3カード */}
        {primary && (
          <View style={s.kpiRow}>
            <View style={s.kpiCard}>
              <Text style={s.kpiValue}>{formatMidYen(primary.initialTotal.min, primary.initialTotal.max)}</Text>
              <Text style={s.kpiLabel}>1人あたり初期費用</Text>
            </View>
            <View style={s.kpiCard}>
              <Text style={s.kpiValue}>{formatMidYen(primary.monthlyTotal.min, primary.monthlyTotal.max)}</Text>
              <Text style={s.kpiLabel}>月次コスト（1人）</Text>
            </View>
            <View style={s.kpiCard}>
              <Text style={s.kpiValue}>{formatMidYen(primary.threeYearTotal.min, primary.threeYearTotal.max)}</Text>
              <Text style={s.kpiLabel}>3年間総コスト（{inputs.step2.headcount}人）</Text>
            </View>
          </View>
        )}

        {/* 業界ベンチマーク */}
        {benchmark && (
          <View style={{ marginBottom: 12 }}>
            <Text style={s.bodyText}>
              業界平均との比較: {benchmark.label}（初期費用 {benchmark.initialDiff > 0 ? '+' : ''}{benchmark.initialDiff}%、月次 {benchmark.monthlyDiff > 0 ? '+' : ''}{benchmark.monthlyDiff}%）
            </Text>
          </View>
        )}

        {/* 3年間総コスト（ヒーロー） */}
        {breakdowns.map((b) => (
          <View key={b.visaType} style={s.heroBox}>
            <Text style={s.heroLabel}>{b.visaLabel} — 3年間総コスト（{inputs.step2.headcount}人）</Text>
            <Text style={s.heroNumber}>{formatMidYen(b.threeYearTotal.min, b.threeYearTotal.max)}</Text>
            {b.threeYearTotal.min !== b.threeYearTotal.max && (
              <Text style={{ fontSize: 7, color: '#fff', opacity: 0.6, marginTop: 2 }}>
                （{rangeText(b.threeYearTotal.min, b.threeYearTotal.max)}）
              </Text>
            )}
          </View>
        ))}

        {/* 日本人採用との比較 */}
        {jpBenchmark && primary && (
          <>
            <Text style={s.subTitle}>日本人採用との比較</Text>
            <View style={s.table}>
              <View style={s.tableHeader}>
                <Text style={[s.tableHeaderText, s.cellWide]}>項目</Text>
                <Text style={[s.tableHeaderText, s.cellNarrow]}>外国人採用</Text>
                <Text style={[s.tableHeaderText, s.cellNarrow]}>日本人採用</Text>
              </View>
              <View style={s.tableRow}>
                <Text style={s.cellWide}>初期費用（1人あたり）</Text>
                <Text style={s.cellNarrow}>{formatMidYen(primary.initialTotal.min, primary.initialTotal.max)}</Text>
                <Text style={s.cellNarrow}>{formatMidYen(jpBenchmark.adCostPerHire.min, jpBenchmark.adCostPerHire.max)}</Text>
              </View>
              <View style={s.tableRowAlt}>
                <Text style={s.cellWide}>紹介手数料率</Text>
                <Text style={s.cellNarrow}>—</Text>
                <Text style={s.cellNarrow}>{Math.round(jpBenchmark.agencyFeeRate * 100)}%</Text>
              </View>
              <View style={s.tableRow}>
                <Text style={s.cellWide}>有効求人倍率</Text>
                <Text style={s.cellNarrow}>—</Text>
                <Text style={s.cellNarrow}>{jpBenchmark.effectiveJobOpeningsRatio}倍</Text>
              </View>
            </View>
          </>
        )}

        <Text style={s.disclaimer}>
          ※ 表示金額はあくまでも目安です。実際の費用は監理団体・登録支援機関にご確認ください。
        </Text>

        <View style={s.footer}>
          <Text style={s.footerText}>{orgName}</Text>
          <Text style={s.footerText}>2 / {totalPages}</Text>
        </View>
      </Page>

      {/* P3: 課題診断・提案 */}
      <Page size="A4" style={s.page}>
        <Text style={s.sectionTitle}>課題診断・ご提案</Text>

        {diagnosisItems.length > 0 ? (
          <>
            <Text style={s.bodyText}>
              入力いただいた条件をもとに、{diagnosisItems.length}件の改善ポイントを自動検出しました。
            </Text>
            {diagnosisItems.map((item, i) => {
              const colors: Record<string, { bg: string; border: string }> = {
                urgent:      { bg: '#fef2f2', border: '#fca5a5' },
                warning:     { bg: '#fffbeb', border: '#fcd34d' },
                info:        { bg: '#eff6ff', border: '#93c5fd' },
                opportunity: { bg: '#f0fdf4', border: '#86efac' },
              };
              const c = colors[item.type] ?? colors.info;
              return (
                <View key={i} style={[s.diagCard, { backgroundColor: c.bg, borderColor: c.border }]}>
                  <Text style={s.diagTitle}>{item.title}</Text>
                  <Text style={s.diagDesc}>{item.description}</Text>
                </View>
              );
            })}
          </>
        ) : (
          <Text style={s.bodyText}>
            現時点で特に問題のある設定は検出されませんでした。入力条件は概ね適切です。
          </Text>
        )}

        {/* 入力条件一覧 */}
        <Text style={s.subTitle}>入力条件</Text>
        <View style={s.table}>
          {[
            ['業種', inputs.step1.industry],
            ['常勤職員数', `${inputs.step1.fullTimeStaff}人`],
            ['採用人数', `${inputs.step2.headcount}人`],
            ['就労開始希望', inputs.step2.startDate],
            ['送出国', inputs.step2.sendingCountry],
          ].map(([label, value], i) => (
            <View key={label} style={i % 2 === 0 ? s.tableRow : s.tableRowAlt}>
              <Text style={s.cellLabel}>{label}</Text>
              <Text style={s.cellAmount}>{value}</Text>
            </View>
          ))}
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>{orgName}</Text>
          <Text style={s.footerText}>3 / {totalPages}</Text>
        </View>
      </Page>

      {/* P4: コスト詳細内訳 */}
      <Page size="A4" style={s.page}>
        <Text style={s.sectionTitle}>コスト詳細内訳</Text>

        {breakdowns.map((b) => (
          <View key={b.visaType} style={{ marginBottom: 20 }}>
            <Text style={s.subTitle}>{b.visaLabel}</Text>

            {/* 初期費用 */}
            <View style={s.table}>
              <View style={s.tableHeader}>
                <Text style={[s.tableHeaderText, s.cellLabel]}>初期費用</Text>
                <Text style={[s.tableHeaderText, s.cellAmount]}>金額（1人あたり）</Text>
              </View>
              {b.initialItems.map((item, i) => (
                <View key={item.key} style={i % 2 === 0 ? s.tableRow : s.tableRowAlt}>
                  <Text style={s.cellLabel}>{item.label}</Text>
                  <Text style={s.cellAmount}>{rangeText(item.min, item.max)}</Text>
                </View>
              ))}
              <View style={s.tableTotalRow}>
                <Text style={[s.cellLabel, { fontWeight: 'bold' }]}>初期費用 小計</Text>
                <Text style={s.cellAmount}>{rangeText(b.initialTotal.min, b.initialTotal.max)}</Text>
              </View>
            </View>

            {/* 月次費用 */}
            <View style={s.table}>
              <View style={s.tableHeader}>
                <Text style={[s.tableHeaderText, s.cellLabel]}>月次費用</Text>
                <Text style={[s.tableHeaderText, s.cellAmount]}>金額（1人あたり/月）</Text>
              </View>
              {b.monthlyItems.map((item, i) => (
                <View key={item.key} style={i % 2 === 0 ? s.tableRow : s.tableRowAlt}>
                  <Text style={s.cellLabel}>{item.label}</Text>
                  <Text style={s.cellAmount}>{rangeText(item.min, item.max)}</Text>
                </View>
              ))}
              <View style={s.tableTotalRow}>
                <Text style={[s.cellLabel, { fontWeight: 'bold' }]}>月次費用 小計</Text>
                <Text style={s.cellAmount}>{rangeText(b.monthlyTotal.min, b.monthlyTotal.max)}</Text>
              </View>
            </View>
          </View>
        ))}

        <Text style={s.disclaimer}>
          ※ 表示金額はあくまでも目安です。実際の費用は監理団体・登録支援機関にご確認ください。
        </Text>

        <View style={s.footer}>
          <Text style={s.footerText}>{orgName}</Text>
          <Text style={s.footerText}>4 / {totalPages}</Text>
        </View>
      </Page>

      {/* P5: 逆算スケジュール */}
      <Page size="A4" style={s.page}>
        <Text style={s.sectionTitle}>逆算スケジュール</Text>

        {breakdowns.map((b) => {
          const stepsMap: Record<string, { label: string; text: string }[]> = {
            ikusei: [
              { label: 'T-8〜9ヶ月', text: '監理団体との契約・加入手続き' },
              { label: 'T-7〜8ヶ月', text: '受入要請' },
              { label: 'T-6〜7ヶ月', text: '送出機関との契約・求人票作成' },
              { label: 'T-5〜6ヶ月', text: '現地面接・内定' },
              { label: 'T-3〜4ヶ月', text: '育成就労計画 認定申請' },
              { label: 'T-1〜2ヶ月', text: '在留資格認定証明書 交付・査証取得' },
              { label: 'T', text: '就労開始' },
            ],
            tokutei1_kaigai: [
              { label: 'T-5〜6ヶ月', text: '候補者探し' },
              { label: 'T-4〜5ヶ月', text: '現地面接・内定' },
              { label: 'T-3〜4ヶ月', text: '雇用契約・試験確認' },
              { label: 'T-2〜3ヶ月', text: '在留資格認定証明書申請' },
              { label: 'T-1〜2ヶ月', text: '交付・査証申請・渡航' },
              { label: 'T', text: '就労開始' },
            ],
            tokutei1_kokunai: [
              { label: 'T-3ヶ月', text: '候補者探し・面接' },
              { label: 'T-2ヶ月', text: '雇用契約・変更申請' },
              { label: 'T-1ヶ月', text: '変更許可・オリエンテーション' },
              { label: 'T', text: '就労開始（最短3ヶ月）' },
            ],
            tokutei2: [
              { label: 'T-4ヶ月', text: '1号での経験確認' },
              { label: 'T-3ヶ月', text: '2号技能試験受験・合格' },
              { label: 'T-2ヶ月', text: '在留資格変更申請' },
              { label: 'T', text: '2号での就労開始' },
            ],
            ginou: [
              { label: 'T-3ヶ月', text: '候補者探し・書類選考' },
              { label: 'T-2ヶ月', text: '面接・行政書士依頼' },
              { label: 'T-1ヶ月', text: '在留資格申請・許可' },
              { label: 'T', text: '就労開始' },
            ],
            student: [
              { label: 'T-2ヶ月', text: '候補者選定・アルバイト開始' },
              { label: 'T-1ヶ月', text: '卒業後ビザ変更申請' },
              { label: 'T', text: '正規就労開始' },
            ],
          };
          const steps = stepsMap[b.visaType] ?? stepsMap['tokutei1_kokunai'];

          return (
            <View key={b.visaType} style={{ marginBottom: 20 }}>
              <Text style={s.subTitle}>{b.visaLabel}</Text>
              {steps.map((step, i) => (
                <View key={i} style={s.timelineRow}>
                  <View
                    style={[
                      s.timelineDot,
                      {
                        backgroundColor:
                          step.label === 'T' ? '#c9a84c' : brandColor,
                      },
                    ]}
                  />
                  <Text style={s.timelineLabel}>{step.label}</Text>
                  <Text style={s.timelineText}>{step.text}</Text>
                </View>
              ))}
            </View>
          );
        })}

        <View style={s.footer}>
          <Text style={s.footerText}>{orgName}</Text>
          <Text style={s.footerText}>5 / {totalPages}</Text>
        </View>
      </Page>

      {/* P6: リスク分析 */}
      <Page size="A4" style={s.page}>
        <Text style={s.sectionTitle}>リスク分析・対策</Text>

        {/* 離職リスクシナリオ */}
        <Text style={s.subTitle}>離職リスクシナリオ</Text>
        {riskScenarios.length > 0 && (
          <View style={s.table}>
            <View style={s.tableHeader}>
              <Text style={[s.tableHeaderText, { flex: 2 }]}>シナリオ</Text>
              <Text style={[s.tableHeaderText, { flex: 1, textAlign: 'right' }]}>離職率</Text>
              <Text style={[s.tableHeaderText, { flex: 1, textAlign: 'right' }]}>離職人数</Text>
              <Text style={[s.tableHeaderText, { flex: 2, textAlign: 'right' }]}>リスクコスト</Text>
            </View>
            {riskScenarios.map((scenario, i) => (
              <View key={i} style={i % 2 === 0 ? s.tableRow : s.tableRowAlt}>
                <Text style={{ flex: 2, fontSize: 8 }}>{scenario.label}</Text>
                <Text style={{ flex: 1, fontSize: 8, textAlign: 'right' }}>{scenario.turnoverRate}%</Text>
                <Text style={{ flex: 1, fontSize: 8, textAlign: 'right' }}>{scenario.lostWorkers}人</Text>
                <Text style={{ flex: 2, fontSize: 8, textAlign: 'right', fontWeight: 'bold' }}>{formatYen(scenario.riskTotal)}</Text>
              </View>
            ))}
          </View>
        )}

        <Text style={s.bodyText}>
          離職防止は再採用コストの削減に直結します。現場指示書ビルダーや日本語研修支援を活用して、定着率の改善に取り組むことをお勧めします。
        </Text>

        {/* その他のリスク */}
        <Text style={s.subTitle}>その他の主要リスク</Text>
        {ADDITIONAL_RISKS.map((risk) => {
          if (risk.type === 'regulatory' && !hasIkusei) return null;
          const colors: Record<string, { bg: string; border: string }> = {
            high:   { bg: '#fef2f2', border: '#fca5a5' },
            medium: { bg: '#fffbeb', border: '#fcd34d' },
            low:    { bg: '#f0fdf4', border: '#86efac' },
          };
          const c = colors[risk.severity] ?? colors.medium;
          const severityLabel = risk.severity === 'high' ? '高' : risk.severity === 'medium' ? '中' : '低';
          return (
            <View key={risk.type} style={[s.diagCard, { backgroundColor: c.bg, borderColor: c.border }]}>
              <Text style={s.diagTitle}>[リスク度: {severityLabel}] {risk.label}</Text>
              <Text style={s.diagDesc}>{risk.description}</Text>
            </View>
          );
        })}

        <View style={s.footer}>
          <Text style={s.footerText}>{orgName}</Text>
          <Text style={s.footerText}>6 / {totalPages}</Text>
        </View>
      </Page>

      {/* P7: アクションプラン（allInputs がある場合） */}
      {actionPlan.length > 0 && (
        <Page size="A4" style={s.page}>
          <Text style={s.sectionTitle}>アクションプラン</Text>

          <Text style={s.bodyText}>
            下記は採用開始から就労開始までの推奨アクションプランです。各フェーズのタスクを順次実行することで、スムーズな外国人材受入を実現できます。
          </Text>

          {actionPlan.map((phase, i) => (
            <View key={i}>
              <View style={s.phaseHeader}>
                <Text style={s.phaseHeaderText}>Phase {i + 1}: {phase.phase}</Text>
              </View>
              {phase.tasks.map((task, j) => (
                <View key={j} style={s.taskRow}>
                  <Text style={s.taskBullet}>-</Text>
                  <Text style={s.taskLabel}>{task.label}</Text>
                </View>
              ))}
            </View>
          ))}

          <View style={s.footer}>
            <Text style={s.footerText}>{orgName}</Text>
            <Text style={s.footerText}>7 / {totalPages}</Text>
          </View>
        </Page>
      )}

      {/* P8: サービス紹介（提案モード時のみ） */}
      {isProposalMode && (
        <Page size="A4" style={s.page}>
          <Text style={s.sectionTitle}>{orgName}のサービス紹介</Text>

          <Text style={s.bodyText}>
            {orgName}は、外国人材の受入から定着までをワンストップでサポートいたします。
          </Text>

          <Text style={s.subTitle}>ご提供サービス</Text>

          {[
            { title: '受入計画策定', desc: '業種・規模に応じた最適なビザ種別の選定、採用人数計画、コスト試算をサポートします。' },
            { title: '送出機関連携', desc: '信頼性の高い送出機関の紹介・選定、現地面接のアレンジ、候補者の事前スクリーニングを行います。' },
            { title: '在留資格申請代行', desc: '育成就労計画の認定申請、在留資格認定証明書の取得、査証申請までの各種行政手続きを代行します。' },
            { title: '入国後サポート', desc: '入国後講習の実施、住居手配、生活オリエンテーション、日本語研修プログラムの提供を行います。' },
            { title: '定着支援', desc: '定期面談、相談窓口の設置、多言語での生活支援、キャリアパスの設計をサポートします。' },
          ].map((item, i) => (
            <View key={i} style={{ marginBottom: 10 }}>
              <Text style={{ fontSize: 10, fontWeight: 'bold', color: brandColor, marginBottom: 3 }}>{item.title}</Text>
              <Text style={s.bodyText}>{item.desc}</Text>
            </View>
          ))}

          <View style={{ marginTop: 20, borderTopWidth: 1, borderTopColor: '#e2e8f0', paddingTop: 16 }}>
            <Text style={{ fontSize: 11, fontWeight: 'bold', color: brandColor, marginBottom: 8 }}>
              お問い合わせ
            </Text>
            {step4.orgContact && (
              <Text style={s.bodyText}>担当: {step4.orgContact}</Text>
            )}
            <Text style={s.bodyText}>
              本試算の詳細説明やお見積りのご相談は、お気軽にお問い合わせください。
            </Text>
          </View>

          <Text style={s.disclaimer}>
            本書に記載の金額は概算であり、実際の費用は個別のお見積りにてご確認ください。
          </Text>

          <View style={s.footer}>
            <Text style={s.footerText}>{orgName}</Text>
            <Text style={s.footerText}>{totalPages} / {totalPages}</Text>
          </View>
        </Page>
      )}
    </Document>
  );
}

/* ========================================
   ダウンロードボタン
   ======================================== */

export function PdfDownloadButton(props: PdfProps) {
  const [generating, setGenerating] = useState(false);

  const handleDownload = useCallback(async () => {
    setGenerating(true);
    try {
      const blob = await pdf(<CostSimulatorPdf {...props} />).toBlob();
      const companyPart = props.inputs.step1.companyName || '試算';
      const date = new Date().toISOString().slice(0, 10);
      saveAs(blob, `採用コスト試算_${companyPart}_${date}.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      setGenerating(false);
    }
  }, [props]);

  return (
    <button
      onClick={handleDownload}
      disabled={generating}
      className="px-6 py-3 bg-[#c9a84c] text-white rounded-lg text-sm font-medium hover:bg-[#c9a84c]/90 transition-colors disabled:opacity-50"
    >
      {generating ? 'PDF作成中...' : 'PDF提案書を作成'}
    </button>
  );
}
