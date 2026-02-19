import { Users } from 'lucide-react';

export default function WorkerHomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="p-4 bg-emerald-50 rounded-2xl mb-6">
        <Users size={40} className="text-emerald-400" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Home</h1>
      <p className="text-slate-500 text-sm">This page is under construction.</p>
    </div>
  );
}
