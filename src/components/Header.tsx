import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import Breadcrumbs from './Breadcrumbs';
import { useUDLData } from '../contexts/UDLDataContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useUI } from '../contexts/UIContext';
import pkg from '../../package.json';

interface HeaderProps {
  breadcrumbItems?: Array<{ label: string; href?: string; icon?: any }>;
  bgColor?: string;
  breadcrumbColor?: string;
}

export default function Header({
  breadcrumbItems,
  bgColor = 'bg-white',
  breadcrumbColor,
}: HeaderProps) {
  const { udlData } = useUDLData();
  const { t } = useLanguage();
  const ui = useUI();
  const { pathname } = useLocation();

  const backDestination = useMemo(() => {
    if (breadcrumbItems && breadcrumbItems.length >= 2) {
      const prevItem = breadcrumbItems[breadcrumbItems.length - 2];
      if (prevItem.href && prevItem.href !== '#') {
        return prevItem.href;
      }
    }
    return pathname === '/dashboard' ? '/' : '/dashboard';
  }, [pathname, breadcrumbItems]);

  return (
    <div
      className={`${bgColor} border-b border-gray-200 sticky top-0 z-20 shadow-sm transition-colors duration-300 print:hidden app-header`}
    >
      {breadcrumbColor && (
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundColor: breadcrumbColor }}
        />
      )}

      <div className="container mx-auto px-4 py-3 print:py-0 print:px-2">
        {/* Row 1: Back + Logo | Title + Version + CAST | Language */}
        <div className="flex items-center justify-between gap-4 print:gap-2">
          {/* Left: Back + Branding */}
          <div className="flex items-center gap-3 shrink-0 print:gap-1">
            <Link
              to={backDestination}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-600 hover:bg-white hover:shadow-sm transition-all text-sm font-bold print:hidden"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex flex-col items-start leading-none">
              <Link
                to={backDestination}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity print:text-xs"
              >
                <img src="logo.png" alt="Logo" className="w-8 h-8 object-contain" />
                <div className="flex font-black tracking-tighter text-xl text-gray-800 leading-none">
                  <span style={{ color: '#078743' }}>udl</span>
                  <span style={{ color: '#831682' }}>4</span>
                  <span style={{ color: '#295e86' }}>all</span>
                </div>
              </Link>
              <span className="px-1.5 py-0.5 bg-gray-100/50 text-gray-500 font-black rounded text-[9px] uppercase tracking-widest border border-gray-200 mt-0.5 print:text-[6px] print:mt-0">
                v{pkg.version}
              </span>
            </div>
          </div>

          {/* Center: Title + Version + CAST */}
          <div className="flex-1 flex items-center justify-center gap-3 min-w-0">
            <h1 className="text-base md:text-lg font-black text-gray-900 tracking-tight truncate print:text-xs">
              {t(udlData.terminology?.principle?.title) || ui.appTitle}
            </h1>
            <span className="hidden sm:inline-block px-2 py-0.5 bg-blue-50 text-blue-700 font-black rounded-full border border-blue-100 text-[10px] uppercase tracking-wide whitespace-nowrap print:text-[8px]">
              {t(udlData.version)}
            </span>
            <a
              href="https://udlguidelines.cast.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex px-2.5 py-1 bg-gray-900 text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-gray-700 transition-colors whitespace-nowrap print:inline-flex print:bg-transparent print:text-black print:border print:border-gray-300 print:px-1 print:py-0"
            >
              CAST (2024)
            </a>
          </div>

          {/* Right: Language */}
          <div className="flex items-center shrink-0 print:hidden">
            <LanguageSwitcher />
          </div>
        </div>

        {/* Row 2: Breadcrumbs (below the title row) */}
        {breadcrumbItems && breadcrumbItems.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-100 print:hidden">
            <Breadcrumbs items={breadcrumbItems} color={breadcrumbColor} />
          </div>
        )}
      </div>
    </div>
  );
}
