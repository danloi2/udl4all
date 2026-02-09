import { useLanguage } from '../../contexts/LanguageContext';
import type { MultilingualText } from '../../types';
import { Key, LifeBuoy, Brain } from 'lucide-react';
import { useMemo } from 'react';

interface LevelBadgeProps {
  row: MultilingualText;
}

export default function LevelBadge({ row }: LevelBadgeProps) {
  const { t } = useLanguage();
  const label = t(row);

  const Icon = useMemo(() => {
    const l = label.toLowerCase();
    if (l.includes('acceso') || l.includes('access')) {
      return Key;
    } else if (l.includes('apoyo') || l.includes('support')) {
      return LifeBuoy;
    } else {
      return Brain;
    }
  }, [label]);

  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-gray-200 bg-white text-gray-900 shadow-xs group-hover:border-gray-300 transition-colors">
      <Icon className="w-3.5 h-3.5" />
      <span className="text-[10px] font-black uppercase tracking-wider">{label}</span>
    </div>
  );
}
