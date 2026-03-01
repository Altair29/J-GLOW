'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Printer, FileText, Star } from 'lucide-react';
import {
  type Language,
  type Industry,
  type RuleItem,
  LANGUAGES,
  INDUSTRIES,
  UI,
  SAFETY_RULES,
  EMERGENCY_RULES,
  DAILY_RULES,
  PHRASES,
} from '@/lib/templateData';

const MAX_PER_SECTION = 5;
const MAX_SAFETY = 7;

const FONT_MAP: Record<Language, string> = {
  ja: "'Noto Sans JP', sans-serif",
  vi: "'Noto Sans', sans-serif",
  id: "'Noto Sans', sans-serif",
  en: "'Noto Sans', sans-serif",
  my: "'Noto Sans Myanmar', sans-serif",
  zh: "'Noto Sans SC', sans-serif",
};

const FONT_URLS: Record<Language, string> = {
  ja: 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap',
  vi: 'https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&display=swap',
  id: 'https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&display=swap',
  en: 'https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&display=swap',
  my: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Myanmar:wght@400;700&display=swap',
  zh: 'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700&display=swap',
};

const SUPERVISOR_GENERIC: Record<Language, string> = {
  ja: '担当者',
  vi: 'người phụ trách',
  id: 'penanggung jawab',
  en: 'your supervisor',
  my: 'တာဝန်ခံ',
  zh: '负责人',
};

const TITLE_NO_COMPANY: Record<Language, string> = {
  ja: '現場で大切なルール',
  vi: 'Nội Quy Quan Trọng Tại Nơi Làm Việc',
  id: 'Peraturan Penting di Tempat Kerja',
  en: 'Important Workplace Rules',
  my: 'အလုပ်ခွင်တွင် အရေးကြီးသောစည်းမျဉ်းများ',
  zh: '工作场所重要规则',
};

const TITLE_WITH_COMPANY: Record<Language, string> = {
  ja: '{name}の現場で大切なルール',
  vi: 'Nội Quy Quan Trọng Tại {name}',
  id: 'Peraturan Penting di {name}',
  en: 'Important Rules at {name}',
  my: '{name} တွင် အရေးကြီးသောစည်းမျဉ်းများ',
  zh: '{name}的工作场所重要规则',
};

// ─── Helper Functions ────────────────────────────────────────────

function getLangText(item: RuleItem, lang: Language): string {
  if (lang === 'id') return item.id_lang;
  return item[lang];
}

function getLangContext(item: RuleItem, lang: Language): string | undefined {
  if (!item.context) return undefined;
  return item.context[lang];
}

function getItemText(
  item: RuleItem,
  lang: Language,
  paramValues: Record<string, number>,
  companyInfo: { supervisor: string; supervisorKana: string },
): string {
  let text = getLangText(item, lang);

  // Resolve __key__ param placeholders
  if (item.params) {
    for (const p of item.params) {
      const val = paramValues[`${item.id}-${p.key}`] ?? p.default;
      text = text.replace(new RegExp(`__${p.key}__`, 'g'), String(val));
    }
  }

  // Resolve __supervisor__ placeholder
  if (item.usesSupervisorName) {
    const name = companyInfo.supervisorKana || companyInfo.supervisor;
    if (name) {
      const display = lang === 'ja' ? `${name}さん` : name;
      text = text.replace('__supervisor__', display);
    } else {
      text = text.replace('__supervisor__', SUPERVISOR_GENERIC[lang]);
    }
  }

  return text;
}

function sortByIndustry(items: RuleItem[], industry: Industry): RuleItem[] {
  if (industry === 'all') return items;
  return [...items].sort((a, b) => {
    const aMatch = a.industries.includes(industry);
    const bMatch = b.industries.includes(industry);
    const aAll = a.industries.includes('all');
    const bAll = b.industries.includes('all');
    // ★ matched items first
    if (aMatch && !bMatch) return -1;
    if (!aMatch && bMatch) return 1;
    // 'all' items next
    if (aAll && !bAll) return -1;
    if (!aAll && bAll) return 1;
    return 0;
  });
}

function getRelevance(
  item: RuleItem,
  industry: Industry,
): 'match' | 'all' | 'other' {
  if (industry === 'all') return 'all';
  if (item.industries.includes(industry)) return 'match';
  if (item.industries.includes('all')) return 'all';
  return 'other';
}

// ─── Emergency Contact Labels ────────────────────────────────────

const EMERGENCY_CONTACT_LABEL: Record<Language, string> = {
  ja: '緊急連絡先',
  vi: 'Liên hệ khẩn cấp',
  id: 'Kontak Darurat',
  en: 'Emergency Contact',
  my: 'အရေးပေါ်ဆက်သွယ်ရန်',
  zh: '紧急联系方式',
};

const PHONE_LABEL: Record<Language, string> = {
  ja: '担当者直通',
  vi: 'Số điện thoại người phụ trách',
  id: 'Telepon penanggung jawab',
  en: 'Supervisor direct line',
  my: 'တာဝန်ခံဖုန်းနံပါတ်',
  zh: '负责人直线',
};

const EMERGENCY_PHONE_LABEL: Record<Language, string> = {
  ja: '緊急連絡先',
  vi: 'Liên hệ khẩn cấp',
  id: 'Kontak darurat',
  en: 'Emergency line',
  my: 'အရေးပေါ်ဆက်သွယ်ရန်',
  zh: '紧急联系',
};

// ─── Main Component ──────────────────────────────────────────────

// ── sessionStorage 永続化 ──
const TB_STORAGE_KEY = 'template_builder_state';
type TbSavedState = {
  lang: Language; industry: Industry;
  safety: string[]; emergency: string[]; daily: string[]; phrases: string[];
  params: Record<string, number>;
  company: { name: string; supervisor: string; supervisorKana: string; phone: string; emergency: string };
};
function saveTbState(s: TbSavedState): void {
  try { sessionStorage.setItem(TB_STORAGE_KEY, JSON.stringify(s)); } catch { /* ignore */ }
}
function loadTbState(): TbSavedState | null {
  try {
    const raw = sessionStorage.getItem(TB_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as TbSavedState;
  } catch { return null; }
}

export default function TemplateBuilder() {
  const [selectedLang, setSelectedLang] = useState<Language>(() => loadTbState()?.lang ?? 'ja');
  const [selectedIndustry, setSelectedIndustry] = useState<Industry>(() => loadTbState()?.industry ?? 'all');
  const [selectedSafety, setSelectedSafety] = useState<string[]>(
    () => loadTbState()?.safety ?? ['S01', 'S02', 'S03', 'S04'],
  );
  const [selectedEmergency, setSelectedEmergency] = useState<string[]>(
    () => loadTbState()?.emergency ?? ['E01', 'E02', 'E03', 'E04'],
  );
  const [selectedDaily, setSelectedDaily] = useState<string[]>(
    () => loadTbState()?.daily ?? ['D01', 'D02', 'D03', 'D04'],
  );
  const [selectedPhrases, setSelectedPhrases] = useState<string[]>(() => loadTbState()?.phrases ?? []);
  const [paramValues, setParamValues] = useState<Record<string, number>>(
    () => loadTbState()?.params ?? { 'S05-weight': 20, 'S05-people': 2, 'D01-minutes': 15, 'D02-hour': 8 },
  );
  const [companyInfo, setCompanyInfo] = useState(
    () => loadTbState()?.company ?? { name: '', supervisor: '', supervisorKana: '', phone: '', emergency: '' },
  );

  // state変更時にsessionStorageへ保存
  useEffect(() => {
    saveTbState({
      lang: selectedLang, industry: selectedIndustry,
      safety: selectedSafety, emergency: selectedEmergency, daily: selectedDaily, phrases: selectedPhrases,
      params: paramValues, company: companyInfo,
    });
  }, [selectedLang, selectedIndustry, selectedSafety, selectedEmergency, selectedDaily, selectedPhrases, paramValues, companyInfo]);

  const labels = UI[selectedLang];

  // Sorted items
  const sortedSafety = useMemo(
    () => sortByIndustry(SAFETY_RULES, selectedIndustry),
    [selectedIndustry],
  );
  const sortedEmergency = useMemo(
    () => sortByIndustry(EMERGENCY_RULES, selectedIndustry),
    [selectedIndustry],
  );
  const sortedDaily = useMemo(
    () => sortByIndustry(DAILY_RULES, selectedIndustry),
    [selectedIndustry],
  );
  const sortedPhrases = useMemo(
    () => sortByIndustry(PHRASES, selectedIndustry),
    [selectedIndustry],
  );

  // Selected items for preview
  const safetyItems = SAFETY_RULES.filter((r) =>
    selectedSafety.includes(r.id),
  );
  const emergencyItems = EMERGENCY_RULES.filter((r) =>
    selectedEmergency.includes(r.id),
  );
  const dailyItems = DAILY_RULES.filter((r) => selectedDaily.includes(r.id));
  const phraseItems = PHRASES.filter((r) => selectedPhrases.includes(r.id));

  function toggleItem(
    list: string[],
    setList: (v: string[]) => void,
    id: string,
    max?: number,
  ) {
    if (list.includes(id)) {
      setList(list.filter((x) => x !== id));
    } else if (!max || list.length < max) {
      setList([...list, id]);
    }
  }

  function handlePrint() {
    const printTarget = document.querySelector('.print-target');
    if (!printTarget) return;

    // 選択済み項目数を数える
    const totalSelected =
      selectedSafety.length +
      selectedEmergency.length +
      selectedDaily.length +
      selectedPhrases.length;

    // フォント倍率を計算
    const getFontScale = (count: number): number => {
      if (count <= 10) return 1.4;
      if (count <= 15) return 1.2;
      if (count <= 20) return 1.0;
      if (count <= 25) return 0.9;
      return 0.85;
    };
    const fontScale = getFontScale(totalSelected);

    // スケール用のCSSを動的に生成
    const scaleCSS = `.print-target { font-size: ${fontScale}em !important; }`;

    // 現在適用されている全CSSを取得
    const styles = Array.from(document.styleSheets)
      .map((sheet) => {
        try {
          return Array.from(sheet.cssRules)
            .map((rule) => rule.cssText)
            .join('\n');
        } catch {
          return '';
        }
      })
      .join('\n');

    // 別ウィンドウで印刷（ブラウザヘッダー/URLを除去）
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) {
      // ポップアップブロック時は通常印刷にフォールバック
      window.print();
      return;
    }

    printWindow.document.write(`<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<title>\u200B</title>
<style>
${styles}
${scaleCSS}
body { margin: 0; padding: 0; background: white; }
</style>
<link href="${FONT_URLS[selectedLang]}" rel="stylesheet">
</head>
<body>
${printTarget.outerHTML}
<script>
document.fonts.ready.then(function() { window.print(); window.close(); });
</script>
</body>
</html>`);
    printWindow.document.close();
  }

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href={FONT_URLS[selectedLang]} rel="stylesheet" />

      <style>{`
        @media print {
          body { background: white !important; }
          .builder-wrapper { min-height: unset !important; background: white !important; }
          .builder-grid { display: block !important; padding: 0 !important; }
          .print-area {
            position: static !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          /* ── 印刷対象コンテナ ── */
          .preview-page.print-target {
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            height: auto !important;
            min-height: unset !important;
            overflow: visible !important;
          }

          /* ── タイトル ── */
          .print-title-block { margin-bottom: 2mm !important; }
          .print-title-main {
            font-size: 13pt !important;
            font-weight: 900 !important;
            margin-bottom: 0.5mm !important;
            line-height: 1.2 !important;
          }
          .print-title-sub {
            font-size: 8pt !important;
            color: #666 !important;
            margin-bottom: 0 !important;
          }

          /* ── ルールエリア: CSS columns 段組み ── */
          .print-rules-columns {
            columns: 2 !important;
            column-gap: 4mm !important;
            margin-bottom: 2mm !important;
            orphans: 2;
            widows: 2;
          }

          /* 各セクションは段をまたがない */
          .print-rule-section {
            break-inside: avoid !important;
            -webkit-column-break-inside: avoid !important;
            margin-bottom: 2mm !important;
            overflow: visible !important;
          }

          /* セクションカード */
          .preview-page .section-mb {
            margin-bottom: 0 !important;
            border-width: 0.3mm !important;
            border-radius: 1.5mm !important;
          }

          /* セクション見出し */
          .preview-page .section-header-bar {
            padding: 1mm 2mm !important;
            font-size: 9pt !important;
          }

          /* セクション本文 */
          .preview-page .section-body-pad {
            padding: 1mm 2mm !important;
          }

          /* ルール項目テキスト */
          .preview-page .rule-item {
            padding: 0.5mm 0 !important;
            font-size: 9pt !important;
            line-height: 1.4 !important;
            gap: 1mm !important;
          }

          /* ナンバーバッジ */
          .preview-page .rule-item span[style*="width: 20px"] {
            width: 13px !important;
            height: 13px !important;
            font-size: 7pt !important;
          }

          /* アイコン絵文字 */
          .preview-page .rule-icon {
            font-size: 9pt !important;
            line-height: 1 !important;
            flex-shrink: 0 !important;
          }

          /* 日本語サブテキスト */
          .preview-page .rule-ja-sub {
            font-size: 7pt !important;
            color: #555 !important;
            line-height: 1.2 !important;
            margin-top: 0.2mm !important;
          }

          /* ── よく使う言葉: 3列グリッド ── */
          .print-phrases {
            margin-bottom: 2mm !important;
            break-inside: avoid !important;
            -webkit-column-break-inside: avoid !important;
            border-width: 0.3mm !important;
            border-radius: 1.5mm !important;
          }

          .print-phrases .section-header-bar {
            padding: 1mm 2mm !important;
            font-size: 9pt !important;
          }

          .print-phrases .section-body-pad {
            padding: 1mm 2mm !important;
          }

          .print-phrases .phrase-grid {
            display: grid !important;
            grid-template-columns: 1fr 1fr 1fr !important;
            gap: 1.5mm !important;
          }

          .preview-page .phrase-card-sm {
            padding: 1mm 1.5mm !important;
            border-radius: 1mm !important;
            break-inside: avoid !important;
          }

          .preview-page .phrase-card-sm .phrase-main-text {
            font-size: 9pt !important;
            line-height: 1.3 !important;
          }

          .preview-page .phrase-card-sm .phrase-ja-text {
            font-size: 7pt !important;
            color: #555 !important;
            margin-top: 0.2mm !important;
          }

          /* コンテキスト説明は印刷時非表示 */
          .preview-page .phrase-card-sm .phrase-context-text {
            display: none !important;
          }

          /* ── 会社情報: 3列グリッド ── */
          .print-company.company-section {
            padding: 2mm 2.5mm !important;
            margin-top: 2mm !important;
            border-radius: 1.5mm !important;
            break-inside: avoid !important;
          }

          .print-company .company-section-title {
            margin-bottom: 1mm !important;
            font-size: 8pt !important;
          }

          .print-company .company-fields {
            display: grid !important;
            grid-template-columns: 1fr 1fr 1fr !important;
            gap: 1mm 4mm !important;
          }

          .print-company .field-label { font-size: 7.5pt !important; }
          .print-company .field-value { font-size: 8pt !important; }
          .print-company .field-line { height: 12px !important; }

          /* ── 緊急連絡先 ── */
          .print-emergency-contact {
            margin-top: 3mm !important;
            border: 0.5mm solid #dc2626 !important;
            border-radius: 2mm !important;
            padding: 2mm 3mm !important;
            background-color: #fff5f5 !important;
            break-inside: avoid !important;
          }

          .print-emergency-label {
            font-size: 9pt !important;
            font-weight: 700 !important;
            color: #dc2626 !important;
            margin-bottom: 1.5mm !important;
          }

          .print-emergency-numbers {
            display: flex !important;
            gap: 10mm !important;
            flex-wrap: wrap !important;
          }

          .print-emergency-number-title {
            font-size: 7pt !important;
            color: #666 !important;
          }

          .print-emergency-number {
            font-size: 16pt !important;
            font-weight: 900 !important;
            color: #dc2626 !important;
            letter-spacing: 0.05em !important;
            line-height: 1.2 !important;
          }

          /* ── フッター ── */
          .print-footer {
            font-size: 7pt !important;
            text-align: center !important;
            margin-top: 1.5mm !important;
            padding-top: 1mm !important;
            border-top: 0.3mm solid #ccc !important;
          }
        }
        .cb-item { cursor: pointer; user-select: none; }
        .cb-item:hover { background-color: #f8fafc; }
        .cb-item.disabled { opacity: 0.4; cursor: not-allowed; }
        .cb-item.disabled:hover { background-color: transparent; }
        .lang-btn { transition: all 0.15s; }
        .lang-btn:hover { border-color: #c9a84c !important; }
        .lang-btn.active { background-color: #1a2f5e !important; color: #fff !important; border-color: #1a2f5e !important; }
        .ind-pill { transition: all 0.15s; }
        .ind-pill:hover { border-color: #c9a84c !important; }
        .ind-pill.active { background-color: rgba(201,168,76,0.12) !important; border-color: #c9a84c !important; color: #1a2f5e !important; font-weight: 700 !important; }
      `}</style>

      <div className="builder-wrapper" style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        {/* ─── Hero ─── */}
        <div
          className="no-print"
          style={{
            background: 'linear-gradient(135deg, #1a2f5e 0%, #0f1d3d 100%)',
          }}
        >
          <div
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
              padding: '2.5rem 1.5rem 3rem',
            }}
          >
            <nav
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                color: '#93c5fd',
                marginBottom: '1.25rem',
                flexWrap: 'wrap',
              }}
            >
              <Link
                href="/business"
                style={{ color: '#93c5fd', textDecoration: 'none' }}
              >
                企業向けトップ
              </Link>
              <span style={{ color: '#6094d8' }}>/</span>
              <Link
                href="/business/existing-users"
                style={{ color: '#93c5fd', textDecoration: 'none' }}
              >
                外国人スタッフを活かす
              </Link>
              <span style={{ color: '#6094d8' }}>/</span>
              <Link
                href="/business/existing-users/connect"
                style={{ color: '#93c5fd', textDecoration: 'none' }}
              >
                つなぐ
              </Link>
              <span style={{ color: '#6094d8' }}>/</span>
              <span style={{ color: '#bfdbfe' }}>指示書ビルダー</span>
            </nav>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'rgba(201,168,76,0.15)',
                color: '#c9a84c',
                fontSize: '11px',
                fontWeight: '600',
                padding: '4px 12px',
                borderRadius: '999px',
                marginBottom: '1rem',
              }}
            >
              <FileText size={12} />
              無料ツール
            </div>
            <h1
              style={{
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                fontWeight: '700',
                color: '#fff',
                lineHeight: '1.4',
                marginBottom: '0.75rem',
              }}
            >
              多言語 現場指示書ビルダー
            </h1>
            <p
              style={{
                color: '#bfdbfe',
                fontSize: '14px',
                lineHeight: '1.8',
                maxWidth: '640px',
              }}
            >
              自社の現場ルールを選択 → 会社情報を入力 →
              そのまま印刷。5言語対応の指示書をカスタマイズできます。
            </p>
          </div>
        </div>

        {/* ─── Two-column Grid ─── */}
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '2rem 1rem 3rem',
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '24px',
          }}
          className="builder-grid"
        >
          {/* === LEFT COLUMN (Controls) === */}
          <div className="no-print" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* Language Selector */}
            <div
              style={{
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '24px',
              }}
            >
              <h2
                style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#1a2f5e',
                  marginBottom: '4px',
                }}
              >
                STEP 1：言語を選ぶ
              </h2>
              <p
                style={{
                  fontSize: '12px',
                  color: '#64748b',
                  marginBottom: '16px',
                }}
              >
                外国人スタッフの母国語を選択してください
              </p>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}
              >
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    className={`lang-btn${selectedLang === l.code ? ' active' : ''}`}
                    onClick={() => setSelectedLang(l.code)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 18px',
                      borderRadius: '8px',
                      border: '1.5px solid #e2e8f0',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      fontSize: '13px',
                      color: '#1a2f5e',
                      fontWeight:
                        selectedLang === l.code ? '700' : '400',
                    }}
                  >
                    <span style={{ fontSize: '16px' }}>{l.flag}</span>
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Industry Filter */}
            <div
              style={{
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '24px',
              }}
            >
              <h2
                style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#1a2f5e',
                  marginBottom: '4px',
                }}
              >
                STEP 2：業種を選ぶ
              </h2>
              <p
                style={{
                  fontSize: '12px',
                  color: '#64748b',
                  marginBottom: '16px',
                }}
              >
                業種に合った項目に ★ マークが付きます
              </p>
              <div
                style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}
              >
                {INDUSTRIES.map((ind) => (
                  <button
                    key={ind.code}
                    type="button"
                    className={`ind-pill${selectedIndustry === ind.code ? ' active' : ''}`}
                    onClick={() => setSelectedIndustry(ind.code)}
                    style={{
                      padding: '6px 16px',
                      borderRadius: '999px',
                      border: '1.5px solid #e2e8f0',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      fontSize: '13px',
                      color: '#64748b',
                    }}
                  >
                    {ind.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Rule Sections */}
            <div
              style={{
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '24px',
              }}
            >
              <h2
                style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#1a2f5e',
                  marginBottom: '4px',
                }}
              >
                STEP 3：項目を選ぶ
              </h2>
              <p
                style={{
                  fontSize: '12px',
                  color: '#64748b',
                  marginBottom: '20px',
                }}
              >
                安全ルール最大7、その他最大5まで選択できます
              </p>

              {/* Safety */}
              <SectionCheckboxes
                title="🦺 安全ルール"
                items={sortedSafety}
                selected={selectedSafety}
                onToggle={(id) =>
                  toggleItem(
                    selectedSafety,
                    setSelectedSafety,
                    id,
                    MAX_SAFETY,
                  )
                }
                lang={selectedLang}
                industry={selectedIndustry}
                max={MAX_SAFETY}
                paramValues={paramValues}
                onParamChange={(key, val) =>
                  setParamValues((prev) => ({ ...prev, [key]: val }))
                }
                companyInfo={companyInfo}
              />

              {/* Emergency */}
              <SectionCheckboxes
                title="🚨 緊急のとき"
                items={sortedEmergency}
                selected={selectedEmergency}
                onToggle={(id) =>
                  toggleItem(
                    selectedEmergency,
                    setSelectedEmergency,
                    id,
                    MAX_PER_SECTION,
                  )
                }
                lang={selectedLang}
                industry={selectedIndustry}
                max={MAX_PER_SECTION}
                paramValues={paramValues}
                onParamChange={(key, val) =>
                  setParamValues((prev) => ({ ...prev, [key]: val }))
                }
                companyInfo={companyInfo}
              />

              {/* Daily */}
              <SectionCheckboxes
                title="📋 毎日のルール"
                items={sortedDaily}
                selected={selectedDaily}
                onToggle={(id) =>
                  toggleItem(
                    selectedDaily,
                    setSelectedDaily,
                    id,
                    MAX_PER_SECTION,
                  )
                }
                lang={selectedLang}
                industry={selectedIndustry}
                max={MAX_PER_SECTION}
                paramValues={paramValues}
                onParamChange={(key, val) =>
                  setParamValues((prev) => ({ ...prev, [key]: val }))
                }
                companyInfo={companyInfo}
              />

              {/* Phrases (no limit) */}
              <SectionCheckboxes
                title="💬 よく使う言葉"
                items={sortedPhrases}
                selected={selectedPhrases}
                onToggle={(id) =>
                  toggleItem(
                    selectedPhrases,
                    setSelectedPhrases,
                    id,
                  )
                }
                lang={selectedLang}
                industry={selectedIndustry}
                paramValues={paramValues}
                onParamChange={(key, val) =>
                  setParamValues((prev) => ({ ...prev, [key]: val }))
                }
                companyInfo={companyInfo}
              />
            </div>

            {/* Company Info */}
            <div
              style={{
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '24px',
              }}
            >
              <h2
                style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#1a2f5e',
                  marginBottom: '4px',
                }}
              >
                STEP 4：会社情報を入力
              </h2>
              <p
                style={{
                  fontSize: '12px',
                  color: '#64748b',
                  marginBottom: '16px',
                }}
              >
                指示書に印刷される会社情報です
              </p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(auto-fill, minmax(220px, 1fr))',
                  gap: '10px',
                }}
              >
                <CompanyInput
                  label="会社名"
                  value={companyInfo.name}
                  onChange={(v) =>
                    setCompanyInfo({ ...companyInfo, name: v })
                  }
                />
                <CompanyInput
                  label="担当者（漢字）"
                  value={companyInfo.supervisor}
                  onChange={(v) =>
                    setCompanyInfo({ ...companyInfo, supervisor: v })
                  }
                />
                <CompanyInput
                  label="担当者（ふりがな）"
                  value={companyInfo.supervisorKana}
                  onChange={(v) =>
                    setCompanyInfo({
                      ...companyInfo,
                      supervisorKana: v,
                    })
                  }
                  placeholder="たなか たろう"
                />
                <CompanyInput
                  label="電話番号"
                  value={companyInfo.phone}
                  onChange={(v) =>
                    setCompanyInfo({ ...companyInfo, phone: v })
                  }
                />
                <CompanyInput
                  label="緊急連絡先"
                  value={companyInfo.emergency}
                  onChange={(v) =>
                    setCompanyInfo({ ...companyInfo, emergency: v })
                  }
                />
              </div>
            </div>

            {/* Print Button (mobile) */}
            <div
              className="print-btn-mobile"
              style={{
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '24px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <div>
                  <h2
                    style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#1a2f5e',
                      marginBottom: '4px',
                    }}
                  >
                    プレビュー確認 → 印刷
                  </h2>
                  <p style={{ fontSize: '12px', color: '#64748b' }}>
                    下のプレビューを確認し、「印刷する」を押してください
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handlePrint}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: '#1a2f5e',
                    color: '#fff',
                    padding: '12px 28px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer',
                  }}
                >
                  <Printer size={16} />
                  印刷する
                </button>
              </div>
            </div>
          </div>

          {/* === RIGHT COLUMN (Preview) === */}
          <div className="print-area">
            {/* Sticky print button (desktop) */}
            <div
              className="no-print"
              style={{
                marginBottom: '16px',
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <button
                type="button"
                onClick={handlePrint}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#1a2f5e',
                  color: '#fff',
                  padding: '10px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                <Printer size={14} />
                印刷する / PDF保存
              </button>
            </div>

            <div
              className="preview-page print-target"
              style={{
                width: '100%',
                maxWidth: '210mm',
                margin: '0 auto',
                background: 'white',
                padding: '24px 28px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
                fontFamily: FONT_MAP[selectedLang],
                color: '#1a2f5e',
              }}
            >
              {/* Title block */}
              <div className="print-title-block" style={{ marginBottom: '12px' }}>
                <h1
                  className="print-title-main"
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: '#1a2f5e',
                    marginBottom: '2px',
                    lineHeight: '1.3',
                  }}
                >
                  {companyInfo.name
                    ? TITLE_WITH_COMPANY[selectedLang].replace('{name}', companyInfo.name)
                    : TITLE_NO_COMPANY[selectedLang]}
                </h1>
                {selectedLang !== 'ja' && (
                  <p
                    className="print-title-sub"
                    style={{
                      fontSize: '0.85rem',
                      color: '#666',
                      marginBottom: '0',
                    }}
                  >
                    {companyInfo.name
                      ? `${companyInfo.name}の現場で大切なルール`
                      : '現場で大切なルール'}
                  </p>
                )}
              </div>

              {/* Rules area: CSS columns auto-flow */}
              <div
                className="print-rules-columns"
                style={{
                  columns: 2,
                  columnGap: '16px',
                  marginBottom: '12px',
                }}
              >
                {safetyItems.length > 0 && (
                  <div className="print-rule-section" style={{ breakInside: 'avoid', marginBottom: '12px' }}>
                    <PreviewSection
                      title={labels.safety}
                      items={safetyItems}
                      lang={selectedLang}
                      paramValues={paramValues}
                      companyInfo={companyInfo}
                      headerBg="#1a2f5e"
                      numbered
                    />
                  </div>
                )}
                {emergencyItems.length > 0 && (
                  <div className="print-rule-section" style={{ breakInside: 'avoid', marginBottom: '12px' }}>
                    <PreviewSection
                      title={labels.emergency}
                      items={emergencyItems}
                      lang={selectedLang}
                      paramValues={paramValues}
                      companyInfo={companyInfo}
                      headerBg="#c0392b"
                      arrow
                    />
                  </div>
                )}
                {dailyItems.length > 0 && (
                  <div className="print-rule-section" style={{ breakInside: 'avoid', marginBottom: '12px' }}>
                    <PreviewSection
                      title={labels.daily}
                      items={dailyItems}
                      lang={selectedLang}
                      paramValues={paramValues}
                      companyInfo={companyInfo}
                      headerBg="#1a2f5e"
                      numbered
                    />
                  </div>
                )}
              </div>

              {/* Phrases */}
              {phraseItems.length > 0 && (
                <div
                  className="print-phrases section-mb"
                  style={{
                    marginBottom: '14px',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '8px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    className="section-header-bar"
                    style={{
                      background: '#1a2f5e',
                      color: 'white',
                      padding: '8px 14px',
                      fontSize: '13px',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    {labels.phrases}
                  </div>
                  <div
                    className="section-body-pad"
                    style={{ padding: '10px 14px' }}
                  >
                    <div
                      className="phrase-grid"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr',
                        gap: '8px',
                      }}
                    >
                      {phraseItems.map((item) => (
                        <div
                          key={item.id}
                          className="phrase-card-sm"
                          style={{
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            borderRadius: '6px',
                            padding: '8px 10px',
                          }}
                        >
                          <div
                            className="phrase-main-text"
                            style={{
                              fontSize: '14px',
                              fontWeight: '700',
                              color: '#1a2f5e',
                            }}
                          >
                            {selectedLang === 'ja' && item.jaRuby ? (
                              <span dangerouslySetInnerHTML={{ __html: item.jaRuby }} />
                            ) : (
                              getLangText(item, selectedLang)
                            )}
                          </div>
                          {selectedLang !== 'ja' && (
                            <div
                              className="phrase-ja-text"
                              style={{
                                fontSize: '11px',
                                color: '#64748b',
                                marginTop: '2px',
                              }}
                              dangerouslySetInnerHTML={{ __html: item.jaRuby || item.ja }}
                            />
                          )}
                          {item.context && (
                            <div
                              className="phrase-context-text no-print"
                              style={{
                                fontSize: '10px',
                                color: '#4a6fa5',
                                marginTop: '3px',
                                fontStyle: 'italic',
                                lineHeight: '1.4',
                              }}
                            >
                              {getLangContext(item, selectedLang)}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Company Info */}
              <div
                className="print-company company-section"
                style={{
                  background: '#fafbfc',
                  border: '1.5px dashed #c9a84c',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  marginTop: '14px',
                }}
              >
                <div
                  className="company-section-title"
                  style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#c9a84c',
                    marginBottom: '10px',
                  }}
                >
                  {labels.companySection}
                </div>
                <div
                  className="company-fields"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '8px 24px',
                  }}
                >
                  {[
                    {
                      label: labels.labelCompany,
                      value: companyInfo.name,
                    },
                    {
                      label: labels.labelSupervisor,
                      value: companyInfo.supervisor,
                    },
                    {
                      label: labels.labelSupervisorKana,
                      value: companyInfo.supervisorKana,
                    },
                    {
                      label: labels.labelPhone,
                      value: companyInfo.phone,
                    },
                    {
                      label: labels.labelEmergency,
                      value: companyInfo.emergency,
                    },
                  ].map((row, i) => (
                    <div
                      key={i}
                      className="company-field-row"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <span
                        className="field-label"
                        style={{
                          fontSize: '10px',
                          color: '#64748b',
                          whiteSpace: 'nowrap',
                          flexShrink: 0,
                        }}
                      >
                        {row.label}
                      </span>
                      {row.value ? (
                        <span
                          className="field-value"
                          style={{
                            flex: 1,
                            fontSize: '12px',
                            fontWeight: '600',
                            color: '#1a2f5e',
                          }}
                        >
                          {row.value}
                        </span>
                      ) : (
                        <div
                          className="field-line"
                          style={{
                            flex: 1,
                            borderBottom: '1px solid #94a3b8',
                            height: '18px',
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Emergency Contact Large Display */}
              {(companyInfo.phone || companyInfo.emergency) && (
                <div
                  className="print-emergency-contact"
                  style={{
                    marginTop: '8px',
                    border: '2px solid #dc2626',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    backgroundColor: '#fef2f2',
                  }}
                >
                  <p
                    className="print-emergency-label"
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      color: '#dc2626',
                      marginBottom: '8px',
                    }}
                  >
                    🚨 {EMERGENCY_CONTACT_LABEL[selectedLang]}
                  </p>
                  <div
                    className="print-emergency-numbers"
                    style={{
                      display: 'flex',
                      gap: '24px',
                      flexWrap: 'wrap',
                    }}
                  >
                    {companyInfo.phone && (
                      <div
                        className="print-emergency-number-block"
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '2px',
                        }}
                      >
                        <span
                          className="print-emergency-number-title"
                          style={{ fontSize: '0.7rem', color: '#666' }}
                        >
                          {PHONE_LABEL[selectedLang]}
                        </span>
                        <span
                          className="print-emergency-number"
                          style={{
                            fontSize: '1.3rem',
                            fontWeight: '900',
                            color: '#dc2626',
                            letterSpacing: '0.05em',
                          }}
                        >
                          📞 {companyInfo.phone}
                        </span>
                      </div>
                    )}
                    {companyInfo.emergency && (
                      <div
                        className="print-emergency-number-block"
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '2px',
                        }}
                      >
                        <span
                          className="print-emergency-number-title"
                          style={{ fontSize: '0.7rem', color: '#666' }}
                        >
                          {EMERGENCY_PHONE_LABEL[selectedLang]}
                        </span>
                        <span
                          className="print-emergency-number"
                          style={{
                            fontSize: '1.3rem',
                            fontWeight: '900',
                            color: '#dc2626',
                            letterSpacing: '0.05em',
                          }}
                        >
                          🆘 {companyInfo.emergency}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div
                className="print-footer"
                style={{
                  marginTop: '12px',
                  textAlign: 'center',
                  fontSize: '10px',
                  color: '#94a3b8',
                }}
              >
                J-GLOW | j-glow.com | {labels.footer}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Nav */}
        <div
          className="no-print"
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0 1rem 3rem',
          }}
        >
          <div
            style={{
              paddingTop: '24px',
              borderTop: '1px solid #e2e5ea',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <Link
              href="/business/existing-users/connect#contents"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#1a2f5e',
                textDecoration: 'none',
              }}
            >
              &larr; 「つなぐ」コンテンツ一覧に戻る
            </Link>
            <Link
              href="/business/existing-users/connect/visual-instruction-design"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#fff',
                backgroundColor: '#1a2f5e',
                padding: '10px 20px',
                borderRadius: '8px',
                textDecoration: 'none',
              }}
            >
              ビジュアル指示書の作り方を読む &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Fixed print button (bottom-right) */}
      <div
        className="no-print"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 50,
        }}
      >
        <button
          type="button"
          onClick={handlePrint}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#1a2f5e',
            color: '#fff',
            padding: '14px 24px',
            borderRadius: '12px',
            border: 'none',
            fontSize: '14px',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(26,47,94,0.35)',
          }}
        >
          <Printer size={16} />
          印刷する / PDF保存
        </button>
      </div>

      {/* Responsive: 2-column on desktop */}
      <style>{`
        @media (min-width: 1024px) {
          .builder-grid {
            grid-template-columns: 1fr 420px !important;
          }
          .print-area {
            position: sticky;
            top: 1rem;
            align-self: start;
          }
          .print-btn-mobile { display: none !important; }
        }
        @media (max-width: 1023px) {
          .print-area .no-print { display: none !important; }
        }
      `}</style>
    </>
  );
}

// ─── Sub-Components ──────────────────────────────────────────────

function SectionCheckboxes({
  title,
  items,
  selected,
  onToggle,
  lang,
  industry,
  max,
  paramValues,
  onParamChange,
  companyInfo,
}: {
  title: string;
  items: RuleItem[];
  selected: string[];
  onToggle: (id: string) => void;
  lang: Language;
  industry: Industry;
  max?: number;
  paramValues: Record<string, number>;
  onParamChange: (key: string, val: number) => void;
  companyInfo: { supervisor: string; supervisorKana: string };
}) {
  const isFull = max ? selected.length >= max : false;

  return (
    <div style={{ marginBottom: '20px' }}>
      <h3
        style={{
          fontSize: '13px',
          fontWeight: '700',
          color: '#1a2f5e',
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        {title}
        {max && (
          <span
            style={{
              fontSize: '11px',
              fontWeight: '400',
              color: selected.length >= max ? '#c9a84c' : '#64748b',
            }}
          >
            {selected.length}/{max} 選択中
          </span>
        )}
      </h3>

      {/* Max warning */}
      {max && isFull && (
        <div
          style={{
            fontSize: '11px',
            color: '#92700c',
            backgroundColor: 'rgba(201,168,76,0.1)',
            border: '1px solid rgba(201,168,76,0.3)',
            borderRadius: '6px',
            padding: '6px 12px',
            marginBottom: '8px',
          }}
        >
          選択上限に達しました。別の項目を選ぶには、既存の選択を外してください。
        </div>
      )}

      <div
        style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}
      >
        {items.map((item) => {
          const isSelected = selected.includes(item.id);
          const relevance = getRelevance(item, industry);
          const isOther = relevance === 'other';
          const isMatch = relevance === 'match';
          const isDisabled = !isSelected && isFull;

          return (
            <label
              key={item.id}
              className={`cb-item${isDisabled ? ' disabled' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                padding: '8px 10px',
                borderRadius: '6px',
                backgroundColor: isSelected
                  ? 'rgba(26,47,94,0.04)'
                  : 'transparent',
                opacity: isOther && !isSelected ? 0.4 : 1,
              }}
            >
              <input
                type="checkbox"
                checked={isSelected}
                disabled={isDisabled}
                onChange={() => onToggle(item.id)}
                style={{ marginTop: '3px', accentColor: '#1a2f5e' }}
              />
              <span
                style={{
                  fontSize: '13px',
                  color: isDisabled ? '#94a3b8' : '#374151',
                  lineHeight: '1.5',
                  flex: 1,
                }}
              >
                <span style={{ display: 'flex', alignItems: 'flex-start', flexWrap: 'wrap', gap: '4px' }}>
                  {isMatch && (
                    <Star
                      size={12}
                      fill="#c9a84c"
                      color="#c9a84c"
                      style={{ flexShrink: 0, marginTop: '3px' }}
                    />
                  )}
                  {item.icon && (
                    <span style={{ flexShrink: 0, fontSize: '14px', lineHeight: '1.3' }}>
                      {item.icon}
                    </span>
                  )}
                  <span>{item.ja}</span>
                  {/* Supervisor hint */}
                  {item.usesSupervisorName &&
                    (companyInfo.supervisorKana ||
                      companyInfo.supervisor) && (
                      <span
                        style={{
                          fontSize: '11px',
                          color: '#c9a84c',
                          marginLeft: '4px',
                        }}
                      >
                        &rarr;{' '}
                        {companyInfo.supervisorKana ||
                          companyInfo.supervisor}
                        さん
                      </span>
                    )}
                </span>
                {/* Param inputs when selected */}
                {isSelected && item.params && (
                  <span
                    style={{
                      display: 'inline-flex',
                      gap: '8px',
                      marginLeft: '4px',
                      marginTop: '4px',
                    }}
                  >
                    {item.params.map((p) => (
                      <span
                        key={p.key}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                        }}
                      >
                        <input
                          type="number"
                          value={
                            paramValues[`${item.id}-${p.key}`] ??
                            p.default
                          }
                          min={p.min}
                          max={p.max}
                          onChange={(e) => {
                            const v =
                              parseInt(e.target.value) || p.default;
                            onParamChange(
                              `${item.id}-${p.key}`,
                              Math.max(p.min, Math.min(p.max, v)),
                            );
                          }}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            width: '48px',
                            padding: '2px 4px',
                            borderRadius: '4px',
                            border: '1.5px solid #c9a84c',
                            fontSize: '12px',
                            textAlign: 'center',
                            color: '#1a2f5e',
                            fontWeight: '600',
                          }}
                        />
                        <span
                          style={{
                            fontSize: '11px',
                            color: '#64748b',
                          }}
                        >
                          {p.unit}
                        </span>
                      </span>
                    ))}
                  </span>
                )}
                {/* Bilingual sub-text (non-ja) */}
                {lang !== 'ja' && (
                  <span
                    style={{
                      display: 'block',
                      fontSize: '11px',
                      color: '#94a3b8',
                      marginTop: '2px',
                    }}
                  >
                    {getLangText(item, lang)}
                  </span>
                )}
                {/* Context hint (selected phrases only) */}
                {isSelected && item.context && (
                  <span
                    style={{
                      display: 'block',
                      fontSize: '11px',
                      color: '#4a6fa5',
                      marginTop: '3px',
                      fontStyle: 'italic',
                    }}
                  >
                    {getLangContext(item, lang)}
                  </span>
                )}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

function PreviewSection({
  title,
  items,
  lang,
  paramValues,
  companyInfo,
  headerBg,
  numbered,
  arrow,
}: {
  title: string;
  items: RuleItem[];
  lang: Language;
  paramValues: Record<string, number>;
  companyInfo: { supervisor: string; supervisorKana: string };
  headerBg: string;
  numbered?: boolean;
  arrow?: boolean;
}) {
  return (
    <div
      className="section-mb"
      style={{
        marginBottom: '14px',
        border: '1.5px solid #e2e8f0',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      <div
        className="section-header-bar"
        style={{
          background: headerBg,
          color: 'white',
          padding: '8px 14px',
          fontSize: '13px',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        {title}
      </div>
      <div className="section-body-pad" style={{ padding: '10px 14px' }}>
        {items.map((item, i) => (
          <div
            key={item.id}
            className="rule-item"
            style={{
              padding: '6px 0',
              borderBottom:
                i < items.length - 1
                  ? '1px solid #f0f4f8'
                  : 'none',
              fontSize: '12.5px',
              lineHeight: '1.6',
              display: 'flex',
              gap: '8px',
            }}
          >
            {numbered && (
              <span
                style={{
                  background: '#c9a84c',
                  color: 'white',
                  fontWeight: '700',
                  fontSize: '11px',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px',
                }}
              >
                {i + 1}
              </span>
            )}
            {arrow && (
              <span
                style={{
                  color: '#c0392b',
                  fontWeight: '700',
                  fontSize: '14px',
                  flexShrink: 0,
                }}
              >
                &rarr;
              </span>
            )}
            {item.icon && (
              <span
                className="rule-icon"
                style={{
                  flexShrink: 0,
                  fontSize: '13px',
                  lineHeight: '1.4',
                }}
              >
                {item.icon}
              </span>
            )}
            <span>
              {getItemText(item, lang, paramValues, companyInfo)}
              {lang !== 'ja' && (
                <span
                  className="rule-ja-sub"
                  style={{
                    display: 'block',
                    fontSize: '9px',
                    color: '#94a3b8',
                    marginTop: '1px',
                  }}
                >
                  {getItemText(item, 'ja', paramValues, companyInfo)}
                </span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CompanyInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label
        style={{
          fontSize: '11px',
          color: '#64748b',
          display: 'block',
          marginBottom: '4px',
        }}
      >
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '8px 10px',
          borderRadius: '6px',
          border: '1.5px solid #e2e8f0',
          fontSize: '13px',
          color: '#1a2f5e',
          outline: 'none',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = '#c9a84c';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = '#e2e8f0';
        }}
      />
    </div>
  );
}
