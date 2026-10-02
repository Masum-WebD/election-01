import React, { useState, useEffect } from 'react';
import { 
  Send, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  Phone, 
  User, 
  Tag, 
  Clock, 
  Sparkles,
  Inbox,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { submitGrievanceApi } from '../services/campaignApi';

export default function GrievanceBox({ candidateConfig, initialGrievances = [] }) {
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    ward: '৩নং ওয়ার্ড (চরশাহী মধ্যপাড়া ও বাজার এলাকা)',
    village: '',
    phone: '',
    category: 'রাস্তাঘাট ও ড্রেনেজ',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedModalOpen, setSubmittedModalOpen] = useState(false);
  const [submissionReceipt, setSubmissionReceipt] = useState(null);

  // Initial Mock & Persisted Grievance Feed
  const [grievances, setGrievances] = useState(() => {
    if (initialGrievances && initialGrievances.length > 0) {
      return initialGrievances;
    }
    const saved = localStorage.getItem('up_grievance_list');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'UP-2026-1042',
        name: 'মোঃ আবুল কাশেম',
        village: 'বাঘমারা',
        ward: '১নং ওয়ার্ড',
        category: 'রাস্তাঘাট ও ড্রেনেজ',
        message: 'বাঘমারা প্রাথমিক বিদ্যালয় থেকে পূর্বপাড়ার কাঁচা রাস্তাটি বর্ষাকালে ডুবে যায়। শিক্ষার্থীদের যাতায়াতে খুব কষ্ট হয়। এটি পাকাকরণ একান্ত জরুরি।',
        date: '২৮ সেপ্টেম্বর ২০২৬',
        status: 'অগ্রাধিকার তালিকায় অন্তর্ভুক্ত'
      },
      {
        id: 'UP-2026-1039',
        name: 'হোসনে আরা বেগম',
        village: 'মিয়াপাড়া',
        ward: '২নং ওয়ার্ড',
        category: 'বয়স্ক ও বিধবা ভাতা',
        message: 'আমাদের গ্রামে অনেক প্রকৃত গরিব বয়স্ক মানুষ ভাতার কার্ড পাচ্ছেন না। দালাল ছাড়া যেন সরাসরি ভাতা বণ্টন করা হয় এই দাবি রইল।',
        date: '২৭ সেপ্টেম্বর ২০২৬',
        status: 'পর্যালোচনায় গৃহীত'
      },
      {
        id: 'UP-2026-1035',
        name: 'তৌহিদুল ইসলাম',
        village: 'চরশাহী বাজার',
        ward: '৩নং ওয়ার্ড',
        category: 'সোলার লাইট ও বিদ্যুৎ',
        message: 'বাজারের উত্তর দিকের ব্রিজের মোড়ে রাতে ঘুটঘুটে অন্ধকার থাকে। সেখানে ২টি সোলার লাইট স্থাপন করলে সাধারণ ব্যবসায়ী ও পথচারীরা উপকৃত হবেন।',
        date: '২৫ সেপ্টেম্বর ২০২৬',
        status: 'অগ্রাধিকার তালিকায় অন্তর্ভুক্ত'
      }
    ];
  });

  useEffect(() => {
    if (initialGrievances && initialGrievances.length > 0) {
      setGrievances(initialGrievances);
    }
  }, [initialGrievances]);

  const categories = [
    'রাস্তাঘাট ও ড্রেনেজ',
    'কৃষি ও সেচ সহায়তা',
    'সোলার লাইট ও বিদ্যুৎ',
    'সুপেয় পানি ও স্বাস্থ্যসম্মত স্যানিটেশন',
    'বয়স্ক, বিধবা ও প্রতিবন্ধী ভাতা',
    'আইনশৃঙ্খলা, সালিশ ও নিরাপত্তা',
    'যুব কর্মসংস্থান ও অন্যান্য'
  ];

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'অনুগ্রহ করে আপনার নাম লিখুন';
    if (!formData.village.trim()) newErrors.village = 'গ্রাম বা পাড়ার নাম উল্লেখ করুন';
    if (!formData.phone.trim()) {
      newErrors.phone = 'মোবাইল নম্বর প্রদান করুন';
    } else if (!/^(\+?88)?01[3-9]\d{8}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      newErrors.phone = 'সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017xxxxxxxx)';
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      newErrors.message = 'আপনার সমস্যা বা পরামর্শ বিস্তারিত লিখুন (কমপক্ষে ১০ অক্ষর)';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      // Call Laravel REST API
      const result = await submitGrievanceApi(formData);

      const receipt = result?.receipt || {
        id: `UP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        name: formData.name,
        category: formData.category,
        phone: formData.phone,
        ward: formData.ward.split(' ')[0],
        status: 'পর্যালোচনায় গৃহীত',
        date: 'আজকে'
      };

      const newEntry = {
        id: receipt.id,
        tracking_id: receipt.id,
        name: formData.name,
        village: formData.village,
        ward: formData.ward.split(' ')[0],
        category: formData.category,
        message: formData.message,
        date: 'আজকে',
        status: 'পর্যালোচনায় গৃহীত'
      };

      const updatedList = [newEntry, ...grievances];
      setGrievances(updatedList);
      localStorage.setItem('up_grievance_list', JSON.stringify(updatedList));

      setSubmissionReceipt(receipt);
      setSubmittedModalOpen(true);

      // Trigger celebratory mini confetti
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 }
      });

      // Reset form
      setFormData({
        name: '',
        ward: '৩নং ওয়ার্ড (চরশাহী মধ্যপাড়া ও বাজার এলাকা)',
        village: '',
        phone: '',
        category: 'রাস্তাঘাট ও ড্রেনেজ',
        message: ''
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="grievance" className="py-16 sm:py-24 bg-white text-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-100 text-red-800 text-xs sm:text-sm font-bold mb-3 border border-red-300">
            <MessageSquare className="w-4 h-4 text-red-600" />
            <span>জনগণের সরাসরি দরবার</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#064e3b] font-display">
            জনতার অভিযোগ ও উন্নয়ন পরামর্শ বক্স
          </h2>
          <p className="mt-3 text-stone-600 text-base sm:text-lg leading-relaxed">
            চরশাহীর যে কোনো ওয়ার্ডের সমস্যা, অবহেলিত রাস্তাঘাট কিংবা জরুরি দাবি সরাসরি চেয়ারম্যান পদপ্রার্থীর নিকট পৌঁছান। প্রতিটি পরামর্শ ডাটাবেজে সংরক্ষিত হয়ে গুরুত্বের সাথে বিবেচনা করা হবে।
          </p>
          <div className="mt-4 mx-auto w-24 h-1.5 bg-gradient-to-r from-emerald-600 via-amber-500 to-red-600 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Interactive Submission Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-stone-50 rounded-3xl p-6 sm:p-9 shadow-xl border border-stone-200">
              <div className="flex items-center gap-3 pb-5 mb-6 border-b border-stone-200">
                <div className="p-2.5 rounded-2xl bg-emerald-700 text-white shadow">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#064e3b] font-display">
                    আপনার সমস্যা বা দাবি লিখে পাঠান
                  </h3>
                  <p className="text-xs text-stone-500">
                    তথ্য Laravel ও MySQL ডাটাবেজে সংরক্ষিত হয় এবং প্রার্থীর মনিটরিং টিম যাচাই করে
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      আপনার পূর্ণ নাম *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="যেমন: মোঃ জসিম উদ্দিন"
                        className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
                          errors.name ? 'border-red-500 bg-red-50/20' : 'border-stone-300'
                        }`}
                      />
                    </div>
                    {errors.name && <p className="text-red-600 text-xs mt-1 font-semibold">{errors.name}</p>}
                  </div>

                  {/* Mobile Phone */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      মোবাইল নম্বর (যোগাযোগের জন্য) *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="০১৭১২-xxxxxx"
                        className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
                          errors.phone ? 'border-red-500 bg-red-50/20' : 'border-stone-300'
                        }`}
                      />
                    </div>
                    {errors.phone && <p className="text-red-600 text-xs mt-1 font-semibold">{errors.phone}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Ward Selection */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      ওয়ার্ড নং নির্বাচন করুন *
                    </label>
                    <select
                      value={formData.ward}
                      onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    >
                      {candidateConfig.wards?.map((w) => (
                        <option key={w.no} value={w.name}>
                          {w.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Village Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      গ্রাম বা পাড়ার নাম *
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        value={formData.village}
                        onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                        placeholder="যেমন: ফকির বাড়ি, পূর্ব চরশাহী"
                        className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
                          errors.village ? 'border-red-500 bg-red-50/20' : 'border-stone-300'
                        }`}
                      />
                    </div>
                    {errors.village && <p className="text-red-600 text-xs mt-1 font-semibold">{errors.village}</p>}
                  </div>
                </div>

                {/* Category Selection */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    বিষয়ের ধরন / ক্যাটাগরি
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: cat })}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                          formData.category === cat
                            ? 'bg-[#064e3b] text-white border-[#064e3b]'
                            : 'bg-white text-stone-600 border-stone-200 hover:border-emerald-300'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Problem Description */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    সমস্যা বা পরামর্শের বিস্তারিত বিবরণ *
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="আপনার এলাকার সমস্যা, রাস্তার অবস্থান বা যেকোনো জনকল্যাণমূলক পরামর্শ বিস্তারিতভাবে লিখুন..."
                    className={`w-full p-3.5 rounded-xl bg-white border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
                      errors.message ? 'border-red-500 bg-red-50/20' : 'border-stone-300'
                    }`}
                  />
                  {errors.message && <p className="text-red-600 text-xs mt-1 font-semibold">{errors.message}</p>}
                </div>

                {/* Submit CTA */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-xl bg-[#064e3b] hover:bg-[#043327] text-white font-extrabold text-base shadow-lg hover:shadow-emerald-950/30 transition-all flex items-center justify-center gap-2 transform active:scale-95 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4 text-amber-400" />
                    <span>{isSubmitting ? 'প্রেরণ করা হচ্ছে...' : 'পরামর্শ / অভিযোগ জমা দিন'}</span>
                  </button>
                </div>
              </form>

            </div>
          </div>

          {/* Right Column: Recent Public Petitions Feed (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="bg-stone-50 rounded-3xl p-6 sm:p-7 shadow-lg border border-stone-200">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-200">
                <div className="flex items-center gap-2">
                  <Inbox className="w-5 h-5 text-emerald-700" />
                  <h3 className="text-base sm:text-lg font-bold text-stone-900">
                    সাম্প্রতিক নাগরিক আবেদনসমূহ
                  </h3>
                </div>
                <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                  লাইভ ফিড
                </span>
              </div>

              {/* Grievances scrollable container */}
              <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
                {grievances.map((item, idx) => (
                  <div
                    key={item.id || item.tracking_id || idx}
                    className="p-4 rounded-2xl bg-white border border-stone-200/90 hover:border-emerald-300 shadow-sm transition-all text-left"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-xs font-extrabold text-stone-900 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-emerald-600" />
                        {item.name}
                      </span>
                      <span className="text-[10px] font-mono text-stone-400">
                        {item.tracking_id || item.id}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
                      <span className="bg-stone-100 px-2 py-0.5 rounded text-[11px] font-semibold text-stone-700">
                        {item.ward}
                      </span>
                      <span>•</span>
                      <span>{item.village}</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-medium">{item.category}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
                      "{item.message}"
                    </p>

                    <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
                      <span className="text-stone-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.date || 'সম্প্রতি'}
                      </span>
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {item.status || 'পর্যালোচনায় গৃহীত'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                ⭐ আপনার দাখিলকৃত পরামর্শ সরাসরি প্রার্থীর প্রতিদিনের পর্যালোচনা ফাইলে ও অ্যাডমিন প্যানেলে সংযুক্ত হবে।
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Submission Success Modal */}
      {submittedModalOpen && submissionReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border-2 border-emerald-500 relative animate-scale-up text-center">
            <button
              onClick={() => setSubmittedModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-2xl font-black text-[#064e3b] font-display">
              ধন্যবাদ, আপনার মতামত গৃহীত হয়েছে!
            </h3>

            <p className="text-sm text-stone-600 mt-2">
              আপনার দাখিলকৃত দাবিটি প্রার্থী আলহাজ্ব মো: রফিকুল ইসলাম চৌধুরীর নির্বাচনী ডাটাবেজে সফলভাবে সংরক্ষিত হয়েছে।
            </p>

            {/* Tracking Receipt Box */}
            <div className="my-6 p-4 rounded-2xl bg-stone-50 border border-stone-200 text-left space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between pb-1 border-b border-stone-200">
                <span className="text-stone-500 font-semibold">ট্র্যাকিং নম্বর:</span>
                <span className="font-mono font-bold text-red-600 text-base">{submissionReceipt.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">নাম:</span>
                <span className="font-bold text-stone-800">{submissionReceipt.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">বিষয়:</span>
                <span className="font-bold text-emerald-800">{submissionReceipt.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">মোবাইল:</span>
                <span className="font-bold text-stone-700">{submissionReceipt.phone}</span>
              </div>
            </div>

            <button
              onClick={() => setSubmittedModalOpen(false)}
              className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition"
            >
              ঠিক আছে
            </button>
          </div>
        </div>
      )}

    </section>
  );
}
