import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getNavItems, getThemeVars, getContentBlocks } from '@/lib/data';
import { BusinessHeader } from '@/components/business/BusinessHeader';
import { Footer } from '@/components/common/Footer';

export const metadata = {
  title: 'プライバシーポリシー | J-GLOW',
  description: 'J-GLOWのプライバシーポリシー。企業ユーザー・個人ユーザーの個人情報の取り扱い、Cookie、Google Analyticsの利用等について定めます。',
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
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f8f7f4' }}>
      <BusinessHeader navItems={headerNav} texts={headerTexts} theme={theme} />
      <main className="flex-1 max-w-3xl mx-auto px-6 py-12">

        <h1 className="text-3xl font-bold text-[#1a2f5e] mb-2">プライバシーポリシー</h1>
        <p className="text-sm text-gray-500 mb-8">
          制定日：2026年3月1日　J-GLOW運営事務局
        </p>

        <p className="text-sm text-gray-700 leading-relaxed mb-8">
          J-GLOW（以下「当サービス」）は、外国人材の雇用支援および求職支援を目的としたウェブプラットフォームです。
          当サービスをご利用いただくすべてのお客様——企業・団体（以下「企業ユーザー」）、
          個人の求職者・利用者（以下「個人ユーザー」）、およびゲストを含む——の
          個人情報およびご利用データの取り扱いについて、以下のとおり定めます。
        </p>

        {/* 第1条 */}
        <h2 className="text-lg font-bold text-[#1a2f5e] border-b border-gray-200 pb-2 mt-10 mb-4">
          第1条　事業者情報
        </h2>
        <ul className="ml-4 space-y-1 text-sm text-gray-700 leading-relaxed">
          <li>・名称：J-GLOW運営事務局</li>
          <li>・メールアドレス：<a href="mailto:privacy@j-glow.com" className="text-[#1a2f5e] underline">privacy@j-glow.com</a></li>
        </ul>

        {/* 第2条 */}
        <h2 className="text-lg font-bold text-[#1a2f5e] border-b border-gray-200 pb-2 mt-10 mb-4">
          第2条　収集する情報の種類
        </h2>

        <p className="text-sm text-gray-700 leading-relaxed font-bold mt-4 mb-2">
          （1）企業ユーザーの登録情報
        </p>
        <ul className="ml-4 space-y-1 text-sm text-gray-700 leading-relaxed">
          <li>・メールアドレス</li>
          <li>・パスワード（ハッシュ化して保存。平文での保存は行いません）</li>
          <li>・会社名・担当者名・役職（任意入力）</li>
          <li>・業種・事業形態</li>
        </ul>

        <p className="text-sm text-gray-700 leading-relaxed font-bold mt-6 mb-2">
          （2）個人ユーザーの登録情報
        </p>
        <ul className="ml-4 space-y-1 text-sm text-gray-700 leading-relaxed">
          <li>・メールアドレス</li>
          <li>・パスワード（ハッシュ化して保存。平文での保存は行いません）</li>
          <li>・氏名</li>
          <li>・国籍・在留資格の種別（該当する場合）</li>
          <li>・職歴・スキル・資格・日本語能力等のプロフィール情報（任意入力）</li>
          <li>・求人への応募情報・希望条件（ジョブボード利用時）</li>
        </ul>

        <p className="text-sm text-gray-700 leading-relaxed font-bold mt-6 mb-2">
          （3）ツール利用データ（全ユーザー共通）
        </p>
        <ul className="ml-4 space-y-1 text-sm text-gray-700 leading-relaxed">
          <li>・当サービスが提供する各種ツール・機能において入力・選択された情報および結果データ</li>
          <li className="text-gray-500">　（氏名・連絡先等の個人を特定できる情報を除く）</li>
        </ul>

        <p className="text-sm text-gray-700 leading-relaxed font-bold mt-6 mb-2">
          （4）アクセス・行動ログ（全ユーザー共通）
        </p>
        <ul className="ml-4 space-y-1 text-sm text-gray-700 leading-relaxed">
          <li>・閲覧ページ・日時・デバイス情報等のアクセスログ</li>
          <li>・Cookie・セッションIDを用いた利用状況データ（詳細は第4条・第5条をご参照ください）</li>
        </ul>

        <p className="text-sm text-gray-700 leading-relaxed font-bold mt-6 mb-2">
          （5）お問い合わせ情報
        </p>
        <ul className="ml-4 space-y-1 text-sm text-gray-700 leading-relaxed">
          <li>・お問い合わせフォームに入力された氏名・メールアドレス・お問い合わせ内容</li>
        </ul>

        <p className="text-xs text-gray-500 italic bg-gray-50 p-3 rounded mt-4">
          ※ ゲストユーザーは氏名・メールアドレス等を登録していないため、ツール利用データおよび
          アクセスログは原則として個人を特定できない状態で収集されます。
        </p>

        {/* 第3条 */}
        <h2 className="text-lg font-bold text-[#1a2f5e] border-b border-gray-200 pb-2 mt-10 mb-4">
          第3条　情報の利用目的
        </h2>
        <ul className="ml-4 space-y-1 text-sm text-gray-700 leading-relaxed">
          <li>・当サービスの提供・運営・改善</li>
          <li>・ツールや機能の利用傾向分析によるコンテンツ品質の向上</li>
          <li>・企業ユーザーと個人ユーザー間の求人マッチング・紹介（ジョブボード機能）</li>
          <li>・個人ユーザーへのキャリア支援・求人情報の提供</li>
          <li>・会員へのサービス通知・サポート対応</li>
          <li>・不正利用の検知・防止</li>
          <li>・統計データの作成（個人を特定できない形式）</li>
          <li>・当サービスに関する新機能・キャンペーン等のご案内（会員のみ・配信停止可能）</li>
        </ul>

        {/* 第4条 */}
        <h2 className="text-lg font-bold text-[#1a2f5e] border-b border-gray-200 pb-2 mt-10 mb-4">
          第4条　Google Analytics の利用について
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-3">
          当サービスでは、アクセス解析のためにGoogle Analytics 4（GA4）を使用しています。
          GA4はCookieを使用して匿名のトラフィックデータを収集します。
        </p>
        <ul className="ml-4 space-y-1 text-sm text-gray-700 leading-relaxed">
          <li>・収集されるデータ：ページ閲覧数・滞在時間・流入元・デバイス情報等（個人を特定しない形式）</li>
          <li>・データの管理主体：Google LLC</li>
          <li>・オプトアウト：<a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-[#1a2f5e] underline">Googleアナリティクス オプトアウト アドオン</a>からブラウザ単位で無効化できます</li>
          <li>・Googleのプライバシーポリシーは<a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#1a2f5e] underline">Googleのウェブサイト</a>でご確認ください</li>
        </ul>

        {/* 第5条 */}
        <h2 className="text-lg font-bold text-[#1a2f5e] border-b border-gray-200 pb-2 mt-10 mb-4">
          第5条　CookieおよびセッションIDの利用
        </h2>
        <ul className="ml-4 space-y-1 text-sm text-gray-700 leading-relaxed">
          <li>・セッションID：ゲストユーザーの行動ログを匿名で記録するため（ブラウザを閉じると消去されます）</li>
          <li>・認証Cookie：会員のログイン状態を維持するため（Supabase Authが発行）</li>
          <li>・アクセス解析Cookie：Google Analytics 4 による利用状況の把握のため</li>
        </ul>
        <p className="text-sm text-gray-700 leading-relaxed mt-3">
          ブラウザの設定からCookieを無効にすることが可能ですが、
          その場合一部の機能が正常に動作しない場合があります。
        </p>

        {/* 第6条 */}
        <h2 className="text-lg font-bold text-[#1a2f5e] border-b border-gray-200 pb-2 mt-10 mb-4">
          第6条　第三者への情報提供
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-3">
          当サービスは、以下の場合を除き、収集した情報を第三者に提供しません。
        </p>
        <ul className="ml-4 space-y-1 text-sm text-gray-700 leading-relaxed">
          <li>・ご本人の同意がある場合</li>
          <li>・ジョブボード機能において、個人ユーザーが求人に応募した場合、
            応募先の企業ユーザーに対してプロフィール情報（氏名・職歴・スキル等）を提供します。
            提供範囲は個人ユーザーが公開設定した情報に限ります</li>
          <li>・法令に基づく開示請求があった場合</li>
          <li>・人の生命・身体・財産の保護のために必要がある場合</li>
          <li>・当サービスの運営に必要な委託先（Supabase、Vercel、Google等）への提供（いずれも守秘義務契約の下での提供に限ります）</li>
        </ul>
        <p className="text-xs text-gray-500 italic bg-gray-50 p-3 rounded mt-4">
          ※ 当サービスは広告目的でのデータ販売・第三者への情報提供を行いません。
        </p>

        {/* 第7条 */}
        <h2 className="text-lg font-bold text-[#1a2f5e] border-b border-gray-200 pb-2 mt-10 mb-4">
          第7条　データの保存・管理
        </h2>
        <ul className="ml-4 space-y-1 text-sm text-gray-700 leading-relaxed">
          <li>・当サービスのデータベースはSupabase（データセンター：シンガポール）で管理されています</li>
          <li>・データへのアクセスは行レベルセキュリティ（RLS）により制御され、本人または管理者のみがアクセス可能です</li>
          <li>・アクティビティログはサービスの品質向上・不正利用防止のために必要な期間保存されます</li>
          <li>・会員が退会した場合、個人情報は合理的な期間内に削除します（法令上の保存義務がある場合を除く）</li>
        </ul>

        {/* 第8条 */}
        <h2 className="text-lg font-bold text-[#1a2f5e] border-b border-gray-200 pb-2 mt-10 mb-4">
          第8条　お客様の権利
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-3">
          会員のお客様（企業ユーザー・個人ユーザーを問わず）は、以下の権利を有します。
        </p>
        <ul className="ml-4 space-y-1 text-sm text-gray-700 leading-relaxed">
          <li>・保有する個人情報の開示請求</li>
          <li>・個人情報の訂正・削除請求</li>
          <li>・利用停止・消去の請求</li>
          <li>・ジョブボードに登録したプロフィール情報の公開停止・削除</li>
          <li>・メールマガジン等の受信停止</li>
        </ul>
        <p className="text-sm text-gray-700 leading-relaxed mt-3">
          ご要望は<a href="mailto:privacy@j-glow.com" className="text-[#1a2f5e] underline">privacy@j-glow.com</a>までお問い合わせください。
          本人確認の上、合理的な期間内に対応いたします。
        </p>

        {/* 第9条 */}
        <h2 className="text-lg font-bold text-[#1a2f5e] border-b border-gray-200 pb-2 mt-10 mb-4">
          第9条　未成年者の利用について
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          18歳未満の方の会員登録はお断りしております。
        </p>

        {/* 第10条 */}
        <h2 className="text-lg font-bold text-[#1a2f5e] border-b border-gray-200 pb-2 mt-10 mb-4">
          第10条　多言語対応について
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          本ポリシーは日本語を正文とします。
          当サービスでは利用者の利便性のため多言語での情報提供を行っておりますが、
          翻訳版と日本語版の間に齟齬がある場合は、日本語版の記載が優先されます。
        </p>

        {/* 第11条 */}
        <h2 className="text-lg font-bold text-[#1a2f5e] border-b border-gray-200 pb-2 mt-10 mb-4">
          第11条　プライバシーポリシーの変更
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          当サービスは、法令の改正やサービス内容の変更に伴い、本ポリシーを変更することがあります。
          重要な変更の場合はサイト上で告知いたします。
          変更後も当サービスを継続してご利用いただいた場合、変更後のポリシーに同意したものとみなします。
        </p>

        {/* 第12条 */}
        <h2 className="text-lg font-bold text-[#1a2f5e] border-b border-gray-200 pb-2 mt-10 mb-4">
          第12条　お問い合わせ窓口
        </h2>
        <ul className="ml-4 space-y-1 text-sm text-gray-700 leading-relaxed">
          <li>・J-GLOW運営事務局　個人情報担当</li>
          <li>・メールアドレス：<a href="mailto:privacy@j-glow.com" className="text-[#1a2f5e] underline">privacy@j-glow.com</a></li>
          <li>・受付時間：平日 10:00〜18:00（土日祝・年末年始を除く）</li>
        </ul>

        {/* トップへ戻る */}
        <div className="mt-12 text-center">
          <Link
            href="/business"
            className="text-sm font-medium text-[#1a2f5e] hover:underline"
          >
            ← トップへ戻る
          </Link>
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
