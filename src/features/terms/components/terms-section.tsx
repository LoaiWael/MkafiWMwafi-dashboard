import { useState, useMemo } from "react";
import {
  Scale,
  Search,
  CheckCircle2,
  Calendar,
  Building2,
  FileCheck2,
  Copy,
  Check,
  Printer,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import PageHeader from "@/components/layout/page-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  TERMS_CATEGORIES,
  TERMS_CLAUSES,
  TERMS_META,
  type TermCategoryId,
} from "@/features/terms/constants";

export default function TermsSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<TermCategoryId>("all");
  const [expandedClauses, setExpandedClauses] = useState<Record<string, boolean>>({
    "term-1": true,
    "term-2": true,
    "term-3": true,
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function toggleClause(id: string) {
    setExpandedClauses((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  function expandAll() {
    const allExpanded = TERMS_CLAUSES.reduce<Record<string, boolean>>((acc, item) => {
      acc[item.id] = true;
      return acc;
    }, {});
    setExpandedClauses(allExpanded);
  }

  function collapseAll() {
    setExpandedClauses({});
  }

  async function handleCopyClause(id: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // ignore
    }
  }

  function handlePrint() {
    window.print();
  }

  const filteredClauses = useMemo(() => {
    return TERMS_CLAUSES.filter((clause) => {
      const matchesCategory =
        selectedCategory === "all" || clause.category === selectedCategory;

      const query = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !query ||
        clause.title.toLowerCase().includes(query) ||
        clause.summary.toLowerCase().includes(query) ||
        clause.number.toLowerCase().includes(query) ||
        clause.content.some((line) => line.toLowerCase().includes(query)) ||
        clause.regulations.some((reg) => reg.toLowerCase().includes(query));

      return matchesCategory && matchesQuery;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="page-shell space-y-6 py-8">
      <PageHeader
        title="الشروط والأحكام"
        description="الضوابط القانونية والتنظيمية المعتمدة لتوثيق عقود الإيجار السكنية والتجارية عبر منصة مكفي وموفي."
        badge={
          <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
            <ShieldCheck className="size-3.5 me-1.5" />
            {TERMS_META.status}
          </Badge>
        }
        actions={
          <div className="flex items-center gap-2">
            <TooltipProvider delay={100}>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrint}
                      aria-label="طباعة الشروط والأحكام"
                    />
                  }
                >
                  <Printer className="size-4" />
                  <span className="hidden sm:inline">طباعة الوثيقة</span>
                </TooltipTrigger>
                <TooltipContent side="bottom" sideOffset={6} className="text-xs font-medium">
                  طباعة بنود الشروط والأحكام الرسمية
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        }
      />

      {/* Meta Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              رقم الإصدار
            </CardTitle>
            <Scale className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-foreground">v{TERMS_META.version}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              سارية في {TERMS_META.jurisdiction}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              تاريخ السريان
            </CardTitle>
            <Calendar className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-foreground">{TERMS_META.effectiveDate}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              آخر مراجعة: {TERMS_META.lastReviewedDate}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              المرجعية التنظيمية
            </CardTitle>
            <Building2 className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="truncate text-base font-bold text-foreground">
              الهيئة العامة للعقار
            </div>
            <p className="mt-1 truncate text-xs text-muted-foreground">
              شبكة إيجار المعتمدة
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              عدد البنود المعتمدة
            </CardTitle>
            <FileCheck2 className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-foreground">{TERMS_CLAUSES.length} بنود</div>
            <p className="mt-1 text-xs text-muted-foreground">
              تغطي كافة اشتراطات التوثيق
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث في نصوص وبنود الشروط والأحكام..."
            className="ps-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={expandAll} className="text-xs">
            توسيع الكل
          </Button>
          <Button variant="ghost" size="sm" onClick={collapseAll} className="text-xs">
            طي الكل
          </Button>
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs
        value={selectedCategory}
        onValueChange={(val) => setSelectedCategory(val as TermCategoryId)}
      >
        <TabsList className="w-full flex-wrap justify-start sm:w-auto" aria-label="أقسام الشروط">
          {TERMS_CATEGORIES.map((cat) => (
            <TabsTrigger key={cat.id} value={cat.id} className="text-xs sm:text-sm">
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Clauses List */}
      <div className="space-y-4">
        {filteredClauses.length === 0 ? (
          <Card className="border-border bg-card p-12 text-center">
            <Scale className="mx-auto size-10 text-muted-foreground/50" />
            <h3 className="mt-4 text-base font-semibold text-foreground">
              لا توجد بنود مطابقة للبحث
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              جرب تغيير كلمات البحث أو اختيار تبويب تصنيف آخر.
            </p>
          </Card>
        ) : (
          filteredClauses.map((clause) => {
            const isExpanded = !!expandedClauses[clause.id];
            const fullText = `${clause.number}: ${clause.title}\n\n${clause.content.join("\n\n")}`;
            const isCopied = copiedId === clause.id;

            return (
              <Card
                key={clause.id}
                className="overflow-hidden border-border bg-card transition-all duration-200 hover:border-primary/40"
              >
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleClause(clause.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleClause(clause.id);
                    }
                  }}
                  className="flex cursor-pointer items-start justify-between gap-4 p-5 text-start hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary" className="font-semibold">
                        {clause.number}
                      </Badge>
                      <h3 className="text-base font-bold text-foreground">
                        {clause.title}
                      </h3>
                    </div>
                    <CardDescription className="text-sm">
                      {clause.summary}
                    </CardDescription>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <TooltipProvider delay={100}>
                      <Tooltip>
                        <TooltipTrigger
                          render={
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              aria-label="نسخ نص البند"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyClause(clause.id, fullText);
                              }}
                            />
                          }
                        >
                          {isCopied ? (
                            <Check className="size-4 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <Copy className="size-4 text-muted-foreground" />
                          )}
                        </TooltipTrigger>
                        <TooltipContent side="top" sideOffset={6} className="text-xs font-medium">
                          {isCopied ? "تم النسخ" : "نسخ نص البند"}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <div className="text-muted-foreground">
                      {isExpanded ? (
                        <ChevronUp className="size-5" />
                      ) : (
                        <ChevronDown className="size-5" />
                      )}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <CardContent className="border-t border-border/60 bg-muted/10 p-5 pt-4 space-y-4">
                    <div className="space-y-2.5">
                      {clause.content.map((paragraph, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-sm text-foreground/90 leading-relaxed">
                          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                          <p>{paragraph}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/40 text-xs text-muted-foreground">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-medium">التوافق التنظيمي:</span>
                        {clause.regulations.map((reg, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="bg-background text-[11px] font-normal"
                          >
                            {reg}
                          </Badge>
                        ))}
                      </div>

                      <span>تاريخ التحديث: {clause.lastUpdated}</span>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
