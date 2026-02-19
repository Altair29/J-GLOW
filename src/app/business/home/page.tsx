import { Building2 } from 'lucide-react';

export default function BusinessHomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="p-4 bg-slate-100 rounded-2xl mb-6">
        <Building2 size={40} className="text-slate-400" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">企業ホーム</h1>
      <p className="text-slate-500 text-sm">このページは現在準備中です。</p>
    </div>
  );
}
