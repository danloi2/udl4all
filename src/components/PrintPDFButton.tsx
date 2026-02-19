import { Printer } from 'lucide-react';

interface PrintPDFButtonProps {
  className?: string;
  onBeforePrint?: () => void | Promise<void>;
  onAfterPrint?: () => void;
  instructions?: string[];
  orientation?: 'landscape' | 'portrait';
  scale?: number;
}

export default function PrintPDFButton({
  className = '',
  onBeforePrint,
  onAfterPrint,
  instructions,
  orientation = 'portrait',
  scale,
}: PrintPDFButtonProps) {
  const handlePrint = async () => {
    // Inject dynamic print styles
    const styleId = 'dynamic-print-styles';
    let styleEl = document.getElementById(styleId) as HTMLStyleElement;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    const scaleRule = scale
      ? `
      body {
        transform: scale(${scale});
        transform-origin: top center;
        width: ${100 / scale}%;
      }`
      : '';

    /* @page must be at the TOP LEVEL — never nested inside @media print.
       Browsers silently ignore @page when nested inside @media. */
    styleEl.innerHTML = `
      @page {
        size: A4 ${orientation};
        margin: 8mm 10mm;
      }
      @media print {
        ${scaleRule}
      }
    `;

    if (onBeforePrint) {
      await onBeforePrint();
    }

    // If parent handles printing manually (by not passing onBeforePrint or handling it internally),
    // we might still want to trigger window.print() here generally, but MapView handles it itself via useEffect.
    // However, since MapView passes onBeforePrint, we await it.
    // MapView set state, but we need to wait for render.
    // MapView's handleBeforePrint returns a promise that resolves when data is ready.

    // For MapView specific case where we want to wait for an image to render:
    // The parent (MapView) should probably delay resolving onBeforePrint until image is in DOM?
    // Or we just keep a small timeout here to let React render updates from onBeforePrint.

    setTimeout(() => {
      window.print();

      if (onAfterPrint) {
        setTimeout(() => {
          onAfterPrint();
          // Clean up styles? Maybe keep them until next print?
          // Better to leave them to avoid flashing if user cancels and retries quickly
        }, 100);
      }
    }, 500);
  };

  return (
    <div className="relative group/pdf">
      {/* Instructions tooltip panel — shown on hover, hidden during print */}
      {instructions && instructions.length > 0 && (
        <div
          className="
            absolute right-full mr-4 bottom-0
            w-64 p-3
            bg-gray-900/90 backdrop-blur
            text-white text-xs rounded-xl shadow-2xl
            opacity-0 group-hover/pdf:opacity-100
            pointer-events-none
            transition-all duration-200
            print:hidden
          "
        >
          <p className="font-black uppercase tracking-widest text-[10px] text-white/50 mb-2">
            Instrucciones de impresión
          </p>
          <ul className="space-y-1.5">
            {instructions.map((line, i) => (
              <li key={i} className="flex gap-2 items-start leading-snug">
                <span className="text-blue-400 font-black shrink-0">{i + 1}.</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={handlePrint}
        className={`flex flex-col items-center justify-center w-16 h-16 bg-gray-800 text-white rounded-2xl shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 print:hidden ${className}`}
        title="Imprimir PDF / Print to PDF"
      >
        <Printer className="w-6 h-6 mb-1" />
        <span className="text-[10px] font-black uppercase tracking-widest">PDF</span>
      </button>
    </div>
  );
}
