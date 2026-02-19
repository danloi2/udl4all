import { useLanguage } from '../../contexts/LanguageContext';
import { useUI } from '../../contexts/UIContext';
import {
  NIVELES,
  AREAS_INFANTIL,
  AREAS_PRIMARIA,
  AREAS_ESO,
  BACHILLERATO_COMUNES,
  BACHILLERATO_MODALIDADES,
  AMBITOS_UNIVERSIDAD,
} from '../../data/constants/constants';
import type { Activity } from '../../types';
import { GraduationCap, BookOpen, ChevronRight } from 'lucide-react';
import pkg from '../../../package.json';

// Helper to get areas (duplicated from Activities.tsx)
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

// Colors for levels (duplicated from Activities.tsx)
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

interface ActivitiesPDFProps {
  step: 'level' | 'area' | 'activity';
  selectedLevelId: string | null;
  selectedAreaId: string | null;
  filteredActivities: Activity[];
  availableLevels: (typeof NIVELES)[keyof typeof NIVELES][];
  availableAreas: { id: string; name: any }[];
  groupedByLevel: Record<string, Record<string, Activity[]>>;
}

export default function ActivitiesPDF({
  step,
  selectedLevelId,
  selectedAreaId,
  filteredActivities,
  availableLevels,
  availableAreas,
  groupedByLevel,
}: ActivitiesPDFProps) {
  const { t } = useLanguage();
  const ui = useUI();

  const selectedLevel = selectedLevelId
    ? Object.values(NIVELES).find((l) => l.id === selectedLevelId)
    : null;

  const selectedArea = selectedAreaId
    ? getAreasForLevel(selectedLevelId || '').find((a) => a.id === selectedAreaId)
    : null;

  return (
    <div className="w-full bg-white text-black p-8">
      {/* Integrated Header */}
      <div className="w-full text-center border-b border-gray-300 pb-1 mb-6">
        <div className="flex justify-between items-baseline px-2">
          <div className="flex items-baseline gap-2">
            <div className="flex items-center gap-1.5">
              <img src="logo.png" alt="" className="w-5 h-5 object-contain" />
              <span className="font-black tracking-tighter text-sm leading-none">
                <span style={{ color: '#078743' }}>udl</span>
                <span style={{ color: '#831682' }}>4</span>
                <span style={{ color: '#295e86' }}>all</span>
              </span>
            </div>
            <span className="text-[6px] text-gray-500 font-bold uppercase tracking-widest border border-gray-300 px-1 rounded-sm">
              v{pkg.version}
            </span>
          </div>
          <h1 className="text-xs font-black text-gray-900 tracking-tight flex-1 text-center mx-4 uppercase">
            {ui.appTitle}
          </h1>
          <div className="text-[10px] text-gray-500 font-bold uppercase">CAST (2024)</div>
        </div>
      </div>

      <div className="mb-8 border-b-2 border-gray-200 pb-4">
        <h2 className="text-3xl font-black text-gray-900 mb-2">
          {ui.dashActivities || 'Actividades'}
        </h2>
        {selectedLevel && (
          <div className="flex items-center gap-2 text-xl font-bold text-gray-700">
            <span style={{ color: levelColors[selectedLevel.id] }}>{t(selectedLevel.name)}</span>
            {selectedArea && (
              <>
                <ChevronRight className="w-5 h-5 text-gray-400" />
                <span>{t(selectedArea.name)}</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Content based on step */}
      {step === 'level' && (
        <div className="space-y-6">
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-500 border-b pb-2">
            {ui.abSelectLevel}
          </h3>
          <div className="grid grid-cols-2 gap-6">
            {availableLevels.map((level) => {
              const count = Object.values(groupedByLevel[level.id] || {}).flat().length;
              const color = levelColors[level.id] || '#000';
              return (
                <div
                  key={level.id}
                  className="p-6 border-2 rounded-2xl flex flex-col items-center text-center gap-4 break-inside-avoid"
                  style={{ borderColor: `${color}40`, backgroundColor: `${color}05` }}
                >
                  <GraduationCap className="w-12 h-12" style={{ color }} />
                  <span className="text-xl font-black text-gray-900">{t(level.name)}</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
                    {count} {ui.abActivitiesCount}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {step === 'area' && (
        <div className="space-y-6">
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-500 border-b pb-2">
            {ui.abSelectArea}
          </h3>
          <div className="grid grid-cols-2 gap-6">
            {availableAreas.map((area) => {
              const count = groupedByLevel[selectedLevelId!]?.[area.id]?.length || 0;
              const color = selectedLevelId ? levelColors[selectedLevelId] : '#000';
              return (
                <div
                  key={area.id}
                  className="p-6 border-2 rounded-2xl flex flex-col items-center text-center gap-4 break-inside-avoid"
                  style={{ borderColor: `${color}40`, backgroundColor: `${color}05` }}
                >
                  <BookOpen className="w-10 h-10" style={{ color }} />
                  <span className="text-lg font-bold text-gray-900 leading-tight">
                    {t(area.name)}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
                    {count} {ui.abActivitiesCount}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {step === 'activity' && (
        <div className="space-y-6">
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-500 border-b pb-2">
            {ui.abSelectActivity}
          </h3>
          <div className="space-y-4">
            {filteredActivities.map((activity, idx) => {
              const color = selectedLevelId ? levelColors[selectedLevelId] : '#000';
              return (
                <div
                  key={activity.id}
                  className="p-4 border rounded-xl flex items-start gap-4 break-inside-avoid"
                  style={{ borderColor: `${color}30` }}
                >
                  <div
                    className="w-10 h-10 flex items-center justify-center rounded-lg text-white font-black shrink-0 text-lg print-color-adjust-exact"
                    style={{ backgroundColor: color }}
                  >
                    {idx + 1}
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest block mb-1 text-gray-400">
                      {activity.code}
                    </span>
                    <h4 className="text-lg font-bold text-gray-900 leading-tight">
                      {t(activity.title)}
                    </h4>
                  </div>
                </div>
              );
            })}
            {filteredActivities.length === 0 && (
              <p className="text-gray-500 italic text-center py-8">{ui.abNoActivities}</p>
            )}
          </div>
        </div>
      )}

      <div className="mt-8 pt-4 border-t text-sm text-gray-500 flex justify-between">
        <span>© 2026 Daniel Losada</span>
        <span>Generated by UDL4All</span>
      </div>
    </div>
  );
}
