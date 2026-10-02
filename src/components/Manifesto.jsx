import React, { useState } from 'react';
import { 
  Building2, 
  Sprout, 
  Scale, 
  Users, 
  HeartPulse, 
  CheckSquare, 
  Target, 
  Sparkles, 
  Printer, 
  ArrowRight,
  Flame,
  FileCheck2
} from 'lucide-react';
import PineappleSymbol from './PineappleSymbol';

export default function Manifesto({ candidateConfig }) {
  const manifestoList = candidateConfig.manifesto || [];
  const firstCatId = manifestoList[0]?.category_id || manifestoList[0]?.id || 'infrastructure';
  const [activeTab, setActiveTab] = useState(firstCatId);

  // Category Icon Resolver
  const getCategoryIcon = (id) => {
    switch (id) {
      case 'infrastructure':
      case 'roads':
        return <Building2 className="w-5 h-5" />;
      case 'agriculture':
        return <Sprout className="w-5 h-5" />;
      case 'governance':
        return <Scale className="w-5 h-5" />;
      case 'youth':
        return <Users className="w-5 h-5" />;
      case 'welfare':
        return <HeartPulse className="w-5 h-5" />;
      default:
        return <Target className="w-5 h-5" />;
    }
  };

  const currentManifesto = manifestoList.find(
    (m) => (m.category_id === activeTab || m.id === activeTab)
  ) || manifestoList[0] || {
    title: 'নির্বাচনী ইশতেহার',
    badge: 'অগ্রাধিকার',
    headline: 'সুশাসন ও জনকল্যাণ',
    points: ['টেকসই উন্নয়ন ও নাগরিক অধিকার']
  };

  const points = Array.isArray(currentManifesto.points) 
    ? currentManifesto.points 
    : (typeof currentManifesto.points === 'string' ? JSON.parse(currentManifesto.points || '[]') : []);

  return (
    <section id="manifesto" className="py-16 sm:py-24 bg-gradient-to-b from-stone-50 via-white to-stone-100 text-stone-900 relative">
      {/* Decorative side accent */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-bold mb-3 border border-emerald-300">
            <FileCheck2 className="w-4 h-4 text-emerald-700" />
            <span>আগামীর {candidateConfig.unionName || 'ইউনিয়ন'} বিনির্মাণে</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#064e3b] font-display">
            জনতার নির্বাচনী ইশতেহার ({candidateConfig.electionYear})
          </h2>
          <p className="mt-3 text-stone-600 text-base sm:text-lg leading-relaxed">
            কোনো ফাঁকা বুলি নয়, {candidateConfig.candidateRole || 'চেয়ারম্যান'} নির্বাচিত হলে আগামী ৫ বছরে বাস্তবভিত্তিক অগ্রাধিকার কর্মপরিকল্পনা।
          </p>
          <div className="mt-4 mx-auto w-24 h-1.5 bg-gradient-to-r from-emerald-600 via-amber-500 to-red-600 rounded-full"></div>
        </div>

        {/* Tab Navigation (Responsive scrolling & pill buttons) */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-4 gap-2 sm:gap-3 no-scrollbar">
          {manifestoList.map((category) => {
            const catId = category.category_id || category.id;
            const isActive = activeTab === catId;
            return (
              <button
                key={catId}
                onClick={() => setActiveTab(catId)}
                className={`inline-flex items-center gap-2.5 px-4 sm:px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all duration-200 border ${
                  isActive
                    ? 'bg-[#064e3b] text-white border-[#064e3b] shadow-lg shadow-emerald-950/20 transform -translate-y-0.5'
                    : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50 hover:border-emerald-300'
                }`}
              >
                <span className={isActive ? 'text-amber-400' : 'text-emerald-700'}>
                  {getCategoryIcon(catId)}
                </span>
                <span>{category.badge}</span>
              </button>
            );
          })}
        </div>

        {/* Active Manifesto Detailed Card */}
        <div className="mt-8 bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-stone-200 relative overflow-hidden transition-all duration-300">
          
          {/* Subtle watermark symbol */}
          <div className="absolute right-4 bottom-4 opacity-5 pointer-events-none">
            <PineappleSymbol className="w-72 h-72" />
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200">
                অগ্রাধিকার খাতা • {currentManifesto.badge}
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#064e3b] mt-2 font-display">
                {currentManifesto.title}
              </h3>
              <p className="text-sm sm:text-base text-stone-600 mt-1 font-medium">
                {currentManifesto.headline}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="bg-red-50 text-red-600 text-xs font-bold px-3 py-1 rounded-full border border-red-200 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-red-600" />
                শতভাগ প্রতিশ্রুতি
              </span>
            </div>
          </div>

          {/* Points Grid */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {points.map((point, index) => (
              <div
                key={index}
                className="p-5 rounded-2xl bg-stone-50 border border-stone-200 hover:border-emerald-400 hover:bg-emerald-50/40 transition-all duration-200 flex items-start gap-4 group"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white font-bold text-sm flex items-center justify-center shrink-0 mt-0.5 shadow-sm group-hover:scale-105 transition-transform font-outfit">
                  ০{index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm sm:text-base text-stone-800 font-semibold leading-relaxed">
                    {point}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Citizen Suggestion prompt inside manifesto */}
          <div className="mt-10 p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-amber-50 border border-emerald-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-left">
              <div className="p-2.5 rounded-xl bg-emerald-700 text-white shadow shrink-0">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-[#064e3b]">
                  আপনার এলাকার বিশেষ কোনো উন্নয়ন সমস্যা কি বাদ পড়েছে?
                </h4>
                <p className="text-xs sm:text-sm text-stone-600">
                  সরাসরি প্রার্থীর নিকট অভিযোগ বা উন্নয়ন পরামর্শ লিখে পাঠান।
                </p>
              </div>
            </div>

            <a
              href="#grievance"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#064e3b] hover:bg-[#043327] text-white text-xs sm:text-sm font-bold shadow transition-transform transform hover:scale-105 whitespace-nowrap"
            >
              <span>পরামর্শ বক্সে লিখুন</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
