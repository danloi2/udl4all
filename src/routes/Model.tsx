import { useMemo } from 'react';
import { useUDLData } from '../contexts/UDLDataContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useUI } from '../contexts/UIContext';
import { useSettings } from '../contexts/SettingsContext';
import Header from '../components/Header';
import ModelPDF from '../components/printPDF/ModelPDF';
import PrincipleHeader from '../components/model/PrincipleHeader';
import GuidelineCard from '../components/model/GuidelineCard';
import FloatingNavigation from '../components/FloatingNavigation';
import Footer from '../components/Footer';

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
      {/* Screen Header (Hidden in Print) */}
      <div className="print:hidden">
        <Header breadcrumbItems={breadcrumbItems} />
      </div>

      {/* 
        PRINT VIEW (Dedicated ModelPDF Component)
        Completely replaces the web view during printing.
        Uses its own internal layout logic.
      */}
      <div className="hidden print:block w-full">
        <ModelPDF />
      </div>

      {/* WEB VIEW (Hidden in Print) */}
      <div className="print:hidden">
        <div
          className={`container mx-auto px-4 print-model-container print-landscape ${
            showConsiderations ? 'show-cons' : 'hide-cons'
          }`}
        >
          {/* Goal description */}
          <div className="text-center mb-8 model-goal-wrapper">
            <p className="text-sm md:text-base text-gray-600 font-medium max-w-full mx-auto leading-tight app-model-goal">
              {t(udlData.goal)}
            </p>
          </div>

          {/* Desktop Grid (3x3 Principles + Guidelines) */}
          <div className="hidden lg:grid grid-cols-3 gap-x-12 gap-y-8 items-stretch">
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

          {/* Print Optimized Layout (Column-based for maximum vertical density) - This section is now handled by ModelPDF */}
          {/* <div className="hidden print:grid grid-cols-3 gap-2 items-start print-content">
            {udlData.networks.map((network) => (
              <div key={network.id} className="flex flex-col gap-2">
                <div
                  className="rounded-lg overflow-hidden border-b-2"
                  style={{ borderColor: network.principle.color }}
                >
                  <PrincipleHeader network={network} />
                </div>
                {network.principle.guidelines.map((guideline) => (
                  <GuidelineCard
                    key={guideline.id}
                    guideline={guideline}
                    principleColor={network.principle.color}
                  />
                ))}
              </div>
            ))}
          </div> */}

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
      </div>

      <FloatingNavigation
        currentPage="model"
        printOrientation="landscape"
        printScale={0.9}
  
      />

      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}
