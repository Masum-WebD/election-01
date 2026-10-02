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
  MapPin,
  ExternalLink,
  ShieldCheck,
  Award
} from 'lucide-react';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import PineappleSymbol from './PineappleSymbol';

export default function PosterGenerator({ candidateConfig }) {
  // 3 Distinct Templates: 'classic_poster' | 'social_banner' | 'manifesto_handbill'
  const [template, setTemplate] = useState('classic_poster');
  
  // Color Mode: 'color' (রঙিন) | 'bw' (সাদা-কালো)
  const [colorMode, setColorMode] = useState('color');
  
  // Customizer fields
  const [supporterText, setSupporterText] = useState(`${candidateConfig.unionName || 'ইউনিয়ন'}-এর সর্বস্তরের সচেতন ভোটারবৃন্দ`);
  const [tagline, setTagline] = useState(candidateConfig.slogan || 'উন্নয়ন, সততা ও তারুণ্যের অঙ্গীকার – গড়বো মডেল ইউনিয়ন এবার');
  const [customAppeal, setCustomAppeal] = useState('দোয়া, সমর্থন ও মূল্যবান ভোট প্রার্থনা');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const posterRef = useRef(null);

  const isSymbolOn = candidateConfig.show_symbol !== false && candidateConfig.show_symbol !== 0 && candidateConfig.show_symbol !== '0';
  const candidatePortrait = candidateConfig.assets?.portrait || '/assets/candidate_portrait.jpg';
  const candidateSymbolImage = candidateConfig.symbol?.image || null;

  // Official portal link for QR code
  const QR_PORTAL_URL = 'https://ashrafultetulbariya.vercel.app/';

  // Candidate Manifesto points
  const manifestoList = (candidateConfig.manifesto && candidateConfig.manifesto.length > 0)
    ? candidateConfig.manifesto
    : [
        {
          badge: 'অবকাঠামো উন্নয়ন',
          headline: 'কাদামুক্ত ও সুগম সড়ক যোগাযোগ নিশ্চিতকরণ',
          points: ['ইউনিয়নের প্রধান ও শাখা কাঁচা রাস্তা পর্যায়ক্রমে পাকাকরণ ও ড্রেনেজ।']
        },
        {
          badge: 'কৃষি ও কৃষকবান্ধব',
          headline: 'কৃষকের ঘামের সঠিক মূল্যায়ন ও প্রযুক্তি সহায়তা',
          points: ['সরকারি সার, বীজ ও সেচ সুবিধা সরাসরি কৃষকের কাছে পৌঁছে দেওয়া।']
        },
        {
          badge: 'সুশাসন ও অধিকার',
          headline: 'ঘুষমুক্ত ও নিরপেক্ষ নাগরিক ওয়ান-স্টপ সেবা',
          points: ['দালালমুক্ত ডিজিটাল সনদ ও শতভাগ নিরপেক্ষ গ্রাম আদালত।']
        },
        {
          badge: 'যুব উন্নয়ন ও আইটি',
          headline: 'ইউনিয়ন ফ্রিল্যান্সিং ও আইটি ল্যাব স্থাপন',
          points: ['তরুণদের প্রযুক্তিনির্ভর কর্মসংস্থান ও ক্রীড়া সামগ্রী সহায়তা।']
        },
        {
          badge: 'শিক্ষা ও স্বাস্থ্যসেবা',
          headline: 'সার্বক্ষণিক ডাক্তার ও জরুরি ফ্রি অ্যাম্বুলেন্স সেবা',
          points: ['বিধবা, বয়স্ক ও প্রতিবন্ধী ভাতা বন্টনে স্বজনপ্রীতি বন্ধ।']
        }
      ];

  // Generate QR Code linking directly to https://ashrafultetulbariya.vercel.app/
  useEffect(() => {
    QRCode.toDataURL(
      QR_PORTAL_URL,
      {
        width: 160,
        margin: 1,
        color: {
          dark: colorMode === 'bw' ? '#000000' : '#064e3b',
          light: '#ffffff'
        }
      },
      (err, url) => {
        if (!err && url) {
          setQrCodeDataUrl(url);
        }
      }
    );
  }, [colorMode]);

  // Export Poster as High-Resolution PNG
  const handleDownload = async () => {
    if (!posterRef.current) return;
    setIsGenerating(true);
    setDownloadSuccess(false);

    try {
      const isDarkColor = colorMode === 'color' && template === 'social_banner';
      const canvas = await html2canvas(posterRef.current, {
        scale: 2.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: isDarkColor ? '#064e3b' : '#ffffff',
        logging: false
      });

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      const filename = `Poster_${candidateConfig.candidate_short_name || candidateConfig.name}_${template}_${colorMode}.png`;
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
      navigator.clipboard.writeText(QR_PORTAL_URL);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const isBw = colorMode === 'bw';

  return (
    <section id="poster-generator" className="py-16 sm:py-24 bg-stone-100 text-stone-900 border-t border-b border-stone-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs sm:text-sm font-bold mb-3 border border-amber-300">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>প্রিন্ট ও সোশ্যাল মিডিয়া রেডি</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#064e3b] font-display">
            ডিজিটাল নির্বাচনী পোস্টার জেনারেটর
          </h2>
          <p className="mt-3 text-stone-600 text-base sm:text-lg leading-relaxed">
            পছন্দের ৩টি ভিন্ন ডিজাইন থেকে বেছে নিন এবং প্রতিটি ডিজাইনকে রঙিন বা সাদা-কালো মোডে প্রিভিউ ও ডাউনলোড করুন।
          </p>
          <div className="mt-4 mx-auto w-24 h-1.5 bg-gradient-to-r from-emerald-600 via-amber-500 to-red-600 rounded-full"></div>
        </div>

        {/* Top Controls: 3 Design Tabs & Color Switcher */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3 sm:p-4 rounded-3xl shadow-sm border border-stone-200 mb-8 max-w-4xl mx-auto">
          
          {/* Design Selectors */}
          <div className="flex flex-wrap items-center justify-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setTemplate('classic_poster')}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer ${
                template === 'classic_poster'
                  ? 'bg-[#064e3b] text-white shadow-md'
                  : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              <Printer className="w-4 h-4" />
              <span>১. ক্লাসিক্যাল পোস্টার</span>
            </button>

            <button
              onClick={() => setTemplate('social_banner')}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer ${
                template === 'social_banner'
                  ? 'bg-[#064e3b] text-white shadow-md'
                  : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              <Palette className="w-4 h-4 text-amber-400" />
              <span>২. সোশ্যাল ব্যানার</span>
            </button>

            <button
              onClick={() => setTemplate('manifesto_handbill')}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer ${
                template === 'manifesto_handbill'
                  ? 'bg-[#064e3b] text-white shadow-md'
                  : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              <FileText className="w-4 h-4 text-amber-300" />
              <span>৩. ইশতেহার হ্যান্ডবিল</span>
            </button>
          </div>

          {/* Color Mode Switcher (রঙিন vs সাদা-কালো) */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-2xl border border-stone-300 shrink-0">
            <button
              onClick={() => setColorMode('color')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                colorMode === 'color'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>রঙিন</span>
            </button>
            <button
              onClick={() => setColorMode('bw')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                colorMode === 'bw'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>সাদা-কালো</span>
            </button>
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Customization Controls (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-7 shadow-lg border border-stone-200 space-y-5">
            <h3 className="font-extrabold text-lg text-stone-900 border-b border-stone-200 pb-3 flex items-center justify-between">
              <span>পোস্টার কাস্টমাইজার</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded ${isBw ? 'bg-stone-100 text-stone-800' : 'bg-emerald-50 text-emerald-700'}`}>
                {isBw ? 'সাদা-কালো মোড' : 'রঙিন মোড'}
              </span>
            </h3>

            {/* Slogan */}
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

            {/* Appeal */}
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

            {/* Supporter Credits */}
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

            {/* QR Code link display */}
            <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs space-y-1">
              <div className="flex items-center justify-between font-bold text-emerald-950">
                <span className="flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-emerald-700" />
                  <span>কিউআর কোড লিংক:</span>
                </span>
                <span className="text-[10px] text-emerald-700 font-mono">লাইভ পোর্টাল</span>
              </div>
              <p className="text-[11px] font-mono text-emerald-800 break-all">
                {QR_PORTAL_URL}
              </p>
            </div>

            {/* Marka status badge */}
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs">
              <span className="font-semibold text-stone-600">নির্বাচনী মার্কা প্রদর্শন:</span>
              <span className={`font-bold px-2 py-0.5 rounded ${isSymbolOn ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                {isSymbolOn ? `চালু (${candidateConfig.symbol?.name || 'মার্কা'})` : 'লুকানো / বন্ধ'}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2.5">
              <button
                onClick={handleDownload}
                disabled={isGenerating}
                className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-white font-extrabold text-sm shadow-md transition-all transform hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer ${
                  isBw ? 'bg-stone-900 hover:bg-black' : 'bg-emerald-800 hover:bg-emerald-900'
                }`}
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>পোস্টার প্রস্তুত হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>হাই-রেজোলিউশন PNG ডাউনলোড ({isBw ? 'সাদা-কালো' : 'রঙিন'})</span>
                  </>
                )}
              </button>

              <button
                onClick={handleCopyLink}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs border border-stone-300 transition-colors cursor-pointer"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'ওয়েবসাইট লিংক কপি হয়েছে!' : 'ওয়েবসাইট লিংক কপি করুন'}</span>
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
              className={`w-full max-w-[500px] shadow-2xl transition-all duration-300 select-none overflow-hidden ${
                isBw
                  ? 'bg-white text-black border-4 border-black p-5 sm:p-6'
                  : template === 'social_banner'
                  ? 'bg-gradient-to-b from-[#064e3b] via-[#095c46] to-[#043327] text-white border-4 border-amber-400 p-5 sm:p-6 rounded-3xl'
                  : 'bg-white text-stone-900 border-4 border-emerald-700 p-5 sm:p-6 rounded-3xl'
              }`}
            >

              {/* ========================================================== */}
              {/* DESIGN 1: CLASSICAL ELECTORAL POSTER WITH MANIFESTO        */}
              {/* ========================================================== */}
              {template === 'classic_poster' && (
                <div className={`space-y-3.5 p-3.5 text-center border-2 ${isBw ? 'border-black' : 'border-emerald-700 rounded-2xl bg-stone-50/40'}`}>
                  
                  {/* Top Bismillah */}
                  <div className={`text-xs font-serif font-bold pb-1 border-b ${isBw ? 'border-black text-black' : 'border-emerald-700 text-emerald-900'}`}>
                    বিস্‌মিল্লাহির রাহ্‌মানির রাহীম
                  </div>

                  {/* Top Header */}
                  <div>
                    <h4 className={`text-xs font-black uppercase tracking-wider ${isBw ? 'text-black' : 'text-emerald-800'}`}>
                      {candidateConfig.electionYear} ইউনিয়ন পরিষদ সাধারণ নির্বাচন
                    </h4>
                    <p className={`text-xs font-bold mt-0.5 ${isBw ? 'text-black' : 'text-stone-700'}`}>
                      {candidateConfig.unionName}, {candidateConfig.upazila}, {candidateConfig.district}
                    </p>
                  </div>

                  {/* Slogan Frame */}
                  <div className={`py-1.5 px-2 my-1 border-y-2 ${isBw ? 'border-black' : 'border-emerald-600 bg-emerald-50/60'}`}>
                    <p className={`text-xs sm:text-sm font-black italic ${isBw ? 'text-black' : 'text-emerald-950'}`}>
                      "{tagline}"
                    </p>
                  </div>

                  {/* Main Candidate Name */}
                  <div className="my-1.5">
                    <span className={`text-xs font-bold uppercase tracking-wide block mb-0.5 ${isBw ? 'text-black' : 'text-emerald-700'}`}>
                      {candidateConfig.candidateRole} পদে
                    </span>
                    <h1 className={`text-2xl sm:text-3xl font-black tracking-tight leading-tight ${isBw ? 'text-black' : 'text-[#064e3b]'}`}>
                      {candidateConfig.name}
                    </h1>
                    <p className={`text-xs font-black mt-1 ${isBw ? 'text-black' : 'text-red-600'}`}>
                      {customAppeal}
                    </p>
                  </div>

                  {/* Center Content: Photo and Symbol */}
                  <div className={`grid ${isSymbolOn ? 'grid-cols-2' : 'grid-cols-1'} gap-3 items-center my-2`}>
                    
                    {/* Candidate Photo */}
                    <div className="flex flex-col items-center justify-center">
                      <div className={`w-36 h-44 rounded-xl overflow-hidden border-2 shadow-sm relative ${isBw ? 'border-black bg-stone-100' : 'border-emerald-700 bg-emerald-950'}`}>
                        <img
                          src={candidatePortrait}
                          alt={candidateConfig.name}
                          className={`w-full h-full object-cover object-top ${isBw ? 'filter grayscale contrast-125' : ''}`}
                          onError={(e) => {
                            e.target.src = '/assets/candidate_portrait.jpg';
                          }}
                        />
                        <div className={`absolute bottom-0 inset-x-0 text-[11px] font-black py-0.5 ${isBw ? 'bg-black text-white' : 'bg-red-600 text-white'}`}>
                          {candidateConfig.candidate_short_name || candidateConfig.name}
                        </div>
                      </div>
                    </div>

                    {/* Symbol */}
                    {isSymbolOn && (
                      <div className="flex flex-col items-center justify-center space-y-1">
                        <div className={`p-2.5 bg-white rounded-xl border-2 flex flex-col items-center justify-center shadow-md ${isBw ? 'border-black' : 'border-amber-400'}`}>
                          <PineappleSymbol
                            className="w-20 h-24"
                            isMonochrome={isBw}
                            showStamp={false}
                            customImage={candidateSymbolImage}
                            symbolName={candidateConfig.symbol?.name}
                          />
                          <div className={`mt-1 px-3 py-0.5 font-black text-xs rounded flex items-center gap-1 shadow-xs ${isBw ? 'bg-black text-white' : 'bg-red-600 text-white'}`}>
                            <span className="text-base font-extrabold">✓</span>
                            <span>{candidateConfig.symbol?.name || 'মার্কা'}</span>
                          </div>
                        </div>
                        <span className={`text-xs font-black ${isBw ? 'text-black' : 'text-emerald-900'}`}>
                          মার্কায় আপনার ভোট দিন
                        </span>
                      </div>
                    )}
                  </div>

                  {/* MANIFESTO SECTION (ইশতেহারের মূল অঙ্গীকার) */}
                  <div className={`text-left p-2.5 rounded-xl border ${isBw ? 'border-black bg-stone-50' : 'border-emerald-300 bg-emerald-50/70'}`}>
                    <div className={`flex items-center gap-1 font-bold text-xs pb-1 border-b ${isBw ? 'border-black text-black' : 'border-emerald-300 text-emerald-900'}`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>উন্নয়নের মূল নির্বাচনী অঙ্গীকার ও ইশতেহার:</span>
                    </div>
                    <ul className={`mt-1.5 space-y-1 text-[11px] leading-tight ${isBw ? 'text-black font-semibold' : 'text-stone-800'}`}>
                      {manifestoList.slice(0, 4).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="font-extrabold">✓</span>
                          <span><strong>{item.badge}:</strong> {item.headline || item.title}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Supporter & QR Footer */}
                  <div className={`border-t-2 pt-2 text-[11px] font-bold flex items-center justify-between ${isBw ? 'border-black text-black' : 'border-emerald-700 text-stone-800'}`}>
                    <div className="text-left leading-tight">
                      <span>প্রচারে: {supporterText}</span>
                      <p className={`text-[9px] font-normal mt-0.5 ${isBw ? 'text-stone-700' : 'text-stone-500'}`}>
                        হটলাইন: {candidateConfig.contacts?.phonePrimary}
                      </p>
                    </div>
                    {qrCodeDataUrl && (
                      <div className="flex items-center gap-1.5 shrink-0 text-right">
                        <div className="text-[9px] leading-none text-right">
                          <span className="block font-black">অনলাইন পোর্টাল</span>
                          <span className="text-[8px] font-mono text-stone-500">স্ক্যান করুন</span>
                        </div>
                        <img src={qrCodeDataUrl} alt="QR Code" className={`w-10 h-10 border p-0.5 ${isBw ? 'border-black' : 'border-emerald-700 bg-white rounded'}`} />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ========================================================== */}
              {/* DESIGN 2: MODERN SOCIAL MEDIA BANNER WITH MANIFESTO        */}
              {/* ========================================================== */}
              {template === 'social_banner' && (
                <div className={`space-y-3.5 text-center ${isBw ? 'p-3 bg-white text-black' : ''}`}>
                  
                  {/* Top Pill Tag */}
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    isBw 
                      ? 'bg-stone-200 text-black border border-black' 
                      : 'bg-white/10 border border-amber-400/40 text-amber-300'
                  }`}>
                    <span>{candidateConfig.electionYear} নির্বাচন</span>
                    <span>•</span>
                    <span>{candidateConfig.unionName}</span>
                  </div>

                  {/* Slogan */}
                  <div className={`p-2.5 rounded-2xl ${
                    isBw 
                      ? 'bg-stone-100 border border-black text-black' 
                      : 'bg-white/10 backdrop-blur-md border border-white/20'
                  }`}>
                    <p className={`text-xs sm:text-sm font-bold italic ${isBw ? 'text-black' : 'text-amber-200'}`}>
                      "{tagline}"
                    </p>
                  </div>

                  {/* Candidate Name & Role */}
                  <div>
                    <span className={`text-xs font-semibold uppercase tracking-widest block ${isBw ? 'text-stone-700' : 'text-emerald-200'}`}>
                      {candidateConfig.candidateRole} পদে
                    </span>
                    <h1 className={`text-2xl sm:text-3xl font-extrabold font-display mt-0.5 ${isBw ? 'text-black' : 'text-white'}`}>
                      {candidateConfig.name}
                    </h1>
                    <p className={`text-xs font-bold mt-1 ${isBw ? 'text-black' : 'text-amber-300'}`}>
                      {customAppeal}
                    </p>
                  </div>

                  {/* Photos Grid */}
                  <div className={`grid ${isSymbolOn ? 'grid-cols-2' : 'grid-cols-1'} gap-3 items-center my-2`}>
                    
                    {/* Candidate Photo */}
                    <div className="flex flex-col items-center justify-center">
                      <div className={`w-36 h-44 rounded-2xl overflow-hidden shadow-xl relative ${
                        isBw 
                          ? 'border-2 border-black bg-stone-100' 
                          : 'border-3 border-amber-400 bg-emerald-950'
                      }`}>
                        <img
                          src={candidatePortrait}
                          alt={candidateConfig.name}
                          className={`w-full h-full object-cover object-top ${isBw ? 'filter grayscale contrast-125' : ''}`}
                          onError={(e) => {
                            e.target.src = '/assets/candidate_portrait.jpg';
                          }}
                        />
                        <div className={`absolute bottom-0 inset-x-0 text-[11px] font-black py-0.5 ${isBw ? 'bg-black text-white' : 'bg-red-600 text-white'}`}>
                          {candidateConfig.candidate_short_name || candidateConfig.name}
                        </div>
                      </div>
                    </div>

                    {/* Symbol */}
                    {isSymbolOn && (
                      <div className="flex flex-col items-center justify-center space-y-1">
                        <div className={`p-2.5 bg-white rounded-2xl border-2 flex flex-col items-center justify-center shadow-lg ${
                          isBw ? 'border-black' : 'border-amber-400'
                        }`}>
                          <PineappleSymbol
                            className="w-20 h-24"
                            isMonochrome={isBw}
                            showStamp={false}
                            customImage={candidateSymbolImage}
                            symbolName={candidateConfig.symbol?.name}
                          />
                          <div className={`mt-1 px-3 py-1 font-black text-xs rounded-lg shadow flex items-center gap-1 ${
                            isBw ? 'bg-black text-white' : 'bg-red-600 text-white'
                          }`}>
                            <span className="text-base font-extrabold">✓</span>
                            <span>{candidateConfig.symbol?.name || 'মার্কা'}</span>
                          </div>
                        </div>
                        <span className={`text-xs font-bold ${isBw ? 'text-black' : 'text-amber-300'}`}>
                          উন্নয়নের মার্কা
                        </span>
                      </div>
                    )}
                  </div>

                  {/* MANIFESTO CARD FOR SOCIAL BANNER */}
                  <div className={`text-left p-2.5 rounded-2xl border ${
                    isBw 
                      ? 'border-black bg-stone-50 text-black' 
                      : 'border-amber-400/30 bg-emerald-950/60 text-white'
                  }`}>
                    <div className="flex items-center justify-between pb-1 border-b border-white/20 text-xs font-bold">
                      <span className="flex items-center gap-1">
                        <ShieldCheck className={`w-3.5 h-3.5 ${isBw ? 'text-black' : 'text-amber-400'}`} />
                        <span>জনতার ইশতেহার ও অঙ্গীকার:</span>
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-extrabold ${isBw ? 'bg-black text-white' : 'bg-amber-400 text-stone-950'}`}>
                        ৫ দফা
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-1 text-[11px] pt-1.5">
                      {manifestoList.slice(0, 4).map((item, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 leading-tight">
                          <span className={`font-bold ${isBw ? 'text-black' : 'text-amber-300'}`}>•</span>
                          <span><strong>{item.badge}:</strong> {item.headline || item.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Footer Info */}
                  <div className={`pt-2.5 border-t flex items-center justify-between text-xs ${
                    isBw 
                      ? 'border-black text-black' 
                      : 'border-emerald-700/60 text-emerald-200'
                  }`}>
                    <div className="text-left truncate mr-2">
                      <span className="font-medium block truncate">সৌজন্যে: {supporterText}</span>
                      <span className="text-[10px] opacity-80 block truncate">হটলাইন: {candidateConfig.contacts?.phonePrimary}</span>
                    </div>
                    {qrCodeDataUrl && (
                      <div className="flex items-center gap-1.5 shrink-0">
                        <div className="text-[9px] text-right font-mono">
                          <span className="block font-bold">পোর্টাল</span>
                          <span className="text-[8px] opacity-75">স্ক্যান করুন</span>
                        </div>
                        <div className="p-0.5 bg-white rounded-lg shrink-0 border border-stone-300">
                          <img src={qrCodeDataUrl} alt="QR Code" className="w-9 h-9" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ========================================================== */}
              {/* DESIGN 3: CITIZEN MANIFESTO HANDBILL / LEAFLET             */}
              {/* ========================================================== */}
              {template === 'manifesto_handbill' && (
                <div className={`space-y-3.5 ${isBw ? 'text-black' : 'text-stone-800'}`}>
                  
                  {/* Top Header */}
                  <div className={`flex items-center justify-between border-b-2 pb-2 ${isBw ? 'border-black' : 'border-emerald-700'}`}>
                    <div>
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                        isBw ? 'bg-black text-white' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        অফিসিয়াল নির্বাচনী হ্যান্ডবিল
                      </span>
                      <h4 className="text-xs font-bold mt-1">
                        {candidateConfig.unionName}, {candidateConfig.upazila}
                      </h4>
                    </div>
                    {isSymbolOn && (
                      <div className={`flex items-center gap-1.5 px-2 py-1 rounded-xl border ${
                        isBw ? 'border-black bg-stone-100' : 'bg-amber-100 border-amber-300'
                      }`}>
                        <PineappleSymbol
                          className="w-7 h-7"
                          isMonochrome={isBw}
                          customImage={candidateSymbolImage}
                          symbolName={candidateConfig.symbol?.name}
                        />
                        <span className="text-xs font-bold">
                          {candidateConfig.symbol?.name}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Candidate Profile Strip */}
                  <div className={`flex items-center gap-3 p-2.5 rounded-2xl border ${
                    isBw ? 'bg-stone-50 border-black' : 'bg-stone-50 border-stone-200'
                  }`}>
                    <div className={`w-16 h-20 rounded-xl overflow-hidden border-2 shrink-0 ${
                      isBw ? 'border-black bg-stone-200' : 'border-emerald-600 bg-stone-200'
                    }`}>
                      <img
                        src={candidatePortrait}
                        alt={candidateConfig.name}
                        className={`w-full h-full object-cover object-top ${isBw ? 'filter grayscale contrast-125' : ''}`}
                        onError={(e) => {
                          e.target.src = '/assets/candidate_portrait.jpg';
                        }}
                      />
                    </div>
                    <div className="text-left min-w-0">
                      <h3 className={`font-extrabold text-base leading-tight ${isBw ? 'text-black' : 'text-emerald-950'}`}>
                        {candidateConfig.name}
                      </h3>
                      <p className={`text-xs font-bold mt-0.5 ${isBw ? 'text-black' : 'text-red-600'}`}>
                        {candidateConfig.candidateRole} ({candidateConfig.electionYear})
                      </p>
                      <p className="text-[11px] text-stone-600 mt-0.5 truncate">
                        "{tagline}"
                      </p>
                    </div>
                  </div>

                  {/* DETAILED 5-POINT MANIFESTO COMMITMENTS */}
                  <div className={`space-y-1.5 text-left text-xs p-3 rounded-2xl border ${
                    isBw ? 'border-black bg-stone-50' : 'bg-emerald-50/60 border-emerald-200'
                  }`}>
                    <div className={`font-bold pb-1 border-b flex items-center justify-between ${
                      isBw ? 'border-black text-black' : 'border-emerald-200 text-emerald-950'
                    }`}>
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className={`w-3.5 h-3.5 ${isBw ? 'text-black' : 'text-emerald-700'}`} />
                        <span>জনতার ৫ দফা অগ্রাধিকার নির্বাচনী ইশতেহার:</span>
                      </span>
                      <span className="text-[10px] font-mono opacity-80">{candidateConfig.electionYear}</span>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      {manifestoList.slice(0, 5).map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-[11px] leading-tight">
                          <span className={`w-4 h-4 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5 ${
                            isBw ? 'bg-black text-white' : 'bg-emerald-700 text-white'
                          }`}>
                            {idx + 1}
                          </span>
                          <div className="flex-1">
                            <span className="font-bold">{item.badge}: </span>
                            <span className="text-stone-700">{item.headline || item.title}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Leaflet Bottom Strip */}
                  <div className={`pt-2 border-t flex items-center justify-between text-[11px] ${
                    isBw ? 'border-black text-black' : 'border-stone-200 text-stone-600'
                  }`}>
                    <div>
                      <p className="font-bold">{customAppeal}</p>
                      <p className="text-[10px] mt-0.5">প্রচারে: {supporterText}</p>
                      <p className="text-[10px] mt-0.2">হটলাইন: {candidateConfig.contacts?.phonePrimary}</p>
                    </div>
                    {qrCodeDataUrl && (
                      <div className="text-center shrink-0">
                        <img 
                          src={qrCodeDataUrl} 
                          alt="QR Code" 
                          className={`w-11 h-11 border p-0.5 rounded ${isBw ? 'border-black' : 'border-stone-300'}`} 
                        />
                        <span className="text-[8px] text-stone-500 block mt-0.5 font-mono">পোর্টাল স্ক্যান</span>
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
