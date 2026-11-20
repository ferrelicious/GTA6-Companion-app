import { CheckSquare, Gamepad2, Map as MapIcon, Newspaper } from 'lucide-react';
import { MainTab } from '../types';

interface BottomNavProps {
  activeTab: MainTab;
  onSelectTab: (tab: MainTab) => void;
}

const NAV_ITEMS: { id: MainTab; label: string; icon: typeof Newspaper }[] = [
  { id: 'patches', label: 'Uppdateringar', icon: Newspaper },
  { id: 'map', label: 'Karta', icon: MapIcon },
  { id: 'checklist', label: 'Checklista', icon: CheckSquare },
  { id: 'guides', label: 'Guider & Fusk', icon: Gamepad2 },
];

export function BottomNav({ activeTab, onSelectTab }: BottomNavProps) {
  return (
    <nav
      aria-label="Huvudnavigering"
      className="fixed bottom-0 left-0 right-0 z-40 leonida-glass border-t border-white/10 pb-[env(safe-area-inset-bottom)]"
    >
      <div className="max-w-3xl mx-auto grid grid-cols-4 h-16">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`relative flex flex-col items-center justify-center min-h-[44px] px-1 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#00F0FF] ${
                isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-0.5 rounded-full bg-gradient-to-r from-[#FF2A85] to-[#00F0FF]"
                />
              )}
              <Icon
                size={21}
                strokeWidth={isActive ? 2.25 : 1.75}
                className={isActive ? 'text-[#00F0FF]' : 'text-current'}
              />
              <span
                className={`mt-1 text-[11px] font-medium tracking-tight whitespace-nowrap truncate max-w-full ${
                  isActive ? 'text-white' : 'text-slate-400'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
