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
import type { AllInputs, CostBreakdown, Step4Data } from './CostSimulatorShell';

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
    // テーブル
    table: { marginBottom: 16 },
    tableHeader: { flexDirection: 'row', backgroundColor: brandColor, padding: 6 },
    tableHeaderText: { color: '#fff', fontWeight: 'bold', fontSize: 8 },
    tableRow: { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#e2e8f0', padding: 5 },
    tableRowAlt: { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#e2e8f0', padding: 5, backgroundColor: '#f8fafc' },
    tableTotalRow: { flexDirection: 'row', borderTopWidth: 1.5, borderTopColor: brandColor, padding: 6, backgroundColor: `${brandColor}10` },
    cellLabel: { flex: 3, fontSize: 8 },
    cellAmount: { flex: 2, fontSize: 8, textAlign: 'right', fontWeight: 'bold' },
    // ヒーロー数字
    heroBox: { backgroundColor: brandColor, borderRadius: 8, padding: 16, marginBottom: 16, alignItems: 'center' },
    heroNumber: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
    heroLabel: { fontSize: 9, color: '#fff', opacity: 0.8, marginTop: 4 },
    // タイムライン
    timelineRow: { flexDirection: 'row', marginBottom: 8 },
    timelineDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8, marginTop: 2 },
    timelineLabel: { fontSize: 8, color: '#666', width: 80 },
    timelineText: { fontSize: 9, flex: 1 },
    // フッター
    footer: { position: 'absolute', bottom: 20, left: 40, right: 40, flexDirection: 'row', justifyContent: 'space-between' },
    footerText: { fontSize: 7, color: '#999' },
    disclaimer: { fontSize: 7, color: '#999', marginTop: 12, textAlign: 'center' },
  });

function formatYen(n: number): string {
  return `¥${n.toLocaleString()}`;
}

function rangeText(min: number, max: number): string {
  if (min === 0 && max === 0) return '—';
  if (min === max) return formatYen(min);
  return `${formatYen(min)} 〜 ${formatYen(max)}`;
}

/* ========================================
   PDF Document
   ======================================== */

type PdfProps = {
  inputs: AllInputs;
  breakdowns: CostBreakdown[];
  step4: Step4Data;
  isProposalMode: boolean;
};

function CostSimulatorPdf({ inputs, breakdowns, step4, isProposalMode }: PdfProps) {
  const brandColor = step4.brandColor || '#1a2f5e';
  const s = createStyles(brandColor);
  const today = new Date().toLocaleDateString('ja-JP');
  const orgName = step4.orgName || 'J-GLOW';
  const docTitle = isProposalMode ? `外国人採用コスト試算 提案書` : 'J-GLOW 試算レポート';

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
          <Text style={s.footerText}>1 / 4</Text>
        </View>
      </Page>

      {/* P2: 採用計画サマリー */}
      <Page size="A4" style={s.page}>
        <Text style={s.sectionTitle}>採用計画サマリー</Text>

        {breakdowns.map((b) => (
          <View key={b.visaType} style={s.heroBox}>
            <Text style={s.heroLabel}>{b.visaLabel} — 3年間総コスト（{inputs.step2.headcount}人）</Text>
            <Text style={s.heroNumber}>{rangeText(b.threeYearTotal.min, b.threeYearTotal.max)}</Text>
          </View>
        ))}

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

        <Text style={s.disclaimer}>
          ※ 表示金額はあくまでも目安です。実際の費用は監理団体・登録支援機関にご確認ください。
        </Text>

        <View style={s.footer}>
          <Text style={s.footerText}>{orgName}</Text>
          <Text style={s.footerText}>2 / 4</Text>
        </View>
      </Page>

      {/* P3: 逆算スケジュール */}
      <Page size="A4" style={s.page}>
        <Text style={s.sectionTitle}>逆算スケジュール</Text>

        {breakdowns.map((b) => {
          const steps =
            b.visaType === 'ikusei'
              ? [
                  { label: 'T-8〜9ヶ月', text: '監理団体との契約・加入手続き' },
                  { label: 'T-7〜8ヶ月', text: '受入要請' },
                  { label: 'T-6〜7ヶ月', text: '送出機関との契約・求人票作成' },
                  { label: 'T-5〜6ヶ月', text: '現地面接・内定' },
                  { label: 'T-3〜4ヶ月', text: '育成就労計画 認定申請' },
                  { label: 'T-1〜2ヶ月', text: '在留資格認定証明書 交付・査証取得' },
                  { label: 'T', text: '就労開始' },
                ]
              : b.visaType === 'tokutei_kaigai'
                ? [
                    { label: 'T-5〜6ヶ月', text: '候補者探し' },
                    { label: 'T-4〜5ヶ月', text: '現地面接・内定' },
                    { label: 'T-3〜4ヶ月', text: '雇用契約・試験確認' },
                    { label: 'T-2〜3ヶ月', text: '在留資格認定証明書申請' },
                    { label: 'T-1〜2ヶ月', text: '交付・査証申請・渡航' },
                    { label: 'T', text: '就労開始' },
                  ]
                : [
                    { label: 'T-3ヶ月', text: '候補者探し・面接' },
                    { label: 'T-2ヶ月', text: '雇用契約・変更申請' },
                    { label: 'T-1ヶ月', text: '変更許可・オリエンテーション' },
                    { label: 'T', text: '就労開始（最短3ヶ月）' },
                  ];

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
          <Text style={s.footerText}>3 / 4</Text>
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
          <Text style={s.footerText}>4 / 4</Text>
        </View>
      </Page>
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
      {generating ? 'PDF作成中...' : '📄 PDF提案書を作成'}
    </button>
  );
}
