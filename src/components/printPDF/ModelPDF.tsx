import { useUDLData } from '../../contexts/UDLDataContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useUI } from '../../contexts/UIContext';
import { useSettings } from '../../contexts/SettingsContext';
import PrincipleHeader from '../model/PrincipleHeader';
import GuidelineCard from '../model/GuidelineCard';
import pkg from '../../../package.json';

export default function ModelPDF() {
  const { udlData } = useUDLData();
  const { t } = useLanguage();
  const ui = useUI();
  const { showConsiderations } = useSettings();

  return (
    <div
      className={`w-full h-full bg-white text-black print-model-container ${
        showConsiderations ? 'show-cons' : 'hide-cons'
      }`}
    >
      {/* Inline Minimal Header */}
      <div className="w-full text-center border-b border-gray-300 pb-1 mb-2">
        <div className="flex justify-between items-baseline px-2">
          <div className="flex items-baseline gap-2">
            <span className="font-black tracking-tighter text-sm leading-none">
              <span style={{ color: '#078743' }}>udl</span>
              <span style={{ color: '#831682' }}>4</span>
              <span style={{ color: '#295e86' }}>all</span>
            </span>
            <span className="text-[6px] text-gray-500 font-bold uppercase tracking-widest border border-gray-300 px-1 rounded-sm">
              v{pkg.version}
            </span>
          </div>
          <h1 className="text-xs font-black text-gray-900 tracking-tight flex-1 text-center mx-4">
            {t(udlData.terminology?.principle?.title) || ui.appTitle}
          </h1>
          <div className="text-[8px] text-gray-500 font-bold uppercase">CAST (2024)</div>
        </div>
      </div>

      {/* Goal Description (Added per request) */}
      <div className="text-center mb-2 px-8 app-model-goal">
        <p className="text-xs font-medium text-gray-700 leading-tight">{t(udlData.goal)}</p>
      </div>

      {/* Grid Layout (Optimized for Print Density) */}
      <div className="grid grid-cols-3 gap-2 items-start print-content">
        {udlData.networks.map((network) => (
          <div key={network.id} className="flex flex-col gap-2">
            {/* Header */}
            <div
              className="rounded-lg overflow-hidden border-b-2"
              style={{ borderColor: network.principle.color }}
            >
              <PrincipleHeader network={network} />
            </div>
            {/* Guidelines Stack */}
            {network.principle.guidelines.map((guideline) => (
              <div key={guideline.id} style={{ pageBreakInside: 'avoid' }}>
                <GuidelineCard guideline={guideline} principleColor={network.principle.color} />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Inline Minimal Footer */}
      <div className="flex justify-between items-center border-t border-gray-300 pt-[2mm] mt-[2mm] text-[9pt] text-gray-600">
        <span>© 2026 Daniel Losada</span>
        <span>Generado por UDL4All</span>
      </div>
    </div>
  );
}
