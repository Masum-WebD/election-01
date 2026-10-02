import React, { useState } from 'react';
import { GraduationCap, Award, HeartHandshake, History, CheckCircle, ShieldCheck, ChevronRight, UserCheck } from 'lucide-react';
import PineappleSymbol from './PineappleSymbol';

export default function CandidateBio({ candidateConfig }) {
  const [activeBioTab, setActiveBioTab] = useState('achievements');

  return (
    <section id="bio" className="py-16 sm:py-24 bg-stone-50 text-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-bold mb-3 border border-emerald-300">
            <UserCheck className="w-4 h-4 text-emerald-700" />
            <span>{candidateConfig.unionName || 'ইউনিয়ন'}-এর কৃতি সন্তান</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#064e3b] font-display">
            পরিচিতি ও অতীত উন্নয়ন কর্মকাণ্ড
          </h2>
          <p className="mt-3 text-stone-600 text-base sm:text-lg leading-relaxed">
            কথায় নয়, সততা ও কাজের মাধ্যমে যিনি সবসময় {candidateConfig.unionName || 'ইউনিয়ন'}-বাসীর সেবায় নিবেদিত প্রাণ।
          </p>
          <div className="mt-4 mx-auto w-24 h-1.5 bg-gradient-to-r from-emerald-600 via-amber-500 to-red-600 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Profile Card & Education & Family (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Candidate Identity Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/50 rounded-bl-full pointer-events-none"></div>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-md border-2 border-emerald-600 shrink-0">
                  <img
                    src={candidateConfig.assets.portrait}
                    alt={candidateConfig.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#064e3b] font-display">
                    {candidateConfig.name}
                  </h3>
                  <p className="text-sm font-semibold text-red-600">
                    {candidateConfig.candidateRole} ({candidateConfig.electionYear})
                  </p>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {candidateConfig.unionName}, {candidateConfig.upazila}
                  </p>
                </div>
              </div>

              {/* Bio Summary Quote */}
              {candidateConfig.bio?.summary && (
                <div className="p-4 rounded-2xl bg-emerald-50 border-l-4 border-emerald-600 text-stone-700 text-sm leading-relaxed mb-6 italic">
                  "{candidateConfig.bio.summary}"
                </div>
              )}

              {/* Family Standing & Heritage */}
              <div className="space-y-4 pt-2 border-t border-stone-100">
                {candidateConfig.bio?.familyHeritage && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5">
                      <History className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-stone-900">পারিবারিক ঐতিহ্য</h4>
                      <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
                        {candidateConfig.bio.familyHeritage}
                      </p>
                    </div>
                  </div>
                )}

                {/* Educational Qualifications */}
                {Array.isArray(candidateConfig.bio?.education) && candidateConfig.bio.education.length > 0 && (
                  <div className="flex items-start gap-3 pt-2">
                    <div className="p-2 rounded-xl bg-blue-100 text-blue-800 shrink-0 mt-0.5">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-stone-900 mb-2">শিক্ষাগত যোগ্যতা</h4>
                      <div className="space-y-2">
                        {candidateConfig.bio.education.map((edu, idx) => (
                          <div key={idx} className="p-2 rounded-lg bg-stone-50 border border-stone-200/80 text-xs">
                            <span className="font-bold text-stone-800">{edu.degree}</span>
                            <span className="text-stone-500 block">{edu.institute} ({edu.year})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Ethical Principle */}
                {candidateConfig.bio?.socialPhilosophy && (
                  <div className="flex items-start gap-3 pt-2">
                    <div className="p-2 rounded-xl bg-red-100 text-red-800 shrink-0 mt-0.5">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-stone-900">সামাজিক অঙ্গীকার</h4>
                      <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
                        {candidateConfig.bio.socialPhilosophy}
                      </p>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>

          {/* Right Column: Track Record & Past Achievements (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-200">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-200">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-emerald-700 text-white shadow">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#064e3b] font-display">
                      অতীত সমাজসেবা ও উন্নয়ন চিত্র
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-500">
                      দায়িত্বে না থেকেও জনগণের প্রয়োজনে সবসময় অগ্রণী ভূমিকা
                    </p>
                  </div>
                </div>

                {candidateConfig.show_symbol !== false && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold border border-amber-300">
                    <PineappleSymbol 
                      className="w-5 h-5" 
                      customImage={candidateConfig.symbol?.image}
                      symbolName={candidateConfig.symbol?.name}
                    />
                    <span>{candidateConfig.symbol?.name || 'মার্কা'}</span>
                  </div>
                )}
              </div>

              {/* Achievements List */}
              <div className="space-y-4">
                {(candidateConfig.bio?.pastAchievements || []).map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3.5 p-4 rounded-2xl bg-stone-50/80 hover:bg-emerald-50/60 border border-stone-200/90 hover:border-emerald-300 transition-all duration-200 group"
                  >
                    <div className="p-1 rounded-full bg-emerald-600 text-white shrink-0 mt-0.5 shadow-sm group-hover:scale-110 transition-transform">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <p className="text-sm sm:text-base text-stone-700 leading-relaxed font-medium">
                      {item}
                    </p>
                  </div>
                ))}
              </div>

              {/* Bottom Quote & CTA */}
              <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-[#064e3b] to-[#0b5d3b] text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
                <div className="text-left">
                  <h4 className="text-base font-bold text-amber-300">
                    "{candidateConfig.unionName || 'ইউনিয়ন'}-এর উন্নয়ন ও শান্তি রক্ষায় আমি আপসহীন"
                  </h4>
                  <p className="text-xs text-emerald-100 mt-0.5">
                    আপনার একটি মূল্যবান ভোট দিতে পারে একটি আলোকিত আগামীর নিশ্চয়তা।
                  </p>
                </div>
                <a
                  href="#manifesto"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-900 font-extrabold text-sm whitespace-nowrap shadow transition-all transform hover:scale-105"
                >
                  ইশতেহারের বিস্তারিত
                </a>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
