import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, FileText } from 'lucide-react';

export function ConnectTemplateBanner() {
  return (
    <section className="py-10 md:py-14" style={{ backgroundColor: '#ffffff' }}>
      <div className="max-w-6xl mx-auto px-4">
        <Link
          href="/business/existing-users/connect/templates"
          className="group block rounded-2xl border-2 p-6 md:p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          style={{
            borderColor: 'rgba(201, 168, 76, 0.35)',
            backgroundColor: 'rgba(201, 168, 76, 0.03)',
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: 'rgba(201, 168, 76, 0.12)' }}
                >
                  <FileText size={20} strokeWidth={1.8} style={{ color: '#c9a84c' }} />
                </div>
                <span
                  className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: 'rgba(201, 168, 76, 0.12)',
                    color: '#c9a84c',
                  }}
                >
                  無料ツール
                </span>
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1">
                5言語対応 現場指示書を自社用にカスタマイズして印刷
              </h3>
              <p className="text-sm text-gray-500 mb-3">
                ベトナム語・インドネシア語・英語・ミャンマー語
                <br />
                各会社に合ったルールを選んで、そのまま印刷できます
              </p>
              <span
                className="inline-flex items-center gap-1.5 text-sm font-semibold group-hover:gap-2.5 transition-all"
                style={{ color: '#1a2f5e' }}
              >
                指示書をカスタマイズする
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </span>
            </div>
            <div className="hidden sm:block shrink-0" style={{ width: '120px' }}>
              <Image
                src="/images/articles/template_preview.svg"
                alt="指示書プレビュー"
                width={120}
                height={168}
                style={{
                  borderRadius: '6px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              />
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
