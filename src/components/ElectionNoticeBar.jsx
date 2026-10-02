import React from 'react';
import { AlertTriangle, Info, CheckCircle2, ShieldAlert } from 'lucide-react';
import PineappleSymbol from './PineappleSymbol';

export default function ElectionNoticeBar({ candidateConfig }) {
  return (
    <div className="bg-amber-500 text-stone-950 py-3 px-4 border-y border-amber-600 shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left text-xs sm:text-sm font-semibold">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded bg-stone-950 text-amber-400 shrink-0">
            <Info className="w-4 h-4" />
          </span>
          <span>
            <strong>ভোটারদের প্রতি বিশেষ অনুরোধ:</strong> ভোটকেন্দ্রে যাওয়ার সময় আপনার জাতীয় পরিচয়পত্র (NID) অথবা ভোটার স্লিপ সাথে রাখুন।
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="bg-emerald-950 text-white text-xs px-2.5 py-1 rounded-md font-bold flex items-center gap-1.5 shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
            <span>সুষ্ঠু ও নিরপেক্ষ নির্বাচন চাই</span>
          </span>
          <a
            href="#grievance"
            className="underline underline-offset-2 hover:text-stone-800 text-xs font-bold"
          >
            ভোটকেন্দ্র সহায়তা সেল
          </a>
        </div>
      </div>
    </div>
  );
}
