import React, { useState } from 'react';
import { Quote, Star, ThumbsUp, Heart, UserPlus, CheckCircle2, Shield } from 'lucide-react';
import PineappleSymbol from './PineappleSymbol';

export default function Endorsements({ candidateConfig }) {
  const [endorsements, setEndorsements] = useState(candidateConfig.testimonials);
  const [modalOpen, setModalOpen] = useState(false);
  const [newEndorsement, setNewEndorsement] = useState({
    name: '',
    village: '',
    profession: '',
    quote: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleAddEndorsement = (e) => {
    e.preventDefault();
    if (!newEndorsement.name.trim() || !newEndorsement.quote.trim()) return;

    const entry = {
      id: Date.now(),
      name: newEndorsement.name,
      title: newEndorsement.profession || 'সচেতন ইউনিয়নবাসী',
      village: newEndorsement.village || 'চরশাহী ইউনিয়ন',
      image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      quote: newEndorsement.quote
    };

    setEndorsements([entry, ...endorsements]);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setModalOpen(false);
      setNewEndorsement({ name: '', village: '', profession: '', quote: '' });
    }, 1500);
  };

  return (
    <section id="testimonials" className="py-16 sm:py-24 bg-white text-stone-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-bold mb-3 border border-emerald-300">
            <ThumbsUp className="w-4 h-4 text-emerald-700" />
            <span>জনতার আস্থা ও কণ্ঠস্বর</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#064e3b] font-display">
            চরশাহীর সাধারণ মানুষ ও গুণীজনদের সমর্থন
          </h2>
          <p className="mt-3 text-stone-600 text-base sm:text-lg leading-relaxed">
            দলমত নির্বিশেষে বীর মুক্তিযোদ্ধা, আলেম-ওলামা, শিক্ষক, কৃষক ও যুবসমাজ কেন আনারস মার্কাকে সমর্থন করছেন।
          </p>
          <div className="mt-4 mx-auto w-24 h-1.5 bg-gradient-to-r from-emerald-600 via-amber-500 to-red-600 rounded-full"></div>
        </div>

        {/* Endorsements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {endorsements.map((item) => (
            <div
              key={item.id}
              className="bg-stone-50 rounded-3xl p-6 sm:p-8 border border-stone-200 hover:border-emerald-300 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative group"
            >
              <Quote className="w-10 h-10 text-emerald-600/20 absolute top-6 right-6 group-hover:text-emerald-600/40 transition-colors" />

              <div>
                {/* Quote text */}
                <p className="text-sm sm:text-base text-stone-700 font-medium leading-relaxed italic relative z-10">
                  "{item.quote}"
                </p>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-3.5 pt-6 mt-6 border-t border-stone-200/80">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-emerald-600 shadow-sm"
                />
                <div className="text-left">
                  <h4 className="text-base font-bold text-stone-900 group-hover:text-[#064e3b] transition-colors">
                    {item.name}
                  </h4>
                  <p className="text-xs text-emerald-800 font-semibold">
                    {item.title}
                  </p>
                  <p className="text-[11px] text-stone-500">
                    গ্রাম: {item.village}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Endorsement CTA Box */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#064e3b] to-[#0b5d3b] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="text-left space-y-1">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              আপনিও কি {candidateConfig.candidate_short_name || candidateConfig.name} ভাইয়ের সমর্থক?
            </span>
            <h3 className="text-xl sm:text-2xl font-black font-display">
              আপনার সমর্থন বার্তা ও শুভেচ্ছা বক্তব্য যুক্ত করুন
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
              {candidateConfig.unionName || 'ইউনিয়নের'} উন্নয়নে আপনার মতামত ও শুভকামনা অন্যান্য ভোটারদের অনুপ্রাণিত করবে।
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-sm shadow-lg whitespace-nowrap transition-transform transform hover:scale-105"
          >
            <UserPlus className="w-4 h-4" />
            <span>সমর্থন বার্তা লিখুন</span>
          </button>
        </div>

      </div>

      {/* Write Endorsement Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative">
            <h3 className="text-xl font-bold text-[#064e3b] font-display mb-1">
              আপনার সমর্থন বার্তা পাঠান
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              আপনার মতামত সংক্ষিপ্ত ও সুনির্দিষ্ট রাখুন।
            </p>

            {submitted ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
                <h4 className="text-lg font-bold text-emerald-900">ধন্যবাদ! আপনার বার্তা যুক্ত হয়েছে।</h4>
              </div>
            ) : (
              <form onSubmit={handleAddEndorsement} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">আপনার নাম *</label>
                  <input
                    type="text"
                    required
                    value={newEndorsement.name}
                    onChange={(e) => setNewEndorsement({ ...newEndorsement, name: e.target.value })}
                    placeholder="যেমন: হাজী মোঃ দেলোয়ার হোসেন"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">পেশা বা পরিচয়</label>
                    <input
                      type="text"
                      value={newEndorsement.profession}
                      onChange={(e) => setNewEndorsement({ ...newEndorsement, profession: e.target.value })}
                      placeholder="ব্যবসায়ী / কৃষক / শিক্ষক"
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">গ্রামের নাম</label>
                    <input
                      type="text"
                      value={newEndorsement.village}
                      onChange={(e) => setNewEndorsement({ ...newEndorsement, village: e.target.value })}
                      placeholder="যেমন: চরশাহী বাজার"
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">আপনার বক্তব্য বা সমর্থন বাণী *</label>
                  <textarea
                    rows={3}
                    required
                    value={newEndorsement.quote}
                    onChange={(e) => setNewEndorsement({ ...newEndorsement, quote: e.target.value })}
                    placeholder={`কেন আপনি ${candidateConfig.candidate_short_name || candidateConfig.name} ভাইকে যোগ্য মনে করেন...`}
                    className="w-full p-3 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-stone-300 text-stone-600 font-bold text-xs hover:bg-stone-50"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow"
                  >
                    বার্তা প্রকাশ করুন
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </section>
  );
}
