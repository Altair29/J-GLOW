'use client';

import Link from 'next/link';
import { GUEST_MONTH_LIMIT } from '../lib/constants';

export default function GuestGateOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Blur backdrop */}
      <div className="absolute inset-0 bg-white/60 backdrop-blur-md" />

      {/* Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center border border-gray-200">
        <div className="text-4xl mb-4">🔒</div>
        <h2 className="text-xl font-extrabold text-[#1a2f5e] mb-2">
          ゲスト体験は{GUEST_MONTH_LIMIT}ヶ月まで
        </h2>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          残りのターンをプレイするには、無料会員登録が必要です。<br />
          登録すればセッション保存も利用できます。
        </p>

        <div className="space-y-3">
          <Link
            href="/register/business?redirectTo=/business/management-sim"
            className="block w-full py-3 rounded-xl bg-[#1a2f5e] text-white text-sm font-bold hover:bg-[#15254d] transition-colors shadow-md"
          >
            無料で会員登録
          </Link>
          <Link
            href="/login?redirectTo=/business/management-sim"
            className="block w-full py-3 rounded-xl border-2 border-gray-200 text-gray-600 text-sm font-bold hover:bg-gray-50 transition-colors"
          >
            ログインして続ける
          </Link>
          <Link
            href="/business"
            className="block text-xs text-gray-400 hover:text-gray-600 transition-colors mt-2"
          >
            ← トップに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
