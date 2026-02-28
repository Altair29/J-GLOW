import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getNavItems, getThemeVars, getContentBlocks } from '@/lib/data';
import { BusinessHeader } from '@/components/business/BusinessHeader';
import { Footer } from '@/components/common/Footer';

export const metadata = {
  title: 'プライバシーポリシー | J-GLOW',
  description: 'J-GLOWのプライバシーポリシー',
};

export default async function PrivacyPolicyPage() {
  const supabase = await createClient();

  const [headerNav, footerBizNav, footerWkrNav, bizTheme, globalTheme, headerTexts, footerTexts] =
    await Promise.all([
      getNavItems(supabase, 'business_header'),
      getNavItems(supabase, 'footer_business'),
      getNavItems(supabase, 'footer_worker'),
      getThemeVars(supabase, 'business'),
      getThemeVars(supabase, 'global'),
      getContentBlocks(supabase, 'business_header'),
      getContentBlocks(supabase, 'footer'),
    ]);

  const theme = { ...globalTheme, ...bizTheme };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f8fafc' }}>
      <BusinessHeader navItems={headerNav} texts={headerTexts} theme={theme} />
      <main className="flex-1">
        {/* ヒーロー */}
        <section
          className="py-14"
          style={{ background: 'linear-gradient(135deg, #1a2f5e 0%, #0f1d3d 100%)' }}
        >
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">プライバシーポリシー</h1>
            <p className="text-white/60 text-sm">Privacy Policy</p>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="bg-white rounded-xl border border-gray-200 p-8 md:p-10">
            <p className="text-sm text-gray-500 mb-8">制定日：（準備中）</p>

            {/* 第1条 */}
            <section className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200">
                第1条　用語の定義
              </h2>
              <ul className="space-y-2 text-sm text-gray-700 leading-relaxed">
                <li className="flex gap-2">
                  <span className="text-gray-400 shrink-0">・</span>
                  <span><strong>個人ユーザー</strong>：当サービスに個人として登録した方</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-gray-400 shrink-0">・</span>
                  <span><strong>法人ユーザー</strong>：当サービスに登録した企業・監理団体・登録支援機関</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-gray-400 shrink-0">・</span>
                  <span><strong>ユーザー</strong>：個人ユーザーおよび法人ユーザーの総称</span>
                </li>
              </ul>
            </section>

            {/* 第2条 */}
            <section className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200">
                第2条　事業者情報
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="py-2.5 pr-4 font-medium text-gray-600 whitespace-nowrap w-48">名称</td>
                      <td className="py-2.5 text-gray-500">【準備中】</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-4 font-medium text-gray-600 whitespace-nowrap">所在地</td>
                      <td className="py-2.5 text-gray-500">【準備中】</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-4 font-medium text-gray-600 whitespace-nowrap">個人情報取扱責任者</td>
                      <td className="py-2.5 text-gray-500">【準備中】</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-4 font-medium text-gray-600 whitespace-nowrap">メールアドレス</td>
                      <td className="py-2.5 text-gray-500">【準備中】</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-4 font-medium text-gray-600 whitespace-nowrap">特定募集情報等提供事業<br />届出受理番号</td>
                      <td className="py-2.5 text-gray-500">【届出後に記載】</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 第3条〜第14条 */}
            <section className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200">
                第3条〜第14条
              </h2>
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <p className="text-gray-600 text-sm leading-relaxed">
                  現在準備中です。正式版は近日公開予定です。
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  お問い合わせは{' '}
                  <a href="mailto:info@j-glow.com" className="font-medium" style={{ color: '#1a2f5e' }}>
                    info@j-glow.com
                  </a>
                  {' '}までご連絡ください。
                </p>
              </div>
            </section>

            {/* 末尾注記 */}
            <p className="text-xs text-gray-400 text-center mt-10">
              ※本ポリシーは現在法務確認中です。正式版に随時更新します。
            </p>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/business"
              className="text-sm font-medium hover:underline"
              style={{ color: '#1a2f5e' }}
            >
              ← トップへ戻る
            </Link>
          </div>
        </div>
      </main>
      <Footer
        variant="business"
        bizNavItems={footerBizNav}
        wkrNavItems={footerWkrNav}
        texts={footerTexts}
        theme={theme}
      />
    </div>
  );
}
