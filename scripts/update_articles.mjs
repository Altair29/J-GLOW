import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const backup = JSON.parse(fs.readFileSync('/tmp/backup_articles.json', 'utf-8'))
const article005 = backup.find(d => d.slug === 'ikuseshuro-article-005')
const special001 = backup.find(d => d.slug === 'ikuseshuro-special-001')

// ========================================
// article-005
// ========================================
const newTable005 = `| No. | 分野 | 転籍制限期間 | 備考 |
| --- | --- | --- | --- |
| 1 | 宿泊 | 1年 | — |
| 2 | 物流倉庫 | 1年 | — |
| 3 | 林業 | 1年 | — |
| 4 | リネンサプライ | 1年 | — |
| 5 | 飲食料品製造業 | 1年 | — |
| 6 | 農業 | 1年 | 季節性を考慮した派遣形態の運用あり |
| 7 | 漁業 | 1年 | 季節性を考慮した派遣形態の運用あり |
| 8 | 鉱業・採石業等 | 1年 | — |
| 9 | 建設 | 1年 | 一部区分で異なる場合あり |
| 10 | 介護 | 2年 | 企業判断で1年への短縮可能（要：待遇向上義務） |
| 11 | 外食業 | 2年 | 企業判断で1年への短縮可能（要：待遇向上義務） |
| 12 | 自動車整備 | 2年 | 企業判断で1年への短縮可能（要：待遇向上義務） |
| 13 | 工業製品製造業 | 2年 | 企業判断で1年への短縮可能（要：待遇向上義務） |
| 14 | 造船・舶用工業 | 2年 | 企業判断で1年への短縮可能（要：待遇向上義務） |
| 15 | 航空 | 2年 | 企業判断で1年への短縮可能（要：待遇向上義務） |
| 16 | ビルクリーニング | 2年 | 企業判断で1年への短縮可能（要：待遇向上義務） |
| 17 | 廃棄物処理（資源循環） | 2年 | 企業判断で1年への短縮可能（要：待遇向上義務） |`

let newBody005 = article005.body

// テーブル全体を差し替え
const oldTableRegex = /\| No\. \| 分野 \| 転籍制限期間 \| 備考 \|[\s\S]*?(?=\n\n|\n##)/
newBody005 = newBody005.replace(oldTableRegex, newTable005)

// テーブル直後のリード文を修正
newBody005 = newBody005.replace(
  /大半の分野では転籍制限期間が\*\*1年\*\*とされています。/,
  '分野によって転籍制限期間が異なります。**9分野が1年・8分野が2年**です。'
)

// diff確認
console.log('=== article-005 チェック ===')
console.log('新分野（廃棄物処理）追加済み:', newBody005.includes('廃棄物処理（資源循環）'))
console.log('旧分野（紙器・段ボール）除去済み:', !newBody005.includes('紙器・段ボール箱製造'))
console.log('介護が2年になっているか:', newBody005.includes('| 介護 | 2年 |'))
console.log('リード文修正済み:', newBody005.includes('9分野が1年・8分野が2年'))

// ========================================
// special-001
// ========================================
let newBodySpecial = special001.body

// 修正1: ポイント③ 派遣先数の表現
newBodySpecial = newBodySpecial.replace(
  /派遣先の数は最大3者まで（形態によって異なります）。ただし全ての派遣先で同一の業務区分内の技能を習得させることが条件です。/,
  '派遣先は1者または複数とすることができます。ただし、具体的な上限数については分野別の運用方針（告示）で詳細が定められる予定です。全ての派遣先で同一の業務区分内の技能を習得させることが条件である点は変わりません。'
)

// 修正2: ポイント①末尾の「監理団体」→「監理支援機関（旧・監理団体）」
newBodySpecial = newBodySpecial.replace(
  /監理団体は今すぐ許可申請の準備を始める必要があります/,
  '**監理支援機関（旧・監理団体）** は今すぐ許可申請の準備を始める必要があります'
)

// 修正3: ポイント⑦（中立性確保）の前に日本語教育ポイントを挿入（⑦→⑧に繰り下げ）
const newSection = `## ポイント⑦：日本語能力の目標達成を支援する義務

育成就労実施者には、外国人が定められた日本語能力の目標（A2相当など）を達成できるよう、以下の支援措置を講じる義務があります。

- 100時間以上の日本語講習機会の提供
- 講習費用の負担
- 自学自習ができる環境の整備

優良認定の評価基準にも関連すると考えられており、早期から体制を整えておくことが得策です。

## ポイント⑧：監理支援機関の許可に「中立性の確保」要件`

newBodySpecial = newBodySpecial.replace(
  /## ポイント⑦：監理支援機関の許可に「中立性の確保」要件/,
  newSection
)

// 修正4: まとめセクション「監理支援機関の方へ」の直後に振込注記を追加
newBodySpecial = newBodySpecial.replace(
  /(\*\*監理支援機関（旧・監理団体）の方へ\*\*\n)/,
  `$1育成就労計画の認定手数料の支払いは、従来の収入印紙方式から**機構の指定口座への銀行振込**に変更されます。従来の実習制度での事務経験がある担当者への周知をお忘れなく。\n`
)

// diff確認
console.log('\n=== special-001 チェック ===')
console.log('派遣先修正済み:', newBodySpecial.includes('1者または複数'))
console.log('日本語教育ポイント追加済み:', newBodySpecial.includes('100時間以上'))
console.log('ポイント⑧に繰り下げ済み:', newBodySpecial.includes('ポイント⑧：監理支援機関'))
console.log('振込注記追加済み:', newBodySpecial.includes('銀行振込'))
console.log('監理支援機関（旧表記）修正済み:', newBodySpecial.includes('監理支援機関（旧・監理団体）') && !newBodySpecial.includes('監理団体は今すぐ'))

// ========================================
// 全チェックOKなら更新実行
// ========================================
const checks005 = [
  newBody005.includes('廃棄物処理（資源循環）'),
  !newBody005.includes('紙器・段ボール箱製造'),
  newBody005.includes('| 介護 | 2年 |'),
  newBody005.includes('9分野が1年・8分野が2年'),
]

const checksSpecial = [
  newBodySpecial.includes('1者または複数'),
  newBodySpecial.includes('100時間以上'),
  newBodySpecial.includes('ポイント⑧：監理支援機関'),
  newBodySpecial.includes('銀行振込'),
]

if (checks005.every(Boolean) && checksSpecial.every(Boolean)) {
  console.log('\n✅ 全チェック通過 → DB更新を実行します')

  const { error: e1 } = await supabase
    .from('blog_posts')
    .update({ body: newBody005 })
    .eq('id', 52)
  if (e1) { console.error('❌ article-005 更新失敗:', e1); process.exit(1) }
  console.log('✅ article-005 (id=52) 更新完了')

  const { error: e2 } = await supabase
    .from('blog_posts')
    .update({ body: newBodySpecial })
    .eq('id', 63)
  if (e2) { console.error('❌ special-001 更新失敗:', e2); process.exit(1) }
  console.log('✅ special-001 (id=63) 更新完了')

} else {
  console.log('\n❌ チェック未通過のものがあります。正規表現がマッチしていない可能性があります。')
  console.log('バックアップ本文の該当箇所を確認して正規表現を調整してください。')
  // デバッグ用：実際のテキストを出力
  console.log('\n--- article-005 body の最初の1000文字 ---')
  console.log(article005.body.slice(0, 1000))
  console.log('\n--- special-001 ポイント③周辺 ---')
  const idx = special001.body.indexOf('ポイント③')
  console.log(special001.body.slice(idx, idx + 400))
  console.log('\n--- special-001 ポイント⑦周辺 ---')
  const idx2 = special001.body.indexOf('ポイント⑦')
  console.log(special001.body.slice(idx2, idx2 + 400))
}
