import React, { useState, useEffect } from 'react';
import { fetchCampaignData, getBackendBaseUrl } from './services/campaignApi';
import Navbar from './components/Navbar';
import ElectionNoticeBar from './components/ElectionNoticeBar';
import Hero from './components/Hero';
import CandidateBio from './components/CandidateBio';
import Manifesto from './components/Manifesto';
import PosterGenerator from './components/PosterGenerator';
import GrievanceBox from './components/GrievanceBox';
import MediaGallery from './components/MediaGallery';
import Endorsements from './components/Endorsements';
import Footer from './components/Footer';
import { MessageCircle, Phone } from 'lucide-react';

export default function App() {
  const [campaignData, setCampaignData] = useState(null);
  const [sections, setSections] = useState({
    symbol: true,
    hero: true,
    notice_bar: true,
    bio: true,
    manifesto: true,
    poster_generator: true,
    grievance: true,
    gallery: true,
    testimonials: true,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load campaign settings & section visibility from Laravel API
  const loadData = async () => {
    try {
      const data = await fetchCampaignData();
      if (data && data.settings) {
        setCampaignData(data);
        if (data.sections && Object.keys(data.sections).length > 0) {
          setSections(data.sections);
        }
      } else {
        setCampaignData(null);
      }
    } catch (err) {
      console.warn('Data sync warning:', err);
      setCampaignData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Poll periodically every 10s to automatically reflect admin toggles in real-time
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Dynamically set Browser Tab Title according to Candidate Name & Union
  useEffect(() => {
    if (campaignData?.settings?.candidate_name) {
      const name = campaignData.settings.candidate_name;
      const role = campaignData.settings.candidate_role || 'চেয়ারম্যান পদপ্রার্থী';
      const union = campaignData.settings.union_name || '';
      document.title = union ? `${name} | ${role} | ${union}` : `${name} | ${role}`;
    }
  }, [campaignData]);

  const handleScrollToPoster = () => {
    const el = document.getElementById('poster-generator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 1. Loading State - Sleek, branded loading spinner (Never flashes old static data)
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#064e3b] text-white font-bengali">
        <div className="relative flex items-center justify-center mb-5">
          <div className="w-16 h-16 border-4 border-emerald-400/30 border-t-amber-400 rounded-full animate-spin"></div>
          <span className="absolute text-xl font-black text-amber-300">ভোট</span>
        </div>
        <h2 className="text-xl font-bold tracking-wide text-emerald-100">নির্বাচনী পোর্টাল লোড হচ্ছে...</h2>
        <p className="text-xs text-emerald-300/80 mt-1 font-light">অনুগ্রহ করে অপেক্ষা করুন</p>
      </div>
    );
  }

  // 2. Data Not Found State - If database has no data or server is down
  if (!campaignData || !campaignData.settings) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-100 text-stone-700 px-4 text-center font-bengali">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-stone-200">
          <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center font-bold text-2xl">
            ভোট
          </div>
          <h2 className="text-2xl font-black text-stone-800 font-display">কোনো তথ্য পাওয়া যায়নি</h2>
          <p className="text-sm text-stone-500 mt-2 leading-relaxed">
            সার্ভার থেকে নির্বাচনী তথ্য পাওয়া যায়নি। অনুগ্রহ করে ইন্টারনেট সংযোগ চেক করে পুনরায় রিলোড দিন।
          </p>
          <button
            onClick={() => { setIsLoading(true); loadData(); }}
            className="mt-6 px-6 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl shadow transition-all cursor-pointer"
          >
            পুনরায় চেষ্টা করুন
          </button>
        </div>
      </div>
    );
  }

  // Determine whether election symbol (মার্কা) is enabled or disabled
  const isSettingSymbolOn = campaignData?.settings?.show_symbol !== undefined 
    ? (campaignData.settings.show_symbol !== false && campaignData.settings.show_symbol !== 0 && campaignData.settings.show_symbol !== '0')
    : true;
  const isSectionSymbolOn = sections.symbol !== false && sections.symbol !== 0 && sections.symbol !== '0';
  const isSymbolVisible = isSectionSymbolOn && isSettingSymbolOn;

  // Determine whether election countdown (কাউন্টডাউন) is enabled or disabled
  const isSettingCountdownOn = campaignData?.settings?.show_countdown !== undefined
    ? (campaignData.settings.show_countdown !== false && campaignData.settings.show_countdown !== 0 && campaignData.settings.show_countdown !== '0')
    : true;
  const isSectionCountdownOn = sections.countdown !== false && sections.countdown !== 0 && sections.countdown !== '0';
  const isCountdownVisible = isSectionCountdownOn && isSettingCountdownOn;

  const resolveAssetUrl = (path, fallback = null) => {
    if (!path) return fallback;
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
      return path;
    }
    if (path.startsWith('/uploads') || path.startsWith('uploads/')) {
      const cleanPath = path.startsWith('/') ? path : `/${path}`;
      return `${getBackendBaseUrl()}${cleanPath}`;
    }
    return path;
  };

  // Purely dynamic campaign configuration from backend database
  const settings = campaignData.settings;
  const mergedConfig = {
    sections,
    name: settings.candidate_name || '',
    candidate_short_name: settings.candidate_short_name || settings.candidate_name || '',
    candidateRole: settings.candidate_role || 'চেয়ারম্যান পদপ্রার্থী',
    unionName: settings.union_name || '',
    upazila: settings.upazila || '',
    district: settings.district || '',
    electionYear: settings.election_year || '২০২৬',
    electionDate: settings.election_date || '',
    slogan: settings.slogan || '',
    subSlogan: settings.sub_slogan || '',
    show_symbol: isSymbolVisible,
    show_countdown: isCountdownVisible,
    symbol: {
      name: settings.symbol_name || 'মার্কা',
      tagline: settings.symbol_tagline || '',
      image: resolveAssetUrl(settings.symbol_image_path, null),
    },
    contacts: {
      phonePrimary: settings.phone_primary || '',
      phoneSecondary: settings.phone_secondary || '',
      whatsapp: settings.whatsapp || '',
      email: settings.email || '',
      officeAddress: settings.office_address || '',
      meetingTime: settings.meeting_time || '',
    },
    socialLinks: {
      facebook: settings.facebook || 'https://facebook.com',
      youtube: settings.youtube || 'https://youtube.com',
      whatsapp: settings.whatsapp ? `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}` : '',
    },
    assets: {
      portrait: resolveAssetUrl(settings.portrait_path, '/assets/candidate_portrait.jpg'),
      rallyPhoto: '/assets/campaign_rally.jpg',
      massContactPhoto: '/assets/mass_contact.jpg',
    },
    support_pledge_count: Number(settings.support_pledge_count) || 0,
    stats: Array.isArray(settings.stats) ? settings.stats : [],
    bio: settings.bio_data || {},
    manifesto: campaignData.manifestos || [],
    gallery: campaignData.gallery || [],
    videos: campaignData.videos || [],
    testimonials: campaignData.endorsements || [],
    wards: campaignData.wards || [],
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 font-bengali text-stone-900 selection:bg-emerald-700 selection:text-white">
      
      {/* 1. Sticky Navigation (Clean, reduced items, candidate short name, Marka on/off, NO admin links) */}
      <Navbar 
        candidateConfig={mergedConfig} 
        sections={sections}
        onOpenPosterTab={handleScrollToPoster} 
      />

      {/* Main Content: Conditionally rendered according to Section Settings */}
      <main className="flex-grow">
        
        {/* 2. Hero Section (Controlled by sections.hero) */}
        {sections.hero !== false && (
          <Hero candidateConfig={mergedConfig} />
        )}

        {/* 3. Voter Advisory Bar (Controlled by sections.notice_bar) */}
        {sections.notice_bar !== false && (
          <ElectionNoticeBar candidateConfig={mergedConfig} />
        )}

        {/* 4. Candidate Bio & Track Record (Controlled by sections.bio) */}
        {sections.bio !== false && (
          <CandidateBio candidateConfig={mergedConfig} />
        )}

        {/* 5. 5-Point Manifesto (Controlled by sections.manifesto) */}
        {sections.manifesto !== false && (
          <Manifesto candidateConfig={mergedConfig} />
        )}

        {/* 6. Dynamic Poster Generator (Controlled by sections.poster_generator) */}
        {sections.poster_generator !== false && (
          <PosterGenerator candidateConfig={mergedConfig} />
        )}

        {/* 7. Public Grievance Box (Controlled by sections.grievance) */}
        {sections.grievance !== false && (
          <GrievanceBox 
            candidateConfig={mergedConfig} 
            initialGrievances={campaignData?.grievances}
          />
        )}

        {/* 8. Media Gallery & Speeches (Controlled by sections.gallery) */}
        {sections.gallery !== false && (
          <MediaGallery candidateConfig={mergedConfig} />
        )}

        {/* 9. Endorsements & Voice of People (Controlled by sections.testimonials) */}
        {sections.testimonials !== false && (
          <Endorsements candidateConfig={mergedConfig} />
        )}

      </main>

      {/* 10. Footer */}
      <Footer candidateConfig={mergedConfig} sections={sections} />

      {/* Floating Action Buttons (Citizen Support & Helpline - ZERO Admin Buttons) */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-2.5">
        <a
          href={mergedConfig.socialLinks?.whatsapp || `https://wa.me/${mergedConfig.contacts?.whatsapp?.replace(/[^0-9]/g, '') || '8801712345678'}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-green-600 hover:bg-green-500 text-white shadow-xl flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 group relative"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 fill-white" />
        </a>

        <a
          href={`tel:${mergedConfig.contacts?.phonePrimary}`}
          className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-xl flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 group relative"
          aria-label="Direct Phone Call"
        >
          <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
        </a>
      </div>

    </div>
  );
}
