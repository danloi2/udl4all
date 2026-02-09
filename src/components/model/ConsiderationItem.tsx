import { Link } from 'react-router-dom';
import type { Consideration, Guideline } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { getGuidelineStyles } from '../../utils/colors';
import { useState, useMemo } from 'react';

interface ConsiderationItemProps {
  consideration: Consideration;
  guideline: Guideline;
}

export default function ConsiderationItem({ consideration, guideline }: ConsiderationItemProps) {
  const { t } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

  const styles = getGuidelineStyles(guideline);

  // Create hover background color
  const hoverBg = useMemo(() => {
    if (!guideline.color) return 'rgba(0,0,0,0.02)';
    const hex = guideline.color;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, 0.05)`;
  }, [guideline.color]);

  return (
    <Link
      to={`/detail/${consideration.id}`}
      className="block px-3 py-2 rounded-md transition-colors border-l-2"
      style={{
        borderColor: guideline.color || '#ccc',
        backgroundColor: isHovered ? hoverBg : 'transparent',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-2">
        <span className="font-mono text-sm font-semibold shrink-0" style={{ color: styles.hex }}>
          {consideration.code}
        </span>
        <span className="text-sm text-gray-700">{t(consideration.description)}</span>
      </div>
    </Link>
  );
}
