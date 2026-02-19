import ConceptMap from '../conceptmap/ConceptMap';
import { useUI } from '../../contexts/UIContext';
import pkg from '../../../package.json';

export default function MapPDF() {
  const ui = useUI();

  return (
    <div className="w-[297mm] h-[210mm] bg-white text-black flex flex-col p-[10mm] overflow-hidden">
      {/* Integrated Header */}
      <div className="w-full text-center border-b border-gray-300 pb-2 mb-4">
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

      {/* Main Map Content: Using fixed dimensions ensures ReactFlow can calculate bounds */}
      <div className="flex-1 relative w-full border border-gray-100 rounded-lg overflow-hidden bg-white">
        <ConceptMap isPrintMode={true} />
      </div>

      {/* Footer */}
      <div className="mt-4 pt-2 border-t border-gray-100 flex justify-between items-center text-[9px] text-gray-400 font-bold uppercase tracking-widest">
        <span>© 2026 Daniel Losada</span>
        <div className="flex gap-4">
          <span>Mapa Conceptual</span>
          <span>udl4all.com</span>
        </div>
      </div>
    </div>
  );
}
