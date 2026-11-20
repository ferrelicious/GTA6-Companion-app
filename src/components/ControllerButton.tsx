import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';
import { useTranslation } from '../i18n/translations';
import { CheatButtonToken, ConsolePlatform } from '../types';

interface ControllerButtonProps {
  token: CheatButtonToken;
  platform: ConsolePlatform;
}

export function ControllerButton({ token, platform }: ControllerButtonProps) {
  const { t } = useTranslation();

  if (token === 'UP' || token === 'DOWN' || token === 'LEFT' || token === 'RIGHT') {
    const ArrowIcon =
      token === 'UP'
        ? ArrowUp
        : token === 'DOWN'
          ? ArrowDown
          : token === 'LEFT'
            ? ArrowLeft
            : ArrowRight;
    const label =
      token === 'UP'
        ? t.guides.dpad.up
        : token === 'DOWN'
          ? t.guides.dpad.down
          : token === 'LEFT'
            ? t.guides.dpad.left
            : t.guides.dpad.right;

    return (
      <span
        title={label}
        aria-label={label}
        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#0D0F14] border border-white/15 text-slate-200 shrink-0"
      >
        <ArrowIcon size={15} strokeWidth={2.25} />
      </span>
    );
  }

  if (token === 'L1_LB' || token === 'R1_RB' || token === 'L2_LT' || token === 'R2_RT') {
    const labelMap: Record<'L1_LB' | 'R1_RB' | 'L2_LT' | 'R2_RT', string> =
      platform === 'ps5'
        ? { L1_LB: 'L1', R1_RB: 'R1', L2_LT: 'L2', R2_RT: 'R2' }
        : { L1_LB: 'LB', R1_RB: 'RB', L2_LT: 'LT', R2_RT: 'RT' };

    return (
      <span className="inline-flex items-center justify-center h-8 px-2.5 rounded-lg bg-[#0D0F14] border border-white/15 font-mono text-xs font-semibold text-slate-200 shrink-0">
        {labelMap[token]}
      </span>
    );
  }

  if (platform === 'ps5') {
    if (token === 'TRIANGLE_Y') {
      return (
        <span
          title={t.guides.psButtons.triangle}
          aria-label={t.guides.psButtons.triangle}
          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#0D0F14] border border-emerald-400/40 shrink-0"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M8 2.5L14 13H2L8 2.5Z" stroke="#34D399" strokeWidth="1.8" strokeLinejoin="round" />
          </svg>
        </span>
      );
    }
    if (token === 'CIRCLE_B') {
      return (
        <span
          title={t.guides.psButtons.circle}
          aria-label={t.guides.psButtons.circle}
          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#0D0F14] border border-rose-400/40 shrink-0"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="8" cy="8" r="5.2" stroke="#FB7185" strokeWidth="1.8" />
          </svg>
        </span>
      );
    }
    if (token === 'CROSS_A') {
      return (
        <span
          title={t.guides.psButtons.cross}
          aria-label={t.guides.psButtons.cross}
          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#0D0F14] border border-sky-400/40 shrink-0"
        >
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3.5 3.5L12.5 12.5M12.5 3.5L3.5 12.5" stroke="#38BDF8" strokeWidth="1.9" strokeLinecap="round" />
          </svg>
        </span>
      );
    }
    return (
      <span
        title={t.guides.psButtons.square}
        aria-label={t.guides.psButtons.square}
        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#0D0F14] border border-pink-400/40 shrink-0"
      >
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <rect x="3" y="3" width="10" height="10" rx="1" stroke="#F472B6" strokeWidth="1.8" />
        </svg>
      </span>
    );
  }

  const xboxMap: Record<'TRIANGLE_Y' | 'CIRCLE_B' | 'CROSS_A' | 'SQUARE_X', { label: string; colorClass: string }> = {
    TRIANGLE_Y: { label: 'Y', colorClass: 'text-amber-400 border-amber-400/40' },
    CIRCLE_B: { label: 'B', colorClass: 'text-rose-400 border-rose-400/40' },
    CROSS_A: { label: 'A', colorClass: 'text-emerald-400 border-emerald-400/40' },
    SQUARE_X: { label: 'X', colorClass: 'text-sky-400 border-sky-400/40' },
  };

  const btn = xboxMap[token];
  return (
    <span
      title={btn.label}
      aria-label={btn.label}
      className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#0D0F14] border font-display text-xs font-bold shrink-0 ${btn.colorClass}`}
    >
      {btn.label}
    </span>
  );
}
