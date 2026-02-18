import { ThemeEditor } from '@/components/admin/ThemeEditor';
import { ContentBlockEditor } from '@/components/admin/ContentBlockEditor';
import { NavigationEditor } from '@/components/admin/NavigationEditor';

export default function BusinessSettingsPage() {
  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">企業セクション設定</h2>
        <p className="text-gray-500 text-sm mb-6">ネイビー基調のカラー、テキスト、ナビゲーションを管理します</p>
      </div>

      <section>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">テーマカラー</h3>
        <ThemeEditor section="business" />
      </section>

      <section>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">ヘッダーナビゲーション</h3>
        <NavigationEditor section="business_header" />
      </section>

      <section>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">ヘッダーテキスト</h3>
        <ContentBlockEditor page="business_header" />
      </section>

      <section>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">ホームページテキスト</h3>
        <ContentBlockEditor page="business_home" />
      </section>

      <section>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">フッターリンク</h3>
        <NavigationEditor section="footer_business" />
      </section>
    </div>
  );
}
