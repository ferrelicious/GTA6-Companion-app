import { AlertTriangle, CheckCircle2, ChevronDown, Globe, Wrench } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { LANGUAGE_OPTIONS, useTranslation } from '../i18n/translations';
import { ConsolePlatform, PlatformServerStatus } from '../types';

interface TopBarProps {
  selectedConsole: ConsolePlatform;
  onSelectConsole: (platform: ConsolePlatform) => void;
  serverStatus: PlatformServerStatus[];
  onOpenServerStatus: () => void;
}

export function TopBar({
  selectedConsole,
  onSelectConsole,
  serverStatus,
  onOpenServerStatus,
}: TopBarProps) {
  const { language, setLanguage, t, localizeServerStatus } = useTranslation();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeServer = serverStatus.find((s) => s.platform === selectedConsole) ?? serverStatus[0];
  const localizedServer = activeServer ? localizeServerStatus(activeServer) : null;
  const activeLangOption =
    LANGUAGE_OPTIONS.find((opt) => opt.code === language) ?? LANGUAGE_OPTIONS[0];

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsLangOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsLangOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 h-14 leonida-glass border-b border-white/[0.08]">
      <div className="max-w-6xl mx-auto h-full px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            aria-hidden="true"
            className="w-2.5 h-6 rounded-sm bg-gradient-to-b from-[#FF2A85] to-[#00F0FF] shrink-0"
          />
          <span className="font-display text-sm sm:text-lg font-bold tracking-tight text-white whitespace-nowrap truncate">
            {t.common.appName}
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Compact Server Status Indicator */}
          {localizedServer && (
            <button
              type="button"
              onClick={onOpenServerStatus}
              title={`${t.common.serverStatusShort}: ${localizedServer.overallLabel}`}
              aria-label={`${t.common.serverStatusShort}: ${localizedServer.overallLabel}`}
              className="inline-flex items-center gap-1.5 min-h-[36px] px-2.5 py-1 rounded-xl bg-[#0D0F14]/90 border border-white/10 hover:border-white/25 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00F0FF]"
            >
              {localizedServer.overall === 'online' ? (
                <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
              ) : localizedServer.overall === 'degraded' ? (
                <AlertTriangle size={14} className="text-amber-400 shrink-0" />
              ) : (
                <Wrench size={14} className="text-rose-400 shrink-0" />
              )}
              <span
                className={`hidden md:inline ${
                  localizedServer.overall === 'online'
                    ? 'text-emerald-300'
                    : localizedServer.overall === 'degraded'
                      ? 'text-amber-300'
                      : 'text-rose-300'
                }`}
              >
                {localizedServer.overallLabel}
              </span>
            </button>
          )}

          {/* Console Switcher */}
          <div
            role="group"
            aria-label={t.common.selectConsoleAria}
            className="flex items-center p-0.5 sm:p-1 rounded-xl bg-[#0D0F14]/90 border border-white/10 shrink-0"
          >
            <button
              type="button"
              onClick={() => onSelectConsole('ps5')}
              className={`min-h-[32px] px-2 sm:px-3 py-1 rounded-lg text-[11px] sm:text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00F0FF] ${
                selectedConsole === 'ps5'
                  ? 'bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/40'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              {t.common.ps5}
            </button>
            <button
              type="button"
              onClick={() => onSelectConsole('xbox')}
              className={`min-h-[32px] px-2 sm:px-3 py-1 rounded-lg text-[11px] sm:text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2A85] ${
                selectedConsole === 'xbox'
                  ? 'bg-[#FF2A85]/15 text-[#FF2A85] border border-[#FF2A85]/40'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              <span className="sm:hidden">{t.common.xboxShort}</span>
              <span className="hidden sm:inline">{t.common.xbox}</span>
            </button>
          </div>

          {/* Language Dropdown */}
          <div ref={dropdownRef} className="relative shrink-0">
            <button
              type="button"
              onClick={() => setIsLangOpen((prev) => !prev)}
              aria-haspopup="listbox"
              aria-expanded={isLangOpen}
              aria-label={t.common.selectLanguageAria}
              className="inline-flex items-center gap-1.5 min-h-[36px] px-2.5 py-1 rounded-xl bg-[#0D0F14]/90 border border-white/10 hover:border-white/25 text-xs font-semibold text-slate-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00F0FF]"
            >
              <Globe size={13} className="text-[#00F0FF] hidden sm:inline shrink-0" />
              <span aria-hidden="true">{activeLangOption.flag}</span>
              <span className="font-mono">{activeLangOption.shortLabel}</span>
              <ChevronDown
                size={13}
                className={`text-slate-400 transition-transform ${
                  isLangOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isLangOpen && (
              <div
                role="listbox"
                aria-label={t.common.selectLanguageAria}
                className="absolute right-0 mt-2 w-44 rounded-xl bg-[#141720] border border-white/15 shadow-2xl py-1 z-50"
              >
                {LANGUAGE_OPTIONS.map((opt) => {
                  const selected = opt.code === language;
                  return (
                    <button
                      key={opt.code}
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onClick={() => {
                        setLanguage(opt.code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full px-3.5 py-2.5 min-h-[40px] flex items-center justify-between gap-2 text-left text-xs transition-colors cursor-pointer ${
                        selected
                          ? 'bg-[#00F0FF]/15 text-[#00F0FF] font-semibold'
                          : 'text-slate-200 hover:bg-white/[0.05]'
                      }`}
                    >
                      <span className="flex items-center gap-2.5 min-w-0">
                        <span aria-hidden="true">{opt.flag}</span>
                        <span className="truncate">{opt.nativeName}</span>
                      </span>
                      <span className="font-mono text-[11px] opacity-80 shrink-0">
                        {opt.shortLabel}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
