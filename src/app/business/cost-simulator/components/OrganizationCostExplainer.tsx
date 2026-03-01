'use client';

type Props = {
  type: 'kanri' | 'sien';
  managementFee?: number;
};

export function OrganizationCostExplainer({ type, managementFee }: Props) {
  const isKanri = type === 'kanri';
  const title = isKanri ? '監理費に含まれるもの' : '支援委託費に含まれるもの';
  const feeLabel = isKanri ? '監理費' : '支援委託費';

  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200">
      <details>
        <summary className="px-4 py-3 text-sm font-medium text-[#1a2f5e] cursor-pointer hover:bg-gray-100 rounded-lg">
          {feeLabel}の内訳を確認する
          {managementFee ? ` — ¥${managementFee.toLocaleString()}/月` : ''}
        </summary>
        <div className="px-4 pb-4 space-y-4 border-t border-gray-200 pt-3">
          {/* 含まれるもの */}
          <div>
            <h5 className="text-sm font-bold text-gray-700 mb-2">
              {feeLabel}に通常含まれるもの
            </h5>
            <ul className="space-y-1.5">
              {isKanri ? (
                <>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-green-500 mt-0.5 shrink-0">✅</span>
                    月1回以上の訪問指導・監査
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-green-500 mt-0.5 shrink-0">✅</span>
                    育成就労計画の作成支援
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-green-500 mt-0.5 shrink-0">✅</span>
                    入国手続き・在留資格申請代行
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-green-500 mt-0.5 shrink-0">✅</span>
                    送出機関との連絡調整
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-green-500 mt-0.5 shrink-0">✅</span>
                    技能検定の受験手配
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-green-500 mt-0.5 shrink-0">✅</span>
                    事前ガイダンス（対面 or オンライン）
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-green-500 mt-0.5 shrink-0">✅</span>
                    出入国時の送迎
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-green-500 mt-0.5 shrink-0">✅</span>
                    住居確保・生活オリエンテーション
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-green-500 mt-0.5 shrink-0">✅</span>
                    定期面談（3ヶ月に1回以上）
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-green-500 mt-0.5 shrink-0">✅</span>
                    相談・苦情対応
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* 別途確認項目 */}
          <div>
            <h5 className="text-sm font-bold text-gray-700 mb-2">
              別途発生する可能性がある費用
            </h5>
            <ul className="space-y-1.5">
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-amber-500 mt-0.5 shrink-0">❓</span>
                入会金・出資金（初回のみ）
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-amber-500 mt-0.5 shrink-0">❓</span>
                翻訳・通訳の手配費用
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-amber-500 mt-0.5 shrink-0">❓</span>
                渡航費・健康診断費用
              </li>
            </ul>
          </div>

          {/* 注意文言 */}
          <p className="text-xs text-gray-400">
            ※ {feeLabel}の内容は{isKanri ? '監理団体' : '登録支援機関'}によって異なります。
            契約前に必ず詳細をご確認ください。
          </p>

          {/* パートナー検索CTA */}
          <a
            href={`/business/partners?type=${isKanri ? 'kanri' : 'support'}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-[#1a2f5e] hover:text-[#c9a84c] transition-colors"
          >
            {isKanri ? '監理団体' : '登録支援機関'}を探す &rarr;
          </a>
        </div>
      </details>
    </div>
  );
}
