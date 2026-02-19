import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useUDLData } from '../contexts/UDLDataContext';
import { Film, Play, Globe, Layers, Grid3x3, Sparkles, Video } from 'lucide-react';
import FloatingNavigation from '../components/FloatingNavigation';
import Header from '../components/Header';
import { useUI } from '../contexts/UIContext';
import { useMemo } from 'react';

type VideoCategory = 'constellation' | 'network' | 'guideline';
type Lang = 'es' | 'en' | 'eu' | 'la';

interface VideoItem {
  id: string;
  title: string;
  subtitle: string;
  category: VideoCategory;
  lang: Lang;
  color: string;
  filename: string;
  format: string;
}

const LANG_LABELS: Record<Lang, string> = {
  es: 'Español',
  en: 'English',
  eu: 'Euskara',
  la: 'Latina',
};

const CATEGORY_INFO: Record<
  VideoCategory,
  { icon: typeof Film; label: string; description: string }
> = {
  constellation: {
    icon: Sparkles,
    label: 'Constelación',
    description: 'Mapa radial completo del marco UDL',
  },
  network: {
    icon: Layers,
    label: 'Redes',
    description: 'Exploración por red neuronal',
  },
  guideline: {
    icon: Grid3x3,
    label: 'Pautas',
    description: 'Clips cortos por pauta (formato social)',
  },
};

export default function Videos() {
  const { language, t } = useLanguage();
  const ui = useUI();
  const { udlData } = useUDLData();
  const [selectedCategory, setSelectedCategory] = useState<VideoCategory | 'all'>('all');
  const [selectedLang, setSelectedLang] = useState<Lang>(language as Lang);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  const breadcrumbItems = useMemo(
    () => [
      { label: '', href: '/', icon: undefined },
      { label: ui.dashboard, href: '/dashboard' },
      { label: ui.dashVideos, icon: Video },
    ],
    [ui.dashboard, ui.dashVideos]
  );

  // Build video catalog from UDL data
  const videos: VideoItem[] = [];
  const langs: Lang[] = ['es', 'en', 'eu', 'la'];

  // Constellation videos
  for (const lang of langs) {
    videos.push({
      id: `constellation-${lang}`,
      title: t(udlData.title),
      subtitle: `${CATEGORY_INFO.constellation.label} — ${LANG_LABELS[lang]}`,
      category: 'constellation',
      lang,
      color: '#8866cc',
      filename: `constellation/ConstellationMap-${lang}.mp4`,
      format: '1920×1080',
    });
  }

  // Network videos
  for (const network of udlData.networks) {
    for (const lang of langs) {
      videos.push({
        id: `network-${network.id}-${lang}`,
        title: t(network.principle.name),
        subtitle: `${t(network.name)} — ${LANG_LABELS[lang]}`,
        category: 'network',
        lang,
        color: network.color || '#666666',
        filename: `network/Network-${network.id}-${lang}.mp4`,
        format: '1920×1080',
      });
    }
  }

  // Guideline clips
  for (const network of udlData.networks) {
    for (const guideline of network.principle.guidelines) {
      for (const lang of langs) {
        videos.push({
          id: `guideline-${guideline.code}-${lang}`,
          title: t(guideline.name),
          subtitle: `${t(guideline.row)} — ${LANG_LABELS[lang]}`,
          category: 'guideline',
          lang,
          color: network.color || '#666666',
          filename: `guideline/Guideline-${guideline.code}-${lang}.mp4`,
          format: '1080×1080',
        });
      }
    }
  }

  // Filter
  const filteredVideos = videos.filter((v) => {
    if (selectedCategory !== 'all' && v.category !== selectedCategory) return false;
    if (v.lang !== selectedLang) return false;
    return true;
  });

  const categoryGroups =
    selectedCategory === 'all'
      ? (['constellation', 'network', 'guideline'] as VideoCategory[])
      : [selectedCategory];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header breadcrumbItems={breadcrumbItems} />

      {/* Filter Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-[72px] z-30 shadow-sm transition-all animate-in fade-in slide-in-from-top-4">
        <div className="container mx-auto px-6 py-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Film className="w-5 h-5 text-purple-600" />
              <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">
                {ui.dashVideos}
              </h2>
              <span className="px-2 py-0.5 bg-gray-100 text-gray-500 font-mono text-[10px] rounded border border-gray-200">
                {filteredVideos.length} vídeos
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Language filter */}
              <div className="flex items-center gap-1 bg-gray-50 border border-gray-100 rounded-xl p-1 shadow-inner">
                <Globe className="w-4 h-4 text-gray-400 ml-2" />
                {langs.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLang(lang)}
                    className={`px-3 py-1 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${
                      selectedLang === lang
                        ? 'bg-white shadow-md text-purple-600 border border-purple-100'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Category filter */}
              <div className="flex items-center gap-1 bg-gray-50 border border-gray-100 rounded-xl p-1 shadow-inner">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-1.5 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${
                    selectedCategory === 'all'
                      ? 'bg-white shadow-md text-gray-900 border border-gray-100'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  Todos
                </button>
                {(Object.keys(CATEGORY_INFO) as VideoCategory[]).map((cat) => {
                  const info = CATEGORY_INFO[cat];
                  const Icon = info.icon;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`flex items-center gap-2 px-4 py-1.5 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${
                        selectedCategory === cat
                          ? 'bg-white shadow-md text-gray-900 border border-gray-100'
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {info.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-6 py-8">
        {categoryGroups.map((cat) => {
          const catVideos = filteredVideos.filter((v) => v.category === cat);
          if (catVideos.length === 0) return null;
          const info = CATEGORY_INFO[cat];
          const Icon = info.icon;

          return (
            <section key={cat} className="mb-12">
              <div className="flex items-center gap-2 mb-4">
                <Icon className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-bold text-gray-800">{info.label}</h2>
                <span className="text-sm text-gray-400">{info.description}</span>
              </div>

              <div
                className={`grid gap-4 ${
                  cat === 'guideline'
                    ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                }`}
              >
                {catVideos.map((video) => (
                  <div
                    key={video.id}
                    className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                  >
                    {/* Video thumbnail / player area */}
                    <div
                      className="relative overflow-hidden"
                      style={{
                        aspectRatio: cat === 'guideline' ? '1 / 1' : '16 / 9',
                        background: `linear-gradient(135deg, ${video.color}15, ${video.color}08)`,
                      }}
                    >
                      {playingVideo === video.id ? (
                        <video
                          className="w-full h-full object-cover"
                          src={`${import.meta.env.BASE_URL}videos/${video.filename}`}
                          autoPlay
                          controls
                          onEnded={() => setPlayingVideo(null)}
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <div
                            className="w-16 h-16 rounded-full flex items-center justify-center border-2 mb-3 cursor-pointer hover:scale-110 transition-transform"
                            style={{
                              borderColor: video.color,
                              background: `${video.color}20`,
                            }}
                            onClick={() => setPlayingVideo(video.id)}
                          >
                            <Play className="w-7 h-7 ml-1" style={{ color: video.color }} />
                          </div>
                          <span className="text-sm font-bold" style={{ color: video.color }}>
                            {video.format}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-3">
                      <h3 className="font-semibold text-gray-800 text-sm leading-tight truncate">
                        {video.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{video.subtitle}</p>
                    </div>

                    {/* Color accent bar */}
                    <div
                      className="absolute top-0 left-0 w-full h-0.5"
                      style={{ background: video.color }}
                    />
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        {filteredVideos.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <Film className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-lg font-medium">No hay vídeos disponibles</p>
            <p className="text-sm mt-1">
              Ejecuta{' '}
              <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                cd video && npm run render:all
              </code>{' '}
              para generarlos
            </p>
          </div>
        )}
      </main>

      <FloatingNavigation currentPage="videos" printOrientation="landscape" />

      <style>{`
        .video-card-enter {
          animation: cardFadeIn 0.3s ease-out;
        }
        @keyframes cardFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
