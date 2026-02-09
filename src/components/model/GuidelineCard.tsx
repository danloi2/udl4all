import type { Guideline } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { getColorStyles } from '../../utils/colors';
import ConsiderationItem from './ConsiderationItem';
import LevelBadge from './LevelBadge';
import { useSettings } from '../../contexts/SettingsContext';
import { Link } from 'react-router-dom';

interface GuidelineCardProps {
  guideline: Guideline;
  principleColor?: string;
}

export default function GuidelineCard({ guideline, principleColor = '#ccc' }: GuidelineCardProps) {
  const { t } = useLanguage();
  const { showConsiderations } = useSettings();

  const styles = getColorStyles(principleColor);

  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1 print:border-gray-200 print:rounded-lg">
      <Link
        to={`/detail/${guideline.id}`}
        className="block px-5 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors print:px-2 print:py-1"
        style={{
          borderTop: `4px solid ${principleColor}`,
          backgroundColor: `rgba(${parseInt(principleColor.slice(1, 3), 16)}, ${parseInt(principleColor.slice(3, 5), 16)}, ${parseInt(principleColor.slice(5, 7), 16)}, 0.05)`,
        }}
      >
        <div className="flex items-start gap-3 md:gap-4 print:gap-1.5">
          <div
            className="w-8 h-8 md:w-10 md:h-10 shrink-0 flex items-center justify-center rounded-lg md:rounded-xl font-mono text-sm md:text-lg font-black shadow-inner print:w-7 print:h-7 print:text-[10pt]"
            style={{
              backgroundColor: principleColor,
              color: 'white',
              textShadow: '0 1px 1px rgba(0,0,0,0.1)',
            }}
          >
            {guideline.code}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold leading-tight">
              {guideline.preDescription && (
                <span className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-0.5 pre-description-text">
                  {t(guideline.preDescription)}
                </span>
              )}
              <span
                className="text-xs md:text-base print:text-[10px] print:leading-none"
                style={{ color: principleColor }}
              >
                {t(guideline.name)}
              </span>
            </h3>
          </div>
        </div>
        <div className="mt-2 md:mt-4 flex justify-end print:hidden">
          <LevelBadge row={guideline.row} />
        </div>
      </Link>

      {showConsiderations && (
        <div className="p-3 space-y-1">
          {guideline.considerations.map((consideration) => (
            <ConsiderationItem
              key={consideration.id}
              consideration={consideration}
              guideline={guideline}
            />
          ))}
        </div>
      )}
    </div>
  );
}
