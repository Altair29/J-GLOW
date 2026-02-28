'use client';

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import type { FormData, Lang, Translations, VisaType } from '../types';
import {
  VISA_CONFIGS,
  RENEWAL_LIMIT_REASONS,
  WORK_HOUR_TYPE_OPTIONS,
  RAISE_TIMING_OPTIONS,
  BONUS_FREQUENCY_OPTIONS,
  TOKUTEI_SECTORS,
  PAYMENT_METHOD_OPTIONS,
  WAGE_TYPE_OPTIONS,
  getSectorList,
  resolveWorkplaceRange,
  resolveJobRange,
  resolveWorkplaceRangeTx,
  resolveJobRangeTx,
  formatCutoffDay,
  formatPayDay,
  formatJPY,
} from '../types';

/* ── Font Registration ── */
// Japanese + Latin (covers ja, en, vi, tl, pt)
Font.register({
  family: 'NotoSansJP',
  fonts: [
    { src: '/fonts/NotoSansJP-Regular.otf', fontWeight: 'normal' },
    { src: '/fonts/NotoSansJP-Bold.otf', fontWeight: 'bold' },
  ],
});

// Khmer (km)
Font.register({
  family: 'NotoSansKhmer',
  fonts: [
    { src: '/fonts/NotoSansKhmer-Regular.ttf', fontWeight: 'normal' },
    { src: '/fonts/NotoSansKhmer-Bold.ttf', fontWeight: 'bold' },
  ],
});

// Myanmar (my)
Font.register({
  family: 'NotoSansMyanmar',
  fonts: [
    { src: '/fonts/NotoSansMyanmar-Regular.ttf', fontWeight: 'normal' },
  ],
});

// Simplified Chinese (zh)
Font.register({
  family: 'NotoSansSC',
  fonts: [
    { src: '/fonts/NotoSansSC-Regular.otf', fontWeight: 'normal' },
  ],
});

// Devanagari — Nepali (ne)
Font.register({
  family: 'NotoSansDevanagari',
  fonts: [
    { src: '/fonts/NotoSansDevanagari-Regular.ttf', fontWeight: 'normal' },
  ],
});

// Disable hyphenation for CJK and other scripts
Font.registerHyphenationCallback((word) => [word]);

/* ── Font family per language ── */
const LANG_FONT: Record<string, string> = {
  ja: 'NotoSansJP',
  en: 'NotoSansJP',
  zh: 'NotoSansSC',
  vi: 'NotoSansJP',
  tl: 'NotoSansJP',
  pt: 'NotoSansJP',
  id: 'NotoSansJP',
  km: 'NotoSansKhmer',
  my: 'NotoSansMyanmar',
  ne: 'NotoSansDevanagari',
};

function getFontFamily(lang: Lang): string {
  return LANG_FONT[lang] || 'NotoSansJP';
}

/* ── Styles ── */
const NAVY = '#1a2f5e';
const GOLD = '#c9a84c';
const GRAY = '#6b7280';
const LIGHT_GRAY = '#f3f4f6';

const s = StyleSheet.create({
  page: {
    fontFamily: 'NotoSansJP',
    fontSize: 9,
    paddingTop: 40,
    paddingBottom: 60,
    paddingHorizontal: 40,
    color: '#111827',
  },
  /* Header */
  header: {
    backgroundColor: NAVY,
    marginHorizontal: -40,
    marginTop: -40,
    paddingVertical: 20,
    paddingHorizontal: 40,
    marginBottom: 20,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerSubtitle: {
    color: '#ffffff',
    fontSize: 8,
    textAlign: 'center',
    marginTop: 4,
    opacity: 0.8,
  },
  headerJaSub: {
    color: '#ffffff',
    fontSize: 7,
    textAlign: 'center',
    marginTop: 2,
    opacity: 0.6,
  },
  /* Meta row */
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  metaText: {
    fontSize: 8,
    color: GRAY,
  },
  /* Section */
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: NAVY,
    paddingBottom: 4,
    marginBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: GOLD,
  },
  sectionTitleJa: {
    fontSize: 7,
    color: GRAY,
    marginTop: 1,
  },
  /* Rows */
  row: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e7eb',
    paddingVertical: 4,
  },
  rowLabel: {
    width: '35%',
    fontSize: 8,
    color: GRAY,
    paddingRight: 8,
  },
  rowValue: {
    width: '65%',
    fontSize: 9,
  },
  rowValueJa: {
    fontSize: 7,
    color: GRAY,
    marginTop: 1,
  },
  /* Clause */
  clauseBox: {
    backgroundColor: LIGHT_GRAY,
    padding: 10,
    marginBottom: 8,
    borderRadius: 4,
  },
  clauseTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: NAVY,
    marginBottom: 4,
  },
  clauseTitleJa: {
    fontSize: 7,
    color: GRAY,
    marginBottom: 4,
  },
  clauseBody: {
    fontSize: 8,
    lineHeight: 1.5,
  },
  clauseBodyJa: {
    fontSize: 7,
    color: GRAY,
    lineHeight: 1.4,
    marginTop: 4,
  },
  /* Footer */
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 0.5,
    borderTopColor: '#e5e7eb',
    paddingTop: 6,
  },
  footerText: {
    fontSize: 7,
    color: GRAY,
  },
  footerPage: {
    fontSize: 7,
    color: GRAY,
  },
  /* Disclaimer */
  disclaimer: {
    backgroundColor: '#fef3c7',
    padding: 8,
    marginBottom: 12,
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: GOLD,
  },
  disclaimerText: {
    fontSize: 7,
    color: '#92400e',
    lineHeight: 1.4,
  },
  /* Dismissal list */
  dismissalItem: {
    fontSize: 8,
    lineHeight: 1.5,
    paddingLeft: 8,
    marginBottom: 2,
  },
  dismissalItemJa: {
    fontSize: 7,
    color: GRAY,
    paddingLeft: 8,
    marginBottom: 2,
  },
  /* Signature section */
  signatureSection: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  signatureBoxRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  signatureBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 4,
    padding: 10,
    minHeight: 110,
  },
  signatureBoxLeft: {
    marginRight: 10,
  },
  signatureBoxRight: {
    marginLeft: 10,
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
    marginTop: 18,
  },
  signatureSeal: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

/* ── Helpers ── */
const VISA_TKEY: Record<VisaType, string> = {
  ikusei: 'visa_ikusei',
  tokutei1: 'visa_tokutei1',
  tokutei2: 'visa_tokutei2',
  ginou_jisshu: 'visa_gino',
};

const WAGE_TYPE_TKEY: Record<string, string> = {
  monthly: 'label_monthly',
  daily: 'label_daily',
  hourly: 'label_hourly',
};

function tx(t: Translations, key: string, lang: Lang): string {
  return t[key]?.[lang] ?? t[key]?.ja ?? key;
}

function txJa(t: Translations, key: string): string {
  return t[key]?.ja ?? '';
}

/* ── Bilingual Row Component ── */
function BiRow({
  label,
  labelJa,
  value,
  valueJa,
  lang,
}: {
  label: string;
  labelJa?: string;
  value: string;
  valueJa?: string;
  lang: Lang;
}) {
  const showJa = lang !== 'ja';
  const font = getFontFamily(lang);
  return (
    <View style={s.row}>
      <View style={s.rowLabel}>
        <Text style={{ fontFamily: font }}>{label}</Text>
        {showJa && labelJa && <Text style={s.rowValueJa}>{labelJa}</Text>}
      </View>
      <View style={s.rowValue}>
        <Text style={{ fontFamily: font }}>{value || '—'}</Text>
        {showJa && <Text style={s.rowValueJa}>{valueJa ?? (value || '—')}</Text>}
      </View>
    </View>
  );
}

/* ── Clause 4: Visa-type-aware content ── */
interface ClauseDef {
  subtitleJa: string;
  subtitleForeign: string;
  bodyKey?: string;        // Use tx() from translations
  bodyJa?: string;         // Override for custom text
  bodyForeign?: string;    // Override for custom text
}

function getClause4(
  visaType: VisaType,
  hasTransfer: boolean,
  t: Translations,
  lang: Lang,
): ClauseDef | null {
  // ginou_jisshu: never output clause 4
  if (visaType === 'ginou_jisshu') return null;

  // transfer clause OFF: don't output
  if (!hasTransfer) return null;

  // ikusei: 育成就労 specific wording
  if (visaType === 'ikusei') {
    return {
      subtitleJa: '転籍に関する特約',
      subtitleForeign: lang === 'en' ? 'Transfer Clause'
        : lang === 'zh' ? '转籍条款'
        : lang === 'vi' ? 'Điều khoản chuyển công ty'
        : lang === 'id' ? 'Klausul Transfer'
        : lang === 'tl' ? 'Sugnay ng Paglipat'
        : lang === 'km' ? 'ប្រការផ្ទេរ'
        : lang === 'my' ? 'လွှဲပြောင်းချက်'
        : 'Transfer Clause',
      bodyKey: 'clause_4_body', // existing ikusei translation
    };
  }

  // tokutei1 / tokutei2: 特定技能 specific wording
  if (visaType === 'tokutei1' || visaType === 'tokutei2') {
    return {
      subtitleJa: '転職・転籍に関する事項',
      subtitleForeign: lang === 'en' ? 'Job Change and Transfer'
        : lang === 'zh' ? '转职・转籍事项'
        : lang === 'vi' ? 'Chuyển việc và chuyển công ty'
        : lang === 'id' ? 'Perpindahan Kerja dan Transfer'
        : lang === 'tl' ? 'Paglipat ng Trabaho at Transfer'
        : lang === 'km' ? 'ការផ្លាស់ប្ដូរការងារ និងការផ្ទេរ'
        : lang === 'my' ? 'အလုပ်ပြောင်းခြင်းနှင့် လွှဲပြောင်းခြင်း'
        : 'Job Change and Transfer',
      bodyKey: 'clause_4_tokutei_body', // new tokutei translation
    };
  }

  return null;
}

/* ── Build all clauses with dynamic numbering ── */
function buildClauses(
  visaType: VisaType,
  hasTransfer: boolean,
  t: Translations,
  lang: Lang,
): { titleJa: string; titleForeign: string; bodyJa: string; bodyForeign: string }[] {
  const clause4 = getClause4(visaType, hasTransfer, t, lang);

  const defs: (ClauseDef | null)[] = [
    // 1. 在留資格・雇用契約の効力
    {
      subtitleJa: '在留資格・雇用契約の効力',
      subtitleForeign: lang === 'en' ? 'Residence Status / Validity of Employment Contract'
        : tx(t, 'clause_1_title', lang).replace(/^[^(（]*[（(]/, '').replace(/[)）]$/, ''),
      bodyKey: 'clause_1_body',
    },
    // 2. 賃金控除
    {
      subtitleJa: '賃金控除',
      subtitleForeign: lang === 'en' ? 'Wage Deductions'
        : tx(t, 'clause_2_title', lang).replace(/^[^(（]*[（(]/, '').replace(/[)）]$/, ''),
      bodyKey: 'clause_2_body',
    },
    // 3. 退職・転籍時の費用取扱い
    {
      subtitleJa: '退職・転籍時の費用取扱い',
      subtitleForeign: lang === 'en' ? 'Costs at the Time of Resignation or Transfer'
        : tx(t, 'clause_3_title', lang).replace(/^[^(（]*[（(]/, '').replace(/[)）]$/, ''),
      bodyKey: 'clause_3_body',
    },
    // 4. Transfer clause (conditional)
    clause4,
    // 5. 言語の優先順位
    {
      subtitleJa: '言語の優先順位',
      subtitleForeign: lang === 'en' ? 'Language Priority'
        : tx(t, 'clause_5_title', lang).replace(/^[^(（]*[（(]/, '').replace(/[)）]$/, ''),
      bodyKey: 'clause_5_body',
    },
  ];

  // Filter nulls and build with sequential numbering
  const activeDefs = defs.filter(Boolean) as ClauseDef[];

  return activeDefs.map((def, i) => {
    const num = i + 1;
    const titleJa = `第${num}条（${def.subtitleJa}）`;
    const articlePrefix = lang === 'en' ? 'Article'
      : lang === 'zh' ? '第'
      : lang === 'vi' ? 'Điều'
      : lang === 'id' ? 'Pasal'
      : lang === 'tl' ? 'Artikulo'
      : lang === 'km' ? 'មាត្រា'
      : lang === 'my' ? 'အပိုဒ်မ'
      : 'Article';

    const titleForeign = lang === 'zh'
      ? `第${num}条（${def.subtitleForeign}）`
      : `${articlePrefix} ${num} (${def.subtitleForeign})`;

    const bodyJa = def.bodyJa ?? txJa(t, def.bodyKey ?? '');
    const bodyForeign = def.bodyForeign ?? (def.bodyKey ? tx(t, def.bodyKey, lang) : '');

    return { titleJa, titleForeign, bodyJa, bodyForeign };
  });
}

/* ── Main PDF Document ── */
interface LaborNoticePDFProps {
  form: FormData;
  lang: Lang;
  t: Translations;
}

export default function LaborNoticePDF({ form, lang, t }: LaborNoticePDFProps) {
  const { step1, step2, step3, step4 } = form;
  const showJa = lang !== 'ja';

  const visaLabel =
    t[VISA_TKEY[step2.visa_type]]?.[lang] ??
    VISA_CONFIGS[step2.visa_type]?.label ??
    step2.visa_type;

  const renewalLabel =
    {
      auto: tx(t, 'value_renewal_auto', lang),
      possible: tx(t, 'value_renewal_possible', lang),
      no: tx(t, 'value_renewal_no', lang),
      other: step2.renewal_other_text || tx(t, 'value_renewal_other', lang),
    }[step2.renewal_type] ?? '';

  const yesNo = (v: 'yes' | 'no') =>
    v === 'yes' ? tx(t, 'label_overtime_yes', lang) : tx(t, 'label_overtime_no', lang);

  const yen = tx(t, 'label_yen', lang);
  const days = tx(t, 'label_days', lang);

  const font = getFontFamily(lang);

  // Resolve display values (translated)
  const workplaceRange = resolveWorkplaceRangeTx(step2.workplace_change_range_type, step2.workplace_change_range, t, lang);
  const workplaceRangeJa = resolveWorkplaceRange(step2.workplace_change_range_type, step2.workplace_change_range);
  const jobRange = resolveJobRangeTx(step2.job_description_change_range_type, step2.job_description_change_range, t, lang);
  const jobRangeJa = resolveJobRange(step2.job_description_change_range_type, step2.job_description_change_range);
  const cutoffDisplay = formatCutoffDay(step4.pay_cutoff_day, lang);
  const payDayDisplay = formatPayDay(step4.pay_day, step4.payment_month, lang);

  // Format deduction items
  const deductionDisplay = step4.deduction_items.length > 0
    ? step4.deduction_items
        .filter((item) => item.type)
        .map((item) => item.amount ? `${item.type}: ${formatJPY(item.amount)}` : item.type)
        .join('、')
    : tx(t, 'label_overtime_yes', lang);

  // Build dismissal reasons list
  const articleNum = step4.dismissal_article_from || step4.dismissal_article_number;
  const articleRange = articleNum && step4.dismissal_article_to
    ? `${articleNum}〜${step4.dismissal_article_to}`
    : articleNum || '';
  const dismissalReasons: { ja: string; foreign: string }[] = [
    {
      ja: articleNum
        ? txJa(t, 'label_dismissal_work_rules').replace('{n}', articleRange)
        : txJa(t, 'label_dismissal_work_rules_general'),
      foreign: articleNum
        ? tx(t, 'label_dismissal_work_rules', lang).replace('{n}', articleRange)
        : tx(t, 'label_dismissal_work_rules', lang),
    },
  ];
  if (step4.dismissal_special_clauses.includes('dismissal_visa_loss')) {
    dismissalReasons.push({
      ja: txJa(t, 'dismissal_visa_loss'),
      foreign: tx(t, 'dismissal_visa_loss', lang),
    });
  }
  if (step4.dismissal_special_clauses.includes('dismissal_false_record')) {
    dismissalReasons.push({
      ja: txJa(t, 'dismissal_false_record'),
      foreign: tx(t, 'dismissal_false_record', lang),
    });
  }
  if (step4.dismissal_special_clauses.includes('dismissal_deportation')) {
    dismissalReasons.push({
      ja: txJa(t, 'dismissal_deportation'),
      foreign: tx(t, 'dismissal_deportation', lang),
    });
  }

  // Build dynamic clauses
  const clauses = buildClauses(step2.visa_type, step2.transfer_clause, t, lang);

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* ── Header ── */}
        <View style={s.header} fixed>
          <Text style={[s.headerTitle, { fontFamily: font }]}>{tx(t, 'document_title', lang)}</Text>
          {showJa && (
            <Text style={s.headerJaSub}>{txJa(t, 'document_title')}</Text>
          )}
          <Text style={[s.headerSubtitle, { fontFamily: font }]}>
            {tx(t, 'document_subtitle_general', lang)}
          </Text>
        </View>

        {/* ── Meta ── */}
        <View style={s.metaRow}>
          <Text style={[s.metaText, { fontFamily: font }]}>
            {tx(t, 'label_worker_name', lang)}: {step1.worker_name || '—'}
          </Text>
          <Text style={[s.metaText, { fontFamily: font }]}>
            {tx(t, 'label_issue_date', lang)}: {step1.issue_date || '—'}
          </Text>
        </View>

        {/* ── Section 1: Company & Worker ── */}
        <View style={s.section}>
          <Text style={[s.sectionTitle, { fontFamily: font }]}>{tx(t, 'step1_title', lang)}</Text>
          {showJa && (
            <Text style={s.sectionTitleJa}>{txJa(t, 'step1_title')}</Text>
          )}
          <BiRow
            label={tx(t, 'label_company_name', lang)}
            labelJa={showJa ? txJa(t, 'label_company_name') : undefined}
            value={`${step1.company_name}${step1.company_name_romaji ? ` (${step1.company_name_romaji})` : ''}`}
            lang={lang}
          />
          <BiRow
            label={tx(t, 'label_company_address', lang)}
            labelJa={showJa ? txJa(t, 'label_company_address') : undefined}
            value={`${step1.company_address}${step1.company_address_romaji ? ` (${step1.company_address_romaji})` : ''}`}
            lang={lang}
          />
          <BiRow
            label={tx(t, 'label_company_phone', lang)}
            labelJa={showJa ? txJa(t, 'label_company_phone') : undefined}
            value={step1.company_phone}
            lang={lang}
          />
          <BiRow
            label={tx(t, 'label_employer_name', lang)}
            labelJa={showJa ? txJa(t, 'label_employer_name') : undefined}
            value={`${step1.employer_name}${step1.employer_name_romaji ? ` (${step1.employer_name_romaji})` : ''}`}
            lang={lang}
          />
          {(step1.consultation_department || step1.consultation_contact_person || step1.consultation_contact_info) && (
            <BiRow
              label={tx(t, 'label_consultation_desk', lang)}
              labelJa={showJa ? txJa(t, 'label_consultation_desk') : undefined}
              value={[
                step1.consultation_department,
                step1.consultation_contact_person,
                step1.consultation_contact_info,
              ].filter(Boolean).join(' / ')}
              lang={lang}
            />
          )}
        </View>

        {/* ── Section 2: Contract & Workplace ── */}
        <View style={s.section}>
          <Text style={[s.sectionTitle, { fontFamily: font }]}>{tx(t, 'step2_title', lang)}</Text>
          {showJa && (
            <Text style={s.sectionTitleJa}>{txJa(t, 'step2_title')}</Text>
          )}
          <BiRow
            label={tx(t, 'label_visa_type', lang)}
            labelJa={showJa ? txJa(t, 'label_visa_type') : undefined}
            value={visaLabel}
            valueJa={
              showJa
                ? VISA_CONFIGS[step2.visa_type]?.label
                : undefined
            }
            lang={lang}
          />
          {step2.entry_date && (
            <BiRow
              label={tx(t, 'label_entry_date', lang)}
              labelJa={showJa ? txJa(t, 'label_entry_date') : undefined}
              value={step2.entry_date}
              lang={lang}
            />
          )}
          {step2.tokutei_sector && (
            <BiRow
              label={tx(t, 'label_sector', lang)}
              labelJa={showJa ? txJa(t, 'label_sector') : undefined}
              value={(() => {
                const opt = getSectorList(step2.visa_type).find((s) => s.value === step2.tokutei_sector)
                  ?? TOKUTEI_SECTORS.find((s) => s.value === step2.tokutei_sector);
                return opt ? tx(t, opt.tKey, lang) : step2.tokutei_sector;
              })()}
              valueJa={showJa ? (() => {
                const opt = getSectorList(step2.visa_type).find((s) => s.value === step2.tokutei_sector)
                  ?? TOKUTEI_SECTORS.find((s) => s.value === step2.tokutei_sector);
                return opt?.label ?? '';
              })() : undefined}
              lang={lang}
            />
          )}
          {step2.tokutei_job_category && (
            <BiRow
              label={tx(t, 'label_job_category', lang)}
              labelJa={showJa ? txJa(t, 'label_job_category') : undefined}
              value={step2.tokutei_job_category}
              lang={lang}
            />
          )}
          <BiRow
            label={tx(t, 'section_contract', lang)}
            labelJa={showJa ? txJa(t, 'section_contract') : undefined}
            value={
              step2.contract_type === 'indefinite'
                ? tx(t, 'value_contract_indefinite', lang)
                : `${step2.contract_start} ～ ${step2.contract_end}`
            }
            valueJa={step2.contract_type === 'indefinite' ? txJa(t, 'value_contract_indefinite') : undefined}
            lang={lang}
          />
          {step2.contract_type === 'fixed' && (
            <>
              <BiRow
                label={tx(t, 'label_contract_renewal', lang)}
                labelJa={showJa ? txJa(t, 'label_contract_renewal') : undefined}
                value={renewalLabel}
                valueJa={(() => {
                  const m: Record<string, string> = {
                    auto: txJa(t, 'value_renewal_auto'),
                    possible: txJa(t, 'value_renewal_possible'),
                    no: txJa(t, 'value_renewal_no'),
                    other: step2.renewal_other_text || txJa(t, 'value_renewal_other'),
                  };
                  return m[step2.renewal_type] ?? '';
                })()}
                lang={lang}
              />
              {step2.renewal_type !== 'auto' && step2.renewal_criteria_text && (
                <BiRow
                  label={tx(t, 'label_renewal_criteria', lang)}
                  labelJa={showJa ? txJa(t, 'label_renewal_criteria') : undefined}
                  value={step2.renewal_criteria_text}
                  lang={lang}
                />
              )}
              {step2.renewal_limit_has && (
                <BiRow
                  label={tx(t, 'label_renewal_limit', lang)}
                  labelJa={showJa ? txJa(t, 'label_renewal_limit') : undefined}
                  value={`${step2.renewal_limit_times ? `${step2.renewal_limit_times}${tx(t, 'label_times', lang)}` : ''}${step2.renewal_limit_times && step2.renewal_limit_years ? ' / ' : ''}${step2.renewal_limit_years ? `${step2.renewal_limit_years}${tx(t, 'label_years', lang)}` : ''}`}
                  lang={lang}
                />
              )}
              {step2.renewal_limit_has && step2.renewal_limit_reason && (
                <BiRow
                  label={tx(t, 'label_renewal_limit_reason', lang)}
                  labelJa={showJa ? txJa(t, 'label_renewal_limit_reason') : undefined}
                  value={
                    step2.renewal_limit_reason === 'custom'
                      ? step2.renewal_limit_reason_text
                      : (RENEWAL_LIMIT_REASONS.find((r) => r.value === step2.renewal_limit_reason)?.label ?? '')
                  }
                  lang={lang}
                />
              )}
            </>
          )}
          {step2.transfer_clause && (
            <BiRow
              label={tx(t, 'label_transfer_clause', lang)}
              labelJa={showJa ? txJa(t, 'label_transfer_clause') : undefined}
              value={tx(t, 'label_transfer_yes', lang)}
              valueJa={txJa(t, 'label_transfer_yes')}
              lang={lang}
            />
          )}
          <BiRow
            label={tx(t, 'label_workplace', lang)}
            labelJa={showJa ? txJa(t, 'label_workplace') : undefined}
            value={step2.workplace_initial}
            lang={lang}
          />
          {workplaceRange && (
            <BiRow
              label={tx(t, 'label_workplace_range', lang)}
              labelJa={showJa ? txJa(t, 'label_workplace_range') : undefined}
              value={workplaceRange}
              valueJa={showJa ? workplaceRangeJa : undefined}
              lang={lang}
            />
          )}
          <BiRow
            label={tx(t, 'label_job_description', lang)}
            labelJa={showJa ? txJa(t, 'label_job_description') : undefined}
            value={step2.job_description_initial}
            lang={lang}
          />
          {jobRange && (
            <BiRow
              label={tx(t, 'label_job_scope_range', lang)}
              labelJa={showJa ? txJa(t, 'label_job_scope_range') : undefined}
              value={jobRange}
              valueJa={showJa ? jobRangeJa : undefined}
              lang={lang}
            />
          )}
        </View>

        {/* ── Section 3: Work Hours ── */}
        <View style={s.section}>
          <Text style={[s.sectionTitle, { fontFamily: font }]}>{tx(t, 'step3_title', lang)}</Text>
          {showJa && (
            <Text style={s.sectionTitleJa}>{txJa(t, 'step3_title')}</Text>
          )}
          <BiRow
            label={tx(t, 'label_work_hour_system', lang)}
            labelJa={showJa ? txJa(t, 'label_work_hour_system') : undefined}
            value={(() => {
              const opt = WORK_HOUR_TYPE_OPTIONS.find((o) => o.value === step3.work_hour_type);
              return opt ? tx(t, opt.tKey, lang) : step3.work_hour_type;
            })()}
            valueJa={showJa ? (WORK_HOUR_TYPE_OPTIONS.find((o) => o.value === step3.work_hour_type)?.label ?? step3.work_hour_type) : undefined}
            lang={lang}
          />
          {step3.work_hour_type === 'shift' && step3.shift_patterns.length > 0 && (
            <BiRow
              label={tx(t, 'label_shift_patterns', lang)}
              labelJa={showJa ? txJa(t, 'label_shift_patterns') : undefined}
              value={step3.shift_patterns
                .map((p) => `${p.name}: ${p.startTime}〜${p.endTime}（休憩${p.breakMinutes}分）`)
                .join(' / ')}
              lang={lang}
            />
          )}
          {(step3.work_hour_type === 'variant1' || step3.work_hour_type === 'variant1y') && step3.variant_start_date && (
            <BiRow
              label={tx(t, 'label_start_date_calc', lang)}
              labelJa={showJa ? txJa(t, 'label_start_date_calc') : undefined}
              value={step3.variant_start_date}
              lang={lang}
            />
          )}
          {step3.work_hour_type !== 'shift' && (
            <BiRow
              label={`${tx(t, 'label_start_time', lang)} / ${tx(t, 'label_end_time', lang)}`}
              labelJa={showJa ? `${txJa(t, 'label_start_time')} / ${txJa(t, 'label_end_time')}` : undefined}
              value={`${step3.work_start} ～ ${step3.work_end}`}
              lang={lang}
            />
          )}
          {step3.work_hour_type !== 'shift' && (
            <BiRow
              label={tx(t, 'label_break_time', lang)}
              labelJa={showJa ? txJa(t, 'label_break_time') : undefined}
              value={`${step3.break_minutes} ${tx(t, 'label_minutes', lang)}`}
              valueJa={`${step3.break_minutes} ${txJa(t, 'label_minutes')}`}
              lang={lang}
            />
          )}
          {(step3.prescribed_hours_weekly || step3.prescribed_hours_monthly || step3.prescribed_hours_yearly) && (
            <BiRow
              label={tx(t, 'label_prescribed_hours', lang)}
              labelJa={showJa ? txJa(t, 'label_prescribed_hours') : undefined}
              value={[
                step3.prescribed_hours_weekly && `${step3.prescribed_hours_weekly}h/${tx(t, 'label_weeks_short', lang) || 'w'}`,
                step3.prescribed_hours_monthly && `${step3.prescribed_hours_monthly}h/${tx(t, 'label_month_unit', lang) || 'm'}`,
                step3.prescribed_hours_yearly && `${step3.prescribed_hours_yearly}h/${tx(t, 'label_years', lang) || 'y'}`,
              ].filter(Boolean).join(' / ')}
              valueJa={[
                step3.prescribed_hours_weekly && `${step3.prescribed_hours_weekly}h/週`,
                step3.prescribed_hours_monthly && `${step3.prescribed_hours_monthly}h/月`,
                step3.prescribed_hours_yearly && `${step3.prescribed_hours_yearly}h/年`,
              ].filter(Boolean).join(' / ')}
              lang={lang}
            />
          )}
          {(step3.prescribed_days_weekly || step3.prescribed_days_monthly || step3.prescribed_days_yearly) && (
            <BiRow
              label={tx(t, 'label_prescribed_days', lang)}
              labelJa={showJa ? txJa(t, 'label_prescribed_days') : undefined}
              value={[
                step3.prescribed_days_weekly && `${step3.prescribed_days_weekly}${days}/${tx(t, 'label_weeks_short', lang) || 'w'}`,
                step3.prescribed_days_monthly && `${step3.prescribed_days_monthly}${days}/${tx(t, 'label_month_unit', lang) || 'm'}`,
                step3.prescribed_days_yearly && `${step3.prescribed_days_yearly}${days}/${tx(t, 'label_years', lang) || 'y'}`,
              ].filter(Boolean).join(' / ')}
              valueJa={[
                step3.prescribed_days_weekly && `${step3.prescribed_days_weekly}日/週`,
                step3.prescribed_days_monthly && `${step3.prescribed_days_monthly}日/月`,
                step3.prescribed_days_yearly && `${step3.prescribed_days_yearly}日/年`,
              ].filter(Boolean).join(' / ')}
              lang={lang}
            />
          )}
          <BiRow
            label={tx(t, 'label_overtime', lang)}
            labelJa={showJa ? txJa(t, 'label_overtime') : undefined}
            value={yesNo(step3.overtime)}
            valueJa={step3.overtime === 'yes' ? txJa(t, 'label_overtime_yes') : txJa(t, 'label_overtime_no')}
            lang={lang}
          />
          {step3.overtime === 'yes' && step3.overtime_article_number && (
            <BiRow
              label={tx(t, 'label_overtime_article', lang)}
              labelJa={showJa ? txJa(t, 'label_overtime_article') : undefined}
              value={`${tx(t, 'label_36agreement', lang)} ${step3.overtime_article_number}`}
              valueJa={`${txJa(t, 'label_36agreement')} ${step3.overtime_article_number}`}
              lang={lang}
            />
          )}
          <BiRow
            label={tx(t, 'label_holidays', lang)}
            labelJa={showJa ? txJa(t, 'label_holidays') : undefined}
            value={
              step3.days_off_pattern === 'weekly'
                ? step3.days_off_weekly
                : step3.days_off_other
            }
            lang={lang}
          />
          <BiRow
            label={tx(t, 'label_paid_leave', lang)}
            labelJa={showJa ? txJa(t, 'label_paid_leave') : undefined}
            value={`${step3.paid_leave_days} ${days}`}
            valueJa={`${step3.paid_leave_days} ${txJa(t, 'label_days')}`}
            lang={lang}
          />
          {step3.other_leave && (
            <BiRow
              label={tx(t, 'label_other_leave', lang)}
              labelJa={showJa ? txJa(t, 'label_other_leave') : undefined}
              value={step3.other_leave}
              lang={lang}
            />
          )}
          <BiRow
            label={tx(t, 'label_temporary_return_leave', lang)}
            labelJa={showJa ? txJa(t, 'label_temporary_return_leave') : undefined}
            value={tx(t, 'label_temporary_return_leave_body', lang)}
            valueJa={showJa ? txJa(t, 'label_temporary_return_leave_body') : undefined}
            lang={lang}
          />
        </View>

        {/* ── Section 4: Wages & Retirement ── */}
        <View style={s.section}>
          <Text style={[s.sectionTitle, { fontFamily: font }]}>{tx(t, 'step4_title', lang)}</Text>
          {showJa && (
            <Text style={s.sectionTitleJa}>{txJa(t, 'step4_title')}</Text>
          )}
          <BiRow
            label={tx(t, 'label_base_wage', lang)}
            labelJa={showJa ? txJa(t, 'label_base_wage') : undefined}
            value={
              step4.basic_salary && Number(step4.basic_salary.replace(/,/g, '')) > 0
                ? `${formatJPY(step4.basic_salary)} (${(() => {
                    const wopt = WAGE_TYPE_OPTIONS.find((o) => o.value === step4.wage_type);
                    return wopt ? tx(t, wopt.tKey, lang) : step4.wage_type;
                  })()})`
                : `${tx(t, 'label_overtime_no', lang)} / None`
            }
            valueJa={
              step4.basic_salary && Number(step4.basic_salary.replace(/,/g, '')) > 0
                ? `${formatJPY(step4.basic_salary)} (${(() => {
                    const wopt = WAGE_TYPE_OPTIONS.find((o) => o.value === step4.wage_type);
                    return wopt ? txJa(t, wopt.tKey) : step4.wage_type;
                  })()})`
                : `${txJa(t, 'label_overtime_no')} / None`
            }
            lang={lang}
          />
          {step4.allowances.length > 0 && (
            <BiRow
              label={tx(t, 'label_allowances', lang)}
              labelJa={showJa ? txJa(t, 'label_allowances') : undefined}
              value={step4.allowances
                .map((a) => `${a.name}: ${formatJPY(a.amount)}`)
                .join(' / ')}
              lang={lang}
            />
          )}
          <BiRow
            label={tx(t, 'label_overtime_rate', lang)}
            labelJa={showJa ? txJa(t, 'label_overtime_rate') : undefined}
            value={`≤60h: ${step4.overtime_rate_normal}% / >60h: ${step4.overtime_rate_over60}% / ${tx(t, 'label_overtime_rate_holiday', lang)}: ${step4.overtime_rate_holiday}% / ${tx(t, 'label_overtime_rate_night', lang)}: ${step4.overtime_rate_night}%`}
            valueJa={`≤60h: ${step4.overtime_rate_normal}% / >60h: ${step4.overtime_rate_over60}% / ${txJa(t, 'label_overtime_rate_holiday')}: ${step4.overtime_rate_holiday}% / ${txJa(t, 'label_overtime_rate_night')}: ${step4.overtime_rate_night}%`}
            lang={lang}
          />
          {step4.deduction_agreement === 'yes' && (
            <BiRow
              label={tx(t, 'label_wage_deductions', lang)}
              labelJa={showJa ? txJa(t, 'label_wage_deductions') : undefined}
              value={deductionDisplay}
              lang={lang}
            />
          )}
          {(step4.deduction_tax_estimate || step4.deduction_social_estimate || step4.deduction_employment_estimate) && (
            <BiRow
              label={tx(t, 'label_deduction_tax', lang)}
              labelJa={showJa ? txJa(t, 'label_deduction_tax') : undefined}
              value={[
                step4.deduction_tax_estimate && `${txJa(t, 'label_deduction_tax')}: ${formatJPY(step4.deduction_tax_estimate)}`,
                step4.deduction_social_estimate && `${txJa(t, 'label_deduction_social')}: ${formatJPY(step4.deduction_social_estimate)}`,
                step4.deduction_employment_estimate && `${txJa(t, 'label_deduction_employment_ins')}: ${formatJPY(step4.deduction_employment_estimate)}`,
              ].filter(Boolean).join(' / ')}
              lang={lang}
            />
          )}
          {(() => {
            const gross = Number((step4.basic_salary || '0').replace(/,/g, ''))
              + step4.allowances.reduce((sum, a) => sum + Number((a.amount || '0').replace(/,/g, '')), 0);
            const statutory = Number(step4.deduction_tax_estimate || '0')
              + Number(step4.deduction_social_estimate || '0')
              + Number(step4.deduction_employment_estimate || '0');
            const voluntary = step4.deduction_items.reduce((sum, d) => sum + Number(d.amount || '0'), 0);
            const takeHome = gross - statutory - voluntary;
            if (gross <= 0) return null;
            return (
              <BiRow
                label={tx(t, 'label_take_home_pay', lang)}
                labelJa={showJa ? txJa(t, 'label_take_home_pay') : undefined}
                value={formatJPY(takeHome > 0 ? takeHome : 0)}
                lang={lang}
              />
            );
          })()}
          <BiRow
            label={tx(t, 'label_wage_cutoff', lang)}
            labelJa={showJa ? txJa(t, 'label_wage_cutoff') : undefined}
            value={cutoffDisplay}
            valueJa={formatCutoffDay(step4.pay_cutoff_day, 'ja')}
            lang={lang}
          />
          <BiRow
            label={tx(t, 'label_payment_date', lang)}
            labelJa={showJa ? txJa(t, 'label_payment_date') : undefined}
            value={payDayDisplay}
            valueJa={formatPayDay(step4.pay_day, step4.payment_month, 'ja')}
            lang={lang}
          />
          <BiRow
            label={tx(t, 'label_payment_method', lang)}
            labelJa={showJa ? txJa(t, 'label_payment_method') : undefined}
            value={step4.payment_method === 'bank_transfer' ? tx(t, 'value_payment_bank_transfer', lang) : tx(t, 'value_payment_cash', lang)}
            valueJa={showJa ? (step4.payment_method === 'bank_transfer' ? txJa(t, 'value_payment_bank_transfer') : txJa(t, 'value_payment_cash')) : undefined}
            lang={lang}
          />
          {step4.fixed_overtime_enabled && (
            <BiRow
              label={tx(t, 'label_fixed_overtime', lang)}
              labelJa={showJa ? txJa(t, 'label_fixed_overtime') : undefined}
              value={`${step4.fixed_overtime_name}: ${formatJPY(step4.fixed_overtime_amount)}（${step4.fixed_overtime_hours}h）`}
              lang={lang}
            />
          )}
          <BiRow
            label={tx(t, 'label_pay_raise', lang)}
            labelJa={showJa ? txJa(t, 'label_pay_raise') : undefined}
            value={
              step4.pay_raise === 'yes'
                ? `${yesNo('yes')}（${step4.raise_timing === 'other' ? step4.raise_timing_other : (() => {
                    const opt = RAISE_TIMING_OPTIONS.find((o) => o.value === step4.raise_timing);
                    return opt ? tx(t, opt.tKey, lang) : '';
                  })()}）`
                : yesNo('no')
            }
            valueJa={
              step4.pay_raise === 'yes'
                ? `${txJa(t, 'label_overtime_yes')}（${step4.raise_timing === 'other' ? step4.raise_timing_other : (() => {
                    const opt = RAISE_TIMING_OPTIONS.find((o) => o.value === step4.raise_timing);
                    return opt ? txJa(t, opt.tKey) : '';
                  })()}）`
                : txJa(t, 'label_overtime_no')
            }
            lang={lang}
          />
          <BiRow
            label={tx(t, 'label_bonus', lang)}
            labelJa={showJa ? txJa(t, 'label_bonus') : undefined}
            value={
              step4.bonus === 'yes'
                ? `${yesNo('yes')}（${(() => {
                    const opt = BONUS_FREQUENCY_OPTIONS.find((o) => o.value === step4.bonus_frequency);
                    return opt ? tx(t, opt.tKey, lang) : '';
                  })()}）${step4.bonus_last_amount ? ` ${tx(t, 'label_recent_amount', lang)}: ${formatJPY(step4.bonus_last_amount)}` : ''}`
                : yesNo('no')
            }
            valueJa={
              step4.bonus === 'yes'
                ? `${txJa(t, 'label_overtime_yes')}（${(() => {
                    const opt = BONUS_FREQUENCY_OPTIONS.find((o) => o.value === step4.bonus_frequency);
                    return opt ? txJa(t, opt.tKey) : '';
                  })()}）${step4.bonus_last_amount ? ` ${txJa(t, 'label_recent_amount')}: ${formatJPY(step4.bonus_last_amount)}` : ''}`
                : txJa(t, 'label_overtime_no')
            }
            lang={lang}
          />
          <BiRow
            label={tx(t, 'label_retirement_pay', lang)}
            labelJa={showJa ? txJa(t, 'label_retirement_pay') : undefined}
            value={yesNo(step4.retirement_allowance)}
            valueJa={step4.retirement_allowance === 'yes' ? txJa(t, 'label_overtime_yes') : txJa(t, 'label_overtime_no')}
            lang={lang}
          />
          {step4.work_stoppage_enabled && (
            <BiRow
              label={tx(t, 'label_work_stoppage', lang)}
              labelJa={showJa ? txJa(t, 'label_work_stoppage') : undefined}
              value={`${tx(t, 'label_work_stoppage_rate', lang)} ${step4.work_stoppage_rate}%`}
              valueJa={`${txJa(t, 'label_work_stoppage_rate')} ${step4.work_stoppage_rate}%`}
              lang={lang}
            />
          )}
          <BiRow
            label={tx(t, 'label_notice_days', lang)}
            labelJa={showJa ? txJa(t, 'label_notice_days') : undefined}
            value={`${step4.retirement_notice_days} ${days}`}
            valueJa={`${step4.retirement_notice_days} ${txJa(t, 'label_days')}`}
            lang={lang}
          />
          {(step4.health_check_hire_month || step4.health_check_periodic_month) && (
            <BiRow
              label={tx(t, 'label_health_check', lang)}
              labelJa={showJa ? txJa(t, 'label_health_check') : undefined}
              value={[
                step4.health_check_hire_month && `${tx(t, 'label_health_check_hire', lang)}: ${step4.health_check_hire_month}${tx(t, 'label_month_unit', lang)}`,
                step4.health_check_periodic_month && `${tx(t, 'label_health_check_periodic', lang)}: ${step4.health_check_periodic_month}${tx(t, 'label_month_unit', lang)}`,
              ].filter(Boolean).join(' / ')}
              valueJa={[
                step4.health_check_hire_month && `${txJa(t, 'label_health_check_hire')}: ${step4.health_check_hire_month}${txJa(t, 'label_month_unit')}`,
                step4.health_check_periodic_month && `${txJa(t, 'label_health_check_periodic')}: ${step4.health_check_periodic_month}${txJa(t, 'label_month_unit')}`,
              ].filter(Boolean).join(' / ')}
              lang={lang}
            />
          )}
          <BiRow
            label={tx(t, 'label_social_insurance', lang)}
            labelJa={showJa ? txJa(t, 'label_social_insurance') : undefined}
            value={[
              step4.insurance_pension && tx(t, 'label_pension_insurance', lang),
              step4.insurance_health && tx(t, 'label_health_insurance', lang),
              step4.insurance_employment && tx(t, 'label_employment_insurance', lang),
              step4.insurance_workers_comp && tx(t, 'label_workers_comp', lang),
            ]
              .filter(Boolean)
              .join('、')}
            valueJa={[
              step4.insurance_pension && txJa(t, 'label_pension_insurance'),
              step4.insurance_health && txJa(t, 'label_health_insurance'),
              step4.insurance_employment && txJa(t, 'label_employment_insurance'),
              step4.insurance_workers_comp && txJa(t, 'label_workers_comp'),
            ]
              .filter(Boolean)
              .join('、')}
            lang={lang}
          />
          <BiRow
            label={tx(t, 'label_union', lang)}
            labelJa={showJa ? txJa(t, 'label_union') : undefined}
            value={
              step4.labor_union === 'yes'
                ? tx(t, 'label_union_yes', lang)
                : tx(t, 'label_union_no', lang)
            }
            valueJa={step4.labor_union === 'yes' ? txJa(t, 'label_union_yes') : txJa(t, 'label_union_no')}
            lang={lang}
          />
          <BiRow
            label={tx(t, 'label_return_travel_expense', lang)}
            labelJa={showJa ? txJa(t, 'label_return_travel_expense') : undefined}
            value={tx(t, 'label_return_travel_expense_body', lang)}
            valueJa={showJa ? txJa(t, 'label_return_travel_expense_body') : undefined}
            lang={lang}
          />
        </View>

        {/* ── Dismissal Reasons Section ── */}
        <View style={s.section}>
          <Text style={[s.sectionTitle, { fontFamily: font }]}>
            {tx(t, 'dismissal_section_title', lang)}
          </Text>
          {showJa && (
            <Text style={s.sectionTitleJa}>{txJa(t, 'dismissal_section_title')}</Text>
          )}
          {dismissalReasons.map((reason, i) => (
            <View key={i} style={{ marginBottom: 4 }}>
              <Text style={[s.dismissalItem, { fontFamily: font }]}>
                {i + 1}. {reason.foreign}
              </Text>
              {showJa && (
                <Text style={s.dismissalItemJa}>
                  {reason.ja}
                </Text>
              )}
            </View>
          ))}
        </View>

        {/* ── Dynamic Clauses (sequential numbering, visa-aware) ── */}
        <View style={s.section}>
          {clauses.map((clause, i) => (
            <View key={i} style={s.clauseBox} wrap={false}>
              <Text style={[s.clauseTitle, { fontFamily: font }]}>
                {lang === 'ja' ? clause.titleJa : clause.titleForeign}
              </Text>
              {showJa && (
                <Text style={s.clauseTitleJa}>{clause.titleJa}</Text>
              )}
              <Text style={[s.clauseBody, { fontFamily: font }]}>
                {lang === 'ja' ? clause.bodyJa : clause.bodyForeign}
              </Text>
              {showJa && (
                <Text style={s.clauseBodyJa}>{clause.bodyJa}</Text>
              )}
            </View>
          ))}
        </View>

        {/* ── Disclaimer ── */}
        <View style={s.disclaimer} wrap={false}>
          <Text style={[s.disclaimerText, { fontFamily: font }]}>{tx(t, 'ui_disclaimer', lang)}</Text>
        </View>

        {/* ── Signature Section ── */}
        <View style={s.signatureSection} wrap={false}>
          {/* Section title */}
          <Text style={[s.sectionTitle, { fontFamily: font }]}>
            {tx(t, 'signature_section_title', lang)}
          </Text>
          {showJa && (
            <Text style={s.sectionTitleJa}>{txJa(t, 'signature_section_title')}</Text>
          )}

          {/* Agreement text */}
          <Text style={{ fontFamily: font, fontSize: 8, color: '#374151', marginBottom: 4 }}>
            {tx(t, 'signature_agreement_text', lang)}
          </Text>
          {showJa && (
            <Text style={{ fontFamily: 'NotoSansJP', fontSize: 7, color: GRAY, marginBottom: 20 }}>
              {txJa(t, 'signature_agreement_text')}
            </Text>
          )}

          {/* Signature boxes: Employer + Worker side by side */}
          <View style={s.signatureBoxRow}>
            {/* Employer box */}
            <View style={[s.signatureBox, s.signatureBoxLeft]}>
              <Text style={{ fontFamily: font, fontSize: 9, fontWeight: 'bold', color: NAVY, marginBottom: 2 }}>
                {tx(t, 'signature_employer', lang)}
              </Text>
              {showJa && (
                <Text style={{ fontFamily: 'NotoSansJP', fontSize: 7, color: GRAY, marginBottom: 8 }}>
                  {txJa(t, 'signature_employer')}
                </Text>
              )}
              {/* Pre-printed company name */}
              <Text style={{ fontFamily: 'NotoSansJP', fontSize: 8, color: '#374151', marginBottom: 14 }}>
                {step1.company_name}
              </Text>
              {/* Name line */}
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontFamily: font, fontSize: 7, color: GRAY, marginBottom: 2 }}>
                  {tx(t, 'signature_name', lang)}
                  {showJa ? ` / ${txJa(t, 'signature_name')}` : ''}
                </Text>
                <View style={s.signatureLine} />
              </View>
              {/* Seal + Date row */}
              <View style={{ flexDirection: 'row' }}>
                <View style={s.signatureSeal}>
                  <Text style={{ fontFamily: font, fontSize: 7, color: GRAY }}>
                    {tx(t, 'signature_seal', lang)}
                  </Text>
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={{ fontFamily: font, fontSize: 7, color: GRAY, marginBottom: 2 }}>
                    {tx(t, 'signature_date', lang)}
                    {showJa ? ` / ${txJa(t, 'signature_date')}` : ''}
                  </Text>
                  <View style={s.signatureLine} />
                </View>
              </View>
            </View>

            {/* Worker box */}
            <View style={[s.signatureBox, s.signatureBoxRight]}>
              <Text style={{ fontFamily: font, fontSize: 9, fontWeight: 'bold', color: NAVY, marginBottom: 2 }}>
                {tx(t, 'signature_worker', lang)}
              </Text>
              {showJa && (
                <Text style={{ fontFamily: 'NotoSansJP', fontSize: 7, color: GRAY, marginBottom: 8 }}>
                  {txJa(t, 'signature_worker')}
                </Text>
              )}
              {/* Pre-printed worker name */}
              <Text style={{ fontFamily: 'NotoSansJP', fontSize: 8, color: '#374151', marginBottom: 14 }}>
                {step1.worker_name}
              </Text>
              {/* Name line */}
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontFamily: font, fontSize: 7, color: GRAY, marginBottom: 2 }}>
                  {tx(t, 'signature_name', lang)}
                  {showJa ? ` / ${txJa(t, 'signature_name')}` : ''}
                </Text>
                <View style={s.signatureLine} />
              </View>
              {/* Seal + Date row */}
              <View style={{ flexDirection: 'row' }}>
                <View style={s.signatureSeal}>
                  <Text style={{ fontFamily: font, fontSize: 7, color: GRAY }}>
                    {tx(t, 'signature_seal', lang)}
                  </Text>
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={{ fontFamily: font, fontSize: 7, color: GRAY, marginBottom: 2 }}>
                    {tx(t, 'signature_date', lang)}
                    {showJa ? ` / ${txJa(t, 'signature_date')}` : ''}
                  </Text>
                  <View style={s.signatureLine} />
                </View>
              </View>
            </View>
          </View>

          {/* Preset note */}
          <Text style={{ fontFamily: 'NotoSansJP', fontSize: 7, color: GRAY, marginTop: 8, textAlign: 'center' }}>
            {tx(t, 'signature_preset_note', lang)}
          </Text>
        </View>

        {/* ── Legal Footer ── */}
        <View style={s.footer} fixed>
          <View style={s.footerRow}>
            <Text style={[s.footerText, { fontFamily: font }]}>
              {tx(t, 'footer_legal_basis', lang)}
            </Text>
            <Text
              style={s.footerPage}
              render={({ pageNumber, totalPages }) =>
                `${pageNumber} / ${totalPages}`
              }
            />
          </View>
          <Text style={[s.footerText, { marginTop: 2, fontFamily: font }]}>
            {tx(t, 'label_issue_date', lang)}: {step1.issue_date || '—'}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
