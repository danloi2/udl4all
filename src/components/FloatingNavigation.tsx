import { Link } from 'react-router-dom';
import { useUI } from '../contexts/UIContext';
import { useSettings } from '../contexts/SettingsContext';
import { ArrowLeft, LayoutGrid, Search, Eye, EyeOff, Home } from 'lucide-react';
import PrintPDFButton from './PrintPDFButton';

interface FloatingNavigationProps {
  currentPage: 'model' | 'explorer' | 'detail';
}

export default function FloatingNavigation({ currentPage }: FloatingNavigationProps) {
  const ui = useUI();
  const { showConsiderations, setShowConsiderations } = useSettings();

  const btnClass =
    'flex flex-col items-center justify-center w-16 h-16 rounded-2xl shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 relative group';
  const primaryClass = 'bg-blue-600 text-white';
  const secondaryClass = 'bg-white text-blue-600 border border-blue-100';
  const tooltipClass =
    'absolute right-full mr-4 px-3 py-1.5 bg-gray-900/80 backdrop-blur text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none';

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4 print:hidden">
      {/* Home Button */}
      <Link to="/" className={`${btnClass} ${secondaryClass}`} title={ui.home}>
        <Home className="w-6 h-6 mb-1" />
        <span className="text-[10px] font-black uppercase tracking-widest">{ui.home}</span>
        <span className={tooltipClass}>{ui.home}</span>
      </Link>

      {/* Model Button */}
      {currentPage !== 'model' && (
        <Link to="/model" className={`${btnClass} ${secondaryClass}`} title={ui.modelAction}>
          <LayoutGrid className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-black uppercase tracking-widest">{ui.modelAction}</span>
          <span className={tooltipClass}>{ui.modelAction}</span>
        </Link>
      )}

      {/* Search Button */}
      {currentPage !== 'explorer' && (
        <Link to="/explore" className={`${btnClass} ${secondaryClass}`} title={ui.searchAction}>
          <Search className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-black uppercase tracking-widest">
            {ui.searchAction}
          </span>
          <span className={tooltipClass}>{ui.searchAction}</span>
        </Link>
      )}

      {/* Show/Hide Considerations */}
      {currentPage === 'model' && (
        <button
          onClick={() => setShowConsiderations(!showConsiderations)}
          className={`${btnClass} ${primaryClass}`}
          title={showConsiderations ? ui.hideConsiderations : ui.showConsiderations}
        >
          {showConsiderations ? (
            <>
              <EyeOff className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                {ui.hideAction}
              </span>
            </>
          ) : (
            <>
              <Eye className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                {ui.showAction}
              </span>
            </>
          )}
          <span className={tooltipClass}>
            {showConsiderations ? ui.hideConsiderations : ui.showConsiderations}
          </span>
        </button>
      )}

      {/* PDF Button */}
      <PrintPDFButton />
    </div>
  );
}
