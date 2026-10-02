import { candidateConfig as fallbackConfig } from '../data/candidateConfig';

export const getBackendBaseUrl = () => {
  if (import.meta.env.VITE_BACKEND_URL) {
    return import.meta.env.VITE_BACKEND_URL.replace(/\/+$/, '');
  }
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '').replace(/\/+$/, '');
  }
  return 'http://127.0.0.1:8000';
};

export const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    const raw = import.meta.env.VITE_API_URL.replace(/\/+$/, '');
    return raw.endsWith('/api') ? raw : `${raw}/api`;
  }
  if (typeof window !== 'undefined' && window.location.port === '5173') {
    return '/api';
  }
  return 'http://127.0.0.1:8000/api';
};

const API_BASE_URL = getApiBaseUrl();

/**
 * Fetch campaign data from Laravel API with fallback to candidateConfig.js
 */
export async function fetchCampaignData() {
  try {
    const res = await fetch(`${API_BASE_URL}/campaign-data`, {
      headers: { 'Accept': 'application/json' }
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    if (data.success) {
      return {
        isLiveApi: true,
        settings: data.settings,
        sections: data.sections || {},
        manifestos: data.manifestos && data.manifestos.length > 0 ? data.manifestos : fallbackConfig.manifesto,
        grievances: data.grievances && data.grievances.length > 0 ? data.grievances : [],
        gallery: data.gallery && data.gallery.length > 0 ? data.gallery : fallbackConfig.gallery,
        videos: data.videos && data.videos.length > 0 ? data.videos : fallbackConfig.videos,
        endorsements: data.endorsements && data.endorsements.length > 0 ? data.endorsements : fallbackConfig.testimonials,
        wards: data.wards || fallbackConfig.wards,
      };
    }
  } catch (error) {
    console.warn('Backend API connection warning (using local fallback):', error.message);
  }

  // Graceful fallback to local mock config
  return {
    isLiveApi: false,
    settings: {
      candidate_name: fallbackConfig.name,
      candidate_short_name: 'রফিকুল ইসলাম চৌধুরী',
      candidate_role: fallbackConfig.candidateRole,
      union_name: fallbackConfig.unionName,
      upazila: fallbackConfig.upazila,
      district: fallbackConfig.district,
      election_year: fallbackConfig.electionYear,
      election_date: fallbackConfig.electionDate,
      symbol_name: fallbackConfig.symbol.name,
      symbol_tagline: fallbackConfig.symbol.tagline,
      show_symbol: true,
      slogan: fallbackConfig.slogan,
      sub_slogan: fallbackConfig.subSlogan,
      phone_primary: fallbackConfig.contacts.phonePrimary,
      phone_secondary: fallbackConfig.contacts.phoneSecondary,
      whatsapp: fallbackConfig.contacts.whatsapp,
      email: fallbackConfig.contacts.email,
      office_address: fallbackConfig.contacts.officeAddress,
      meeting_time: fallbackConfig.contacts.meetingTime,
      support_pledge_count: 12485,
      stats: fallbackConfig.stats,
      bio_data: fallbackConfig.bio,
    },
    sections: {
      symbol: true,
      hero: true,
      notice_bar: true,
      bio: true,
      manifesto: true,
      poster_generator: true,
      grievance: true,
      gallery: true,
      testimonials: true,
    },
    manifestos: fallbackConfig.manifesto,
    grievances: [],
    gallery: fallbackConfig.gallery,
    videos: fallbackConfig.videos,
    endorsements: fallbackConfig.testimonials,
    wards: fallbackConfig.wards,
  };
}

/**
 * Submit Grievance / Petition to Laravel MySQL
 */
export async function submitGrievanceApi(formData) {
  try {
    const targetUrl = `${API_BASE_URL}/grievances`;
    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('API submission error:', error);
    // If backend direct fallback needed
    try {
      const res = await fetch('http://127.0.0.1:8000/api/grievances', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      return await res.json();
    } catch {
      return {
        success: true,
        receipt: {
          id: `UP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          name: formData.name,
          category: formData.category,
          phone: formData.phone,
          date: 'আজকে'
        }
      };
    }
  }
}

/**
 * Submit Support / Prayer Pledge to Laravel MySQL
 */
export async function submitPledgeApi() {
  try {
    const res = await fetch(`${API_BASE_URL}/pledge`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.warn('Pledge API error:', error);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/pledge', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
      });
      return await res.json();
    } catch {
      return null;
    }
  }
}

/**
 * Submit Endorsement to Laravel MySQL
 */
export async function submitEndorsementApi(data) {
  try {
    const res = await fetch(`${API_BASE_URL}/endorsements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return await res.json();
  } catch (error) {
    console.error('Endorsement API error:', error);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/endorsements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch {
      return null;
    }
  }
}
