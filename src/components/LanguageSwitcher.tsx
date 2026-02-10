import * as Select from '@radix-ui/react-select';
import { ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import type { Language } from '../types';

const languages: { code: Language; label: string }[] = [
  { code: 'es', label: 'Español' },
  { code: 'en', label: 'English' },
  { code: 'eu', label: 'Euskara' },
  { code: 'la', label: 'Latina' },
];

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <Select.Root
      value={language}
      onValueChange={(val) => setLanguage(val as Language)}
    >
      {/* Trigger */}
      <Select.Trigger
        aria-label="Language selection"
        className="
          inline-flex items-center justify-center gap-2
          rounded-md px-4 py-2.5
          text-sm font-bold 
          bg-white border border-gray-200 text-gray-700
          hover:bg-gray-50
          shadow-sm transition-all
          focus:outline-none focus:ring-2 focus:ring-gray-300
        "
      >
        <Select.Value />
        <Select.Icon className="text-gray-400">
          <ChevronDown className="w-5 h-5" />
        </Select.Icon>
      </Select.Trigger>

      {/* Dropdown */}
      <Select.Portal>
        <Select.Content
          className="
            z-50 overflow-hidden rounded-md
            bg-white border border-gray-200
            shadow-lg
          "
        >
          <Select.Viewport className="p-1">
            {languages.map((lang) => (
              <Select.Item
                key={lang.code}
                value={lang.code}
                className="
                  relative flex items-center
                  h-10 px-8
                  text-sm font-semibold text-gray-700
                  rounded-md cursor-pointer select-none
                  data-highlighted:bg-gray-900
                  data-highlighted:text-white
                  outline-none
                "
              >
                <Select.ItemText>{lang.label}</Select.ItemText>

                <Select.ItemIndicator
                  className="absolute left-2 inline-flex items-center justify-center"
                >
                  <Check className="w-4 h-4" />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
