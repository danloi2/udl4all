import { useState, useMemo } from 'react';
import ActivitiesPDF from '../components/printPDF/ActivitiesPDF';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, BookOpen, ChevronRight } from 'lucide-react';
import { useUI } from '../contexts/UIContext';
import { useUDLData } from '../contexts/UDLDataContext';
import { useLanguage } from '../contexts/LanguageContext';
import Footer from '../components/Footer';
import Header from '../components/Header';
import pkg from '../../package.json';

import FloatingNavigation from '../components/FloatingNavigation';
import {
  NIVELES,
  AREAS_INFANTIL,
  AREAS_PRIMARIA,
  AREAS_ESO,
  BACHILLERATO_COMUNES,
  BACHILLERATO_MODALIDADES,
  AMBITOS_UNIVERSIDAD,
} from '../data/constants/constants';
import type { Activity } from '../types';

// Map level IDs to their areas
function getAreasForLevel(levelId: string) {
  switch (levelId) {
    case 'INF':
      return Object.values(AREAS_INFANTIL);
    case 'PRI':
      return Object.values(AREAS_PRIMARIA);
    case 'ESO':
      return Object.values(AREAS_ESO);
    case 'BAC': {
      const comunes = Object.values(BACHILLERATO_COMUNES);
      const modalidad = Object.values(BACHILLERATO_MODALIDADES).flatMap((m) => Object.values(m));
      return [...comunes, ...modalidad];
    }
    case 'UNI':
      return Object.values(AMBITOS_UNIVERSIDAD);
    default:
      return [];
  }
}

// Colors for levels
const levelColors: Record<string, string> = {
  INF: '#f59e0b',
  PRI: '#078743',
  ESO: '#295e86',
  BAC: '#831682',
  FPB: '#dc2626',
  EPA: '#6366f1',
  CGM: '#0891b2',
  CGS: '#7c3aed',
  UNI: '#1e293b',
};

type Step = 'level' | 'area' | 'activity';

export default function Activities() {
  const ui = useUI();
  const { udlIndex } = useUDLData();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>('level');
  const [selectedLevelId, setSelectedLevelId] = useState<string | null>(null);
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);

  // Extract raw grade/subject codes from activity JSON files
  const activityModules = useMemo(() => {
    const mods = import.meta.glob('../data/json/activities/**/*.json', { eager: true });
    return Object.values(mods).map((mod: any) => mod.default || mod);
  }, []);

  // Group activities by raw level code and subject code
  const groupedByLevel = useMemo(() => {
    const groups: Record<string, Record<string, Activity[]>> = {};
    activityModules.forEach((raw: any) => {
      const levelCode = raw.gradeLevel; // e.g. "INF"
      const areaCode = raw.subject; // e.g. "ARM"
      if (!groups[levelCode]) groups[levelCode] = {};
      if (!groups[levelCode][areaCode]) groups[levelCode][areaCode] = [];
      const activity = udlIndex.activities.get(raw.id);
      if (activity) groups[levelCode][areaCode].push(activity);
    });
    return groups;
  }, [activityModules, udlIndex.activities]);

  // Available levels (only those with activities)
  const availableLevels = useMemo(() => {
    return Object.values(NIVELES).filter((level) => groupedByLevel[level.id]);
  }, [groupedByLevel]);

  // Areas for current level that have activities
  const availableAreas = useMemo(() => {
    if (!selectedLevelId) return [];
    const levelGroup = groupedByLevel[selectedLevelId] || {};
    const allAreas = getAreasForLevel(selectedLevelId);
    return allAreas.filter((area) => levelGroup[area.id]?.length > 0);
  }, [selectedLevelId, groupedByLevel]);

  // Activities for current level + area
  const filteredActivities = useMemo(() => {
    if (!selectedLevelId || !selectedAreaId) return [];
    return groupedByLevel[selectedLevelId]?.[selectedAreaId] || [];
  }, [selectedLevelId, selectedAreaId, groupedByLevel]);

  const handleSelectLevel = (levelId: string) => {
    setSelectedLevelId(levelId);
    setSelectedAreaId(null);
    setStep('area');
  };

  const handleSelectArea = (areaId: string) => {
    setSelectedAreaId(areaId);
    setStep('activity');
  };

  const selectedLevel = selectedLevelId
    ? Object.values(NIVELES).find((l) => l.id === selectedLevelId)
    : null;

  const selectedArea = selectedAreaId
    ? getAreasForLevel(selectedLevelId || '').find((a) => a.id === selectedAreaId)
    : null;

  const currentColor = selectedLevelId ? levelColors[selectedLevelId] || '#475569' : '#475569';

  // Construct breadcrumbs for Header
  const breadcrumbItems = useMemo(() => {
    const items = [
      { label: '', href: '/', icon: undefined },
      { label: ui.dashboard, href: '/dashboard' },
      { label: ui.dashActivities || 'Actividades', href: '/activities' },
    ];

    if (selectedLevel) {
      items.push({
        label: t(selectedLevel.name),
        href: '#', // Or trigger step change
        icon: undefined,
      });
    }

    if (selectedArea) {
      items.push({
        label: t(selectedArea.name),
        href: '#',
        icon: undefined,
      });
    }

    return items;
  }, [selectedLevel, selectedArea, t, ui.dashActivities]);

  // Custom click handler for breadcrumbs could be passed if Header supported it,
  // but for now we rely on the visual breadcrumb in Header and the state management here.
  // Actually, standard Header links navigate. To support in-page state navigation via breadcrumbs would require more work on Header.
  // For now, simpler: Activity Browser uses the shared Header for consistency, but manages its own "back" flow via UI if needed,
  // OR we just use the step UI.

  // Let's rely on the step UI for navigation and shared Header for global branding/nav.

  return (
    <div className="ab">
      {/* Print View */}
      <div className="hidden print:block w-full bg-white">
        <ActivitiesPDF
          step={step}
          selectedLevelId={selectedLevelId}
          selectedAreaId={selectedAreaId}
          filteredActivities={filteredActivities}
          availableLevels={availableLevels}
          availableAreas={availableAreas}
          groupedByLevel={groupedByLevel}
        />
      </div>

      {/* Screen View */}
      <div className="contents print:hidden">
        <Header breadcrumbItems={breadcrumbItems} />

        {/* Content */}
        <div className="ab__content">
          <FloatingNavigation currentPage="activities" printOrientation="portrait" />
          {/* Internal Navigation / Title Area */}
          {/* Page Header (Branding) */}
          <div className="flex items-center gap-4 mb-8">
            <img src="logo.png" alt="" className="w-12 h-12 object-contain" />
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter leading-none">
              {ui.dashActivities || 'Actividades'}
            </h1>
          </div>

          {step !== 'level' && (
            <button
              onClick={() => {
                if (step === 'activity') {
                  setStep('area');
                  setSelectedAreaId(null);
                } else {
                  setStep('level');
                  setSelectedLevelId(null);
                }
              }}
              className="ab__back-btn"
              style={{ color: currentColor, borderColor: currentColor }}
            >
              <div className="flex items-center gap-1">
                <ChevronRight className="w-4 h-4 rotate-180" />
                <span>{step === 'activity' ? ui.abBackToAreas : ui.abBackToLevels}</span>
              </div>
            </button>
          )}

          <h2
            className="ab__step-title"
            style={{ color: step === 'level' ? '#64748b' : currentColor }}
          >
            {step === 'level' && ui.abSelectLevel}
            {step === 'area' && (
              <>
                <span className="opacity-50 font-normal">{t(selectedLevel?.name)}:</span>{' '}
                {ui.abSelectArea}
              </>
            )}
            {step === 'activity' && (
              <>
                <span className="opacity-50 font-normal">{t(selectedArea?.name)}:</span>{' '}
                {ui.abSelectActivity}
              </>
            )}
          </h2>

          {/* Step 1: Levels */}
          {step === 'level' && (
            <div className="ab__grid ab__grid--levels">
              {availableLevels.map((level) => {
                const color = levelColors[level.id] || '#475569';
                const count = Object.values(groupedByLevel[level.id] || {}).flat().length;
                return (
                  <button
                    key={level.id}
                    className="ab__card"
                    onClick={() => handleSelectLevel(level.id)}
                    style={
                      {
                        '--ab-color': color,
                        '--ab-gradient': `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
                      } as React.CSSProperties
                    }
                  >
                    <GraduationCap className="ab__card-icon" strokeWidth={1.5} />
                    <h2 className="ab__card-label">{t(level.name)}</h2>
                    <span className="ab__card-count">
                      {count} {ui.abActivitiesCount}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Step 2: Areas */}
          {step === 'area' && (
            <div className="ab__grid ab__grid--areas">
              {availableAreas.map((area) => {
                const count = groupedByLevel[selectedLevelId!]?.[area.id]?.length || 0;
                return (
                  <button
                    key={area.id}
                    className="ab__card"
                    onClick={() => handleSelectArea(area.id)}
                    style={
                      {
                        '--ab-color': currentColor,
                        '--ab-gradient': `linear-gradient(135deg, ${currentColor} 0%, ${currentColor}dd 100%)`,
                      } as React.CSSProperties
                    }
                  >
                    <BookOpen className="ab__card-icon" strokeWidth={1.5} />
                    <h2 className="ab__card-label">{t(area.name)}</h2>
                    <span className="ab__card-count">
                      {count} {ui.abActivitiesCount}
                    </span>
                  </button>
                );
              })}
              {availableAreas.length === 0 && <p className="ab__empty">{ui.abNoActivities}</p>}
            </div>
          )}

          {/* Step 3: Activities */}
          {step === 'activity' && (
            <div className="ab__list">
              {filteredActivities.map((activity, idx) => (
                <button
                  key={activity.id}
                  className="ab__activity"
                  onClick={() => navigate(`/detail/${activity.id}`)}
                  style={{ '--ab-color': currentColor } as React.CSSProperties}
                >
                  <div className="ab__activity-num" style={{ backgroundColor: currentColor }}>
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <div className="ab__activity-body">
                    <span className="ab__activity-code">{activity.code}</span>
                    <p className="ab__activity-title">{t(activity.title)}</p>
                  </div>
                  <ChevronRight className="ab__activity-arrow" />
                </button>
              ))}
              {filteredActivities.length === 0 && <p className="ab__empty">{ui.abNoActivities}</p>}
            </div>
          )}
        </div>

        <Footer />
      </div>

      <style>{`
        .ab {
          min-height: 100vh;
          background: #f8fafc;
          display: flex;
          flex-direction: column;
        }

        .ab__content {
          flex: 1;
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          box-sizing: border-box;
        }

        .ab__nav-area {
          margin-bottom: 3rem;
        }

        .ab__back-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.25rem 0.75rem;
          border: 1px solid;
          border-radius: 999px;
          background: white;
          font-weight: 700;
          font-size: 0.8rem;
          margin-bottom: 1.5rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .ab__back-btn:hover {
          transform: translateX(-2px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .ab__step-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: #64748b;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 2px solid currentColor;
          padding-bottom: 0.5rem;
          width: fit-content;
        }

        /* Grid for levels and areas */
        .ab__grid {
          display: grid;
          gap: 1.5rem;
        }

        .ab__grid--levels {
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        }

        .ab__grid--areas {
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        }

        /* Card */
        .ab__card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 2.5rem 1.5rem;
          border-radius: 24px;
          background: white;
          border: 2px solid #e2e8f0;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .ab__card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--ab-gradient);
          opacity: 0;
          transition: opacity 0.4s ease;
          border-radius: 22px;
        }

        .ab__card:hover {
          transform: translateY(-4px) scale(1.01);
          border-color: var(--ab-color);
          box-shadow: 0 16px 40px rgba(0,0,0,0.1), 0 0 0 1px var(--ab-color);
        }

        .ab__card:hover::before {
          opacity: 1;
        }

        .ab__card:hover .ab__card-icon,
        .ab__card:hover .ab__card-label,
        .ab__card:hover .ab__card-count {
          color: white;
          position: relative;
          z-index: 1;
        }

        .ab__card:active {
          transform: translateY(-1px) scale(0.99);
        }

        .ab__card-icon {
          width: 3.5rem;
          height: 3.5rem;
          color: var(--ab-color);
          margin-bottom: 1rem;
          transition: color 0.3s ease;
        }

        .ab__card-label {
          font-size: 1.25rem;
          font-weight: 800;
          color: #1e293b;
          margin: 0 0 0.5rem 0;
          transition: color 0.3s ease;
        }

        .ab__card-count {
          font-size: 0.8rem;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          transition: color 0.3s ease;
        }

        /* Activity list */
        .ab__list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-width: 900px;
        }

        .ab__activity {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding: 1.5rem;
          border-radius: 20px;
          background: white;
          border: 2px solid #e2e8f0;
          cursor: pointer;
          transition: all 0.25s ease;
          text-align: left;
        }

        .ab__activity:hover {
          border-color: var(--ab-color);
          box-shadow: 0 12px 32px rgba(0,0,0,0.08);
          transform: translateX(6px);
        }

        .ab__activity-num {
          width: 3.5rem;
          height: 3.5rem;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 1.25rem;
          color: white;
          flex-shrink: 0;
        }

        .ab__activity-body {
          flex: 1;
          min-width: 0;
        }

        .ab__activity-code {
          font-size: 0.75rem;
          font-weight: 800;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .ab__activity-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0.25rem 0 0 0;
          line-height: 1.3;
        }

        .ab__activity-arrow {
          width: 1.5rem;
          height: 1.5rem;
          color: #cbd5e1;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }

        .ab__activity:hover .ab__activity-arrow {
          color: var(--ab-color);
          transform: translateX(4px);
        }

        .ab__empty {
          text-align: center;
          color: #94a3b8;
          font-weight: 600;
          padding: 4rem;
          font-size: 1.1rem;
        }

        @media (max-width: 640px) {
          .ab__content {
            padding: 1.5rem;
          }
          .ab__grid--levels,
          .ab__grid--areas {
            grid-template-columns: 1fr;
          }
          .ab__card {
            padding: 1.5rem;
            border-radius: 16px;
          }
          .ab__activity {
            padding: 1rem;
            gap: 0.75rem;
            border-radius: 16px;
          }
          .ab__activity-num {
            width: 2.5rem;
            height: 2.5rem;
            font-size: 1rem;
            border-radius: 10px;
          }
          .ab__activity-title {
            font-size: 0.95rem;
          }
        }
      `}</style>
    </div>
  );
}
