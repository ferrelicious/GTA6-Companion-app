import { ConsolePlatform } from '../types';

interface TopBarProps {
  selectedConsole: ConsolePlatform;
  onSelectConsole: (platform: ConsolePlatform) => void;
}

export function TopBar({ selectedConsole, onSelectConsole }: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 h-14 leonida-glass border-b border-white/[0.08]">
      <div className="max-w-6xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <span
            aria-hidden="true"
            className="w-2.5 h-6 rounded-sm bg-gradient-to-b from-[#FF2A85] to-[#00F0FF] shrink-0"
          />
          <span className="font-display text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap truncate">
            Leonida Companion
          </span>
        </div>

        <div
          role="group"
          aria-label="Välj konsolplattform"
          className="flex items-center p-1 rounded-xl bg-[#0D0F14]/90 border border-white/10 shrink-0"
        >
          <button
            type="button"
            onClick={() => onSelectConsole('ps5')}
            className={`min-h-[34px] px-3 py-1 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00F0FF] ${
              selectedConsole === 'ps5'
                ? 'bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/40'
                : 'text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
          >
            PS5
          </button>
          <button
            type="button"
            onClick={() => onSelectConsole('xbox')}
            className={`min-h-[34px] px-3 py-1 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2A85] ${
              selectedConsole === 'xbox'
                ? 'bg-[#FF2A85]/15 text-[#FF2A85] border border-[#FF2A85]/40'
                : 'text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
          >
            Xbox Series X|S
          </button>
        </div>
      </div>
    </header>
  );
}
