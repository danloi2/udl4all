import { useMemo, useEffect } from 'react';
import ExplorerPDF from '../components/printPDF/ExplorerPDF';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useUI } from '../contexts/UIContext';
import { useUDLData } from '../contexts/UDLDataContext';
import { useSearch } from '../contexts/SearchContext';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import Tag from '../components/Tag';
import LevelBadge from '../components/model/LevelBadge';
import FloatingNavigation from '../components/FloatingNavigation';
import { Search, Filter } from 'lucide-react';
import { getGuidelineStyles } from '../utils/colors';
import type { SearchResult } from '../types';
import Footer from '../components/Footer';

export default function Explorer() {
  const { t, tl } = useLanguage();
  const ui = useUI();
  const { udlData } = useUDLData();
  const {
    searchResults,
    searchQuery,
    selectedPrinciple,
    setSelectedPrinciple,
    selectedGuideline,
    setSelectedGuideline,
    selectedConsideration,
    setSelectedConsideration,
    selectedEducationalLevel,
    setSelectedEducationalLevel,
    selectedCurricularArea,
    setSelectedCurricularArea,
    selectedType,
    setSelectedType,
    availableGuidelines,
    availableConsiderations,
    availableEducationalLevels,
    availableCurricularAreas,
    resetFilters,
  } = useSearch();

  // Cascading logic: Reset dependent filters when parent changes
  useEffect(() => {
    if (selectedPrinciple !== 'all') {
      setSelectedGuideline('all');
      setSelectedConsideration('all');
    }
  }, [selectedPrinciple]);

  useEffect(() => {
    if (selectedGuideline !== 'all') {
      setSelectedConsideration('all');
    }
  }, [selectedGuideline]);

  const breadcrumbItems = useMemo(
    () => [
      { label: '', href: '/', icon: undefined },
      { label: ui.searchAction, icon: Search },
    ],
    [ui.searchAction]
  );

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

  const getItemLink = (result: SearchResult): string => {
    if (result.type === 'example') {
      return `/detail/${result.considerationId}`;
    } else if (result.type === 'activity') {
      return `/detail/${result.id}`;
    } else if (['consideration', 'guideline', 'principle'].includes(result.type)) {
      return `/detail/${result.id}`;
    }
    return '/model';
  };

  const hasActiveFilters =
    searchQuery ||
    selectedPrinciple !== 'all' ||
    selectedGuideline !== 'all' ||
    selectedConsideration !== 'all' ||
    selectedType !== 'all' ||
    selectedEducationalLevel !== 'all' ||
    selectedCurricularArea !== 'all';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Print View */}
      <div className="hidden print:block w-full bg-white">
        <ExplorerPDF />
      </div>

      {/* Screen View */}
      <div className="contents print:hidden">
        <Header breadcrumbItems={breadcrumbItems} />

        <div className="flex justify-center mt-8">
          <SearchBar />
        </div>

        {/* Filters */}
        <div className="bg-white border-b border-gray-200 py-4 mt-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">{ui.filters}:</span>
              </div>

              {/* Principle Filter */}
              <select
                value={selectedPrinciple}
                onChange={(e) => setSelectedPrinciple(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">{ui.allPrinciples}</option>
                {udlData.networks.map((network) => (
                  <option key={network.principle.id} value={network.principle.id}>
                    {t(network.principle.name)}
                  </option>
                ))}
              </select>

              {/* Guideline Filter */}
              <select
                value={selectedGuideline}
                onChange={(e) => setSelectedGuideline(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">{ui.allGuidelines || 'Todas las pautas'}</option>
                {availableGuidelines.map((guideline) => (
                  <option key={guideline.id} value={guideline.id}>
                    {guideline.code}: {t(guideline.name)}
                  </option>
                ))}
              </select>

              {/* Consideration Filter */}
              <select
                value={selectedConsideration}
                onChange={(e) => setSelectedConsideration(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-xs"
              >
                <option value="all">{ui.allConsiderations || 'Todas las consideraciones'}</option>
                {availableConsiderations.map((consideration) => (
                  <option key={consideration.id} value={consideration.id}>
                    {consideration.code}: {t(consideration.description).substring(0, 50)}...
                  </option>
                ))}
              </select>

              {/* Type Filter */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as typeof selectedType)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">{ui.allTypes}</option>
                <option value="guideline">{ui.guidelines}</option>
                <option value="consideration">{ui.considerations}</option>
                <option value="activity">{ui.activity || 'Actividad'}</option>
                <option value="example">{ui.examples}</option>
              </select>

              {(selectedType === 'example' ||
                selectedType === 'activity' ||
                selectedType === 'all') && (
                <>
                  {/* Educational Level Filter */}
                  <select
                    value={selectedEducationalLevel}
                    onChange={(e) => setSelectedEducationalLevel(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">{ui.allEducationalLevels}</option>
                    {availableEducationalLevels.map((level) => (
                      <option key={level.es} value={level.es}>
                        {t(level)}
                      </option>
                    ))}
                  </select>

                  {/* Curricular Area Filter */}
                  <select
                    value={selectedCurricularArea}
                    onChange={(e) => setSelectedCurricularArea(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">{ui.allCurricularAreas}</option>
                    {availableCurricularAreas.map((area) => (
                      <option key={area.es} value={area.es}>
                        {t(area)}
                      </option>
                    ))}
                  </select>
                </>
              )}

              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  {ui.clearFilters}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="container mx-auto px-4 py-8">
          <div className="mb-4 text-sm text-gray-600">
            {searchResults.length} {searchResults.length !== 1 ? ui.results : ui.result}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResults.map((result) => {
              const principle = getPrincipleForResult(result);
              const guideline =
                result.type === 'consideration' || result.type === 'guideline'
                  ? udlData.networks
                      .flatMap((n) => n.principle.guidelines)
                      .find(
                        (g) => g.id === result.guidelineId || g.code === result.code?.split('.')[0]
                      )
                  : null;
              const styles = guideline ? getGuidelineStyles(guideline) : null;

              return (
                <Link
                  key={result.id}
                  to={getItemLink(result)}
                  className="block bg-white p-6 rounded-xl shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1 group"
                  style={{
                    borderTop: `4px solid ${principle?.color || '#eee'}`,
                    backgroundColor: styles
                      ? `rgba(${parseInt((principle?.color || '#eee').slice(1, 3), 16)}, ${parseInt((principle?.color || '#eee').slice(3, 5), 16)}, ${parseInt((principle?.color || '#eee').slice(5, 7), 16)}, 0.05)`
                      : undefined,
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    {(result.type === 'activity' || result.code) && (
                      <span
                        className="font-mono text-lg font-bold"
                        style={{ color: styles?.hex || '#374151' }}
                      >
                        {result.code}
                      </span>
                    )}
                    {result.type === 'example' && (
                      <div className="flex flex-col gap-1">
                        <span
                          className="font-mono text-xs font-black"
                          style={{ color: result.item.color }}
                        >
                          {result.item.code}
                        </span>
                      </div>
                    )}

                    <div className="flex flex-col items-end gap-1">
                      <span
                        className="text-[10px] px-2 py-0.5 font-black uppercase tracking-wider rounded border"
                        style={{
                          backgroundColor: 'white',
                          borderColor: principle?.color || '#eee',
                          color: principle?.color || '#666',
                        }}
                      >
                        {result.type === 'principle' && (ui.principle || 'Principio')}
                        {result.type === 'guideline' && (ui.guideline || 'Pauta')}
                        {result.type === 'consideration' && (ui.consideration || 'Consideración')}
                        {result.type === 'activity' && (ui.activity || 'Actividad')}
                        {result.type === 'example' && (ui.examples || 'Ejemplo')}
                      </span>

                      {(result.type === 'activity' || result.type === 'example') && (
                        <div className="flex gap-1">
                          <span className="text-[8px] px-1.5 py-0.5 font-black uppercase tracking-wider rounded border bg-gray-100 text-gray-700 border-gray-200">
                            {t(result.educationalLevel)}
                          </span>
                          <span className="text-[8px] px-1.5 py-0.5 font-black uppercase tracking-wider rounded border bg-gray-100 text-gray-700 border-gray-200">
                            {t(result.curricularArea)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <p
                    className={`font-bold ${!result.item?.designOptions && result.type === 'example' ? '' : 'mb-3'}`}
                    style={{ color: principle?.color || '#111827' }}
                  >
                    {result.type === 'example' ? t(result.item.activity) : getDisplayText(result)}
                  </p>

                  {result.type === 'example' && result.item.designOptions && (
                    <div className="mb-3 text-sm text-gray-600 line-clamp-2">
                      {tl(result.item.designOptions).map((paragraph, i) => (
                        <span key={i}>{paragraph} </span>
                      ))}
                    </div>
                  )}

                  {result.type === 'example' &&
                    result.item.webTools &&
                    result.item.webTools.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {result.item.webTools?.map((tool: any, i: number) => (
                          <div
                            key={i}
                            className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-lg border border-gray-100 transition-colors"
                          >
                            {tool.logo && (
                              <img
                                src={tool.logo}
                                alt=""
                                className="w-3.5 h-3.5 object-contain"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            )}
                            <span className="text-[10px] font-bold text-gray-700">{tool.name}</span>
                          </div>
                        ))}
                      </div>
                    )}

                  <div className="flex items-center justify-between mt-3">
                    {principle?.color ? (
                      <Tag color={principle.color} label={t(principle.name)} small={true} />
                    ) : result.type === 'example' ? (
                      <span className="text-[10px] font-bold text-gray-400">
                        ID: {result.considerationId}
                      </span>
                    ) : result.type === 'activity' ? (
                      <span className="text-[10px] font-bold text-gray-400">Full View</span>
                    ) : null}

                    {guideline && <LevelBadge row={guideline.row} />}
                  </div>
                </Link>
              );
            })}
          </div>

          {searchResults.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">{ui.noResults}</p>
              <button
                onClick={resetFilters}
                className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
              >
                {ui.clearFilters}
              </button>
            </div>
          )}
          <FloatingNavigation currentPage="explorer" />
          <Footer />
        </div>
      </div>
    </div>
  );
}
