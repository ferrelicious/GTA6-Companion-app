import { Download, ExternalLink, Sparkles, X } from 'lucide-react';
import { useTranslation } from '../i18n/translations';
import { formatBytes, UpdateCheckResult } from '../services/updateService';

interface UpdateModalProps {
  updateInfo: UpdateCheckResult;
  onClose: () => void;
}

export function UpdateModal({ updateInfo, onClose }: UpdateModalProps) {
  const { t } = useTranslation();

  const downloadHref = updateInfo.apkDownloadUrl ?? updateInfo.releaseUrl;
  const apkSizeLabel = formatBytes(updateInfo.apkSizeBytes);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="app-update-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4"
    >
      <div className="w-full sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl bg-[#141720] border border-[#00F0FF]/30 shadow-2xl p-5 sm:p-6 space-y-5">
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#00F0FF] mb-1">
              <Sparkles size={14} className="shrink-0" />
              <span>{t.updateModal.kicker}</span>
            </div>
            <h2
              id="app-update-modal-title"
              className="font-display text-lg sm:text-xl font-bold text-white leading-snug"
            >
              {t.updateModal.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.common.close}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        {/* Version comparison */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-[#0D0F14] border border-white/10">
            <p className="text-[11px] font-medium text-slate-400">
              {t.updateModal.currentVersion}
            </p>
            <p className="mt-1 font-mono tabular-nums text-base font-bold text-slate-200">
              v{updateInfo.currentVersion}
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#00F0FF]/10 border border-[#00F0FF]/35">
            <p className="text-[11px] font-medium text-[#00F0FF]">
              {t.updateModal.latestVersion}
            </p>
            <p className="mt-1 font-mono tabular-nums text-base font-bold text-white">
              v{updateInfo.latestVersion}
            </p>
          </div>
        </div>

        {updateInfo.publishedAt && (
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>{updateInfo.releaseTitle}</span>
            <span className="font-mono tabular-nums">
              {t.updateModal.releaseDate}: {updateInfo.publishedAt}
            </span>
          </div>
        )}

        {/* Release Notes */}
        <div className="p-4 rounded-xl bg-[#0D0F14]/90 border border-white/[0.08] space-y-2">
          <h3 className="text-xs font-semibold text-slate-300">
            {t.updateModal.notesHeading}
          </h3>
          <p className="text-sm text-slate-300 whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto">
            {updateInfo.releaseNotes || t.updateModal.noNotesFallback}
          </p>
        </div>

        {updateInfo.apkName && (
          <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-mono">
            <span className="truncate">{updateInfo.apkName}</span>
            {apkSizeLabel && <span className="tabular-nums shrink-0">{apkSizeLabel}</span>}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 pt-1">
          <a
            href={downloadHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-h-[46px] px-4 py-2.5 rounded-xl bg-[#FF2A85] hover:bg-[#e52275] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Download size={17} />
            <span>
              {updateInfo.apkDownloadUrl
                ? t.updateModal.downloadApkBtn
                : t.updateModal.openReleaseBtn}
            </span>
          </a>

          {updateInfo.apkDownloadUrl && (
            <a
              href={updateInfo.releaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[46px] px-4 py-2.5 rounded-xl bg-[#0D0F14] border border-white/15 hover:border-white/30 text-slate-200 text-sm font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <ExternalLink size={15} />
              <span>GitHub</span>
            </a>
          )}

          <button
            type="button"
            onClick={onClose}
            className="min-h-[46px] px-4 py-2.5 rounded-xl border border-white/10 text-sm font-medium text-slate-300 hover:bg-white/5 cursor-pointer"
          >
            {t.updateModal.laterBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
