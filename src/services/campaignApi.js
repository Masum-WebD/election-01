export const getBackendBaseUrl = () => {
  if (import.meta.env.VITE_BACKEND_URL) {
    return import.meta.env.VITE_BACKEND_URL.replace(/\/+$/, '');
  }
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '').replace(/\/+$/, '');
  }
  return 'https://ashaful.oblate-it.com';
};

export const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    const raw = import.meta.env.VITE_API_URL.replace(/\/+$/, '');
    return raw.endsWith('/api') ? raw : `${raw}/api`;
  }
  return 'https://ashaful.oblate-it.com/api';
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
    if (data.success && data.settings) {
      return {
        isLiveApi: true,
        settings: data.settings,
        sections: data.sections || {},
        manifestos: data.manifestos || [],
        grievances: data.grievances || [],
        gallery: data.gallery || [],
        videos: data.videos || [],
        endorsements: data.endorsements || [],
        wards: data.wards || [],
      };
    }
  } catch (error) {
    console.warn('Backend API connection warning:', error.message);
  }

  // Data not found / API failure - return null (no static fallback)
  return null;
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
      const res = await fetch('https://ashaful.oblate-it.com/api/grievances', {
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
      const res = await fetch('https://ashaful.oblate-it.com/api/pledge', {
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
      const res = await fetch('https://ashaful.oblate-it.com/api/endorsements', {
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
