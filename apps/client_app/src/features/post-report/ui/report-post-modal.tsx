'use client';

import { cn } from '@/shared/lib/cn';
import modal from '@/shared/styles/modal.module.css';

interface ReportPostModalProps {
  open: boolean;
  reportReason: string;
  isReporting: boolean;
  onReasonChange: (v: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export function ReportPostModal({
  open,
  reportReason,
  isReporting,
  onReasonChange,
  onClose,
  onSubmit,
}: ReportPostModalProps) {
  if (!open) return null;

  return (
    <div className={modal.root}>
      <button
        type="button"
        className={modal.dim}
        onClick={onClose}
        aria-label="Закрыть"
      />
      <div className={cn(modal.shell, 'max-w-md p-6')} onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-semibold text-foreground mb-3">Report post</h2>
        <textarea
          value={reportReason}
          onChange={e => onReasonChange(e.target.value)}
          className="w-full min-h-24 border border-border rounded-xl p-2 text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary/25"
          placeholder="Describe the issue..."
        />
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-muted text-foreground hover:bg-muted/80"
            disabled={isReporting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="px-4 py-2 rounded-xl bg-warning text-white font-medium hover:opacity-90 disabled:opacity-50"
            disabled={isReporting}
          >
            {isReporting ? 'Sending...' : 'Send report'}
          </button>
        </div>
      </div>
    </div>
  );
}
