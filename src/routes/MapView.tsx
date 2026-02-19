import { useRef, useState } from 'react';
import { Home as HomeIcon, Map as MapIcon, Loader2 } from 'lucide-react';
import Header from '../components/Header';
import FloatingNavigation from '../components/FloatingNavigation';
import ConceptMap, { type ConceptMapRef } from '../components/conceptmap/ConceptMap';
import pkg from '../../package.json';
import { useUI } from '../contexts/UIContext';
import '../css/conceptmap.css';

export default function MapView() {
  const conceptMapRef = useRef<ConceptMapRef>(null);
  const ui = useUI();
  const [printImage, setPrintImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const breadcrumbItems = [
    { label: 'Inicio', href: '/', icon: HomeIcon },
    { label: 'Mapa Conceptual', icon: MapIcon },
  ];

  const handleBeforePrint = async () => {
    if (conceptMapRef.current) {
      setIsGenerating(true);
      try {
        // Give a tiny moment for any pending React Flow updates
        await new Promise((resolve) => setTimeout(resolve, 150));
        const dataUrl = await conceptMapRef.current.captureMap('svg');
        if (dataUrl) {
          setPrintImage(dataUrl);
        }
      } catch (error) {
        console.error('Error capturing map:', error);
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const handleAfterPrint = () => {
    setPrintImage(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 print:bg-white print:m-0 print:p-0">
      {/* Loading Overlay - only on screen */}
      {isGenerating && (
        <div className="fixed inset-0 z-100 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center text-blue-600 print:hidden">
          <Loader2 className="w-12 h-12 animate-spin mb-4" />
          <p className="font-black uppercase tracking-widest animate-pulse">
            Generando vista de impresión...
          </p>
        </div>
      )}

      {/* Screen & Print Wrapper */}
      <div className="flex flex-col h-screen overflow-hidden print:overflow-visible print:h-auto">
        {/* Print Header - Only visible on print */}
        <div className="hidden print:block w-full border-b border-gray-300 pb-2 mb-4 px-8 pt-6">
          <div className="flex justify-between items-baseline">
            <div className="flex items-baseline gap-2">
              <span className="font-black tracking-tighter text-sm leading-none">
                <span style={{ color: '#078743' }}>udl</span>
                <span style={{ color: '#831682' }}>4</span>
                <span style={{ color: '#295e86' }}>all</span>
              </span>
              <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest border border-gray-300 px-1 rounded-sm">
                v{pkg.version}
              </span>
            </div>
            <h1 className="text-sm font-black text-gray-900 tracking-tight flex-1 text-center mx-4 uppercase">
              {ui.appTitle}
            </h1>
            <div className="text-[10px] text-gray-500 font-bold uppercase">CAST (2024)</div>
          </div>
        </div>

        {/* Header - Screen Only */}
        <div className="print:hidden contents">
          <Header breadcrumbItems={breadcrumbItems} />
        </div>

        {/* Map Container - Shared for Screen and Print */}
        <div className="flex-1 w-full bg-white relative print:h-[180mm] print:border print:border-gray-200 print:rounded-xl print:overflow-hidden flex items-center justify-center">
          {/* 
             If we have a print image, we show it during print.
             Otherwise we show the live map.
             The "print:hidden" on live map and "hidden print:block" on image
             ensures the capture-and-replace effect.
          */}
          <div className="w-full h-full print:hidden">
            <ConceptMap ref={conceptMapRef} />
          </div>

          {printImage ? (
            <img
              src={printImage}
              alt="Printable Map"
              className="hidden print:block w-full h-full object-contain"
            />
          ) : (
            <div className="hidden print:flex flex-col items-center justify-center text-gray-400 gap-2">
              {/* Fallback if capture fails */}
              <MapIcon className="w-12 h-12 opacity-20" />
              <p className="text-xs uppercase font-bold tracking-widest opacity-20 text-center">
                Inicia la impresión de nuevo para capturar el mapa
              </p>
            </div>
          )}
        </div>

        {/* Print Footer - Only visible on print */}
        <div className="hidden print:flex items-center justify-between px-8 py-4 border-t border-gray-200 mt-4 text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-none">
          <span>© 2026 Daniel Losada</span>
          <div className="flex gap-4">
            <span>Mapa Conceptual</span>
            <span>udl4all.com</span>
          </div>
        </div>

        {/* Floating Navigation - Screen Only */}
        <div className="print:hidden">
          <FloatingNavigation
            currentPage="map"
            onBeforePrint={handleBeforePrint}
            onAfterPrint={handleAfterPrint}
            printOrientation="landscape"
            printInstructions={[
              'Espera a que termine de generarse la vista de impresión.',
              'Se imprimirá exactamente lo que ves en pantalla.',
              'Ajusta el zoom y la posición como prefieras.',
              'Usa orientación horizontal (apaisado) para mejor resultado.',
            ]}
          />
        </div>
      </div>
    </div>
  );
}
