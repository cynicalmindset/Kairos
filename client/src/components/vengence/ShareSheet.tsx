import { useEffect, useId, useMemo, useRef, useState, useSyncExternalStore, type MouseEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "framer-motion";
import qrcode from "qrcode-generator";
import { 
  Share2, 
  Copy, 
  Check, 
  X, 
  Download, 
  QrCode, 
  ArrowLeft, 
  Send,
  Globe
} from "lucide-react";

let bodyScrollLocks = 0;
let bodyOverflowBeforeLock = "";

function lockBodyScroll() {
  if (bodyScrollLocks === 0) {
    bodyOverflowBeforeLock = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
  bodyScrollLocks += 1;
  let released = false;
  return () => {
    if (released) return;
    released = true;
    bodyScrollLocks -= 1;
    if (bodyScrollLocks === 0) document.body.style.overflow = bodyOverflowBeforeLock;
  };
}

const subscribeToMount = () => () => {};
const getClientMountSnapshot = () => true;
const getServerMountSnapshot = () => false;

const sampleUrl = typeof window !== "undefined" ? window.location.href : "https://kairos.terminal/share/session-781";

const safeUrl = (value: string) => {
  try {
    const u = new URL(value);
    return /^https?:$/.test(u.protocol) ? u.href : "";
  } catch {
    return "";
  }
};

function QrArt({ url, size = 160, onReady }: { url: string; size?: number; onReady?: (svg: string) => void }) {
  const svg = useMemo(() => {
    try {
      if (!url) return "";
      const qr = qrcode(0, "M");
      qr.addData(url);
      qr.make();
      const cells = qr.getModuleCount();
      const margin = 3;
      const n = cells + margin * 2;
      let rects = "";
      for (let y = 0; y < cells; y++) {
        for (let x = 0; x < cells; x++) {
          if (qr.isDark(y, x)) {
            rects += `<rect x="${x + margin}" y="${y + margin}" width="1" height="1"/>`;
          }
        }
      }
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${n * 10}" height="${n * 10}" viewBox="0 0 ${n} ${n}" shape-rendering="crispEdges"><path fill="#fff" d="M0 0h${n}v${n}H0z"/><g fill="#09090b">${rects}</g></svg>`;
    } catch {
      return "";
    }
  }, [url]);

  useEffect(() => {
    onReady?.(svg);
  }, [svg, onReady]);

  return svg ? (
    <img
      width={size}
      height={size}
      alt="Scannable QR code"
      className="rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 p-2 bg-white"
      src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`}
    />
  ) : (
    <p role="alert" className="text-xs text-zinc-500">
      Invalid link for QR code.
    </p>
  );
}

import { cn } from "@/lib/utils";

export interface ShareSheetProps {
  url?: string;
  title?: string;
  buttonLabel?: string;
  variant?: "default" | "message" | "compact";
  initialOpen?: boolean;
  onShare?: (event: { channel: string; url: string; message: string }) => void;
  className?: string;
  triggerClassName?: string;
  iconClassName?: string;
}

export function ShareSheet({
  url = sampleUrl,
  title = "Share Kairos Terminal Stream",
  buttonLabel = "Direct P2P Share",
  variant = "default",
  initialOpen = false,
  onShare,
  className = "",
  triggerClassName = "",
  iconClassName = "",
}: ShareSheetProps) {
  const mounted = useSyncExternalStore(subscribeToMount, getClientMountSnapshot, getServerMountSnapshot);
  const [open, setOpen] = useState(initialOpen);
  const [view, setView] = useState<"share" | "qr" | "copied">("share");
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState("");
  const [qrSvg, setQrSvg] = useState("");
  const returnFocus = useRef<HTMLButtonElement | null>(null);
  const dialog = useRef<HTMLDivElement | null>(null);
  const titleId = useId();
  const reduced = useReducedMotion();
  const link = safeUrl(url) || url;

  const notify = (channel: string) => onShare?.({ channel, url: link, message: message.trim() });

  const close = () => {
    setOpen(false);
    setView("share");
    setFeedback("");
    setTimeout(() => returnFocus.current?.focus(), 50);
  };

  const openDialog = (e: MouseEvent<HTMLButtonElement>) => {
    returnFocus.current = e.currentTarget;
    setOpen(true);
    setView("share");
    setFeedback("");
  };

  useEffect(() => {
    if (!mounted || !open) return;
    const releaseScrollLock = lockBodyScroll();
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      releaseScrollLock();
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, mounted]);

  const copy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(link);
      } else {
        const el = document.createElement("textarea");
        el.value = link;
        document.body.append(el);
        el.select();
        document.execCommand("copy");
        el.remove();
      }
      notify("copy");
      setView("copied");
    } catch {
      setFeedback("Clipboard permission denied");
    }
  };

  const download = () => {
    if (!qrSvg) return;
    const blob = new Blob([qrSvg], { type: "image/svg+xml" });
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = "kairos-stream-qr.svg";
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(href), 1000);
    notify("qr-download");
  };

  const channels: { id: string; label: string; icon: ReactNode; action: () => void }[] = [
    {
      id: "copy",
      label: "Copy Link",
      icon: <Copy className="w-5 h-5 text-emerald-500" />,
      action: copy,
    },
    {
      id: "qr",
      label: "QR Code",
      icon: <QrCode className="w-5 h-5 text-indigo-500" />,
      action: () => setView("qr"),
    },
    {
      id: "telegram",
      label: "Telegram",
      icon: <Send className="w-5 h-5 text-sky-500" />,
      action: () => {
        window.open(`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(title)}`, "_blank");
        notify("telegram");
      },
    },
    {
      id: "web",
      label: "Open Peer",
      icon: <Globe className="w-5 h-5 text-amber-500" />,
      action: () => {
        window.open(link, "_blank");
        notify("web");
      },
    },
  ];

  const content = mounted && open && createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={close}
      />

      {/* Sheet Content */}
      <motion.div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 30 }}
        className="relative z-10 w-full max-w-sm rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800/80">
          <div className="flex items-center gap-2">
            {view !== "share" && (
              <button
                type="button"
                onClick={() => setView("share")}
                className="p-1 rounded-full text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Back"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <h3 id={titleId} className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                {view === "copied" ? "Copied to Clipboard" : view === "qr" ? "Scan QR Code" : "Share P2P Stream"}
              </h3>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                {view === "qr" ? "Scan to join terminal session" : "Direct ephemeral peer access"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={close}
            className="p-1 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="py-4">
          {view === "copied" ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3">
                <Check className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Link Copied!</p>
              <p className="text-xs text-zinc-500 mt-1 max-w-[200px]">
                Paste anywhere to give direct stream access to peers.
              </p>
              <button
                type="button"
                onClick={close}
                className="mt-5 w-full py-2.5 rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                Done
              </button>
            </div>
          ) : view === "qr" ? (
            <div className="flex flex-col items-center justify-center py-2 text-center">
              <QrArt url={link} onReady={setQrSvg} />
              <button
                type="button"
                onClick={download}
                className="mt-4 flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 text-xs font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download SVG
              </button>
            </div>
          ) : (
            <>
              {variant === "message" && (
                <div className="mb-4">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Attach access message (optional)..."
                    className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 outline-none focus:border-emerald-500"
                  />
                </div>
              )}

              <div className="grid grid-cols-4 gap-2">
                {channels.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={c.action}
                    className="flex flex-col items-center justify-center p-3 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all duration-200 group cursor-pointer"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mb-1.5 border border-zinc-200/60 dark:border-zinc-800/60 group-hover:scale-105 transition-transform">
                      {c.icon}
                    </div>
                    <span className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
                      {c.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Link preview pill */}
              <div className="mt-4 p-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono text-zinc-500 truncate max-w-[220px]">
                  {link}
                </span>
                <button
                  type="button"
                  onClick={copy}
                  className="px-2.5 py-1 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-[10px] font-semibold tracking-wide shrink-0 hover:opacity-90"
                >
                  Copy
                </button>
              </div>
            </>
          )}

          {feedback && (
            <p className="mt-3 text-center text-xs text-amber-500 font-medium">
              {feedback}
            </p>
          )}
        </div>
      </motion.div>
    </div>,
    document.body
  );

  return (
    <div className={className}>
      <button
        ref={returnFocus}
        type="button"
        onClick={openDialog}
        className={cn(
          "inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:border-zinc-400 dark:hover:border-zinc-700 shadow-sm transition-all duration-200 active:scale-95 cursor-pointer",
          triggerClassName
        )}
      >
        <Share2 className={cn("w-3.5 h-3.5 text-emerald-500", iconClassName)} />
        {buttonLabel}
      </button>
      {content}
    </div>
  );
}

export default ShareSheet;
