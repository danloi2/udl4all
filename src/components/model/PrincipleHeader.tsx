import { Link } from 'react-router-dom';
import type { Network } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

// Brain assets
import affectiveLogo from '../../assets/brains/affective_logo.svg';
import recognitionLogo from '../../assets/brains/recognition_logo.svg';
import strategicLogo from '../../assets/brains/strategic_logo.svg';

interface PrincipleHeaderProps {
  network: Network;
}

const brainLogos = {
  affective: affectiveLogo,
  recognition: recognitionLogo,
  strategic: strategicLogo,
};

export default function PrincipleHeader({ network }: PrincipleHeaderProps) {
  const { t } = useLanguage();

  const principle = network.principle;
  const logo = brainLogos[network.id as keyof typeof brainLogos];
  const networkLabel = network.why || network.what || network.how;

  return (
    <Link
      to={`/detail/${principle.id}`}
      className="px-4 py-6 md:py-10 flex flex-col items-center gap-2 md:gap-6 shadow-md transition-all duration-500 rounded-xl h-full justify-center hover:opacity-95 print:py-2 print:gap-1 group-header"
      style={{ backgroundColor: principle.color || '#666' }}
    >
      {/* Logo Container */}
      <div className="w-12 h-12 md:w-20 md:h-20 flex items-center justify-center rounded-xl md:rounded-2xl bg-white shadow-2xl p-2 md:p-4 transform hover:scale-110 transition-transform duration-300 border border-white/50 shrink-0 print:w-8 print:h-8 print:p-1 print:rounded-lg cursor-help">
        <img
          src={logo}
          alt={t(network.name)}
          title={t(network.description)}
          className="w-full h-full object-contain"
        />
      </div>

      <div className="text-center flex flex-col items-center">
        {principle.preDescription && (
          <span className="text-[8px] md:text-[10px] font-black text-white/70 uppercase tracking-[0.2em] mb-0.5 md:mb-1 pre-description-text">
            {t(principle.preDescription)}
          </span>
        )}
        <h2 className="text-lg md:text-xl font-black text-white leading-tight mb-1 md:mb-4 tracking-tight print:mb-0 print:text-base">
          {t(principle.name)}
        </h2>

        {/* Network Name Badge */}
        <div className="px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest shadow-xl bg-white text-gray-900 border-none inline-block">
          {t(network.name)}
        </div>

        {/* Network Purpose Text */}
        {networkLabel && (
          <p className="text-[9px] md:text-[11px] font-black italic uppercase tracking-widest mt-2 md:mt-4 text-white/90 network-purpose-text">
            {t(networkLabel)}
          </p>
        )}
      </div>
    </Link>
  );
}
