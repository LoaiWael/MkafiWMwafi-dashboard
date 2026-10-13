import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  TransformWrapper,
  TransformComponent,
  type ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";
import { useRef } from "react";
import {
  Calendar,
  Download,
  FileText,
  Loader2,
  Maximize2,
  RotateCw,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface MediaPreviewItem {
  url: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  documentType?: string;
  version?: number | string;
  uploadedBy?: number | string;
  createdAt?: string;
  description?: string;
}

export interface MediaPreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  item: MediaPreviewItem | null;
  className?: string;
}

export function MediaPreviewDialog({
  isOpen,
  onClose,
  item,
  className,
}: MediaPreviewDialogProps) {
  const [rotation, setRotation] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const transformRef = useRef<ReactZoomPanPinchRef>(null);

  useEffect(() => {
    if (isOpen) {
      setRotation(0);
      setIsLoaded(false);
      setHasError(false);
      transformRef.current?.resetTransform();
    }
  }, [isOpen, item?.url]);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !item) return null;

  const isImage =
    item.mimeType?.startsWith("image") ||
    /\.(png|jpe?g|webp|gif|svg|bmp)(\?.*)?$/i.test(item.url || "");
  const isPdf =
    item.mimeType?.includes("pdf") || /\.pdf(\?.*)?$/i.test(item.url || "");

  async function handleDownload() {
    if (!item?.url || isDownloading) return;
    try {
      setIsDownloading(true);
      const res = await fetch(item.url);
      if (!res.ok) throw new Error("Network response was not ok");
      const blob = await res.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = item.fileName || "document";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(objectUrl);
    } catch {
      // Fallback: if CORS or network blocks fetch, try triggering anchor download without _blank
      const link = document.createElement("a");
      link.href = item.url;
      link.download = item.fileName || "document";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } finally {
      setIsDownloading(false);
    }
  }

  function handleRotate() {
    setRotation((prev) => (prev + 90) % 360);
  }


  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6"
        dir="rtl"
        role="dialog"
        aria-modal="true"
        aria-label={item.fileName || "معاينة المستند"}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-foreground/60 backdrop-blur-sm cursor-pointer"
          aria-hidden="true"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className={cn(
            "relative z-10 flex flex-col w-full max-w-4xl max-h-[94vh] rounded-3xl border border-border bg-card shadow-2xl overflow-hidden",
            className,
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 border-b border-border/70 px-4 py-3 sm:px-6 sm:py-4 bg-card shrink-0">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="flex size-9 sm:size-10 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-300 shrink-0">
                <FileText className="size-4 sm:size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3
                    className="font-bold text-foreground text-sm sm:text-base truncate max-w-xs sm:max-w-md"
                    title={item.fileName}
                  >
                    {item.fileName || "معاينة المستند"}
                  </h3>
                  {item.documentType && (
                    <Badge
                      variant="outline"
                      className="border-primary-200 bg-primary-50 text-primary-800 dark:border-primary-800 dark:bg-primary-950 dark:text-primary-300 text-[10px] font-bold px-2 py-0.5 shrink-0"
                    >
                      {item.documentType}
                    </Badge>
                  )}
                  {item.version !== undefined && (
                    <span className="text-[10px] text-muted-foreground font-mono shrink-0">
                      نسخة #{item.version}
                    </span>
                  )}
                </div>
                {item.mimeType && (
                  <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                    {item.mimeType}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {item.url && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleDownload}
                  disabled={isDownloading}
                  title="تحميل الملف"
                  className="size-8 sm:size-9 rounded-xl border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                  aria-label="تحميل الملف"
                >
                  {isDownloading ? (
                    <Loader2 className="size-4 animate-spin text-primary" />
                  ) : (
                    <Download className="size-4" />
                  )}
                </Button>
              )}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="size-8 sm:size-9 rounded-xl hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                aria-label="إغلاق المعاينة"
              >
                <X className="size-4 sm:size-5" />
              </Button>
            </div>
          </div>

          {/* Media Body */}
          <div className="relative flex-1 min-h-[300px] sm:min-h-[420px] max-h-[65vh] bg-muted/40 overflow-hidden flex items-center justify-center select-none">
            {isImage ? (
              <div className="relative size-full flex items-center justify-center">
                {!isLoaded && !hasError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted/30 z-10">
                    <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  </div>
                )}

                {hasError ? (
                  <div className="flex flex-col items-center justify-center text-center p-6 space-y-2">
                    <FileText className="size-12 text-muted-foreground/60" />
                    <p className="text-xs font-semibold text-muted-foreground">
                      تعذر تحميل الصورة مباشرة، يمكنك تحميلها عبر زر التحميل.
                    </p>
                  </div>
                ) : (
                  <TransformWrapper
                    ref={transformRef}
                    initialScale={1}
                    minScale={0.5}
                    maxScale={5}
                    centerOnInit
                    wheel={{ step: 0.15 }}
                    doubleClick={{ mode: "toggle", step: 1.5 }}
                    panning={{ velocityDisabled: false }}
                  >
                    {({ zoomIn, zoomOut, resetTransform }) => (
                      <>
                        <TransformComponent
                          wrapperClass="!w-full !h-full flex items-center justify-center"
                          contentClass="flex items-center justify-center"
                        >
                          <div
                            style={{
                              transform: `rotate(${rotation}deg)`,
                              transformOrigin: "center center",
                              transition: "transform 0.2s ease-out",
                            }}
                            className="flex items-center justify-center p-4"
                          >
                            <img
                              src={item.url}
                              alt={item.fileName || "معاينة المستند"}
                              draggable={false}
                              onLoad={() => setIsLoaded(true)}
                              onError={() => setHasError(true)}
                              className={cn(
                                "max-h-[58vh] max-w-full rounded-2xl object-contain shadow-md select-none",
                                isLoaded ? "opacity-100" : "opacity-0",
                              )}
                            />
                          </div>
                        </TransformComponent>

                        {/* Floating Controls */}
                        {isLoaded && (
                          <div className="absolute bottom-3 inset-x-0 mx-auto w-fit flex items-center gap-1 rounded-2xl border border-border/80 bg-card/90 backdrop-blur-md px-2 py-1 shadow-lg z-20">
                            <button
                              type="button"
                              onClick={() => zoomIn(0.3)}
                              className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer transition-colors"
                              title="تكبير"
                            >
                              <ZoomIn className="size-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => zoomOut(0.3)}
                              className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer transition-colors"
                              title="تصغير"
                            >
                              <ZoomOut className="size-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                resetTransform();
                                setRotation(0);
                              }}
                              className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer transition-colors"
                              title="إعادة تعيين"
                            >
                              <Maximize2 className="size-4" />
                            </button>
                            <div className="h-4 w-px bg-border/60 mx-0.5" />
                            <button
                              type="button"
                              onClick={handleRotate}
                              className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer transition-colors"
                              title="تدوير 90 درجة"
                            >
                              <RotateCw className="size-4" />
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </TransformWrapper>
                )}
              </div>
            ) : isPdf ? (
              <div className="size-full flex flex-col items-center justify-center p-4">
                <iframe
                  src={item.url}
                  title={item.fileName || "معاينة PDF"}
                  className="size-full min-h-[400px] rounded-2xl border border-border bg-card shadow-inner"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-8 space-y-3">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground shadow-inner">
                  <FileText className="size-8 text-primary" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-foreground">
                    {item.fileName || "مستند مرفق"}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    هذا النوع من الملفات لا يدعم المعاينة المباشرة داخل المتصفح.
                  </p>
                </div>
                {item.url && (
                  <Button
                    type="button"
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2 text-xs font-bold hover:brightness-105 transition-all shadow-sm cursor-pointer"
                  >
                    {isDownloading ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Download className="size-4" />
                    )}
                    <span>تحميل الملف الآن</span>
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-3 border-t border-border/70 px-4 py-3 sm:px-6 bg-card shrink-0 text-xs">
            <div className="flex items-center gap-2 text-muted-foreground text-[11px] sm:text-xs">
              {item.createdAt && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="size-3.5 text-primary shrink-0" />
                  <span>تاريخ الرفع: {item.createdAt}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {item.url && (
                <Button
                  type="button"
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary text-primary-foreground px-3.5 py-1.5 text-xs font-semibold hover:brightness-105 transition-all shadow-xs cursor-pointer"
                >
                  {isDownloading ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Download className="size-3.5" />
                  )}
                  <span>تحميل</span>
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="rounded-xl px-4 py-1.5 text-xs font-semibold cursor-pointer"
              >
                إغلاق
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default MediaPreviewDialog;
