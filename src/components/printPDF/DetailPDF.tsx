import { useLanguage } from '../../contexts/LanguageContext';
import { useUI } from '../../contexts/UIContext';
import { useUDLData } from '../../contexts/UDLDataContext';
import { getColorStyles } from '../../utils/colors';
import { LayoutGrid, Search, Lightbulb } from 'lucide-react';
import type { Activity, Principle, Guideline, Consideration, Example } from '../../types';

interface DetailPDFProps {
  itemData: any;
}
import affectiveLogo from '../../assets/brains/affective_logo.svg';
import recognitionLogo from '../../assets/brains/recognition_logo.svg';
import strategicLogo from '../../assets/brains/strategic_logo.svg';
import pkg from '../../../package.json';

const brainLogos = {
  affective: affectiveLogo,
  recognition: recognitionLogo,
  strategic: strategicLogo,
};

export default function DetailPDF({ itemData }: DetailPDFProps) {
  const { t, tl } = useLanguage();
  const ui = useUI();
  const {
    udlData, // Ensure udlData is destructured
    udlIndex,
    getConsiderationById: _getConsiderationById,
    getGuidelineForConsideration,
    getPrincipleForConsideration,
    getConsiderationForExample,
  } = useUDLData();

  if (!itemData) return null;

  const activity = itemData.type === 'activity' ? (itemData.item as Activity) : null;
  const example = itemData.type === 'example' ? (itemData.item as Example) : null;
  const consideration =
    itemData.type === 'consideration'
      ? (itemData.item as Consideration)
      : itemData.type === 'example'
        ? (itemData.consideration as Consideration)
        : null;
  const guideline = itemData.guideline as Guideline | null;
  const principle = itemData.principle as Principle | null;

  const networkId = principle
    ? udlData.networks.find((n) => n.principle.id === principle.id)?.id
    : undefined;
  const logo = networkId ? brainLogos[networkId as keyof typeof brainLogos] : undefined;

  // --- Helpers for Activity Grouping (duplicated from Detail.tsx for self-containment) ---
  const getConsiderationByCode = (code: string) => {
    for (const [, cons] of udlIndex.considerations) {
      if (cons.code === code) return cons;
    }
    return null;
  };

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

      if (p1 !== p2) return p1 - p2;
      if (a1 !== b1) return a1 - b1;
      return a2 - b2;
    });
  };

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
  const relevantExamples = (() => {
    if (!guideline) return [];

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
  })();

  // ... Renderers ...

  // 1. Activity Full View
  if (itemData.type === 'activity' && activity) {
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

        {/* Activity Header */}
        <div className="border-b-4 border-gray-300 pb-6 mb-8 bg-gray-50 p-6 rounded-t-xl">
          <div className="flex justify-between items-start mb-4">
            <span className="font-mono text-4xl font-black text-gray-400">{activity.code}</span>
            <div className="flex gap-2">
              <span className="px-3 py-1 text-xs font-black uppercase tracking-wider rounded-md border bg-white text-gray-700 border-gray-200">
                {t(activity.gradeLevel)}
              </span>
              <span className="px-3 py-1 text-xs font-black uppercase tracking-wider rounded-md border bg-white text-gray-700 border-gray-200">
                {t(activity.subject)}
              </span>
            </div>
          </div>
          <h1 className="text-3xl font-black text-gray-900 leading-tight max-w-3xl">
            {t(activity.title)}
          </h1>
        </div>

        {/* Adaptations Grid */}
        <div className="space-y-8">
          <h2 className="text-xl font-black uppercase tracking-widest text-gray-900 flex items-center gap-3 border-b pb-2 break-after-avoid">
            <LayoutGrid className="w-6 h-6" />
            {ui.examples}
          </h2>

          <div className="space-y-8">
            {groupAdaptations(activity.duaAdaptations).map((pGroup, pIdx) => (
              <div
                key={pIdx}
                className="space-y-6 border-2 border-dashed border-gray-200 rounded-3xl p-6"
              >
                {/* Principle Header */}
                <h3
                  className="text-2xl font-black uppercase tracking-wider flex items-center gap-3 break-after-avoid"
                  style={{ color: pGroup.principle.color }}
                >
                  <span
                    className="w-3 h-8 rounded-full print-color-adjust-exact"
                    style={{ backgroundColor: pGroup.principle.color }}
                  />
                  {t(pGroup.principle.name)}
                </h3>

                <div className="space-y-6 pl-4">
                  {pGroup.guidelines.map((gGroup, gIdx) => (
                    <div key={gIdx} className="space-y-4">
                      {/* Guideline Header */}
                      <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg w-fit print-color-adjust-exact">
                        <span
                          className="font-mono text-xl font-black px-2 py-0.5 rounded text-white print-color-adjust-exact"
                          style={{ backgroundColor: pGroup.principle.color }}
                        >
                          {gGroup.guideline.code}
                        </span>
                        <h4 className="text-lg font-bold text-gray-800">
                          {t(gGroup.guideline.name)}
                        </h4>
                      </div>

                      {/* Items */}
                      <div
                        className="grid grid-cols-1 gap-4 border-l-4 pl-4"
                        style={{ borderColor: `${pGroup.principle.color}20` }}
                      >
                        {gGroup.items.map(([code, adaptation], iIdx) => {
                          const cons = getConsiderationByCode(code);
                          return (
                            <div
                              key={iIdx}
                              className="flex gap-4 p-4 rounded-xl border border-gray-200 bg-white break-inside-avoid"
                            >
                              <div className="shrink-0">
                                <div
                                  className="w-10 h-10 rounded-xl flex items-center justify-center font-mono text-base font-black text-white print-color-adjust-exact"
                                  style={{ backgroundColor: pGroup.principle.color }}
                                >
                                  {code}
                                </div>
                              </div>
                              <div className="space-y-2 grow">
                                {cons && (
                                  <h5 className="text-xs font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-1">
                                    {t(cons.description)}
                                  </h5>
                                )}
                                <div className="space-y-2">
                                  {tl(adaptation.text).map((paragraph, pIdx) =>
                                    paragraph.trim() ? (
                                      <div key={pIdx} className="flex gap-2 items-start">
                                        <Lightbulb
                                          className="w-4 h-4 shrink-0 mt-1"
                                          style={{ color: pGroup.principle.color }}
                                        />
                                        <p className="text-gray-900 font-medium leading-relaxed">
                                          {paragraph}
                                        </p>
                                      </div>
                                    ) : null
                                  )}
                                </div>
                                {adaptation.webTools && adaptation.webTools.length > 0 && (
                                  <div className="mt-3 pt-2 border-t border-gray-100 flex flex-wrap gap-2">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mr-1 self-center">
                                      {ui.webTools}:
                                    </span>
                                    {adaptation.webTools.map((tool: any, tIdx: number) => (
                                      <span
                                        key={tIdx}
                                        className="flex items-center gap-1 px-2 py-0.5 bg-gray-50 border border-gray-200 rounded text-[10px] font-bold text-gray-600"
                                      >
                                        {tool.name}
                                      </span>
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

        <div className="mt-8 pt-4 border-t text-sm text-gray-500 flex justify-between">
          <span>© 2026 Daniel Losada</span>
          <span>udl4all</span>
        </div>
      </div>
    );
  }

  // 2. Standard View
  const colors = guideline
    ? getColorStyles(guideline.color || '#ccc')
    : principle
      ? getColorStyles(principle.color || '#ccc')
      : undefined;

  const headerBg = colors ? `${colors.hex}15` : '#f3f4f6';
  const headerBorder = principle?.color || '#000';

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

      {/* Activity Header */}
      <div
        className="border-b-4 pb-6 mb-6 rounded-t-xl p-6 print-color-adjust-exact"
        style={{ borderColor: headerBorder, backgroundColor: headerBg }}
      >
        {/* Header content ... */}
        <div className="flex justify-between items-start">
          {/* ... existing header logic ... */}
          <div>
            {itemData.type === 'consideration' && consideration && (
              <span
                className="font-mono text-5xl font-black block mb-2"
                style={{ color: principle?.color }}
              >
                {consideration.code}
              </span>
            )}
            {itemData.type === 'guideline' && guideline && (
              <span
                className="font-mono text-5xl font-black block mb-2"
                style={{ color: principle?.color }}
              >
                {guideline.code}
              </span>
            )}
            {(itemData.type === 'guideline' || itemData.type === 'consideration') && principle && (
              <span
                className="inline-block px-2 py-1 rounded text-white text-xs font-bold uppercase tracking-widest mb-1 print-color-adjust-exact"
                style={{ backgroundColor: principle.color }}
              >
                {t(principle.name)}
              </span>
            )}
            {/* Add Principle Header Special Case if needed, or rely on title below */}
          </div>
          {/* Logo in Header for Principle/Guideline */}
          {logo && (
            <div className="opacity-20 w-16 h-16">
              <img src={logo} alt="" className="w-full h-full object-contain" />
            </div>
          )}
        </div>
        <h1 className="text-3xl font-black text-gray-900 mt-2 leading-tight">
          {itemData.type === 'example' && example
            ? `${example.code}. ${t(example.activity)}`
            : itemData.type === 'consideration' && consideration
              ? t(consideration.description)
              : itemData.type === 'guideline' && guideline
                ? t(guideline.name)
                : itemData.type === 'principle' && principle
                  ? t(principle.name)
                  : ''}
        </h1>
        {itemData.type === 'guideline' && guideline?.preDescription && (
          <p className="text-gray-600 font-bold mt-2">{t(guideline.preDescription)}</p>
        )}
        {itemData.type === 'principle' && principle?.preDescription && (
          <p className="text-gray-600 font-bold mt-2">{t(principle.preDescription)}</p>
        )}
      </div>

      <div className="space-y-8">
        {/* Example View ... */}
        {itemData.type === 'example' && example && (
          // Wrapped in a simple div to manage spacing manually
          <div className="block">
            {/* Metadata Grid - Keep together */}
            <div className="grid grid-cols-2 gap-4 break-inside-avoid mb-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2 flex items-center gap-2">
                  <Search className="w-4 h-4" /> {ui.educationalLevel}
                </div>
                <div className="font-bold text-lg">{t(example.educationalLevel)}</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2 flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4" /> {ui.curricularArea}
                </div>
                <div className="font-bold text-lg">{t(example.curricularArea)}</div>
              </div>
            </div>

            {/* Design Options - Allow breaking to start on Page 1 */}
            <div
              className="p-5 rounded-2xl text-white shadow-sm print-color-adjust-exact break-inside-auto"
              style={{
                backgroundColor: principle?.color || '#1a1a1a',
                breakBefore: 'auto',
                pageBreakBefore: 'auto',
                breakInside: 'auto',
                pageBreakInside: 'auto',
              }}
            >
              <h3 className="text-xs font-black uppercase tracking-widest text-white/70 mb-4 break-after-avoid">
                {ui.designOptions}
              </h3>
              <div className="space-y-4">
                {tl(example.designOptions).map((p: string, i: number) => (
                  <p key={i} className="text-white font-bold leading-relaxed text-lg">
                    {p}
                  </p>
                ))}
              </div>
              {example.webTools && example.webTools.length > 0 && (
                <div className="mt-6 pt-4 border-t border-white/20 flex flex-wrap gap-2 break-inside-avoid">
                  {example.webTools.map((tool, idx) => (
                    <span key={idx} className="bg-white/20 px-2 py-1 rounded text-xs font-bold">
                      {tool.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {consideration && (
              <div className="flex items-center gap-4 p-4 border rounded-xl bg-gray-50 break-inside-avoid mt-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center font-mono font-black text-xl bg-white border"
                  style={{ color: principle?.color }}
                >
                  {consideration.code}
                </div>
                <div>
                  <div className="text-xs uppercase font-bold text-gray-500">
                    {ui.consideration}
                  </div>
                  <div className="font-bold">{t(consideration.description)}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Consideration View ... */}
        {itemData.type === 'consideration' && guideline && (
          <div className="p-6 border-2 rounded-2xl bg-gray-50 flex items-center gap-4">
            <div className="text-center">
              <span className="text-xs uppercase font-bold text-gray-500 block mb-1">
                {ui.guideline}
              </span>
              <span className="font-mono text-3xl font-black" style={{ color: principle?.color }}>
                {guideline.code}
              </span>
            </div>
            <div className="w-px h-12 bg-gray-300"></div>
            <p className="font-bold text-xl text-gray-800">{t(guideline.name)}</p>
          </div>
        )}

        {/* Guideline View: List Considerations */}
        {itemData.type === 'guideline' && guideline?.considerations && (
          <div className="space-y-4">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-500 border-b pb-2">
              {ui.considerations}
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {guideline.considerations.map((c: any) => (
                <div
                  key={c.id}
                  className="p-4 border rounded-xl bg-gray-50 break-inside-avoid flex items-start gap-4"
                >
                  <span
                    className="font-mono font-black text-lg bg-white px-2 py-1 rounded border shadow-sm"
                    style={{ color: principle?.color }}
                  >
                    {c.code}
                  </span>
                  <span className="font-medium text-lg leading-snug pt-1">{t(c.description)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Principle View: List Guidelines */}
        {itemData.type === 'principle' && principle && (
          <div className="space-y-8">
            {/* Network Info */}
            {networkId &&
              (() => {
                const network = udlData.networks.find((n) => n.id === networkId);
                return network ? (
                  <div className="flex gap-6 items-start p-6 rounded-2xl bg-gray-50 border border-gray-100">
                    <div className="w-16 h-16 shrink-0 bg-white rounded-xl p-2 border border-gray-100 shadow-sm flex items-center justify-center">
                      {logo && <img src={logo} alt="" className="w-full h-full object-contain" />}
                    </div>
                    <div>
                      <h3
                        className="text-xs font-black uppercase tracking-widest mb-1"
                        style={{ color: principle.color }}
                      >
                        {t(network.name)}
                      </h3>
                      <p className="text-gray-700 font-medium">{t(network.description)}</p>
                    </div>
                  </div>
                ) : null;
              })()}

            {/* Guidelines */}
            {principle.guidelines && (
              <div className="space-y-4">
                <h2 className="text-sm font-black uppercase tracking-widest text-gray-500 border-b pb-2">
                  {ui.guidelines}
                </h2>
                <div className="grid grid-cols-1 gap-6">
                  {principle.guidelines.map((g) => (
                    <div
                      key={g.id}
                      className="block p-6 rounded-2xl border border-gray-100 bg-white break-inside-avoid shadow-sm"
                      style={{ borderLeft: `8px solid ${principle.color}` }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <span
                            className="font-mono text-xl font-black py-1 px-3 bg-gray-50 rounded-lg border border-gray-200"
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
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {guideline && relevantExamples.length > 0 && (
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
                  className="block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden break-inside-avoid"
                >
                  <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex flex-wrap gap-2 items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        className="font-mono text-sm font-black"
                        style={{ color: principle?.color }} // Using principle color fallback
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
                  <div className="p-6">
                    <div className="text-gray-700 leading-relaxed font-medium mb-4">
                      <div className="mb-2">
                        <span className="font-bold">{ui.activity}:</span> {t(ex.activity)}
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
                      <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-50">
                        {ex.webTools.map((tool: any, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 px-2 py-1 bg-white border border-gray-100 rounded-lg"
                          >
                            {tool.logo && (
                              <img src={tool.logo} alt="" className="w-4 h-4 object-contain" />
                            )}
                            <span className="text-[11px] font-bold text-gray-600">{tool.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
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
