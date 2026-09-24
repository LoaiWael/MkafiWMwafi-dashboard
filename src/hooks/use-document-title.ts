import { useEffect } from "react";
import { TITLE_TEMPLATE } from "@/lib/constants";

export function useDocumentTitle(title: string) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = TITLE_TEMPLATE.replace("%s", title);

    return () => {
      document.title = previousTitle;
    };
  }, [title]);
}
