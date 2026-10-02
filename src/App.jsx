import React, { useState, useEffect } from 'react';
import { candidateConfig as fallbackConfig } from './data/candidateConfig';
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
      if (data) {
        setCampaignData(data);
        if (data.sections && Object.keys(data.sections).length > 0) {
          setSections(data.sections);
        }
      }
    } catch (err) {
      console.warn('Data sync warning:', err);
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

  const handleScrollToPoster = () => {
    const el = document.getElementById('poster-generator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Determine whether election symbol (মার্কা) is enabled or disabled
  const isSymbolVisible = sections.symbol !== false && campaignData?.settings?.show_symbol !== false;

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

  // Merge live API settings with fallback config for maximum stability
  const mergedConfig = {
    ...fallbackConfig,
    sections,
    ...(campaignData?.settings ? {
      name: campaignData.settings.candidate_name || fallbackConfig.name,
      candidate_short_name: campaignData.settings.candidate_short_name || 'রফিকুল ইসলাম চৌধুরী',
      candidateRole: campaignData.settings.candidate_role || fallbackConfig.candidateRole,
      unionName: campaignData.settings.union_name || fallbackConfig.unionName,
      upazila: campaignData.settings.upazila || fallbackConfig.upazila,
      district: campaignData.settings.district || fallbackConfig.district,
      electionYear: campaignData.settings.election_year || fallbackConfig.electionYear,
      electionDate: campaignData.settings.election_date || fallbackConfig.electionDate,
      slogan: campaignData.settings.slogan || fallbackConfig.slogan,
      subSlogan: campaignData.settings.sub_slogan || fallbackConfig.subSlogan,
      show_symbol: isSymbolVisible,
      symbol: {
        ...fallbackConfig.symbol,
        name: campaignData.settings.symbol_name || fallbackConfig.symbol.name,
        image: resolveAssetUrl(campaignData.settings.symbol_image_path, null),
      },
      contacts: {
        ...fallbackConfig.contacts,
        phonePrimary: campaignData.settings.phone_primary || fallbackConfig.contacts.phonePrimary,
        phoneSecondary: campaignData.settings.phone_secondary || fallbackConfig.contacts.phoneSecondary,
        whatsapp: campaignData.settings.whatsapp || fallbackConfig.contacts.whatsapp,
        email: campaignData.settings.email || fallbackConfig.contacts.email,
        officeAddress: campaignData.settings.office_address || fallbackConfig.contacts.officeAddress,
      }
    } : {
      candidate_short_name: 'রফিকুল ইসলাম চৌধুরী',
      show_symbol: isSymbolVisible,
      symbol: {
        ...fallbackConfig.symbol,
        image: null,
      }
    }),
    assets: {
      ...fallbackConfig.assets,
      portrait: resolveAssetUrl(campaignData?.settings?.portrait_path, fallbackConfig.assets.portrait),
    },
    support_pledge_count: campaignData?.settings?.support_pledge_count || fallbackConfig.support_pledge_count || 12485,
    stats: (campaignData?.settings?.stats && Array.isArray(campaignData.settings.stats) && campaignData.settings.stats.length > 0)
      ? campaignData.settings.stats
      : fallbackConfig.stats,
    bio: campaignData?.settings?.bio_data || fallbackConfig.bio,
    manifesto: campaignData?.manifestos?.length > 0 ? campaignData.manifestos : fallbackConfig.manifesto,
    gallery: campaignData?.gallery?.length > 0 ? campaignData.gallery : fallbackConfig.gallery,
    videos: campaignData?.videos?.length > 0 ? campaignData.videos : fallbackConfig.videos,
    testimonials: campaignData?.endorsements?.length > 0 ? campaignData.endorsements : fallbackConfig.testimonials,
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
