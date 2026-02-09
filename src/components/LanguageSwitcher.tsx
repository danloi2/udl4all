import * as Select from '@radix-ui/react-select';
import { ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import type { Language } from '../types';

const languages: { code: Language; label: string }[] = [
  { code: 'es', label: 'Castellano' },
  { code: 'en', label: 'English' },
  { code: 'eu', label: 'Euskara' },
  { code: 'la', label: 'Latina' },
];

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <Select.Root value={language} onValueChange={(val) => setLanguage(val as Language)}>
      <Select.Trigger
        className="inline-flex items-center justify-center rounded px-1.5 py-1 text-[10px] font-black uppercase leading-none gap-1 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 focus:outline-none shadow-sm transition-all"
        aria-label="Language selection"
      >
        <Select.Value>{language}</Select.Value>
        <Select.Icon className="text-gray-400">
          <ChevronDown className="w-3 h-3" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content className="overflow-hidden bg-white rounded-md shadow-[0px_10px_38px_-10px_rgba(22,23,24,0.35),0px_10px_20px_-15px_rgba(22,23,24,0.2)] border border-gray-100 z-50">
          <Select.Viewport className="p-1">
            {languages.map((lang) => (
              <Select.Item
                key={lang.code}
                value={lang.code}
                className="text-[11px] font-bold leading-none text-gray-700 rounded-[3px] flex items-center h-[28px] px-[25px] relative select-none data-disabled:text-gray-400 data-disabled:pointer-events-none data-highlighted:outline-none data-highlighted:bg-gray-900 data-highlighted:text-white cursor-pointer"
              >
                <Select.ItemText>{lang.label}</Select.ItemText>
                <Select.ItemIndicator className="absolute left-0 w-[25px] inline-flex items-center justify-center">
                  <Check className="w-3.5 h-3.5" />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
