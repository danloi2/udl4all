import { Github, Info, Scale } from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';
import pkg from '../../package.json';
import LanguageSwitcher from './LanguageSwitcher';
import Breadcrumbs from './Breadcrumbs';

interface HeaderProps {
  breadcrumbItems: Array<{ label: string; href?: string; icon?: any }>;
  bgColor?: string;
  breadcrumbColor?: string;
}

export default function Header({
  breadcrumbItems,
  bgColor = 'bg-white',
  breadcrumbColor,
}: HeaderProps) {
  return (
    <div
      className={`${bgColor} border-b border-gray-200 sticky top-0 z-20 shadow-sm transition-colors duration-300`}
    >
      {/* Dynamic Background Overlay for Principle Colors */}
      {breadcrumbColor && (
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundColor: breadcrumbColor }}
        />
      )}

      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Branding & Version */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center font-black tracking-tighter text-xl logo-elegant-hover transition-all duration-300">
              <span style={{ color: '#078743' }}>udl</span>
              <span style={{ color: '#831682' }}>4</span>
              <span style={{ color: '#295e86' }}>all</span>
            </div>
            <span className="px-1 py-0 bg-gray-100 text-gray-500 font-bold text-[8px] rounded border border-gray-200 uppercase tracking-tighter">
              v{pkg.version}
            </span>
          </div>

          {/* Center: Navigation (Breadcrumbs) - Flexible space */}
          <div className="flex-1 min-w-0">
            <Breadcrumbs items={breadcrumbItems} color={breadcrumbColor} />
          </div>

          {/* Right: Metadata & Language Switcher */}
          <div className="flex items-center gap-2.5 shrink-0">
            <Tooltip.Provider>
              <div className="flex items-center gap-2.5">
                {/* Copyright info */}
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <button className="text-gray-400 hover:text-gray-600 transition-colors cursor-help outline-none">
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      className="select-none rounded bg-gray-900 px-2 py-1 text-[10px] font-bold leading-none text-white shadow-lg animate-in fade-in zoom-in duration-200 z-50"
                      sideOffset={5}
                    >
                      <a
                        href="https://ekoizpen-zientifikoa.ehu.eus/investigadores/130988/detalle"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        © 2026 Daniel Losada
                      </a>
                      <Tooltip.Arrow className="fill-gray-900" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>

                {/* GitHub link */}
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <a
                      href="https://github.com/danloi2/udl"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-black transition-colors"
                      aria-label="GitHub Repository"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      className="select-none rounded bg-gray-900 px-2 py-1 text-[10px] font-bold leading-none text-white shadow-lg animate-in fade-in zoom-in duration-200 z-50"
                      sideOffset={5}
                    >
                      GitHub Repository
                      <Tooltip.Arrow className="fill-gray-900" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>

                {/* License info */}
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <a
                      href="https://github.com/danloi2/udl/blob/main/LICENSE"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-black transition-colors"
                      aria-label="MIT License"
                    >
                      <Scale className="w-4 h-4" />
                    </a>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      className="select-none rounded bg-gray-900 px-2 py-1 text-[10px] font-bold leading-none text-white shadow-lg animate-in fade-in zoom-in duration-200 z-50"
                      sideOffset={5}
                    >
                      MIT License
                      <Tooltip.Arrow className="fill-gray-900" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </div>
            </Tooltip.Provider>

            <div className="h-4 w-px bg-gray-200 mx-0.5" />

            <LanguageSwitcher />
          </div>
        </div>
      </div>

      <style>{`
        .logo-elegant-hover {
          cursor: default;
        }
        .logo-elegant-hover:hover {
          filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.8));
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
}
