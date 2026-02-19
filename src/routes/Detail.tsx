import { useMemo, useEffect } from 'react';
import DetailPDF from '../components/printPDF/DetailPDF';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useUI } from '../contexts/UIContext';
import { useUDLData } from '../contexts/UDLDataContext';
import Header from '../components/Header';
import Tag from '../components/Tag';
import LevelBadge from '../components/model/LevelBadge';
import FloatingNavigation from '../components/FloatingNavigation';
import { LayoutGrid, Search, Lightbulb } from 'lucide-react';
import { getGuidelineStyles, getColorStyles } from '../utils/colors';
import type { Consideration, Guideline, Principle, Example, Activity } from '../types';
import Footer from '../components/Footer';

// Brain assets
import affectiveLogo from '../assets/brains/affective_logo.svg';
import recognitionLogo from '../assets/brains/recognition_logo.svg';
import strategicLogo from '../assets/brains/strategic_logo.svg';

const brainLogos = {
  affective: affectiveLogo,
  recognition: recognitionLogo,
  strategic: strategicLogo,
};

export default function Detail() {
  const { id } = useParams<{ id: string }>();
  const { t, tl } = useLanguage();
  const ui = useUI();
  const {
    udlData,
    udlIndex,
    getConsiderationById,
    getGuidelineForConsideration,
    getPrincipleForConsideration,
    getExampleById,
    getConsiderationForExample,
    getActivityById,
  } = useUDLData();

  const itemData = useMemo(() => {
    if (!id) return null;

    // Check for Activity first
    const a = getActivityById(id);
    if (a) {
      return { type: 'activity' as const, item: a };
    }

    const e = getExampleById(id);
    if (e) {
      const c = getConsiderationForExample(id);
      if (c) {
        const g = getGuidelineForConsideration(c.id);
        const p = getPrincipleForConsideration(c.id);
        return { type: 'example' as const, item: e, consideration: c, guideline: g, principle: p };
      }
    }

    const c = getConsiderationById(id);
    if (c) {
      const g = getGuidelineForConsideration(id);
      const p = getPrincipleForConsideration(id);
      return { type: 'consideration' as const, item: c, guideline: g, principle: p };
    }

    const g = udlIndex.guidelines.get(id);
    if (g) {
      const p = udlData.networks.find((n) =>
        n.principle.guidelines.some((gu) => gu.id === g.id)
      )?.principle;
      return { type: 'guideline' as const, item: g, guideline: g, principle: p };
    }

    const p = udlIndex.principles.get(id);
    if (p) {
      return { type: 'principle' as const, item: p, guideline: null, principle: p };
    }

    return null;
  }, [
    id,
    udlIndex,
    udlData,
    getActivityById,
    getExampleById,
    getConsiderationById,
    getConsiderationForExample,
    getGuidelineForConsideration,
    getPrincipleForConsideration,
  ]);

  const activity = itemData?.type === 'activity' ? (itemData.item as Activity) : null;
  const example = itemData?.type === 'example' ? (itemData.item as Example) : null;
  const consideration =
    itemData?.type === 'consideration'
      ? (itemData.item as Consideration)
      : itemData?.type === 'example'
        ? ((itemData as any).consideration as Consideration)
        : null;
  const guideline = itemData?.guideline as Guideline | null;
  const principle = itemData?.principle as Principle | null;

  const networkId = principle
    ? udlData.networks.find((n) => n.principle.id === principle.id)?.id
    : undefined;
  const logo = networkId ? brainLogos[networkId as keyof typeof brainLogos] : undefined;
  const colors = guideline
    ? getGuidelineStyles(guideline)
    : principle
      ? getColorStyles(principle.color || '#ccc')
      : undefined;

  const truncate = (text: string, length: number = 40) => {
    if (!text) return '';
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  };

  const breadcrumbItems = useMemo(() => {
    const items: any[] = [
      { label: '', href: '/', icon: undefined },
      { label: ui.dashboard, href: '/dashboard' },
      { label: ui.modelAction, href: '/model', icon: LayoutGrid },
    ];

    if (principle) {
      items.push({
        label:
          itemData?.type === 'principle'
            ? t(principle.name)
            : principle.id === 'engagement'
              ? 'C'
              : principle.id === 'representation'
                ? 'R'
                : 'A',
        href: `/detail/${principle.id}`,
      });
    }

    if (guideline && itemData?.type !== 'principle') {
      items.push({
        label: `${guideline.code}. ${t(guideline.name)}`,
        href: `/detail/${guideline.id}`,
      });
    }

    if (consideration && (itemData?.type === 'consideration' || itemData?.type === 'example')) {
      items.push({
        label:
          itemData?.type === 'consideration'
            ? `${consideration.code}. ${t(consideration.description)}`
            : consideration.code,
        href: `/detail/${consideration.id}`,
      });
    }

    if (itemData?.type === 'example' && example) {
      items.push({
        label: `${example.code}. ${truncate(t(example.activity), 50)}`,
      });
    }

    return items;
  }, [itemData, principle, guideline, consideration, example, ui.modelAction, t]);

  // Fix scroll position when navigating between items
  useEffect(() => {
    if (id) {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, [id]);

  // Helper to get Consideration for a code (e.g. "7.1")
  const getConsiderationByCode = (code: string) => {
    for (const [, cons] of udlIndex.considerations) {
      if (cons.code === code) return cons;
    }
    return null;
  };

  // Custom sort: Engagement (7,8,9) -> Representation (1,2,3) -> Action & Expression (4,5,6)
  const sortAdaptations = (adaptations: Record<string, any>) => {
    const getPriority = (guidelineNum: number) => {
      if (guidelineNum >= 7 && guidelineNum <= 9) return 0; // Engagement
      if (guidelineNum >= 1 && guidelineNum <= 3) return 1; // Representation
      if (guidelineNum >= 4 && guidelineNum <= 6) return 2; // Action & Expression
      return 3;
    };

    return Object.entries(adaptations).sort(([codeA], [codeB]) => {
      const [a1, a2] = codeA.split('.').map(Number);
      const [b1, b2] = codeB.split('.').map(Number);

      const p1 = getPriority(a1);
      const p2 = getPriority(b1);

      if (p1 !== p2) return p1 - p2; // Sort by Principle
      if (a1 !== b1) return a1 - b1; // Then by Guideline
      return a2 - b2; // Then by Consideration
    });
  };

  // Group adaptations by Principle > Guideline
  const groupAdaptations = (adaptations: Record<string, any>) => {
    const sorted = sortAdaptations(adaptations);
    const result: {
      principle: Principle;
      guidelines: { guideline: Guideline; items: [string, any][] }[];
    }[] = [];

    sorted.forEach(([code, adaptation]) => {
      const cons = getConsiderationByCode(code);
      if (!cons) return;
      const p = getPrincipleForConsideration(cons.id);
      const g = getGuidelineForConsideration(cons.id);
      if (!p || !g) return;

      let pGroup = result.find((pg) => pg.principle.id === p.id);
      if (!pGroup) {
        pGroup = { principle: p, guidelines: [] };
        result.push(pGroup);
      }

      let gGroup = pGroup.guidelines.find((gg) => gg.guideline.id === g.id);
      if (!gGroup) {
        gGroup = { guideline: g, items: [] };
        pGroup.guidelines.push(gGroup);
      }

      gGroup.items.push([code, adaptation]);
    });

    return result;
  };

  // Get relevant examples for the current item
  const relevantExamples = useMemo(() => {
    if (!guideline || itemData?.type === 'guideline') return [];

    const allExamples = Array.from(udlIndex.examples.values());
    return allExamples.filter((e) => {
      if (itemData?.type === 'consideration' && consideration) {
        const c = getConsiderationForExample(e.id);
        return c && c.id === consideration.id;
      }
      const c = getConsiderationForExample(e.id);
      if (!c) return false;
      const g = getGuidelineForConsideration(c.id);
      return g && g.id === guideline.id;
    });
  }, [
    guideline,
    itemData,
    consideration,
    udlIndex.examples,
    getConsiderationForExample,
    getGuidelineForConsideration,
  ]);

  if (!itemData) {
    return (
      <div className="min-h-screen bg-gray-50 pb-24">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">{ui.itemNotFound}</p>
          <Link to="/" className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-medium">
            {ui.home}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Print View */}
      <div className="hidden print:block w-full">
        <DetailPDF itemData={itemData} />
      </div>

      {/* Screen View */}
      <div className="contents print:hidden">
        <Header
          breadcrumbItems={
            activity
              ? [
                  { label: '', href: '/', icon: undefined },
                  { label: ui.modelAction, href: '/model', icon: LayoutGrid },
                  { label: activity.code },
                ]
              : breadcrumbItems
          }
          bgColor={colors ? colors.bgLight : 'bg-white'}
          breadcrumbColor={principle?.color}
        />

        {/* Content */}
        <div
          className={`container mx-auto px-4 py-8 max-w-4xl ${
            itemData.type === 'activity' || itemData.type === 'example'
              ? 'print-multi-page'
              : 'print-portrait-compact'
          }`}
        >
          {itemData.type === 'activity' && activity ? (
            /* Activity Full View */
            <div className="bg-white rounded-lg shadow-lg overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Header */}
              <div className="px-8 py-8 border-b-4 bg-gray-50 border-gray-300 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="font-mono text-3xl font-black text-gray-400">
                      {activity.code}
                    </span>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 text-xs font-black uppercase tracking-wider rounded-md border bg-gray-100 text-gray-700 border-gray-200">
                        {t(activity.gradeLevel)}
                      </span>
                      <span className="px-2 py-1 text-xs font-black uppercase tracking-wider rounded-md border bg-gray-100 text-gray-700 border-gray-200">
                        {t(activity.subject)}
                      </span>
                    </div>
                  </div>
                  <h1 className="text-3xl font-black text-gray-900 leading-tight max-w-2xl">
                    {t(activity.title)}
                  </h1>
                </div>
              </div>

              {/* Body */}
              <div className="px-8 py-8 space-y-12">
                {/* Adaptations List */}
                <div className="space-y-12">
                  <h2 className="text-xl font-black uppercase tracking-widest text-gray-900 flex items-center gap-3">
                    <LayoutGrid className="w-6 h-6" />
                    {ui.examples}
                  </h2>

                  <div className="space-y-12">
                    {groupAdaptations(activity.duaAdaptations).map((pGroup, pIdx) => (
                      <div
                        key={pIdx}
                        className="space-y-8 animate-in fade-in slide-in-from-bottom-4 bg-white rounded-3xl p-6 border-2 border-dashed border-gray-100"
                      >
                        {/* Principle Header */}
                        <h3
                          className="text-2xl font-black uppercase tracking-wider flex items-center gap-3"
                          style={{ color: pGroup.principle.color }}
                        >
                          <span
                            className="w-3 h-10 rounded-full"
                            style={{ backgroundColor: pGroup.principle.color }}
                          />
                          {t(pGroup.principle.name)}
                        </h3>

                        <div className="space-y-8 pl-4 lg:pl-8">
                          {pGroup.guidelines.map((gGroup, gIdx) => (
                            <div key={gIdx} className="space-y-4">
                              {/* Guideline Header */}
                              <div className="flex items-center gap-4 bg-gray-50/50 p-3 rounded-xl w-fit">
                                <span
                                  className="font-mono text-xl font-black px-3 py-1 rounded-lg text-white shadow-sm"
                                  style={{ backgroundColor: pGroup.principle.color }}
                                >
                                  {gGroup.guideline.code}
                                </span>
                                <h4 className="text-lg font-bold text-gray-800">
                                  {t(gGroup.guideline.name)}
                                </h4>
                              </div>

                              {/* Items Grid */}
                              <div
                                className="grid grid-cols-1 gap-6 border-l-4 pl-6"
                                style={{ borderColor: `${pGroup.principle.color}20` }}
                              >
                                {gGroup.items.map(([code, adaptation], iIdx) => {
                                  const cons = getConsiderationByCode(code);

                                  return (
                                    <div
                                      key={iIdx}
                                      className="flex flex-col md:flex-row gap-6 p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-all bg-white hover:border-blue-200"
                                    >
                                      {/* Badge */}
                                      <div className="shrink-0 flex md:flex-col items-center gap-3">
                                        <div
                                          className="w-14 h-14 rounded-2xl flex items-center justify-center font-mono text-lg font-black text-white shadow-sm"
                                          style={{ backgroundColor: pGroup.principle.color }}
                                        >
                                          {code}
                                        </div>
                                      </div>

                                      {/* Content */}
                                      <div className="space-y-3 grow">
                                        {cons && (
                                          <h5 className="text-xs font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2">
                                            {t(cons.description)}
                                          </h5>
                                        )}

                                        <div className="space-y-3">
                                          {tl(adaptation.text).map((paragraph, pIdx) =>
                                            paragraph.trim() ? (
                                              <div key={pIdx} className="flex gap-3 items-start">
                                                <Lightbulb
                                                  className="w-5 h-5 shrink-0 mt-0.5"
                                                  style={{ color: pGroup.principle.color }}
                                                />
                                                <p className="text-gray-800 font-medium leading-relaxed text-lg">
                                                  {paragraph}
                                                </p>
                                              </div>
                                            ) : null
                                          )}
                                        </div>

                                        {adaptation.webTools && adaptation.webTools.length > 0 && (
                                          <div className="mt-4 pt-4 border-t border-gray-50 flex flex-wrap gap-2">
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2 self-center">
                                              {ui.webTools}:
                                            </span>
                                            {adaptation.webTools.map((tool: any, tIdx: number) => (
                                              <a
                                                key={tIdx}
                                                href={tool.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 hover:bg-white border border-gray-200 hover:border-blue-400 rounded-lg transition-all group shadow-sm"
                                              >
                                                {tool.logo && (
                                                  <img
                                                    src={tool.logo}
                                                    alt=""
                                                    className="w-4 h-4 object-contain"
                                                  />
                                                )}
                                                <span className="text-xs font-bold text-gray-700 group-hover:text-blue-600">
                                                  {tool.name}
                                                </span>
                                              </a>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : colors ? (
            /* Standard View (Principle/Guideline/Consideration/Example) */
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Header */}
              <div
                className="px-8 py-8 border-b-4 relative overflow-hidden"
                style={{
                  backgroundColor: colors.bgLight,
                  borderColor: principle?.color || '#ccc',
                }}
              >
                {logo && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 w-32 h-32 pointer-events-none">
                    <img src={logo} alt="" className="w-full h-full object-contain" />
                  </div>
                )}

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    {itemData.type === 'consideration' && consideration && (
                      <span className="font-mono text-5xl font-black" style={{ color: colors.hex }}>
                        {consideration.code}
                      </span>
                    )}
                    {itemData.type === 'guideline' && guideline && (
                      <span className="font-mono text-5xl font-black" style={{ color: colors.hex }}>
                        {guideline.code}
                      </span>
                    )}
                    <div className="flex flex-col gap-1">
                      {principle?.color && (
                        <Tag
                          color={principle.color}
                          label={
                            itemData.type === 'principle' && principle.preDescription
                              ? t(principle.preDescription).trim()
                              : (principle.preDescription
                                  ? t(principle.preDescription) + ' '
                                  : '') + t(principle.name)
                          }
                        />
                      )}
                    </div>
                  </div>
                  <h1 className="text-3xl font-black text-gray-900 leading-tight max-w-2xl">
                    {itemData.type === 'example' && example ? (
                      `${example.code}. ${t(example.activity)}`
                    ) : itemData.type === 'consideration' && consideration ? (
                      t(consideration.description)
                    ) : itemData.type === 'guideline' && guideline ? (
                      <>
                        {guideline.preDescription && (
                          <span className="text-sm font-bold text-gray-500 block mb-1">
                            {t(guideline.preDescription)}
                          </span>
                        )}
                        {t(guideline.name)}
                      </>
                    ) : itemData.type === 'principle' && principle ? (
                      t(principle.name)
                    ) : (
                      ''
                    )}
                  </h1>
                </div>
              </div>

              {/* Body */}
              <div className="px-8 py-8 space-y-8">
                {itemData.type === 'example' && example ? (
                  /* Example Details */
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div
                        className="p-6 rounded-2xl border"
                        style={{
                          backgroundColor: `${principle?.color}10`,
                          borderColor: `${principle?.color}30`,
                        }}
                      >
                        <h3
                          className="text-xs font-black uppercase tracking-widest mb-4"
                          style={{ color: principle?.color }}
                        >
                          {ui.educationalLevel}
                        </h3>
                        <div className="flex items-center gap-3">
                          <div
                            className="p-3 bg-white rounded-xl shadow-sm border"
                            style={{ borderColor: `${principle?.color}30` }}
                          >
                            <Search className="w-6 h-6" style={{ color: principle?.color }} />
                          </div>
                          <span className="text-xl font-bold text-gray-900">
                            {t(example.educationalLevel)}
                          </span>
                        </div>
                      </div>
                      <div
                        className="p-6 rounded-2xl border"
                        style={{
                          backgroundColor: `${principle?.color}10`,
                          borderColor: `${principle?.color}30`,
                        }}
                      >
                        <h3
                          className="text-xs font-black uppercase tracking-widest mb-4"
                          style={{ color: principle?.color }}
                        >
                          {ui.curricularArea}
                        </h3>
                        <div className="flex items-center gap-3">
                          <div
                            className="p-3 bg-white rounded-xl shadow-sm border"
                            style={{ borderColor: `${principle?.color}30` }}
                          >
                            <LayoutGrid className="w-6 h-6" style={{ color: principle?.color }} />
                          </div>
                          <span className="text-xl font-bold text-gray-900">
                            {t(example.curricularArea)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                          <span className="text-9xl font-black italic select-none">
                            {ui.udlAcronym}
                          </span>
                        </div>
                        <div className="relative z-10">
                          <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">
                            {ui.activity}
                          </h3>
                          <p className="text-2xl font-bold text-gray-900 leading-relaxed italic">
                            " {t(example.activity)} "
                          </p>
                        </div>
                      </div>
                      <div
                        className="p-8 rounded-3xl text-white shadow-xl relative overflow-hidden"
                        style={{ backgroundColor: principle?.color || '#1a1a1a' }}
                      >
                        <div className="relative z-10">
                          <h3 className="text-xs font-black uppercase tracking-widest text-white/60 mb-4">
                            {ui.designOptions}
                          </h3>
                          <div className="prose prose-invert prose-lg max-w-none">
                            <div className="space-y-4">
                              {tl(example.designOptions).map((paragraph, idx) => (
                                <p key={idx} className="text-white font-bold leading-relaxed">
                                  {paragraph}
                                </p>
                              ))}
                            </div>
                          </div>

                          {example.webTools && example.webTools.length > 0 && (
                            <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap gap-3">
                              {example.webTools.map((tool, idx) => (
                                <a
                                  key={idx}
                                  href={tool.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-3 px-4 py-2.5 bg-white hover:bg-gray-50 border border-gray-200 hover:border-blue-400 rounded-xl transition-all duration-300 group shadow-sm hover:shadow-md hover:scale-110"
                                >
                                  {tool.logo && (
                                    <img
                                      src={tool.logo}
                                      alt=""
                                      className="w-5 h-5 object-contain transition-transform duration-300 group-hover:scale-125"
                                    />
                                  )}
                                  <span className="text-sm font-bold text-gray-700 group-hover:text-blue-600 transition-colors">
                                    {tool.name}
                                  </span>
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {consideration && (
                      <div className="pt-8 border-t border-gray-100">
                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6">
                          {ui.consideration}
                        </h3>
                        <Link
                          to={`/detail/${consideration.id}`}
                          className="flex items-center gap-6 p-6 rounded-2xl bg-white border border-gray-100 hover:border-blue-400 hover:shadow-lg transition-all group"
                        >
                          <div className="w-16 h-16 shrink-0 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 group-hover:scale-110 transition-transform">
                            <span
                              className="font-mono text-xl font-black"
                              style={{ color: principle?.color }}
                            >
                              {consideration.code}
                            </span>
                          </div>
                          <div>
                            <p className="text-gray-900 font-bold text-lg group-hover:text-blue-600 transition-colors">
                              {t(consideration.description)}
                            </p>
                            {guideline && (
                              <p className="text-gray-500 text-sm mt-1">
                                {guideline.code}. {t(guideline.name)}
                              </p>
                            )}
                          </div>
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    {/* Guidelines and Considerations content */}
                    {itemData.type === 'principle' && networkId && (
                      <>
                        {(() => {
                          const network = udlData.networks.find((n) => n.id === networkId);
                          return network ? (
                            <div className="flex gap-6 items-start p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
                              <div className="w-16 h-16 shrink-0 bg-gray-50 rounded-xl p-2 border border-gray-100 shadow-inner">
                                <img src={logo} alt="" className="w-full h-full object-contain" />
                              </div>
                              <div>
                                <h3
                                  className="text-xs font-black uppercase tracking-widest mb-1"
                                  style={{ color: principle?.color || '#666' }}
                                >
                                  {t(network.name)}
                                </h3>
                                <p className="text-gray-700 font-medium">
                                  {t(network.description)}
                                </p>
                              </div>
                            </div>
                          ) : null;
                        })()}
                      </>
                    )}

                    {itemData.type === 'consideration' && guideline && (
                      <div
                        className="rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                        style={{
                          borderTop: `4px solid ${principle?.color || '#ccc'}`,
                          backgroundColor: colors.bgLight,
                        }}
                      >
                        <h2 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3">
                          {ui.guideline}
                        </h2>
                        <div className="flex items-center gap-4">
                          <span
                            className="font-mono text-2xl font-black px-3 py-1 rounded-lg bg-white shadow-sm border border-gray-100"
                            style={{ color: principle?.color }}
                          >
                            {guideline.code}
                          </span>
                          <span className="text-xl font-bold" style={{ color: principle?.color }}>
                            {guideline.preDescription && (
                              <span className="text-sm font-bold text-gray-400 block -mb-1">
                                {t(guideline.preDescription)}
                              </span>
                            )}
                            {t(guideline.name)}
                          </span>
                        </div>
                        <div className="mt-4 flex justify-end border-t border-black/5 pt-4">
                          <LevelBadge row={guideline.row} />
                        </div>
                      </div>
                    )}

                    {itemData.type === 'guideline' && guideline?.considerations && (
                      <div className="space-y-4">
                        <h2 className="text-sm font-black uppercase tracking-widest text-gray-500">
                          {ui.considerations}
                        </h2>
                        <div className="grid grid-cols-1 gap-2">
                          {guideline.considerations.map((cond) => (
                            <Link
                              key={cond.id}
                              to={`/detail/${cond.id}`}
                              className="block p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors shadow-sm"
                            >
                              <div className="flex items-start gap-4">
                                <span
                                  className="font-mono font-black py-1 px-2 bg-gray-50 rounded border text-sm"
                                  style={{ color: principle?.color }}
                                >
                                  {cond.code}
                                </span>
                                <p className="text-gray-800 font-medium">{t(cond.description)}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {itemData.type === 'principle' && principle?.guidelines && (
                      <div className="space-y-4">
                        <h2 className="text-sm font-black uppercase tracking-widest text-gray-500">
                          {ui.guidelines}
                        </h2>
                        <div className="grid grid-cols-1 gap-4">
                          {principle.guidelines.map((g) => (
                            <Link
                              key={g.id}
                              to={`/detail/${g.id}`}
                              className="block p-6 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors shadow-sm"
                              style={{ borderLeft: `8px solid ${principle.color}` }}
                            >
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                  <span
                                    className="font-mono text-xl font-black py-1 px-3 bg-white rounded-lg border shadow-sm"
                                    style={{ color: principle.color }}
                                  >
                                    {g.code}
                                  </span>
                                  <div>
                                    {g.preDescription && (
                                      <p className="text-gray-500 text-xs italic mb-0.5">
                                        {t(g.preDescription)}
                                      </p>
                                    )}
                                    <h3
                                      className="text-lg font-black leading-tight"
                                      style={{ color: principle.color }}
                                    >
                                      {t(g.name)}
                                    </h3>
                                  </div>
                                </div>
                                <LevelBadge row={g.row} />
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {guideline && itemData.type !== 'guideline' && relevantExamples.length > 0 && (
                      <div className="pt-8 print:pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between mb-6 print-break-after-avoid">
                          <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                            <span
                              className="w-2 h-8 rounded-full"
                              style={{ backgroundColor: principle?.color }}
                            />
                            {ui.examples}
                          </h2>
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                          {relevantExamples.map((ex) => (
                            <div
                              key={ex.id}
                              className="block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg hover:border-blue-300 transition-all group relative"
                            >
                              <Link
                                to={`/detail/${ex.id}`}
                                className="absolute inset-0 z-0 shadow-inner group-hover:bg-blue-50/10 transition-colors"
                                aria-label={ui.viewAction}
                              />
                              <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex flex-wrap gap-2 items-center justify-between relative z-10 pointer-events-none">
                                <div className="flex items-center gap-3">
                                  <span
                                    className="font-mono text-sm font-black"
                                    style={{ color: ex.color }}
                                  >
                                    {ex.code}
                                  </span>
                                  <div className="flex gap-2">
                                    <span className="px-2 py-1 text-[10px] font-black uppercase tracking-wider rounded-md border bg-gray-100 text-gray-700 border-gray-200">
                                      {t(ex.educationalLevel)}
                                    </span>
                                    <span className="px-2 py-1 text-[10px] font-black uppercase tracking-wider rounded-md border bg-gray-100 text-gray-700 border-gray-200">
                                      {t(ex.curricularArea)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="p-6 relative z-10">
                                <div className="text-gray-700 leading-relaxed font-medium pointer-events-none mb-4">
                                  <div className="mb-2">
                                    <span className="font-bold">{ui.activity}:</span>{' '}
                                    {t(ex.activity)}
                                  </div>
                                  <div>
                                    <span className="font-bold">{ui.designOptions}:</span>
                                    <div className="mt-1 space-y-2">
                                      {tl(ex.designOptions).map((paragraph, idx) => (
                                        <p key={idx}>{paragraph}</p>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                {ex.webTools && ex.webTools.length > 0 && (
                                  <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-50 relative z-20">
                                    {ex.webTools.map((tool, idx) => (
                                      <a
                                        key={idx}
                                        href={tool.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-2 py-1 bg-white hover:bg-blue-50 border border-gray-100 hover:border-blue-200 rounded-lg transition-all group shadow-sm"
                                      >
                                        {tool.logo && (
                                          <img
                                            src={tool.logo}
                                            alt=""
                                            className="w-4 h-4 object-contain transition-transform duration-300 group-hover:scale-125"
                                          />
                                        )}
                                        <span className="text-[11px] font-bold text-gray-600 group-hover:text-blue-600">
                                          {tool.name}
                                        </span>
                                      </a>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ) : null}
          <FloatingNavigation currentPage="detail" />
          <Footer />
        </div>
      </div>
    </div>
  );
}
