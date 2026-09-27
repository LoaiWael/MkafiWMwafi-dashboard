import { useMemo, useState, useEffect } from "react";
import {
  CalendarDays,
  Check,
  CreditCard,
  Edit2,
  Plus,
  RotateCcw,
  Search,
  Tag,
  Trash2,
  Wallet,
} from "lucide-react";
import PageHeader from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  INITIAL_CONTRACT_DURATIONS,
  INITIAL_PAYMENT_FREQUENCIES,
  INITIAL_PAYMENT_METHODS,
  SERVICE_PRICING,
  type ContractDurationOption,
  type PaymentFrequencyOption,
  type PaymentMethodOption,
} from "@/features/payments/constants";

const STORAGE_KEYS = {
  frequencies: "makfiwamufi.payments.frequencies",
  durations: "makfiwamufi.payments.durations",
  methods: "makfiwamufi.payments.methods",
};

export default function PaymentsSection() {
  const [activeTab, setActiveTab] = useState<string>("frequencies");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Load from localStorage or defaults
  const [frequencies, setFrequencies] = useState<PaymentFrequencyOption[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.frequencies);
    return saved ? JSON.parse(saved) : INITIAL_PAYMENT_FREQUENCIES;
  });

  const [durations, setDurations] = useState<ContractDurationOption[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.durations);
    return saved ? JSON.parse(saved) : INITIAL_CONTRACT_DURATIONS;
  });

  const [methods, setMethods] = useState<PaymentMethodOption[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.methods);
    return saved ? JSON.parse(saved) : INITIAL_PAYMENT_METHODS;
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.frequencies, JSON.stringify(frequencies));
  }, [frequencies]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.durations, JSON.stringify(durations));
  }, [durations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.methods, JSON.stringify(methods));
  }, [methods]);

  // Dialog State for Frequency / Duration
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [editingFrequency, setEditingFrequency] = useState<PaymentFrequencyOption | null>(null);
  const [editingDuration, setEditingDuration] = useState<ContractDurationOption | null>(null);
  const [dialogMode, setDialogMode] = useState<"frequency" | "duration">("frequency");

  const [freqForm, setFreqForm] = useState<{
    nameAr: string;
    installmentCount: number;
    periodAr: string;
    description: string;
    isActive: boolean;
  }>({
    nameAr: "",
    installmentCount: 1,
    periodAr: "سنوي",
    description: "",
    isActive: true,
  });

  const [durForm, setDurForm] = useState<{
    nameAr: string;
    years: number;
    description: string;
    isActive: boolean;
  }>({
    nameAr: "",
    years: 1,
    description: "",
    isActive: true,
  });

  const handleOpenAddFrequency = () => {
    setDialogMode("frequency");
    setEditingFrequency(null);
    setFreqForm({
      nameAr: "",
      installmentCount: 1,
      periodAr: "سنوي",
      description: "",
      isActive: true,
    });
    setIsDialogOpen(true);
  };

  const handleOpenEditFrequency = (item: PaymentFrequencyOption) => {
    setDialogMode("frequency");
    setEditingFrequency(item);
    setFreqForm({
      nameAr: item.nameAr,
      installmentCount: item.installmentCount,
      periodAr: item.periodAr,
      description: item.description,
      isActive: item.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleSaveFrequency = () => {
    if (!freqForm.nameAr.trim()) return;

    if (editingFrequency) {
      setFrequencies((prev) =>
        prev.map((f) =>
          f.id === editingFrequency.id
            ? {
                ...f,
                nameAr: freqForm.nameAr.trim(),
                installmentCount: Number(freqForm.installmentCount),
                periodAr: freqForm.periodAr.trim(),
                description: freqForm.description.trim(),
                isActive: freqForm.isActive,
              }
            : f
        )
      );
    } else {
      const newItem: PaymentFrequencyOption = {
        id: `freq_${Date.now()}`,
        nameAr: freqForm.nameAr.trim(),
        installmentCount: Number(freqForm.installmentCount),
        periodAr: freqForm.periodAr.trim(),
        description: freqForm.description.trim(),
        isActive: freqForm.isActive,
      };
      setFrequencies((prev) => [...prev, newItem]);
    }

    setIsDialogOpen(false);
  };

  const handleDeleteFrequency = (id: string) => {
    setFrequencies((prev) => prev.filter((f) => f.id !== id));
  };

  const handleToggleFrequencyActive = (id: string) => {
    setFrequencies((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isActive: !f.isActive } : f))
    );
  };

  const handleOpenAddDuration = () => {
    setDialogMode("duration");
    setEditingDuration(null);
    setDurForm({
      nameAr: "",
      years: 1,
      description: "",
      isActive: true,
    });
    setIsDialogOpen(true);
  };

  const handleOpenEditDuration = (item: ContractDurationOption) => {
    setDialogMode("duration");
    setEditingDuration(item);
    setDurForm({
      nameAr: item.nameAr,
      years: item.years,
      description: item.description || "",
      isActive: item.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleSaveDuration = () => {
    if (!durForm.nameAr.trim()) return;

    if (editingDuration) {
      setDurations((prev) =>
        prev.map((d) =>
          d.id === editingDuration.id
            ? {
                ...d,
                nameAr: durForm.nameAr.trim(),
                years: Number(durForm.years),
                description: durForm.description.trim(),
                isActive: durForm.isActive,
              }
            : d
        )
      );
    } else {
      const newItem: ContractDurationOption = {
        id: `dur_${Date.now()}`,
        nameAr: durForm.nameAr.trim(),
        years: Number(durForm.years),
        description: durForm.description.trim(),
        isActive: durForm.isActive,
      };
      setDurations((prev) => [...prev, newItem]);
    }

    setIsDialogOpen(false);
  };

  const handleDeleteDuration = (id: string) => {
    setDurations((prev) => prev.filter((d) => d.id !== id));
  };

  const handleToggleDurationActive = (id: string) => {
    setDurations((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isActive: !d.isActive } : d))
    );
  };

  const handleToggleMethodActive = (id: string) => {
    setMethods((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isActive: !m.isActive } : m))
    );
  };

  const handleResetDefaults = () => {
    if (window.confirm("هل ترغب بإعادة تعيين خيارات الدفع والبيانات المالية إلى الافتراضي؟")) {
      setFrequencies(INITIAL_PAYMENT_FREQUENCIES);
      setDurations(INITIAL_CONTRACT_DURATIONS);
      setMethods(INITIAL_PAYMENT_METHODS);
      localStorage.removeItem(STORAGE_KEYS.frequencies);
      localStorage.removeItem(STORAGE_KEYS.durations);
      localStorage.removeItem(STORAGE_KEYS.methods);
    }
  };

  const filteredFrequencies = useMemo(() => {
    if (!searchQuery.trim()) return frequencies;
    return frequencies.filter(
      (f) =>
        f.nameAr.includes(searchQuery) ||
        f.periodAr.includes(searchQuery) ||
        f.description.includes(searchQuery)
    );
  }, [searchQuery, frequencies]);

  const filteredDurations = useMemo(() => {
    if (!searchQuery.trim()) return durations;
    return durations.filter(
      (d) =>
        d.nameAr.includes(searchQuery) ||
        (d.description && d.description.includes(searchQuery))
    );
  }, [searchQuery, durations]);

  return (
    <div className="page-shell space-y-6 py-8">
      <PageHeader
        title="المدفوعات والبيانات المالية"
        description="إدارة خيارات طريقة الدفعات، مدد العقود السنوية، قنوات الدفع، ورسوم توثيق العقود."
        badge={
          <Badge variant="secondary" className="gap-1.5 font-medium">
            <Wallet className="size-3.5" />
            إدارة البيانات المالية
          </Badge>
        }
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetDefaults}
            className="gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="size-3.5" />
            استعادة الافتراضي
          </Button>
        }
      />

      {/* Overview Pricing & Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/60 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              طرق وتكرار الدفعات
            </CardTitle>
            <div className="rounded-md bg-primary/10 p-2 text-primary">
              <Wallet className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{frequencies.length}</span>
              <span className="text-xs text-muted-foreground">
                ({frequencies.filter((f) => f.isActive).length} مفعّل)
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              سنوي، نصف سنوي، ربع سنوي، شهري
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              خيارات مدة العقد
            </CardTitle>
            <div className="rounded-md bg-primary/10 p-2 text-primary">
              <CalendarDays className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{durations.length}</span>
              <span className="text-xs text-muted-foreground">
                ({durations.filter((d) => d.isActive).length} مفعّل)
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              من سنة إلى 10 سنوات
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              قنوات وطرق السداد
            </CardTitle>
            <div className="rounded-md bg-primary/10 p-2 text-primary">
              <CreditCard className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{methods.length}</span>
              <span className="text-xs text-muted-foreground">
                ({methods.filter((m) => m.isActive).length} مفعّل)
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              مدى، Apple Pay، فيزا/ماستر، سداد
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              رسوم التوثيق الرسمية
            </CardTitle>
            <div className="rounded-md bg-primary/10 p-2 text-primary">
              <Tag className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">249 / 349</span>
              <span className="text-xs text-muted-foreground">ر.س / سنة</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              سكني 249 ر.س | تجاري 349 ر.س
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList className="h-auto flex-wrap gap-1 p-1">
            <TabsTrigger value="frequencies" className="gap-2 px-3 py-2 text-sm">
              <Wallet className="size-4" />
              طريقة الدفعات ({frequencies.length})
            </TabsTrigger>
            <TabsTrigger value="durations" className="gap-2 px-3 py-2 text-sm">
              <CalendarDays className="size-4" />
              مدة العقد بالسنة ({durations.length})
            </TabsTrigger>
            <TabsTrigger value="methods" className="gap-2 px-3 py-2 text-sm">
              <CreditCard className="size-4" />
              قنوات السداد ({methods.length})
            </TabsTrigger>
            <TabsTrigger value="pricing" className="gap-2 px-3 py-2 text-sm">
              <Tag className="size-4" />
              تسعير الخدمات المعتمد
            </TabsTrigger>
          </TabsList>

          {(activeTab === "frequencies" || activeTab === "durations") && (
            <div className="relative w-full sm:w-64">
              <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث في الخيارات..."
                className="ps-9"
              />
            </div>
          )}
        </div>

        {/* Tab 1: Payment Frequencies (طريقة الدفعات) */}
        <TabsContent value="frequencies" className="space-y-4">
          <Card className="border-border/60">
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>خيارات طريقة الدفعات (تكرار سداد الإيجار)</CardTitle>
                <CardDescription>
                  الخيارات المتاحة لحقل (طريقة الدفعات) في الخطوة 6 بالبيانات المالية لاستمارة العقد
                </CardDescription>
              </div>
              <Button onClick={handleOpenAddFrequency} className="gap-1.5">
                <Plus className="size-4" />
                إضافة طريقة دفعات جديدة
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12 text-center">#</TableHead>
                    <TableHead>طريقة الدفعات</TableHead>
                    <TableHead>عدد الدفعات سنوياً</TableHead>
                    <TableHead>التكرار</TableHead>
                    <TableHead>الوصف والتوضيح</TableHead>
                    <TableHead className="w-28 text-center">الظهور بالموقع</TableHead>
                    <TableHead className="w-24 text-center">إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFrequencies.map((item, index) => (
                    <TableRow key={item.id} className={!item.isActive ? "opacity-60 bg-muted/20" : ""}>
                      <TableCell className="text-center font-medium text-muted-foreground">
                        {index + 1}
                      </TableCell>
                      <TableCell className="font-semibold text-foreground">
                        {item.nameAr}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-bold">
                          {item.installmentCount} {item.installmentCount === 1 ? "دفعة" : "دفعات"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {item.periodAr}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {item.description}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Switch
                            checked={item.isActive}
                            onCheckedChange={() => handleToggleFrequencyActive(item.id)}
                            aria-label="تفعيل أو تعطيل الظهور"
                          />
                          <span className="text-xs font-medium">
                            {item.isActive ? "مفعّل" : "معطّل"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleOpenEditFrequency(item)}
                            title="تعديل"
                          >
                            <Edit2 className="size-3.5 text-muted-foreground" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleDeleteFrequency(item.id)}
                            className="text-destructive hover:bg-destructive/10"
                            title="حذف"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredFrequencies.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                        لا توجد نتائج مطابقة لبحثك
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Contract Durations (مدة العقد بالسنة) */}
        <TabsContent value="durations" className="space-y-4">
          <Card className="border-border/60">
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>خيارات مدة العقد بالسنة</CardTitle>
                <CardDescription>
                  الخيارات المتاحة لحقل (مدة العقد بالسنة) في استمارة البيانات المالية
                </CardDescription>
              </div>
              <Button onClick={handleOpenAddDuration} className="gap-1.5">
                <Plus className="size-4" />
                إضافة مدة جديدة
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12 text-center">#</TableHead>
                    <TableHead>المدة</TableHead>
                    <TableHead>عدد السنوات</TableHead>
                    <TableHead>الوصف</TableHead>
                    <TableHead className="w-28 text-center">الظهور بالموقع</TableHead>
                    <TableHead className="w-24 text-center">إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDurations.map((item, index) => (
                    <TableRow key={item.id} className={!item.isActive ? "opacity-60 bg-muted/20" : ""}>
                      <TableCell className="text-center font-medium text-muted-foreground">
                        {index + 1}
                      </TableCell>
                      <TableCell className="font-semibold text-foreground">
                        {item.nameAr}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {item.years} {item.years === 1 ? "سنة" : "سنوات"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {item.description || "—"}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Switch
                            checked={item.isActive}
                            onCheckedChange={() => handleToggleDurationActive(item.id)}
                            aria-label="تفعيل أو تعطيل الظهور"
                          />
                          <span className="text-xs font-medium">
                            {item.isActive ? "مفعّل" : "معطّل"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleOpenEditDuration(item)}
                            title="تعديل"
                          >
                            <Edit2 className="size-3.5 text-muted-foreground" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleDeleteDuration(item.id)}
                            className="text-destructive hover:bg-destructive/10"
                            title="حذف"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredDurations.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                        لا توجد نتائج مطابقة لبحثك
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Payment Methods */}
        <TabsContent value="methods" className="space-y-4">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>قنوات وطرق الدفع الإلكتروني</CardTitle>
              <CardDescription>
                بوابات الدفع المعتمدة لسداد رسوم توثيق العقود السكنية والتجارية
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12 text-center">#</TableHead>
                    <TableHead>طريقة / قناة الدفع</TableHead>
                    <TableHead>الرمز</TableHead>
                    <TableHead>الوصف</TableHead>
                    <TableHead className="w-28 text-center">الحالة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {methods.map((item, index) => (
                    <TableRow key={item.id} className={!item.isActive ? "opacity-60 bg-muted/20" : ""}>
                      <TableCell className="text-center font-medium text-muted-foreground">
                        {index + 1}
                      </TableCell>
                      <TableCell className="font-semibold text-foreground">
                        {item.nameAr}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.code}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {item.description}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Switch
                            checked={item.isActive}
                            onCheckedChange={() => handleToggleMethodActive(item.id)}
                            aria-label="تفعيل أو تعطيل القناة"
                          />
                          <span className="text-xs font-medium">
                            {item.isActive ? "مفعّل" : "معطّل"}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Pricing */}
        <TabsContent value="pricing" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {SERVICE_PRICING.map((item) => (
              <Card key={item.id} className="border-border/60">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <Badge variant={item.id === "residential" ? "default" : "secondary"}>
                      {item.id === "residential" ? "سكني" : "تجاري"}
                    </Badge>
                  </div>
                  <p className="pt-2 text-3xl font-bold text-foreground">
                    <bdi>{item.amount}</bdi>
                    <span className="ms-1.5 text-sm font-normal text-muted-foreground">
                      ر.س {item.period}
                    </span>
                  </p>
                  <CardDescription className="pt-2">{item.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog for Add / Edit Frequency or Duration */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "frequency"
                ? editingFrequency
                  ? "تعديل خيار طريقة الدفعات"
                  : "إضافة خيار طريقة دفعات جديد"
                : editingDuration
                ? "تعديل خيار مدة العقد"
                : "إضافة خيار مدة عقد جديدة"}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === "frequency"
                ? "سيظهر هذا الخيار في القائمة المنسدلة لطريقة الدفعات في استمارة الموقع الرئيسي."
                : "سيظهر هذا الخيار في القائمة المنسدلة لمدة العقد بالسنة في الموقع الرئيسي."}
            </DialogDescription>
          </DialogHeader>

          {dialogMode === "frequency" ? (
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="freqName">اسم الخيار بالعربية *</Label>
                <Input
                  id="freqName"
                  value={freqForm.nameAr}
                  onChange={(e) => setFreqForm((prev) => ({ ...prev, nameAr: e.target.value }))}
                  placeholder="مثال: دفعتان (نصف سنوي)"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="installmentCount">عدد الدفعات سنوياً</Label>
                  <Input
                    id="installmentCount"
                    type="number"
                    min={1}
                    max={24}
                    value={freqForm.installmentCount}
                    onChange={(e) =>
                      setFreqForm((prev) => ({ ...prev, installmentCount: Number(e.target.value) }))
                    }
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="freqPeriod">التكرار</Label>
                  <Input
                    id="freqPeriod"
                    value={freqForm.periodAr}
                    onChange={(e) => setFreqForm((prev) => ({ ...prev, periodAr: e.target.value }))}
                    placeholder="مثال: كل 6 أشهر"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="freqDesc">الوصف والتوضيح</Label>
                <Input
                  id="freqDesc"
                  value={freqForm.description}
                  onChange={(e) => setFreqForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="توضيح آلية التقسيط أو السداد"
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border/60 p-3">
                <div>
                  <Label className="text-sm font-medium">تفعيل الخيار مباشرة</Label>
                  <p className="text-xs text-muted-foreground">
                    إتاحة هذا الخيار فوراً في القائمة المنسدلة بالموقع
                  </p>
                </div>
                <Switch
                  checked={freqForm.isActive}
                  onCheckedChange={(checked) =>
                    setFreqForm((prev) => ({ ...prev, isActive: checked }))
                  }
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="durName">اسم المدة بالعربية *</Label>
                <Input
                  id="durName"
                  value={durForm.nameAr}
                  onChange={(e) => setDurForm((prev) => ({ ...prev, nameAr: e.target.value }))}
                  placeholder="مثال: سنتان (2)"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="durYears">عدد السنوات</Label>
                <Input
                  id="durYears"
                  type="number"
                  min={1}
                  max={30}
                  value={durForm.years}
                  onChange={(e) =>
                    setDurForm((prev) => ({ ...prev, years: Number(e.target.value) }))
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="durDesc">الوصف والتوضيح</Label>
                <Input
                  id="durDesc"
                  value={durForm.description}
                  onChange={(e) => setDurForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="وصف لنوع العقد أو المدة"
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border/60 p-3">
                <div>
                  <Label className="text-sm font-medium">تفعيل الخيار مباشرة</Label>
                  <p className="text-xs text-muted-foreground">
                    إتاحة هذا الخيار فوراً في القائمة المنسدلة بالموقع
                  </p>
                </div>
                <Switch
                  checked={durForm.isActive}
                  onCheckedChange={(checked) =>
                    setDurForm((prev) => ({ ...prev, isActive: checked }))
                  }
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              إلغاء
            </Button>
            <Button
              onClick={dialogMode === "frequency" ? handleSaveFrequency : handleSaveDuration}
              disabled={
                dialogMode === "frequency" ? !freqForm.nameAr.trim() : !durForm.nameAr.trim()
              }
              className="gap-1.5"
            >
              <Check className="size-4" />
              {editingFrequency || editingDuration ? "حفظ التعديلات" : "إضافة الخيار"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
