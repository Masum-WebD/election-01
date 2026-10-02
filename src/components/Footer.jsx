import React from 'react';
import { Phone, Mail, MapPin, MessageCircle, ArrowUp, ShieldCheck, Vote } from 'lucide-react';
import PineappleSymbol from './PineappleSymbol';

export default function Footer({ candidateConfig, sections = {} }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isSymbolVisible = candidateConfig.show_symbol !== false && sections.symbol !== false;
  const displayName = candidateConfig.candidate_short_name || candidateConfig.name;

  const footerLinks = [
    { key: 'hero', name: 'হোমপেজ ও কাউন্টডাউন', href: '#hero' },
    { key: 'bio', name: 'প্রার্থীর পরিচিতি ও অতীত রেকর্ড', href: '#bio' },
    { key: 'manifesto', name: '৫ দফা জনতার নির্বাচনী ইশতেহার', href: '#manifesto' },
    { key: 'poster_generator', name: 'ডিজিটাল পোস্টার জেনারেটর', href: '#poster-generator' },
    { key: 'grievance', name: 'নাগরিক অভিযোগ ও পরামর্শ বক্স', href: '#grievance' },
    { key: 'gallery', name: 'প্রচার চিত্র ও ভিডিও ভাষণ', href: '#gallery' },
    { key: 'testimonials', name: 'জনগণের সমর্থন ও অভিমত', href: '#testimonials' },
  ].filter(item => sections[item.key] !== false);

  return (
    <footer className="bg-[#043327] text-white pt-16 pb-12 border-t border-emerald-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-emerald-800/60">
          
          {/* Col 1: Candidate Identity (5 cols) */}
          <div className="lg:col-span-5 space-y-4 text-left">
            <div className="flex items-center gap-3">
              <div className="p-1 bg-white/10 rounded-full border-2 border-amber-400">
                {isSymbolVisible ? (
                  <PineappleSymbol 
                    className="w-10 h-10" 
                    customImage={candidateConfig.symbol?.image}
                    symbolName={candidateConfig.symbol?.name}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-emerald-800 flex items-center justify-center text-amber-300">
                    <Vote className="w-6 h-6" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white font-display">
                  {displayName}
                </h3>
                <p className="text-xs text-amber-300 font-semibold">
                  {candidateConfig.candidateRole} • {candidateConfig.unionName}
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-emerald-200/90 leading-relaxed font-light">
              "{candidateConfig.slogan}" – {candidateConfig.unionName}কে একটি দুর্নীতিমুক্ত, আধুনিক, নিরাপদ ও মডেল ইউনিয়ন পরিষদ হিসেবে গড়ে তোলাই আমাদের প্রধান অঙ্গীকার।
            </p>

            {/* Conditionally rendered Marka Badge */}
            {isSymbolVisible && (
              <div className="pt-2 flex items-center gap-3">
                <span className="bg-red-600 text-white font-bold text-xs px-3 py-1 rounded-md shadow">
                  {candidateConfig.symbol?.name || 'আনারস মার্কা'}
                </span>
                <span className="text-xs text-emerald-200">
                  নির্বাচন কমিশন কর্তৃক বরাদ্দকৃত প্রতীক
                </span>
              </div>
            )}
          </div>

          {/* Col 2: Quick Links (3 cols) */}
          <div className="lg:col-span-3 space-y-3 text-left">
            <h4 className="text-sm font-bold uppercase tracking-wider text-amber-300">
              নেভিগেশন লিংক
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-emerald-200">
              {footerLinks.map(link => (
                <li key={link.name}>
                  <a href={link.href} className="hover:text-white transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Contact & Central Campaign Office (4 cols) */}
          <div className="lg:col-span-4 space-y-3 text-left">
            <h4 className="text-sm font-bold uppercase tracking-wider text-amber-300">
              কেন্দ্রীয় নির্বাচনী কার্যালয়
            </h4>

            <div className="space-y-2.5 text-xs sm:text-sm text-emerald-200">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{candidateConfig.contacts.officeAddress}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`tel:${candidateConfig.contacts.phonePrimary}`} className="hover:text-white">
                  {candidateConfig.contacts.phonePrimary} (হটলাইন)
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-green-400 shrink-0" />
                <a href={candidateConfig.socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  WhatsApp: {candidateConfig.contacts.phonePrimary}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{candidateConfig.contacts.email}</span>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-emerald-300/70">
              সাক্ষাতের সময়: {candidateConfig.contacts.meetingTime}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-300/80">
          <div className="text-center sm:text-left">
            © {candidateConfig.electionYear} {candidateConfig.unionName} নির্বাচনী পরিচালনা কমিটি।
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>আচরণবিধি মেনে সুষ্ঠু প্রচার</span>
            </span>

            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white transition-all shadow"
              title="উপরে ফিরে যান"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
