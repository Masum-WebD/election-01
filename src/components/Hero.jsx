import React, { useState, useEffect } from 'react';
import { Heart, FileText, Phone, Award, Clock, CheckCircle2, Sparkles, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';
import PineappleSymbol from './PineappleSymbol';
import { submitPledgeApi } from '../services/campaignApi';

export default function Hero({ candidateConfig }) {
  // Live Countdown state
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Digital Support / Pledge state (Dynamic from backend database)
  const initialSupport = candidateConfig.support_pledge_count || 12485;
  const [supportCount, setSupportCount] = useState(initialSupport);
  const [hasSupported, setHasSupported] = useState(() => {
    return typeof window !== 'undefined' ? localStorage.getItem('up_user_supported') === 'true' : false;
  });

  useEffect(() => {
    if (candidateConfig.support_pledge_count) {
      setSupportCount(candidateConfig.support_pledge_count);
    }
  }, [candidateConfig.support_pledge_count]);

  useEffect(() => {
    const isCountdownActive = candidateConfig.show_countdown !== false && candidateConfig.sections?.countdown !== false;
    if (!isCountdownActive || !candidateConfig.electionDate) return;
    const targetDate = new Date(candidateConfig.electionDate).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [candidateConfig.electionDate, candidateConfig.show_countdown, candidateConfig.sections?.countdown]);

  // Support / Pledge button handler
  const handleSupport = async () => {
    if (!hasSupported) {
      const newCount = supportCount + 1;
      setSupportCount(newCount);
      setHasSupported(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('up_user_supported', 'true');
      }

      // Submit to backend API
      try {
        const res = await submitPledgeApi();
        if (res && res.supportCount) {
          setSupportCount(res.supportCount);
        }
      } catch (err) {
        console.warn('Pledge error:', err);
      }

      // Trigger festive celebration confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0b5d3b', '#dc2626', '#d97706', '#22c55e']
      });
    }
  };

  // Bengali number converter helper
  const toBengaliNumber = (num) => {
    const bnNums = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().replace(/\d/g, (d) => bnNums[d]);
  };

  return (
    <section id="hero" className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden bg-gradient-to-b from-[#064e3b] via-[#0b5d3b] to-[#043327] text-white">
      {/* Background Decorative Patterns */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fbbf24_1px,transparent_1px)] [background-size:20px_20px]"></div>
      
      {/* Subtle Glow Orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Announcement Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-emerald-400/30 backdrop-blur-md text-emerald-200 text-xs sm:text-sm font-semibold mb-6 animate-fade-in">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <span>{candidateConfig.electionYear} ইউনিয়ন পরিষদ সাধারণ নির্বাচন</span>
          <span className="text-emerald-400">•</span>
          <span className="text-amber-300 font-bold">{candidateConfig.unionName}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Slogan, Candidate Name & CTAs (7 cols) */}
          <div className="lg:col-span-7 text-left space-y-6">
            
            {/* Primary Electoral Badge */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1 bg-red-600/90 text-white rounded-lg shadow-md border border-red-500/50">
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">
                {candidateConfig.candidateRole} পদে আপনার দোয়া ও সমর্থন প্রত্যাশী
              </span>
            </div>

            {/* Candidate Title & Name */}
            <div>
              <p className="text-emerald-300 font-medium text-base sm:text-lg mb-1 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                {candidateConfig.unionName}, {candidateConfig.upazila}, {candidateConfig.district}
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight font-display drop-shadow-sm">
                {candidateConfig.name}
              </h1>
            </div>

            {/* Election Slogan Card */}
            <div className="relative p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-emerald-400/25 shadow-xl">
              <div className="absolute -top-3 left-4 bg-amber-500 text-stone-900 text-xs font-black px-2.5 py-0.5 rounded shadow">
                মূল নির্বাচনী অঙ্গীকার
              </div>
              <p className="text-xl sm:text-2xl font-bold text-amber-200 leading-snug mt-1 font-display">
                "{candidateConfig.slogan}"
              </p>
              <p className="text-sm sm:text-base text-emerald-100/90 mt-2 font-light leading-relaxed">
                {candidateConfig.subSlogan}
              </p>
            </div>

            {/* Electoral Symbol Focus Card (Conditionally shown if Marka is ON) */}
            {candidateConfig.show_symbol !== false ? (
              <div className="flex flex-wrap items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-950/70 to-emerald-900/60 border border-amber-400/40 shadow-inner">
                <div className="p-2.5 bg-white rounded-xl shadow-md border-2 border-amber-400 flex items-center justify-center">
                  <PineappleSymbol 
                    className="w-14 h-14" 
                    showStamp={true} 
                    customImage={candidateConfig.symbol?.image} 
                    symbolName={candidateConfig.symbol?.name} 
                  />
                </div>
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-amber-300 tracking-wide">
                      {candidateConfig.symbol?.name || 'মার্কা'}
                    </span>
                    <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded shadow">
                      ভোটের প্রতীক
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-emerald-200 mt-1">
                    {candidateConfig.unionName}বাসীর উন্নয়ন, সততা ও পরিবর্তনের বিশ্বস্ত প্রতীক।
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-950/70 to-emerald-900/60 border border-emerald-500/30 shadow-inner">
                <div className="p-3 bg-emerald-800 rounded-xl shadow-md border border-emerald-600 flex items-center justify-center text-amber-300">
                  <Award className="w-10 h-10" />
                </div>
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center gap-2">
                    <span className="text-xl sm:text-2xl font-black text-amber-300 tracking-wide">
                      {candidateConfig.candidateRole}
                    </span>
                    <span className="bg-emerald-600 text-white text-xs font-bold px-2 py-0.5 rounded shadow">
                      সাধারণ নির্বাচন {candidateConfig.electionYear}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-emerald-200 mt-1">
                    {candidateConfig.unionName}র প্রতিটি নাগরিকের মর্যাদা, ন্যায়বিচার ও সার্বিক উন্নয়ন আমাদের লক্ষ্য।
                  </p>
                </div>
              </div>
            )}

            {/* Quick Action CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#manifesto"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-base shadow-lg hover:shadow-amber-500/30 transition-all transform hover:-translate-y-0.5"
              >
                <FileText className="w-5 h-5" />
                <span>জনতার ইশতেহার দেখুন</span>
              </a>

              <button
                onClick={handleSupport}
                className={`inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-extrabold text-base transition-all transform hover:-translate-y-0.5 shadow-lg ${
                  hasSupported
                    ? 'bg-emerald-700/80 text-emerald-200 border border-emerald-500 cursor-default'
                    : 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30 animate-pulse'
                }`}
              >
                <Heart className={`w-5 h-5 ${hasSupported ? 'fill-emerald-300 text-emerald-300' : 'fill-white text-white'}`} />
                <span>{hasSupported ? 'দোয়া ও সমর্থন নিশ্চিত হয়েছে ✓' : 'দোয়া ও সমর্থন জানান'}</span>
              </button>

              <a
                href="#grievance"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-base border border-white/20 backdrop-blur-sm transition-all"
              >
                <span>পরামর্শ / অভিযোগ জানান</span>
              </a>
            </div>

            {/* Live Supporter Counter Counter */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-emerald-200/90 pt-1">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>
                এখন পর্যন্ত <strong className="text-amber-300 font-extrabold text-base">{toBengaliNumber(supportCount.toLocaleString())}</strong> জন {candidateConfig.unionName}বাসী দোয়া ও সমর্থন প্রকাশ করেছেন।
              </span>
            </div>

          </div>

          {/* Right Column: Candidate Portrait + Live Countdown (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            
            {/* Candidate Frame */}
            <div className="relative w-full max-w-md">
              {/* Outer decorative ring */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-400 via-emerald-400 to-red-500 rounded-3xl blur-sm opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
              
              <div className="relative rounded-3xl overflow-hidden bg-emerald-950 border-4 border-amber-400/80 shadow-2xl">
                
                {/* Photo */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-gradient-to-t from-black/80 via-transparent to-transparent">
                  <img
                    src={candidateConfig.assets?.portrait || '/assets/candidate_portrait.jpg'}
                    alt={candidateConfig.name}
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                    loading="eager"
                    onError={(e) => {
                      e.target.src = '/assets/candidate_portrait.jpg';
                    }}
                  />
                  
                  {/* Bottom Vignette with Candidate Info */}
                  <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-[#043327] via-[#043327]/85 to-transparent text-left">
                    <span className="bg-amber-400 text-stone-900 text-xs font-black px-2.5 py-0.5 rounded shadow">
                      {candidateConfig.titleBadge}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white mt-1 font-display">
                      {candidateConfig.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-emerald-200">
                      {candidateConfig.candidateRole} • {candidateConfig.unionName}
                    </p>
                  </div>

                  {/* Marka floating badge on photo top-right (Only if Marka is ON) */}
                  {candidateConfig.show_symbol !== false && (
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-2.5 shadow-xl border-2 border-amber-400 flex flex-col items-center animate-fade-in">
                      <PineappleSymbol 
                        className="w-12 h-12" 
                        customImage={candidateConfig.symbol?.image}
                        symbolName={candidateConfig.symbol?.name}
                      />
                      <span className="text-[11px] font-black text-red-600 mt-0.5">
                        {candidateConfig.symbol?.name || 'মার্কা'}
                      </span>
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Live Election Countdown Box */}
            {candidateConfig.show_countdown !== false && candidateConfig.sections?.countdown !== false && (
              <div className="w-full max-w-md mt-6 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-xl text-center animate-fade-in">
                <div className="flex items-center justify-center gap-1.5 text-xs text-amber-300 font-bold uppercase tracking-wider mb-3">
                  <Clock className="w-3.5 h-3.5" />
                  <span>ভোট গ্রহণের বাকি সময় (কাউন্টডাউন)</span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-stone-900">
                  <div className="bg-white/95 rounded-xl p-2.5 shadow-inner">
                    <div className="text-2xl sm:text-3xl font-extrabold text-[#064e3b] font-outfit">
                      {toBengaliNumber(timeLeft.days)}
                    </div>
                    <div className="text-[11px] font-semibold text-stone-600 mt-0.5">দিন</div>
                  </div>
                  <div className="bg-white/95 rounded-xl p-2.5 shadow-inner">
                    <div className="text-2xl sm:text-3xl font-extrabold text-[#064e3b] font-outfit">
                      {toBengaliNumber(timeLeft.hours)}
                    </div>
                    <div className="text-[11px] font-semibold text-stone-600 mt-0.5">ঘণ্টা</div>
                  </div>
                  <div className="bg-white/95 rounded-xl p-2.5 shadow-inner">
                    <div className="text-2xl sm:text-3xl font-extrabold text-[#064e3b] font-outfit">
                      {toBengaliNumber(timeLeft.minutes)}
                    </div>
                    <div className="text-[11px] font-semibold text-stone-600 mt-0.5">মিনিট</div>
                  </div>
                  <div className="bg-white/95 rounded-xl p-2.5 shadow-inner">
                    <div className="text-2xl sm:text-3xl font-extrabold text-red-600 font-outfit animate-pulse">
                      {toBengaliNumber(timeLeft.seconds)}
                    </div>
                    <div className="text-[11px] font-semibold text-stone-600 mt-0.5">সেকেন্ড</div>
                  </div>
                </div>

                <p className="text-[11px] text-emerald-200/80 mt-2.5">
                  {candidateConfig.electionDate 
                    ? (() => {
                        try {
                          const d = new Date(candidateConfig.electionDate);
                          const months = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
                          const bnNums = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
                          const toBn = (n) => n.toString().replace(/\d/g, (x) => bnNums[x]);
                          return `ভোটের দিন: ${toBn(d.getDate())} ${months[d.getMonth()]} ${toBn(d.getFullYear())} • সকাল ৮:০০ হতে বিকাল ৪:০০`;
                        } catch {
                          return 'তারিখ: ২৫ নভেম্বর ২০২৬ • সকাল ৮:০০ টা হতে বিকাল ৪:০০ টা পর্যন্ত';
                        }
                      })()
                    : 'তারিখ: ২৫ নভেম্বর ২০২৬ • সকাল ৮:০০ টা হতে বিকাল ৪:০০ টা পর্যন্ত'
                  }
                </p>
              </div>
            )}

          </div>

        </div>

        {/* Bottom Achievement Stats Strip (Dynamic on/off & dynamic data) */}
        {candidateConfig.sections?.stats !== false && candidateConfig.stats && candidateConfig.stats.length > 0 && (
          <div className="mt-14 pt-8 border-t border-emerald-700/50 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {candidateConfig.stats.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm text-left hover:bg-white/10 transition-colors">
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-outfit flex items-baseline gap-1">
                  <span>{item.value}</span>
                  <span className="text-xs sm:text-sm font-semibold text-emerald-200">{item.unit}</span>
                </div>
                <div className="text-xs sm:text-sm text-stone-200 mt-1 font-medium">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
