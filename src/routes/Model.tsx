import { useMemo } from 'react';
import { useUDLData } from '../contexts/UDLDataContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useUI } from '../contexts/UIContext';
import { useSettings } from '../contexts/SettingsContext';
import Header from '../components/Header';
import PrincipleHeader from '../components/model/PrincipleHeader';
import GuidelineCard from '../components/model/GuidelineCard';
import FloatingNavigation from '../components/FloatingNavigation';
import { LayoutGrid } from 'lucide-react';

export default function Model() {
  const { udlData } = useUDLData();
  const { t } = useLanguage();
  const ui = useUI();
  const { showConsiderations } = useSettings();

  // Breadcrumbs
  const breadcrumbItems = useMemo(
    () => [
      { label: '', href: '/', icon: undefined }, // Icon handled in Header or Breadcrumbs
      { label: ui.modelAction, icon: LayoutGrid },
    ],
    [ui.modelAction]
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header breadcrumbItems={breadcrumbItems} />

      {/* 3x3 Grid Layout */}
      <div
        className={`container mx-auto px-4 print-model-container print-landscape ${
          showConsiderations ? 'show-cons' : 'hide-cons'
        }`}
      >
        {/* Page Header (Title & Meta) */}
        <div className="text-center mb-8 print-header-container print:mb-2">
          <div className="flex items-center justify-center gap-4 flex-wrap mb-2 print:mb-0 print:gap-1">
            <h1 className="font-black text-gray-900 tracking-tight app-model-title text-2xl md:text-4xl print:text-lg print:leading-none">
              {t(udlData.terminology?.principle?.title) || ui.appTitle}
            </h1>

            <div className="flex items-center gap-2 app-model-meta print:gap-1">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 font-black rounded-full border border-blue-100 uppercase tracking-wide print:bg-transparent print:border-none app-model-version text-xs md:text-sm print:text-[14px] print:px-0 print:py-0 print:leading-none">
                {t(udlData.version)}
              </span>

              <a
                href="https://udlguidelines.cast.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-1.5 bg-gray-900 text-white rounded-full hover:bg-gray-700 hover:scale-105 transition-all shadow-md group print:hidden"
              >
                <span className="font-black uppercase tracking-widest whitespace-nowrap app-model-cast text-xs md:text-sm">
                  CAST (2024)
                </span>
              </a>
              {/* Print-only CAST text */}
              <span className="hidden print:inline-block font-black uppercase tracking-widest whitespace-nowrap text-[10px] text-gray-500 print:leading-none">
                CAST (2024)
              </span>
            </div>
          </div>

          {/* UDL Goal Description */}
          <p className="text-sm md:text-base text-gray-600 font-medium max-w-full mx-auto leading-tight app-model-goal print:text-[14px] print:text-gray-500 print:-mt-1 print:leading-none">
            {t(udlData.goal)}
          </p>
        </div>

        {/* Desktop Grid (3x3 Principles + Guidelines) */}
        <div className="hidden lg:grid grid-cols-3 gap-x-12 gap-y-8 items-stretch print:hidden">
          {/* Headers Row */}
          {udlData.networks.map((network) => (
            <div
              key={network.id}
              className="rounded-xl shadow-lg border-b-4 h-full"
              style={{ borderColor: network.principle.color }}
            >
              <PrincipleHeader network={network} />
            </div>
          ))}

          {/* Guideline Rows (Loop over 3 UDL Levels) */}
          {[0, 1, 2].map((rowIndex) =>
            udlData.networks.map((network) => (
              <div key={`${network.id}-${rowIndex}`} className="h-full flex flex-col">
                {network.principle.guidelines[rowIndex] && (
                  <GuidelineCard
                    guideline={network.principle.guidelines[rowIndex]}
                    principleColor={network.principle.color}
                  />
                )}
              </div>
            ))
          )}
        </div>

        {/* Print Optimized Layout (Column-based for maximum vertical density) */}
        <div className="hidden print:grid grid-cols-3 gap-2 items-start">
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
                <GuidelineCard
                  key={guideline.id}
                  guideline={guideline}
                  principleColor={network.principle.color}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Mobile Vertical View */}
        <div className="lg:hidden flex flex-col gap-12">
          {udlData.networks.map((network) => (
            <div key={network.id} className="flex flex-col gap-4">
              <div
                className="rounded-xl shadow-lg border-b-4"
                style={{ borderColor: network.principle.color }}
              >
                <PrincipleHeader network={network} />
              </div>
              <div className="space-y-4 px-2">
                {network.principle.guidelines.map((guideline) => (
                  <GuidelineCard
                    key={guideline.id}
                    guideline={guideline}
                    principleColor={network.principle.color}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <FloatingNavigation currentPage="model" />
    </div>
  );
}
