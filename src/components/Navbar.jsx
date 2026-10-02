import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, Menu, X, Download, ChevronRight, Vote, CheckCircle2 } from 'lucide-react';
import PineappleSymbol from './PineappleSymbol';

export default function Navbar({ candidateConfig, sections = {}, onOpenPosterTab }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Symbol / Marka visibility switch (controlled from admin)
  const isSymbolVisible = sections.symbol !== false && candidateConfig.show_symbol !== false && candidateConfig.show_symbol !== 0 && candidateConfig.show_symbol !== '0';

  // Candidate short name instead of full name
  const candidateShortName = candidateConfig.candidate_short_name || candidateConfig.shortName || candidateConfig.name;

  // Streamlined primary nav options (reduced options for clean layout)
  const navCandidateLinks = [
    { key: 'hero', name: 'হোম', href: '#hero' },
    { key: 'manifesto', name: 'ইশতেহার', href: '#manifesto' },
    { key: 'grievance', name: 'অভিযোগ ও পরামর্শ', href: '#grievance' },
    { key: 'gallery', name: 'প্রচার চিত্র', href: '#gallery' },
  ];

  // Filter links dynamically based on section visibility
  const visibleNavLinks = navCandidateLinks.filter((link) => {
    return sections[link.key] !== false;
  });

  // Mobile menu items (can include bio & testimonials if enabled)
  const mobileNavLinks = [
    { key: 'hero', name: 'হোমপেজ', href: '#hero' },
    { key: 'bio', name: 'প্রার্থীর পরিচিতি', href: '#bio' },
    { key: 'manifesto', name: '৫ দফা ইশতেহার', href: '#manifesto' },
    { key: 'grievance', name: 'অভিযোগ ও উন্নয়ন বক্স', href: '#grievance' },
    { key: 'gallery', name: 'প্রচার চিত্র ও ভিডিও', href: '#gallery' },
    { key: 'testimonials', name: 'জনগণের সমর্থন বাণী', href: '#testimonials' },
  ].filter(link => sections[link.key] !== false);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#064e3b]/95 backdrop-blur-md shadow-lg py-2 sm:py-2.5 border-b border-emerald-800/40 text-white'
            : 'bg-gradient-to-b from-[#043327]/95 via-[#064e3b]/85 to-transparent py-3 sm:py-4 text-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Brand / Logo: Short Candidate Name + Conditional Marka Badge */}
            <a href="#hero" className="flex items-center gap-2.5 sm:gap-3 group min-w-0">
              <div className="relative p-1 sm:p-1.5 bg-white/10 rounded-full border border-amber-400/40 backdrop-blur-sm group-hover:scale-105 transition-transform shrink-0">
                {isSymbolVisible ? (
                  <PineappleSymbol 
                    className="w-8 h-8 sm:w-9 sm:h-9" 
                    customImage={candidateConfig.symbol?.image} 
                    symbolName={candidateConfig.symbol?.name} 
                  />
                ) : (
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-800/90 flex items-center justify-center text-amber-300">
                    <Vote className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                )}
              </div>

              <div className="text-left min-w-0">
                <div className="flex items-center gap-2">
                  {/* Candidate Short Name (Not Full Name) */}
                  <span className="font-extrabold text-base sm:text-lg md:text-xl tracking-tight text-white group-hover:text-amber-300 transition-colors truncate">
                    {candidateShortName}
                  </span>
                  
                  {/* Marka Badge (ONLY if on/off toggle is ON) */}
                  {isSymbolVisible && (
                    <span className="hidden sm:inline-flex items-center bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-xs animate-pulse shrink-0">
                      {candidateConfig.symbol?.name || 'আনারস মার্কা'}
                    </span>
                  )}
                </div>

                <p className="text-[11px] sm:text-xs text-emerald-200/90 font-medium truncate">
                  {candidateConfig.candidateRole} • {candidateConfig.unionName}
                </p>
              </div>
            </a>

            {/* Desktop Navigation Links (Reduced & Clean) */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {visibleNavLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="px-3 py-1.5 text-sm font-semibold rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-all whitespace-nowrap"
                >
                  {link.name}
                </a>
              ))}

              {/* Special Poster Button (only if poster_generator section is visible) */}
              {sections.poster_generator !== false && (
                <a
                  href="#poster-generator"
                  onClick={() => onOpenPosterTab && onOpenPosterTab()}
                  className="ml-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold text-xs sm:text-sm shadow-md transition-all transform hover:-translate-y-0.5 whitespace-nowrap"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>পোস্টার তৈরি</span>
                </a>
              )}
            </nav>

            {/* CTA Buttons (Desktop) */}
            <div className="hidden md:flex items-center gap-2 shrink-0">
              <a
                href={`tel:${candidateConfig.contacts.phonePrimary}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 hover:text-white text-xs font-semibold border border-emerald-600/40 transition-all"
                title="সরাসরি কল করুন"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>{candidateConfig.contacts.phonePrimary}</span>
              </a>

              <a
                href={candidateConfig.socialLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-green-600 hover:bg-green-500 text-white text-xs font-bold shadow-md hover:shadow-green-600/30 transition-all transform hover:scale-105"
                title="হোয়াটসঅ্যাপে যোগাযোগ করুন"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Mobile / Tablet Menu Buttons */}
            <div className="flex items-center gap-2 lg:hidden">
              <a
                href={`tel:${candidateConfig.contacts.phonePrimary}`}
                className="p-2 rounded-full bg-emerald-800 text-emerald-100"
                aria-label="Call Candidate"
              >
                <Phone className="w-4 h-4 text-amber-400" />
              </a>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white focus:outline-none"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-white" />}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Drawer (Responsive & Clean, with ZERO admin links) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden animate-fade-in" onClick={() => setMobileMenuOpen(false)}>
          <div 
            className="fixed top-0 right-0 w-4/5 max-w-sm h-full bg-[#064e3b] text-white p-6 shadow-2xl overflow-y-auto flex flex-col justify-between border-l border-emerald-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-4">
              
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-emerald-800">
                <div className="flex items-center gap-2.5">
                  {isSymbolVisible ? (
                    <PineappleSymbol 
                      className="w-8 h-8" 
                      customImage={candidateConfig.symbol?.image}
                      symbolName={candidateConfig.symbol?.name}
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-emerald-800 flex items-center justify-center text-amber-300">
                      <Vote className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <span className="font-extrabold text-base text-white block">
                      {candidateShortName}
                    </span>
                    {isSymbolVisible ? (
                      <span className="text-xs font-bold text-amber-300">
                        {candidateConfig.symbol?.name || 'আনারস মার্কা'}
                      </span>
                    ) : (
                      <span className="text-[11px] text-emerald-200">
                        {candidateConfig.unionName}
                      </span>
                    )}
                  </div>
                </div>

                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Dynamic Nav Links */}
              <div className="space-y-1">
                {mobileNavLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl text-emerald-100 hover:text-white hover:bg-emerald-800/70 font-semibold text-sm sm:text-base transition-colors"
                  >
                    <span>{link.name}</span>
                    <ChevronRight className="w-4 h-4 text-emerald-400" />
                  </a>
                ))}

                {sections.poster_generator !== false && (
                  <a
                    href="#poster-generator"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (onOpenPosterTab) onOpenPosterTab();
                    }}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold text-sm sm:text-base mt-2 shadow-sm"
                  >
                    <span className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      ডিজিটাল পোস্টার জেনারেটর
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Drawer Bottom Actions */}
            <div className="pt-6 border-t border-emerald-800/80 space-y-3">
              <a
                href={`tel:${candidateConfig.contacts.phonePrimary}`}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm border border-emerald-600/40"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>সরাসরি কল: {candidateConfig.contacts.phonePrimary}</span>
              </a>

              <a
                href={candidateConfig.socialLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-xs sm:text-sm shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp মেসেজ পাঠান</span>
              </a>

              <p className="text-center text-[11px] text-emerald-300/70 pt-1">
                © {candidateConfig.electionYear} {candidateConfig.unionName}
              </p>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
