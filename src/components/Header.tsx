import { Github, Scale } from 'lucide-react';
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
          {/* Left: Branding & Version (Stacked) */}
          <div className="flex flex-col items-start leading-none gap-1 shrink-0">
            <div className="flex items-center font-black tracking-tighter text-2xl logo-elegant-hover transition-all duration-300">
              <span style={{ color: '#078743' }}>udl</span>
              <span style={{ color: '#831682' }}>4</span>
              <span style={{ color: '#295e86' }}>all</span>
            </div>
            <span className="px-1.5 py-0.5 border font-black text-xs rounded-sm uppercase tracking-widest flex items-center justify-center transition-all duration-300 version-badge-dynamic shadow-sm">  
              v{pkg.version}
            </span>
            <span
              className="px-1.5 py-0.5 border font-black text-3xl rounded-sm uppercase tracking-widest transition-colors duration-300"
              style={{
                backgroundColor: breadcrumbColor ? `${breadcrumbColor}15` : '#f3f4f6',
                borderColor: breadcrumbColor ? `${breadcrumbColor}40` : '#e5e7eb',
                color: breadcrumbColor ? breadcrumbColor : '#6b7280',
              }}
            >
            </span>  
           
          </div>

          {/* Center: Navigation (Breadcrumbs) - Flexible space */}
          <div className="flex-1 min-w-0">
            <Breadcrumbs items={breadcrumbItems} color={breadcrumbColor} />
          </div>

          {/* Right: Metadata & Language Switcher */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex flex-col items-end leading-none gap-1">
              {/* Copyright info */}
              <a
                href="https://ekoizpen-zientifikoa.ehu.eus/investigadores/130988/detalle"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-black transition-colors text-base font-bold tracking-wider whitespace-nowrap hidden sm:inline-block"
              >
                © 2026 Daniel Losada
              </a>

              <Tooltip.Provider>
                <div className="flex items-center gap-2">
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
                        <Github className="w-6 h-6" />
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
                        <Scale className="w-6 h-6" />
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
            </div>

            <div className="h-8 w-px bg-gray-200" />

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
