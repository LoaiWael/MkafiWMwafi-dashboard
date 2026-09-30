import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";

interface DraftEntry {
  reset: () => void;
  commit: () => void;
}

interface ContentDraftActions {
  markDirty: () => void;
  register: (entry: DraftEntry) => () => void;
  save: () => void;
  cancel: () => void;
}

const ContentDraftActionsContext = createContext<ContentDraftActions | null>(null);
const ContentDraftStateContext = createContext(false);

function cloneDraft<T>(value: T): T {
  return structuredClone(value);
}

function noop() {}

export function ContentDraftProvider({ children }: { children: ReactNode }) {
  const entries = useRef(new Set<DraftEntry>());
  const dirtyRef = useRef(false);
  const [isDirty, setIsDirty] = useState(false);
  const actions = useRef<ContentDraftActions | null>(null);

  if (actions.current === null) {
    actions.current = {
      markDirty() {
        if (dirtyRef.current) return;
        dirtyRef.current = true;
        setIsDirty(true);
      },
      register(entry) {
        entries.current.add(entry);
        return () => {
          entries.current.delete(entry);
        };
      },
      save() {
        for (const entry of entries.current) entry.commit();
        dirtyRef.current = false;
        setIsDirty(false);
        // After the content API is wired, replace this local save with toast.promise
        // so loading, success, and error share one toast:
        // toast.promise(savePageContent(), {
        //   loading: "جاري حفظ المحتوى",
        //   success: "تم حفظ المحتوى",
        //   error: "تعذّر حفظ المحتوى",
        // });
        toast.success("تم حفظ المحتوى");
      },
      cancel() {
        for (const entry of entries.current) entry.reset();
        dirtyRef.current = false;
        setIsDirty(false);
      },
    };
  }

  return (
    <ContentDraftActionsContext.Provider value={actions.current}>
      <ContentDraftStateContext.Provider value={isDirty}>
        {children}
      </ContentDraftStateContext.Provider>
    </ContentDraftActionsContext.Provider>
  );
}

export function useContentDraft() {
  const actions = useContext(ContentDraftActionsContext);
  const isDirty = useContext(ContentDraftStateContext);
  if (!actions) {
    throw new Error("useContentDraft must be used within ContentDraftProvider.");
  }
  return { ...actions, isDirty };
}

export function useContentField<T>(read: () => T, apply: (next: T) => void) {
  const actions = useContext(ContentDraftActionsContext);
  const readRef = useRef(read);
  const applyRef = useRef(apply);
  const baselineRef = useRef(read());
  readRef.current = read;
  applyRef.current = apply;

  useEffect(() => {
    if (!actions) return;
    return actions.register({
      reset() {
        applyRef.current(cloneDraft(baselineRef.current));
      },
      commit() {
        const next = readRef.current();
        applyRef.current(next);
        baselineRef.current = cloneDraft(readRef.current());
      },
    });
  }, [actions]);

  return actions ? actions.markDirty : noop;
}

export function useTrackedState<T>(initial: T | (() => T)) {
  const [value, setValue] = useState(initial);
  const valueRef = useRef(value);
  valueRef.current = value;
  const markDirty = useContentField(() => valueRef.current, setValue);
  return [value, setValue, markDirty] as const;
}
