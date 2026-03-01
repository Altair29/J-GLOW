'use client';

export function OrgServiceBreakdown() {
  return (
    <div className="bg-blue-50/50 rounded-lg border border-blue-100 p-4 space-y-3">
      <h5 className="text-sm font-bold text-[#1a2f5e]">監理費・支援費の内訳</h5>

      <div className="space-y-2">
        <p className="text-xs font-medium text-gray-600">含まれるもの:</p>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-1">
          {[
            '月1回以上の訪問指導・監査',
            '育成就労計画の作成支援',
            '入国手続き・在留資格申請代行',
            '送出機関との連絡調整',
            '技能検定の受験手配',
            '相談・苦情対応',
          ].map((item) => (
            <li key={item} className="flex items-start gap-1.5 text-xs text-gray-600">
              <span className="text-green-500 shrink-0">✅</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-gray-600">別途確認が必要:</p>
        <ul className="space-y-1">
          {[
            '入会金・出資金の有無',
            '翻訳・通訳費用',
            '渡航費・健康診断費用',
          ].map((item) => (
            <li key={item} className="flex items-start gap-1.5 text-xs text-gray-600">
              <span className="text-amber-500 shrink-0">❓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-blue-100">
        <p className="text-xs text-gray-400">
          ※ 内容は団体によって異なります
        </p>
        <a
          href="/business/partners?type=kanri"
          className="text-xs font-medium text-[#1a2f5e] hover:text-[#c9a84c] transition-colors"
        >
          監理団体を探す &rarr;
        </a>
      </div>
    </div>
  );
}
