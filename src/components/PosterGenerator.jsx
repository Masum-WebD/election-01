import React, { useState, useRef, useEffect } from 'react';
import { 
  Download, 
  Printer, 
  Share2, 
  Sparkles, 
  Check, 
  QrCode, 
  Layers,
  Copy,
  CheckCircle2,
  FileText,
  Palette,
  Phone,
  MapPin
} from 'lucide-react';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import PineappleSymbol from './PineappleSymbol';

export default function PosterGenerator({ candidateConfig }) {
  // 3 Templates: 'classic_bw' | 'modern_color' | 'leaflet_summary'
  const [template, setTemplate] = useState('classic_bw');
  
  // Customizer fields
  const [supporterText, setSupporterText] = useState('চরশাহী ইউনিয়নের সর্বস্তরের সচেতন ভোটারবৃন্দ');
  const [tagline, setTagline] = useState(candidateConfig.slogan || 'উন্নয়ন, সততা ও তারুণ্যের অঙ্গীকার – গড়বো মডেল ইউনিয়ন এবার');
  const [customAppeal, setCustomAppeal] = useState('দোয়া, সমর্থন ও মূল্যবান ভোট প্রার্থনা');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const posterRef = useRef(null);

  const isSymbolOn = candidateConfig.show_symbol !== false;
  const candidatePortrait = candidateConfig.assets?.portrait || '/assets/candidate_portrait.jpg';
  const candidateSymbolImage = candidateConfig.symbol?.image || null;

  // Generate QR Code linking to current website URL
  useEffect(() => {
    const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://charshahi-up-election.gov.bd';
    QRCode.toDataURL(
      currentUrl,
      {
        width: 130,
        margin: 1,
        color: {
          dark: template === 'classic_bw' ? '#000000' : '#064e3b',
          light: '#ffffff'
        }
      },
      (err, url) => {
        if (!err && url) {
          setQrCodeDataUrl(url);
        }
      }
    );
  }, [template]);

  // Export Poster as PNG
  const handleDownload = async () => {
    if (!posterRef.current) return;
    setIsGenerating(true);
    setDownloadSuccess(false);

    try {
      const canvas = await html2canvas(posterRef.current, {
        scale: 2.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: template === 'modern_color' ? '#064e3b' : '#ffffff',
        logging: false
      });

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      const filename = `Poster_${candidateConfig.candidate_short_name || candidateConfig.name}_${template}.png`;
      link.href = image;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (error) {
      console.error('Error generating poster canvas:', error);
      alert('পোস্টার ডাউনলোডে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  return (
    <section id="poster-generator" className="py-16 sm:py-24 bg-stone-100 text-stone-900 border-t border-b border-stone-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs sm:text-sm font-bold mb-3 border border-amber-300">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>প্রিন্ট ও সোশ্যাল মিডিয়া রেডি</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#064e3b] font-display">
            ডিজিটাল নির্বাচনী পোস্টার জেনারেটর
          </h2>
          <p className="mt-3 text-stone-600 text-base sm:text-lg leading-relaxed">
            এক ক্লিকেই ৩ ধরনের প্রফেশনাল নির্বাচনী ডিজাইন প্রিভিউ ও ডাউনলোড করুন।
          </p>
          <div className="mt-4 mx-auto w-24 h-1.5 bg-gradient-to-r from-emerald-600 via-amber-500 to-red-600 rounded-full"></div>
        </div>

        {/* 3 Template Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <button
            onClick={() => setTemplate('classic_bw')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-sm ${
              template === 'classic_bw'
                ? 'bg-stone-900 text-white ring-2 ring-stone-900 shadow-md scale-105'
                : 'bg-white text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Printer className="w-4 h-4" />
            <span>১. ক্লাসিক সাদা-কালো প্রেস প্রিন্ট</span>
          </button>

          <button
            onClick={() => setTemplate('modern_color')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-sm ${
              template === 'modern_color'
                ? 'bg-emerald-800 text-white ring-2 ring-emerald-600 shadow-md scale-105'
                : 'bg-white text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Palette className="w-4 h-4 text-amber-400" />
            <span>২. আধুনিক রঙিন সোশ্যাল ব্যানার</span>
          </button>

          <button
            onClick={() => setTemplate('leaflet_summary')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-sm ${
              template === 'leaflet_summary'
                ? 'bg-blue-800 text-white ring-2 ring-blue-600 shadow-md scale-105'
                : 'bg-white text-stone-700 hover:bg-stone-200'
            }`}
          >
            <FileText className="w-4 h-4 text-amber-300" />
            <span>৩. নির্বাচনী ইশতেহার লিফলেট</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Customization Controls (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-7 shadow-lg border border-stone-200 space-y-5">
            <h3 className="font-extrabold text-lg text-stone-900 border-b border-stone-200 pb-3 flex items-center justify-between">
              <span>পোস্টার কাস্টমাইজার</span>
              <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">লাইভ প্রিভিউ</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                নির্বাচনী অঙ্গীকার / স্লোগান
              </label>
              <textarea
                rows={2}
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                ভোট প্রার্থনার আহ্বান
              </label>
              <input
                type="text"
                value={customAppeal}
                onChange={(e) => setCustomAppeal(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                প্রচারণায় নিবেদক / সৌজন্যে
              </label>
              <input
                type="text"
                value={supporterText}
                onChange={(e) => setSupporterText(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            {/* Marka status badge */}
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs">
              <span className="font-semibold text-stone-600">নির্বাচনী মার্কা প্রদর্শন:</span>
              <span className={`font-bold px-2 py-0.5 rounded ${isSymbolOn ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                {isSymbolOn ? `চালু (${candidateConfig.symbol?.name || 'মার্কা'})` : 'লুকানো / বন্ধ'}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 space-y-2.5">
              <button
                onClick={handleDownload}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-sm shadow-md transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>পোস্টার প্রস্তুত হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>হাই-রেজোলিউশন PNG ডাউনলোড</span>
                  </>
                )}
              </button>

              <button
                onClick={handleCopyLink}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs border border-stone-300 transition-colors"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'ওয়েবসাইট লিঙ্ক কপি হয়েছে!' : 'ওয়েবসাইট লিঙ্ক শেয়ার করুন'}</span>
              </button>

              {downloadSuccess && (
                <div className="p-2.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold text-center animate-fade-in flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>পোস্টার সফলভাবে ডাউনলোড হয়েছে!</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Live Poster Canvas (8 cols) */}
          <div className="lg:col-span-8 flex justify-center overflow-x-auto pb-4">
            
            {/* The Actual Downloadable Poster Element */}
            <div 
              ref={posterRef}
              id="downloadable-poster"
              className={`w-full max-w-[500px] shadow-2xl transition-all duration-300 select-none ${
                template === 'classic_bw'
                  ? 'bg-white text-black border-4 border-black p-5 sm:p-6'
                  : template === 'modern_color'
                  ? 'bg-gradient-to-b from-[#064e3b] via-[#095c46] to-[#043327] text-white border-4 border-amber-400 p-5 sm:p-6 rounded-3xl'
                  : 'bg-white text-stone-900 border-4 border-emerald-700 p-5 sm:p-6 rounded-3xl shadow-xl'
              }`}
            >

              {/* TEMPLATE 1: CLASSIC B&W PRESS PRINT */}
              {template === 'classic_bw' && (
                <div className="space-y-4 border-2 border-black p-4 text-center">
                  
                  {/* Top Bismillah */}
                  <div className="text-xs font-serif font-bold text-black border-b border-black pb-1">
                    বিস্‌মিল্লাহির রাহ্‌মানির রাহীম
                  </div>

                  {/* Top Header */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-black">
                      {candidateConfig.electionYear} ইউনিয়ন পরিষদ সাধারণ নির্বাচন
                    </h4>
                    <p className="text-xs font-semibold text-black mt-0.5">
                      {candidateConfig.unionName}, {candidateConfig.upazila}, {candidateConfig.district}
                    </p>
                  </div>

                  {/* Slogan Frame */}
                  <div className="border-y-2 border-black py-1.5 my-1">
                    <p className="text-xs sm:text-sm font-black italic">
                      "{tagline}"
                    </p>
                  </div>

                  {/* Main Candidate Name */}
                  <div className="my-2">
                    <span className="text-xs font-bold text-black block mb-0.5">
                      {candidateConfig.candidateRole} পদে
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight leading-tight">
                      {candidateConfig.name}
                    </h1>
                    <p className="text-xs font-bold text-black mt-1">
                      {customAppeal}
                    </p>
                  </div>

                  {/* Center Content: Photo and (Optional) Symbol */}
                  <div className={`grid ${isSymbolOn ? 'grid-cols-2' : 'grid-cols-1'} gap-4 items-center my-3`}>
                    
                    {/* Candidate Photo */}
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-36 h-44 sm:w-40 sm:h-48 rounded-lg overflow-hidden border-2 border-black shadow-sm relative bg-stone-100">
                        <img
                          src={candidatePortrait}
                          alt={candidateConfig.name}
                          className="w-full h-full object-cover object-top filter grayscale contrast-150"
                          onError={(e) => {
                            e.target.src = '/assets/candidate_portrait.jpg';
                          }}
                        />
                        <div className="absolute bottom-0 inset-x-0 bg-black text-white text-[11px] font-black py-0.5">
                          {candidateConfig.candidate_short_name || candidateConfig.name}
                        </div>
                      </div>
                    </div>

                    {/* Symbol (Only if isSymbolOn is true) */}
                    {isSymbolOn && (
                      <div className="flex flex-col items-center justify-center space-y-1.5">
                        <div className="p-3 bg-white rounded-xl border-2 border-black flex flex-col items-center justify-center shadow-md">
                          <PineappleSymbol
                            className="w-20 h-24 sm:w-24 sm:h-28"
                            isMonochrome={true}
                            showStamp={false}
                            customImage={candidateSymbolImage}
                            symbolName={candidateConfig.symbol?.name}
                          />
                          <div className="mt-1 px-3 py-1 bg-black text-white font-black text-xs sm:text-sm rounded flex items-center gap-1">
                            <span className="text-base font-extrabold">✓</span>
                            <span>{candidateConfig.symbol?.name || 'মার্কা'}</span>
                          </div>
                        </div>
                        <span className="text-xs font-black text-black">
                          মার্কায় আপনার ভোট দিন
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Supporter Footer */}
                  <div className="border-t-2 border-black pt-2 text-[11px] font-bold text-black flex items-center justify-between">
                    <span>প্রচারে: {supporterText}</span>
                    {qrCodeDataUrl && (
                      <img src={qrCodeDataUrl} alt="QR Code" className="w-10 h-10 border border-black p-0.5" />
                    )}
                  </div>
                </div>
              )}

              {/* TEMPLATE 2: MODERN COLOR DIGITAL SOCIAL BANNER */}
              {template === 'modern_color' && (
                <div className="space-y-4 text-center">
                  
                  {/* Top Pill Tag */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-amber-400/40 text-amber-300 text-xs font-bold">
                    <span>{candidateConfig.electionYear} ইউনিয়ন পরিষদ সাধারণ নির্বাচন</span>
                    <span>•</span>
                    <span>{candidateConfig.unionName}</span>
                  </div>

                  {/* Election Slogan Box */}
                  <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                    <p className="text-xs sm:text-sm font-bold text-amber-200 italic">
                      "{tagline}"
                    </p>
                  </div>

                  {/* Candidate Name & Role */}
                  <div>
                    <span className="text-xs font-semibold text-emerald-200 uppercase tracking-widest block">
                      {candidateConfig.candidateRole} পদে
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display mt-0.5">
                      {candidateConfig.name}
                    </h1>
                    <p className="text-xs font-bold text-amber-300 mt-1">
                      {customAppeal}
                    </p>
                  </div>

                  {/* Photos Grid */}
                  <div className={`grid ${isSymbolOn ? 'grid-cols-2' : 'grid-cols-1'} gap-4 items-center my-3`}>
                    
                    {/* Candidate Photo */}
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-36 h-44 sm:w-40 sm:h-48 rounded-2xl overflow-hidden border-3 border-amber-400 shadow-xl relative bg-emerald-950">
                        <img
                          src={candidatePortrait}
                          alt={candidateConfig.name}
                          className="w-full h-full object-cover object-top"
                          onError={(e) => {
                            e.target.src = '/assets/candidate_portrait.jpg';
                          }}
                        />
                        <div className="absolute bottom-0 inset-x-0 bg-red-600 text-white text-[11px] font-black py-0.5">
                          {candidateConfig.candidate_short_name || candidateConfig.name}
                        </div>
                      </div>
                    </div>

                    {/* Symbol Card (Only if isSymbolOn is true) */}
                    {isSymbolOn && (
                      <div className="flex flex-col items-center justify-center space-y-1.5">
                        <div className="p-3 bg-white rounded-2xl border-2 border-amber-400 flex flex-col items-center justify-center shadow-lg">
                          <PineappleSymbol
                            className="w-20 h-24 sm:w-24 sm:h-28"
                            isMonochrome={false}
                            showStamp={false}
                            customImage={candidateSymbolImage}
                            symbolName={candidateConfig.symbol?.name}
                          />
                          <div className="mt-1 px-3 py-1 bg-red-600 text-white font-black text-xs sm:text-sm rounded-lg shadow flex items-center gap-1">
                            <span className="text-base font-extrabold">✓</span>
                            <span>{candidateConfig.symbol?.name || 'মার্কা'}</span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-amber-300">
                          উন্নয়নের মার্কা
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Bottom Footer Info */}
                  <div className="pt-3 border-t border-emerald-700/60 flex items-center justify-between text-xs text-emerald-200">
                    <span className="font-medium text-left truncate mr-2">সৌজন্যে: {supporterText}</span>
                    {qrCodeDataUrl && (
                      <div className="p-1 bg-white rounded-lg shrink-0">
                        <img src={qrCodeDataUrl} alt="QR Code" className="w-9 h-9" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TEMPLATE 3: CAMPAIGN LEAFLET / HANDBILL */}
              {template === 'leaflet_summary' && (
                <div className="space-y-4 text-stone-800">
                  
                  {/* Top Header */}
                  <div className="flex items-center justify-between border-b-2 border-emerald-700 pb-2">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        অফিসিয়াল হ্যান্ডবিল
                      </span>
                      <h4 className="text-xs font-bold text-stone-900 mt-1">
                        {candidateConfig.unionName}
                      </h4>
                    </div>
                    {isSymbolOn && (
                      <div className="flex items-center gap-1.5 bg-amber-100 border border-amber-300 px-2 py-1 rounded-xl">
                        <PineappleSymbol
                          className="w-7 h-7"
                          customImage={candidateSymbolImage}
                          symbolName={candidateConfig.symbol?.name}
                        />
                        <span className="text-xs font-bold text-stone-900">
                          {candidateConfig.symbol?.name}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Candidate Profile Strip */}
                  <div className="flex items-center gap-3 bg-stone-50 p-2.5 rounded-2xl border border-stone-200">
                    <div className="w-16 h-20 rounded-xl overflow-hidden border-2 border-emerald-600 shrink-0 bg-stone-200">
                      <img
                        src={candidatePortrait}
                        alt={candidateConfig.name}
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                          e.target.src = '/assets/candidate_portrait.jpg';
                        }}
                      />
                    </div>
                    <div className="text-left min-w-0">
                      <h3 className="font-extrabold text-base text-emerald-900 leading-tight">
                        {candidateConfig.name}
                      </h3>
                      <p className="text-xs font-bold text-red-600 mt-0.5">
                        {candidateConfig.candidateRole} ({candidateConfig.electionYear})
                      </p>
                      <p className="text-[11px] text-stone-500 mt-0.5 truncate">
                        "{candidateConfig.slogan}"
                      </p>
                    </div>
                  </div>

                  {/* 5-Point Manifesto Highlights */}
                  <div className="space-y-1.5 text-left text-xs bg-emerald-50/50 p-3 rounded-2xl border border-emerald-200">
                    <div className="font-bold text-emerald-950 pb-1 border-b border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>অগ্রাধিকার নির্বাচনী ৫ দফা ইশতেহার:</span>
                    </div>
                    <div className="grid grid-cols-1 gap-1 text-[11px] text-stone-700 pt-1">
                      <p>✓ টেকসই পাকা রাস্তাঘাট ও দ্রুত পানি নিষ্কাশন ড্রেনেজ</p>
                      <p>✓ প্রকৃত কৃষকদের সার, বীজ ও নিরবচ্ছিন্ন সেচ সহায়তা</p>
                      <p>✓ ঘুষমুক্ত, স্বচ্ছ ও নিরপেক্ষ ডিজিটাল গ্রাম আদালত</p>
                      <p>✓ তরুণদের জন্য ইউনিয়ন আইটি ও ফ্রিল্যান্সিং ল্যাব</p>
                      <p>✓ জরুরি স্বাস্থ্যসেবা ও অসহায় পরিবারের সামাজিক সুরক্ষা</p>
                    </div>
                  </div>

                  {/* Leaflet Bottom Strip */}
                  <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-600">
                    <div>
                      <p className="font-bold text-stone-900">{customAppeal}</p>
                      <p className="text-[10px] text-stone-500 mt-0.5">হটলাইন: {candidateConfig.contacts?.phonePrimary}</p>
                    </div>
                    {qrCodeDataUrl && (
                      <div className="text-center">
                        <img src={qrCodeDataUrl} alt="QR Code" className="w-10 h-10 border border-stone-300 p-0.5 rounded" />
                        <span className="text-[8px] text-stone-400 block mt-0.5">স্ক্যান করুন</span>
                      </div>
                    )}
                  </div>

                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
