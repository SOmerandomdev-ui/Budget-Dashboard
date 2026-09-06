import { useEffect, useId, useRef, useState } from "react";
import { FileSpreadsheet, Upload, X } from "lucide-react";
import Table from "./Data/Table";

type ImportDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: (file: File) => void;
};

export default function ImportDialog({ open, onClose, onConfirm }: ImportDialogProps) {
  const titleId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (!open) return;

    closeRef.current?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setPendingFile(null);
      setError(null);
      setDragging(false);
    }
  }, [open]);

  if (!open) return null;

  function acceptFile(file: File | undefined) {
    if (!file) return;
    const isCsv =
      file.name.toLowerCase().endsWith(".csv") ||
      file.type === "text/csv" ||
      file.type === "application/vnd.ms-excel";
    if (!isCsv) {
      setError("Choose a .csv bank statement.");
      return;
    }
    setError(null);
    setPendingFile(file);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6">
      <button
        type="button"
        className="absolute inset-0 cursor-pointer bg-black/65"
        aria-label="Dismiss import dialog"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 flex max-h-[min(88dvh,880px)] w-full max-w-4xl flex-col overflow-hidden rounded-t-2xl border border-line bg-surface shadow-[0_24px_80px_rgba(0,0,0,0.45)] sm:rounded-2xl"
      >
        <div className="flex items-start gap-4 border-b border-line px-5 py-4 sm:px-6">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-brass"> Statement </p>
            <h2 id={titleId} className="mt-1 font-display text-3xl tracking-tight text-paper"> Import CSV </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-mist transition-colors duration-200 hover:bg-raised hover:text-paper"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-auto px-5 py-5 sm:px-6">
          <input
            ref={inputRef}
            type="file"
            accept=".csv,text/csv"
            className="sr-only"
            onChange={(e) => {
              acceptFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />

          {pendingFile ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-raised/60 px-4 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <FileSpreadsheet
                    size={18}
                    className="shrink-0 text-brass"
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-paper">
                      {pendingFile.name}
                    </p>
                    <p className="text-xs text-mist">
                      {(pendingFile.size / 1024).toFixed(1)} KB · preview below
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="cursor-pointer text-sm text-brass underline-offset-4 hover:underline"
                >
                  Choose another file
                </button>
              </div>
              <Table file={pendingFile} />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              onDragEnter={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                acceptFile(e.dataTransfer.files?.[0]);
              }}
              className={`flex min-h-52 w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 py-10 text-center transition-colors duration-200 ${
                dragging
                  ? "border-brass bg-brass/10"
                  : "border-line bg-raised/40 hover:border-mist/60 hover:bg-raised"
              }`}
            >
              <span className="inline-flex size-12 items-center justify-center rounded-full bg-ink text-brass">
                <Upload size={20} aria-hidden="true" />
              </span>
              <span className="text-base font-medium text-paper">
                Drop a CSV here, or browse
              </span>
              <span className="max-w-sm text-sm text-mist">
                Use a bank export with date, description, debit, credit, and
                balance columns.
              </span>
            </button>
          )}

          {error ? (
            <p role="alert" className="mt-3 text-sm text-rust">
              {error}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-line px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 cursor-pointer items-center justify-center rounded-lg px-4 text-sm font-medium text-mist transition-colors duration-200 hover:bg-raised hover:text-paper"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!pendingFile}
            onClick={() => {
              if (!pendingFile) return;
              onConfirm(pendingFile);
            }}
            className="inline-flex h-11 cursor-pointer items-center justify-center rounded-lg bg-brass px-5 text-sm font-medium text-ink transition-opacity duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:bg-raised disabled:text-mist disabled:opacity-100"
          >
            Confirm import
          </button>
        </div>
      </div>
    </div>
  );
}
