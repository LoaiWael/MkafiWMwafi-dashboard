import { useState, useMemo } from "react";
import {
  Shield,
  Search,
  CheckCircle2,
  Calendar,
  Lock,
  Mail,
  Copy,
  Check,
  Printer,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Server,
} from "lucide-react";
import PageHeader from "@/components/layout/page-header";
import { Input } from "@/components/ui/input";
import { Button, ButtonLink } from "@/components/ui/button";
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
  PRIVACY_CATEGORIES,
  PRIVACY_META,
  PRIVACY_SECTIONS,
  type PrivacyCategoryId,
} from "@/features/privacy/constants";

export default function PrivacySection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<PrivacyCategoryId>("all");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    "priv-1": true,
    "priv-2": true,
    "priv-5": true,
    "priv-6": true,
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function toggleSection(id: string) {
    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  function expandAll() {
    const allExpanded = PRIVACY_SECTIONS.reduce<Record<string, boolean>>((acc, item) => {
      acc[item.id] = true;
      return acc;
    }, {});
    setExpandedSections(allExpanded);
  }

  function collapseAll() {
    setExpandedSections({});
  }

  async function handleCopySection(id: string, text: string) {
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

  const filteredSections = useMemo(() => {
    return PRIVACY_SECTIONS.filter((section) => {
      const matchesCategory =
        selectedCategory === "all" || section.category === selectedCategory;

      const query = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !query ||
        section.title.toLowerCase().includes(query) ||
        section.summary.toLowerCase().includes(query) ||
        section.number.toLowerCase().includes(query) ||
        section.details.some((line) => line.toLowerCase().includes(query)) ||
        section.regulatoryReference.toLowerCase().includes(query);

      return matchesCategory && matchesQuery;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="page-shell space-y-6 py-8">
      <PageHeader
        title="سياسة الخصوصية وحماية البيانات"
        description="السياسات والإجراءات المعتمدة لجمع ومعالجة وحماية البيانات الشخصية وفق نظام حماية البيانات الشخصية السعودي (PDPL)."
        badge={
          <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
            <ShieldCheck className="size-3.5 me-1.5" />
            {PRIVACY_META.status}
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
                      aria-label="طباعة سياسة الخصوصية"
                    />
                  }
                >
                  <Printer className="size-4" />
                  <span className="hidden sm:inline">طباعة السياسة</span>
                </TooltipTrigger>
                <TooltipContent side="bottom" sideOffset={6} className="text-xs font-medium">
                  طباعة وثيقة سياسة الخصوصية وحماية البيانات
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
              الإصدار والامتثال
            </CardTitle>
            <Shield className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-foreground">v{PRIVACY_META.version}</div>
            <p className="mt-1 truncate text-xs text-muted-foreground">
              سدايا (SDAIA) / PDPL
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              موقع استضافة البيانات
            </CardTitle>
            <Server className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="truncate text-base font-bold text-foreground">
              المملكة العربية السعودية
            </div>
            <p className="mt-1 truncate text-xs text-muted-foreground">
              سحابة محلية معتمدة من NCA
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              تاريخ آخر مراجعة
            </CardTitle>
            <Calendar className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-foreground">{PRIVACY_META.lastReviewedDate}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              تاريخ السريان: {PRIVACY_META.effectiveDate}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              مسؤول حماية البيانات (DPO)
            </CardTitle>
            <Mail className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="truncate text-sm font-bold text-foreground">
              {PRIVACY_META.dpoEmail}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              معالجة طلبات حقوق البيانات
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
            placeholder="بحث في بنود وضوابط سياسة الخصوصية..."
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
        onValueChange={(val) => setSelectedCategory(val as PrivacyCategoryId)}
      >
        <TabsList className="w-full flex-wrap justify-start sm:w-auto" aria-label="أقسام الخصوصية">
          {PRIVACY_CATEGORIES.map((cat) => (
            <TabsTrigger key={cat.id} value={cat.id} className="text-xs sm:text-sm">
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Sections List */}
      <div className="space-y-4">
        {filteredSections.length === 0 ? (
          <Card className="border-border bg-card p-12 text-center">
            <Lock className="mx-auto size-10 text-muted-foreground/50" />
            <h3 className="mt-4 text-base font-semibold text-foreground">
              لا توجد أقسام مطابقة للبحث
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              جرب تغيير كلمات البحث أو اختيار تبويب آخر.
            </p>
          </Card>
        ) : (
          filteredSections.map((section) => {
            const isExpanded = !!expandedSections[section.id];
            const fullText = `${section.number}: ${section.title}\n\n${section.details.join("\n\n")}`;
            const isCopied = copiedId === section.id;

            return (
              <Card
                key={section.id}
                className="overflow-hidden border-border bg-card transition-all duration-200 hover:border-primary/40"
              >
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleSection(section.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleSection(section.id);
                    }
                  }}
                  className="flex cursor-pointer items-start justify-between gap-4 p-5 text-start hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary" className="font-semibold">
                        {section.number}
                      </Badge>
                      <h3 className="text-base font-bold text-foreground">
                        {section.title}
                      </h3>
                    </div>
                    <CardDescription className="text-sm">
                      {section.summary}
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
                              aria-label="نسخ نص القسم"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopySection(section.id, fullText);
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
                          {isCopied ? "تم النسخ" : "نسخ نص القسم"}
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
                      {section.details.map((paragraph, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-sm text-foreground/90 leading-relaxed">
                          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                          <p>{paragraph}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/40 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium">المرجع النظامي:</span>
                        <Badge
                          variant="outline"
                          className="bg-background text-[11px] font-normal"
                        >
                          {section.regulatoryReference}
                        </Badge>
                      </div>

                      <span>تاريخ التحديث: {section.lastUpdated}</span>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })
        )}
      </div>

      {/* DPO & Contact Card */}
      <Card className="border-border bg-gradient-to-br from-card to-muted/30 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h4 className="text-base font-bold text-foreground">
              هل لديك استفسار حول حماية بياناتك الشخصية أو حقوقك النظامية؟
            </h4>
            <p className="text-sm text-muted-foreground">
              يمكنك التواصل مباشرة مع مسؤول حماية البيانات (DPO) المعتمد لمعالجة أي طلبات وصول أو تصحيح أو استفسار.
            </p>
          </div>
          <ButtonLink
            variant="primary"
            size="sm"
            href={`mailto:${PRIVACY_META.dpoEmail}`}
            className="shrink-0"
          >
            <Mail className="size-4 me-2" />
            تواصل مع مسؤول الحماية
          </ButtonLink>
        </div>
      </Card>
    </div>
  );
}
