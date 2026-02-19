import { useLanguage } from '../../contexts/LanguageContext';
import { useUI } from '../../contexts/UIContext';
import { useSearch } from '../../contexts/SearchContext';
import { useUDLData } from '../../contexts/UDLDataContext';
import { Search, Book, FileText, Lightbulb, LayoutGrid } from 'lucide-react';
import pkg from '../../../package.json';

import type { SearchResult } from '../../types';

export default function ExplorerPDF() {
  const { t, tl } = useLanguage();
  const ui = useUI();
  const { udlData } = useUDLData();
  const { searchResults, searchQuery, selectedPrinciple, selectedType } = useSearch();

  const getPrincipleForResult = (result: SearchResult) => {
    return udlData.networks.find((n) => n.principle.id === result.principleId)?.principle;
  };

  const getDisplayText = (result: SearchResult): string => {
    if (result.type === 'principle' && 'name' in result.item) {
      return t(result.item.name);
    } else if (result.type === 'guideline' && 'name' in result.item) {
      return t(result.item.name);
    } else if (result.type === 'consideration' && 'description' in result.item) {
      return t(result.item.description);
    } else if (result.type === 'activity' && 'title' in result.item) {
      return t(result.item.title);
    }
    return '';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'activity':
        return <Book className="w-3 h-3" />;
      case 'guideline':
        return <LayoutGrid className="w-3 h-3" />;
      case 'consideration':
        return <Lightbulb className="w-3 h-3" />;
      case 'example':
        return <Search className="w-3 h-3" />;
      default:
        return <FileText className="w-3 h-3" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'activity':
        return ui.activity;
      case 'guideline':
        return ui.guideline;
      case 'consideration':
        return ui.consideration;
      case 'example':
        return ui.example;
      case 'principle':
        return ui.principle;
      default:
        return type;
    }
  };

  return (
    <div className="w-full bg-white text-black p-8 text-sm">
      {/* Inline Minimal Header */}
      <div className="w-full text-center border-b border-gray-300 pb-1 mb-6">
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
          <h1 className="text-xs font-black text-gray-900 tracking-tight flex-1 text-center mx-4 uppercase">
            {ui.appTitle}
          </h1>
          <div className="text-[8px] text-gray-500 font-bold uppercase">CAST (2024)</div>
        </div>
      </div>

      {/* Search Metadata Header */}
      <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <h1 className="text-xl font-black text-gray-900 flex items-center gap-3 mb-2">
          <Search className="w-6 h-6 text-gray-400" />
          {ui.searchAction}
        </h1>
        <div className="flex flex-wrap gap-2 text-xs">
          {searchQuery && (
            <span className="px-2 py-1 bg-white rounded border border-gray-300 font-bold text-gray-800">
              "{searchQuery}"
            </span>
          )}
          {selectedPrinciple !== 'all' && (
            <span className="px-2 py-1 bg-white rounded border border-gray-300 text-gray-600">
              {(() => {
                const p = udlData.networks.find(
                  (n) => n.principle.id === selectedPrinciple
                )?.principle;
                return p ? t(p.name) : selectedPrinciple;
              })()}
            </span>
          )}
          {selectedType !== 'all' && (
            <span className="px-2 py-1 bg-white rounded border border-gray-300 text-gray-600 uppercase tracking-wide">
              {getTypeLabel(selectedType)}
            </span>
          )}
          <span className="ml-auto font-bold text-gray-500 self-center">
            {searchResults.length} {searchResults.length !== 1 ? ui.results : ui.result}
          </span>
        </div>
      </div>

      {/* Results Grid - 2 Columns */}
      <div className="grid grid-cols-2 gap-4">
        {searchResults.map((result) => {
          const principle = getPrincipleForResult(result);
          const guideline =
            result.type === 'consideration' || result.type === 'guideline'
              ? udlData.networks
                  .flatMap((n) => n.principle.guidelines)
                  .find((g) => g.id === result.guidelineId || g.code === result.code?.split('.')[0])
              : null;

          const color = principle?.color || '#ccc';

          return (
            <div
              key={result.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden break-inside-avoid shadow-sm print-color-adjust-exact"
              style={{ borderColor: `${color}40` }}
            >
              {/* Card Header with Color Splash */}
              <div
                className="px-4 py-3 border-b border-gray-100 flex justify-between items-start"
                style={{ backgroundColor: `${color}10` }}
              >
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 px-1.5 py-0.5 text-[10px] uppercase font-black tracking-widest rounded bg-white text-gray-600 border border-gray-200 shadow-sm">
                    {getTypeIcon(result.type)}
                    {getTypeLabel(result.type)}
                  </span>
                  {(result.type === 'activity' || result.code) && (
                    <span
                      className="font-mono font-black text-sm px-1.5 py-0.5 bg-white rounded border border-gray-200 shadow-sm"
                      style={{ color: color }}
                    >
                      {result.code}
                    </span>
                  )}
                </div>
                {guideline && (
                  <span className="text-[10px] font-mono font-bold text-gray-400 bg-white px-1.5 py-0.5 rounded border border-gray-100">
                    {guideline.code}
                  </span>
                )}
              </div>

              {/* Card Body */}
              <div className="p-4">
                <p className="font-bold text-base text-gray-900 leading-tight mb-3">
                  {result.type === 'example' ? t(result.item.activity) : getDisplayText(result)}
                </p>

                {/* Badges for Level/Area (if applicable) */}
                {(result.type === 'activity' || result.type === 'example') && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border bg-gray-50 text-gray-500 border-gray-200">
                      {typeof result.educationalLevel === 'string'
                        ? result.educationalLevel
                        : t(result.educationalLevel as any)}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border bg-gray-50 text-gray-500 border-gray-200">
                      {typeof result.curricularArea === 'string'
                        ? result.curricularArea
                        : t(result.curricularArea as any)}
                    </span>
                  </div>
                )}

                {/* Example Extras */}
                {result.type === 'example' && result.item.designOptions && (
                  <div
                    className="p-3 bg-gray-50 rounded-lg text-xs text-gray-600 border-l-2"
                    style={{ borderLeftColor: color }}
                  >
                    <p className="line-clamp-3 italic">"{tl(result.item.designOptions)[0]}"</p>
                  </div>
                )}

                {/* Principle Badge at bottom */}
                <div className="mt-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></span>
                  <span className="text-[10px] font-bold uppercase text-gray-400">
                    {principle ? t(principle.name) : ''}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {searchResults.length === 0 && (
          <div className="col-span-2 text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">{ui.noResults}</p>
          </div>
        )}
      </div>

      <div className="mt-8 pt-4 border-t text-sm text-gray-500 flex justify-between">
        <span>© 2026 Daniel Losada</span>
        <span>udl4all</span>
      </div>
    </div>
  );
}
