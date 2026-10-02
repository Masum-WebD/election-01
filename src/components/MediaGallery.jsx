import React, { useState } from 'react';
import { 
  Camera, 
  Video, 
  MapPin, 
  Calendar, 
  Play, 
  X, 
  ExternalLink, 
  Eye, 
  Image as ImageIcon,
  Sparkles
} from 'lucide-react';

export default function MediaGallery({ candidateConfig }) {
  const [activeFilter, setActiveFilter] = useState('সব');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const filterTabs = ['সব', 'উঠান বৈঠক', 'গণসংযোগ', 'ত্রাণ ও সমাজসেবা', 'যুব সমাবেশ'];

  const filteredPhotos = activeFilter === 'সব'
    ? candidateConfig.gallery
    : candidateConfig.gallery.filter((item) => item.category === activeFilter);

  return (
    <section id="gallery" className="py-16 sm:py-24 bg-stone-50 text-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-bold mb-3 border border-emerald-300">
            <Camera className="w-4 h-4 text-emerald-700" />
            <span>তৃণমূলের প্রচার ও সমাবেশ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#064e3b] font-display">
            প্রচার অ্যালবাম ও গুরুত্বপূর্ণ ভাষণ
          </h2>
          <p className="mt-3 text-stone-600 text-base sm:text-lg leading-relaxed">
            {candidateConfig.unionName || 'ইউনিয়ন'}-এর সাধারণ মানুষের সাথে প্রার্থীর প্রত্যক্ষ যোগাযোগ, গণসংযোগ ও উঠান বৈঠকের খণ্ডচিত্র।
          </p>
          <div className="mt-4 mx-auto w-24 h-1.5 bg-gradient-to-r from-emerald-600 via-amber-500 to-red-600 rounded-full"></div>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-10">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 border ${
                activeFilter === tab
                  ? 'bg-[#064e3b] text-white border-[#064e3b] shadow-md transform -translate-y-0.5'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-emerald-300 hover:bg-stone-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Photo Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8">
          {filteredPhotos.map((item) => {
            const photoSrc = item.image_url || item.image || '/assets/candidate_portrait.jpg';
            const photoDate = item.date_text || item.date || '২০২৬';
            return (
              <div
                key={item.id}
                onClick={() => setSelectedPhoto({ ...item, image: photoSrc, date: photoDate })}
                className="group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl border border-stone-200 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-stone-900">
                  <img
                    src={photoSrc}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = '/assets/candidate_portrait.jpg';
                    }}
                  />
                  
                  {/* Overlay Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-[#064e3b]/90 backdrop-blur-sm text-white text-xs font-bold border border-emerald-400/40">
                      {item.category}
                    </span>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                    <span className="inline-flex items-center gap-1.5 text-xs text-amber-300 font-bold bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-md">
                      <Eye className="w-3.5 h-3.5" />
                      বড় করে দেখুন
                    </span>
                  </div>
                </div>

                <div className="p-5 sm:p-6 text-left">
                  <div className="flex items-center gap-3 text-xs text-stone-500 mb-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-red-500" />
                      {item.location}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      {photoDate}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-stone-900 group-hover:text-emerald-800 transition-colors font-display">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Video Speeches Section */}
        <div className="mt-16 pt-12 border-t border-stone-200">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 rounded-2xl bg-red-600 text-white shadow">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[#064e3b] font-display">
                ক্যাম্পেইনের ভিডিও ভাষণ ও প্রেস ব্রিফিং
              </h3>
              <p className="text-xs sm:text-sm text-stone-500">
                জনসভায় প্রার্থীর সরাসরি বক্তব্য ও উন্নয়ন দিকনির্দেশনা
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(candidateConfig.videos || []).map((vid) => {
              const videoThumb = vid.youtube_id 
                ? `https://img.youtube.com/vi/${vid.youtube_id}/hqdefault.jpg`
                : candidateConfig.assets?.rallyPhoto;

              return (
                <div
                  key={vid.id}
                  onClick={() => setSelectedVideo(vid)}
                  className="bg-white rounded-3xl p-5 sm:p-6 shadow-lg border border-stone-200 hover:border-red-400 transition-all cursor-pointer group text-left"
                >
                  <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-stone-900 mb-4 shadow-inner">
                    <img
                      src={videoThumb}
                      alt={vid.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                      onError={(e) => {
                        e.target.src = candidateConfig.assets?.rallyPhoto;
                      }}
                    />
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                      <div className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 fill-white ml-1" />
                      </div>
                    </div>

                    <div className="absolute bottom-3 right-3 bg-black/80 text-white text-[11px] font-bold px-2 py-0.5 rounded">
                      {vid.duration}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
                    <span className="font-semibold text-emerald-800">{vid.speaker}</span>
                    <span>{vid.views_text || vid.views || '১০,০০০+ ভিউজ'}</span>
                  </div>

                  <h4 className="text-base font-bold text-stone-900 group-hover:text-red-700 transition-colors line-clamp-2">
                    {vid.title}
                  </h4>

                  <p className="text-xs text-stone-600 mt-2 line-clamp-2">
                    {vid.summary}
                  </p>
                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* Photo Lightbox Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/60 text-white hover:bg-black transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-[16/10] w-full bg-black">
              <img
                src={selectedPhoto.image}
                alt={selectedPhoto.title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="p-6 text-left">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                {selectedPhoto.category}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-stone-900 mt-2 font-display">
                {selectedPhoto.title}
              </h3>
              <p className="text-sm text-stone-600 mt-1 leading-relaxed">
                {selectedPhoto.description}
              </p>
              <div className="flex items-center gap-4 text-xs text-stone-500 mt-4 pt-3 border-t border-stone-200">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-red-500" />
                  {selectedPhoto.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  {selectedPhoto.date}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Modal Player with real YouTube Embed */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-stone-950 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-stone-800 relative text-white">
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/20 text-white hover:bg-white/40 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative aspect-video w-full bg-black">
              {selectedVideo.youtube_id ? (
                <iframe 
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${selectedVideo.youtube_id}?autoplay=1`} 
                  title={selectedVideo.title} 
                  frameborder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowfullscreen
                ></iframe>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl mb-3">
                    <Play className="w-8 h-8 fill-white ml-1" />
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold text-white max-w-xl">
                    {selectedVideo.title}
                  </h4>
                </div>
              )}
            </div>

            <div className="p-6 text-left bg-stone-900">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-400">{selectedVideo.speaker}</span>
                <span className="text-xs text-stone-400">{selectedVideo.duration} • {selectedVideo.views_text || selectedVideo.views || '১০,০০০+ ভিউজ'}</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-2">
                {selectedVideo.title}
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                {selectedVideo.summary}
              </p>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
