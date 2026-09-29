import { useState } from "react";
import { toast } from "sonner";
import {
  Building2,
  Coins,
  Edit2,
  Eye,
  FileText,
  Home,
  Layers,
  Percent,
  Plus,
  Receipt,
  RotateCcw,
  SaudiRiyal,
  ShieldCheck,
  Trash2,
} from "lucide-react";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { TaxSetting } from "@/features/taxes/constants";

interface TaxRulesTableProps {
  taxes: TaxSetting[];
  onTaxesChange: (taxes: TaxSetting[]) => void;
  onResetDefaults: () => void;
}

function getCategoryIcon(category: TaxSetting["category"]) {
  switch (category) {
    case "vat":
      return Percent;
    case "contract_tax":
      return Receipt;
    case "service_fee":
      return Coins;
    default:
      return Layers;
  }
}

export default function TaxRulesTable({
  taxes,
  onTaxesChange,
  onResetDefaults,
}: TaxRulesTableProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTax, setEditingTax] = useState<TaxSetting | null>(null);

  // Form states
  const [formData, setFormData] = useState<Partial<TaxSetting>>({
    nameAr: "",
    category: "vat",
    description: "",
    ratePercent: 0,
    isExempt: false,
    exemptionLabel: "معفى",
    appliesTo: "all",
    calculationType: "percentage",
    fixedAmount: 0,
    isActive: true,
  });

  const activeCount = taxes.filter((t) => t.isActive).length;
  const exemptCount = taxes.filter((t) => t.isExempt).length;

  const handleOpenAdd = () => {
    setEditingTax(null);
    setFormData({
      nameAr: "",
      category: "vat",
      description: "",
      ratePercent: 15,
      isExempt: false,
      exemptionLabel: "معفى",
      appliesTo: "all",
      calculationType: "percentage",
      fixedAmount: 0,
      isActive: true,
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (tax: TaxSetting) => {
    setEditingTax(tax);
    setFormData({
      nameAr: tax.nameAr,
      category: tax.category,
      description: tax.description,
      ratePercent: tax.ratePercent,
      isExempt: tax.isExempt,
      exemptionLabel: tax.exemptionLabel,
      appliesTo: tax.appliesTo,
      calculationType: tax.calculationType,
      fixedAmount: tax.fixedAmount || 0,
      isActive: tax.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleToggleActive = (id: string, nextChecked: boolean) => {
    const target = taxes.find((t) => t.id === id);
    const updated = taxes.map((t) =>
      t.id === id ? { ...t, isActive: nextChecked } : t,
    );
    onTaxesChange(updated);
    if (nextChecked) {
      toast.success(`تم تفعيل البند الضريبي "${target?.nameAr || ""}"`);
    } else {
      toast.info(`تم تعطيل البند الضريبي "${target?.nameAr || ""}"`);
    }
  };

  const handleDelete = (id: string) => {
    const target = taxes.find((t) => t.id === id);
    if (target?.isMandatory) {
      toast.error("لا يمكن حذف بند ضريبي إلزامي أساسي في النظام");
      return;
    }
    const updated = taxes.filter((t) => t.id !== id);
    onTaxesChange(updated);
    toast.success("تم حذف البند الضريبي بنجاح");
  };

  const handleSave = () => {
    if (!formData.nameAr?.trim()) {
      toast.error("يرجى إدخال مسمى الضريبة أو الرسوم");
      return;
    }

    if (editingTax) {
      const updated = taxes.map((t) =>
        t.id === editingTax.id
          ? ({
              ...t,
              ...formData,
              ratePercent: Number(formData.ratePercent) || 0,
              fixedAmount: Number(formData.fixedAmount) || 0,
            } as TaxSetting)
          : t,
      );
      onTaxesChange(updated);
      toast.success("تم تحديث بند الضريبة بنجاح");
    } else {
      const newTax: TaxSetting = {
        id: `tax_${Date.now()}`,
        nameAr: formData.nameAr || "ضريبة جديدة",
        category: formData.category || "custom",
        description: formData.description || "",
        ratePercent: Number(formData.ratePercent) || 0,
        isExempt: !!formData.isExempt,
        exemptionLabel: formData.exemptionLabel || "معفى",
        appliesTo: formData.appliesTo || "all",
        calculationType: formData.calculationType || "percentage",
        fixedAmount: Number(formData.fixedAmount) || 0,
        isActive: formData.isActive !== false,
        order: taxes.length + 1,
      };
      onTaxesChange([...taxes, newTax]);
      toast.success("تمت إضافة بند ضريبي جديد بنجاح");
    }

    setIsDialogOpen(false);
  };

  return (
    <TooltipProvider>
      <Card className="border-border/80 bg-card shadow-xs overflow-hidden">
        <CardHeader className="flex flex-col gap-4 border-b border-border/60 bg-muted/20 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary">
                <Percent className="size-4" />
              </div>
              <CardTitle className="text-base sm:text-lg font-bold">
                قواعد ونسب الضرائب والرسوم
              </CardTitle>
              <Badge variant="secondary" className="text-xs font-semibold">
                {taxes.length} بنود ضريبية
              </Badge>
              {activeCount > 0 && (
                <Badge
                  variant="outline"
                  className="border-primary/30 text-primary text-xs font-semibold"
                >
                  {activeCount} مُفعّل
                </Badge>
              )}
              {exemptCount > 0 && (
                <Badge
                  variant="outline"
                  className="border-border text-muted-foreground text-xs"
                >
                  {exemptCount} إعفاء
                </Badge>
              )}
            </div>
            <CardDescription className="text-xs sm:text-sm">
              إدارة نسب ضريبة القيمة المضافة، شروط الإعفاء السكني والتجاري،
              ورسوم الخدمات المعتمدة
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
              onClick={onResetDefaults}
            >
              <RotateCcw className="size-3.5" />
              <span>استعادة الافتراضي</span>
            </Button>

            <Button
              type="button"
              size="sm"
              className="h-9 gap-1.5 text-xs font-semibold bg-linear-to-r from-primary-800 via-primary to-primary-400 text-primary-foreground shadow-md shadow-inner-primary hover:brightness-105 active:scale-98 cursor-pointer"
              onClick={handleOpenAdd}
            >
              <Plus className="size-3.5" />
              <span>إضافة ضريبة / رسم</span>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {taxes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 px-4 text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-muted/50 text-muted-foreground mb-3">
                <FileText className="size-7" />
              </div>
              <h3 className="text-base font-bold text-foreground">
                لا توجد قواعد ضريبية مضافة
              </h3>
              <p className="mt-1 text-xs text-muted-foreground max-w-sm">
                قم بإضافة بند ضريبي جديد أو استعادة القواعد والإعدادات الضريبية
                الافتراضية للنظام
              </p>
              <div className="mt-4 flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={onResetDefaults}
                  variant="outline"
                  className="text-xs"
                >
                  <RotateCcw className="size-3.5 me-1" />
                  استعادة الافتراضي
                </Button>
                <Button size="sm" onClick={handleOpenAdd} className="text-xs">
                  <Plus className="size-3.5 me-1" />
                  إضافة بند
                </Button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40 border-b border-border/70">
                    <TableHead className="w-16 text-center font-bold ps-4">
                      الحالة
                    </TableHead>
                    <TableHead className="font-bold text-start min-w-[180px]">
                      اسم الضريبة / الرسم
                    </TableHead>
                    <TableHead className="font-bold text-start min-w-[140px]">
                      نطاق السريان
                    </TableHead>
                    <TableHead className="font-bold text-start min-w-[130px]">
                      النسبة / القيمة
                    </TableHead>
                    <TableHead className="font-bold text-start min-w-[130px]">
                      حالة الإعفاء
                    </TableHead>
                    <TableHead className="font-bold text-start min-w-[200px]">
                      الوصف والتطبيق
                    </TableHead>
                    <TableHead className="w-24 text-end font-bold pe-4">
                      إجراءات
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {taxes.map((tax) => {
                    const isVat = tax.category === "vat";
                    const CategoryIcon = getCategoryIcon(tax.category);

                    return (
                      <TableRow
                        key={tax.id}
                        className={`transition-colors border-b border-border/50 last:border-0 hover:bg-muted/30 ${
                          !tax.isActive ? "opacity-60 bg-muted/10" : ""
                        }`}
                      >
                        {/* Active Switch */}
                        <TableCell className="text-center ps-4 py-4">
                          <Tooltip>
                            <TooltipTrigger
                              render={<div className="inline-block" />}
                            >
                              <Switch
                                checked={tax.isActive}
                                onCheckedChange={(checked) =>
                                  handleToggleActive(tax.id, checked)
                                }
                                aria-label={`تفعيل ${tax.nameAr}`}
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              {tax.isActive
                                ? "تعطيل هذا البند الضريبي"
                                : "تفعيل هذا البند الضريبي"}
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>

                        {/* Tax Name + Category */}
                        <TableCell className="py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
                                isVat
                                  ? "bg-primary-50 text-primary border border-primary/20"
                                  : "bg-muted text-muted-foreground border border-border"
                              }`}
                            >
                              <CategoryIcon className="size-4" />
                            </div>
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-bold text-sm text-foreground">
                                  {tax.nameAr}
                                </span>
                                {tax.isMandatory && (
                                  <Badge
                                    variant="outline"
                                    className="border-primary/30 bg-primary-50/50 text-[10px] text-primary px-1.5 py-0"
                                  >
                                    أساسي إلزامي
                                  </Badge>
                                )}
                              </div>
                              <span className="text-[11px] text-muted-foreground block">
                                {isVat
                                  ? "ضريبة قيمة مضافة"
                                  : tax.category === "contract_tax"
                                    ? "ضريبة عقد"
                                    : tax.category === "service_fee"
                                      ? "رسوم خدمة"
                                      : "بند مخصص"}
                              </span>
                            </div>
                          </div>
                        </TableCell>

                        {/* Applies To */}
                        <TableCell className="py-4">
                          {tax.appliesTo === "all" && (
                            <Badge
                              variant="secondary"
                              className="gap-1.5 text-xs font-semibold px-2.5 py-1"
                            >
                              <Layers className="size-3 text-muted-foreground" />
                              <span>جميع العقود</span>
                            </Badge>
                          )}
                          {tax.appliesTo === "residential" && (
                            <Badge
                              variant="outline"
                              className="gap-1.5 border-primary/30 bg-primary-50/30 text-xs font-semibold text-primary px-2.5 py-1"
                            >
                              <Home className="size-3" />
                              <span>سكنية فقط</span>
                            </Badge>
                          )}
                          {tax.appliesTo === "commercial" && (
                            <Badge
                              variant="outline"
                              className="gap-1.5 border-secondary/40 bg-secondary-50/30 text-xs font-semibold text-secondary px-2.5 py-1"
                            >
                              <Building2 className="size-3" />
                              <span>تجارية فقط</span>
                            </Badge>
                          )}
                        </TableCell>

                        {/* Rate / Amount */}
                        <TableCell className="py-4">
                          {tax.calculationType === "percentage" ? (
                            <div className="space-y-0.5">
                              <span className="text-base font-extrabold text-foreground">
                                <bdi>{tax.ratePercent}%</bdi>
                              </span>
                              <span className="text-[10px] text-muted-foreground block">
                                نسبة مئوية من القيمة
                              </span>
                            </div>
                          ) : (
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1 font-extrabold text-foreground">
                                <span className="text-base text-primary">
                                  <bdi>
                                    {(tax.fixedAmount || 0).toLocaleString(
                                      "en-US",
                                    )}
                                  </bdi>
                                </span>
                                <SaudiRiyal className="size-3.5 text-primary shrink-0" />
                              </div>
                              <span className="text-[10px] text-muted-foreground block">
                                مبلغ مقطوع ثابت
                              </span>
                            </div>
                          )}
                        </TableCell>

                        {/* Exemption Status */}
                        <TableCell className="py-4">
                          {tax.isExempt ? (
                            <Badge className="bg-primary-50 text-primary border border-primary/30 text-xs font-semibold gap-1.5 px-2.5 py-1">
                              <ShieldCheck className="size-3.5" />
                              <span>
                                {tax.exemptionLabel || "معفى نظامياً"}
                              </span>
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="border-border/80 text-muted-foreground text-xs font-normal gap-1.5 px-2.5 py-1"
                            >
                              <Percent className="size-3" />
                              <span>خاضع للضريبة</span>
                            </Badge>
                          )}
                        </TableCell>

                        {/* Description */}
                        <TableCell className="py-4">
                          <p className="text-xs text-muted-foreground line-clamp-2 max-w-xs leading-relaxed">
                            {tax.description || "—"}
                          </p>
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-end pe-4 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <Tooltip>
                              <TooltipTrigger
                                render={<div className="inline-block" />}
                              >
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="size-8.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
                                  onClick={() => handleOpenEdit(tax)}
                                >
                                  <Edit2 className="size-4" />
                                  <span className="sr-only">تعديل</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>تعديل الإعدادات</TooltipContent>
                            </Tooltip>

                            {!tax.isMandatory && (
                              <Tooltip>
                                <TooltipTrigger
                                  render={<div className="inline-block" />}
                                >
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="size-8.5 rounded-lg text-destructive/70 hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                                    onClick={() => handleDelete(tax.id)}
                                  >
                                    <Trash2 className="size-4" />
                                    <span className="sr-only">حذف</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>حذف البند</TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>

        {/* Edit / Add Tax Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-xl md:max-w-2xl p-0 overflow-hidden border-border shadow-xl flex flex-col max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-4rem)] rounded-2xl">
            {/* Header with stylized badge */}
            <div className="border-b border-border/70 bg-muted/20 px-4 py-3.5 sm:px-6 sm:py-4 shrink-0">
              <DialogHeader className="gap-2">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="flex size-9 sm:size-10 items-center justify-center rounded-xl bg-primary-50 text-primary border border-primary/20 shadow-xs shrink-0">
                    {editingTax ? (
                      <Edit2 className="size-4 sm:size-5" />
                    ) : (
                      <Plus className="size-4 sm:size-5" />
                    )}
                  </div>
                  <div>
                    <DialogTitle className="text-base sm:text-lg font-bold text-foreground">
                      {editingTax
                        ? "تعديل إعدادات الضريبة"
                        : "إضافة ضريبة أو رسم جديد"}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                      {editingTax
                        ? `تعديل قواعد وحساب ${editingTax.nameAr}`
                        : "تحديد مسمى الضريبة والنسبة وشروط التطبيق على العقود"}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
            </div>

            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto px-4 py-3.5 sm:px-6 sm:py-4 space-y-3.5 sm:space-y-4">
              {/* Section 1: Basic Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                  <span className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-primary text-[11px]">
                    1
                  </span>
                  <span>البيانات الأساسية والتصنيف</span>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="tax-name" className="text-xs font-semibold">
                      اسم الضريبة / الرسم{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="tax-name"
                      value={formData.nameAr}
                      onChange={(e) =>
                        setFormData({ ...formData, nameAr: e.target.value })
                      }
                      placeholder="مثال: ضريبة القيمة المضافة أو ضريبة العقد السكني"
                      className="h-9 text-xs sm:text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="tax-category"
                      className="text-xs font-semibold"
                    >
                      تصنيف البند
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(val) => {
                        if (val) {
                          setFormData((prev) => ({
                            ...prev,
                            category: val as TaxSetting["category"],
                          }));
                        }
                      }}
                    >
                      <SelectTrigger
                        id="tax-category"
                        className="w-full h-9 text-xs"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vat">
                          ضريبة القيمة المضافة (VAT)
                        </SelectItem>
                        <SelectItem value="contract_tax">
                          ضريبة عقد التوثيق
                        </SelectItem>
                        <SelectItem value="service_fee">
                          رسوم خدمة وتشغيل
                        </SelectItem>
                        <SelectItem value="custom">بند مخصص</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="tax-applies"
                      className="text-xs font-semibold"
                    >
                      نطاق السريان
                    </Label>
                    <Select
                      value={formData.appliesTo}
                      onValueChange={(val) => {
                        if (val) {
                          setFormData((prev) => ({
                            ...prev,
                            appliesTo: val as
                              | "all"
                              | "residential"
                              | "commercial",
                          }));
                        }
                      }}
                    >
                      <SelectTrigger
                        id="tax-applies"
                        className="w-full h-9 text-xs"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          جميع العقود الإلكترونية
                        </SelectItem>
                        <SelectItem value="residential">
                          العقود السكنية فقط
                        </SelectItem>
                        <SelectItem value="commercial">
                          العقود التجارية فقط
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="tax-desc" className="text-xs font-semibold">
                      الوصف التوضيحي (يظهر في التفاصيل)
                    </Label>
                    <Input
                      id="tax-desc"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="مثال: ضريبة القيمة المضافة الحكومية أو معفى للوحدات السكنية"
                      className="h-9 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Calculation & Value */}
              <div className="space-y-3 pt-2 border-t border-border/50">
                <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                  <span className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-primary text-[11px]">
                    2
                  </span>
                  <span>طريقة الاحتساب والقيمة</span>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="calc-type"
                      className="text-xs font-semibold"
                    >
                      نوع الاحتساب
                    </Label>
                    <Select
                      value={formData.calculationType}
                      onValueChange={(val) => {
                        if (val) {
                          setFormData((prev) => ({
                            ...prev,
                            calculationType: val as "percentage" | "fixed",
                          }));
                        }
                      }}
                    >
                      <SelectTrigger
                        id="calc-type"
                        className="w-full h-9 text-xs"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">
                          نسبة مئوية (%)
                        </SelectItem>
                        <SelectItem value="fixed">
                          مبلغ ثابت مقطوع (﷼)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.calculationType === "percentage" ? (
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="tax-rate"
                        className="text-xs font-semibold"
                      >
                        النسبة المئوية (%)
                      </Label>
                      <div className="relative">
                        <Input
                          id="tax-rate"
                          type="number"
                          min="0"
                          max="100"
                          step="0.5"
                          value={formData.ratePercent}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              ratePercent: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="h-9 pe-8 text-sm font-bold"
                        />
                        <div className="pointer-events-none absolute inset-y-0 end-2.5 flex items-center text-xs font-bold text-muted-foreground">
                          %
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="tax-fixed"
                        className="text-xs font-semibold"
                      >
                        المبلغ الثابت
                      </Label>
                      <div className="relative">
                        <Input
                          id="tax-fixed"
                          type="number"
                          min="0"
                          step="1"
                          value={formData.fixedAmount}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              fixedAmount: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="h-9 pe-8 text-sm font-bold"
                        />
                        <div className="pointer-events-none absolute inset-y-0 end-2.5 flex items-center text-primary">
                          <SaudiRiyal className="size-3.5" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 3: Exemption & Active State Cards */}
              <div className="space-y-2.5 pt-2 border-t border-border/50">
                <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                  <span className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-primary text-[11px]">
                    3
                  </span>
                  <span>شروط الإعفاء وحالة التفعيل</span>
                </div>

                {/* Exemption Card */}
                <div className="rounded-xl border border-border/80 bg-muted/20 p-3 space-y-2.5 transition-colors">
                  <div className="flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <Label
                        htmlFor="is-exempt"
                        className="font-bold text-xs cursor-pointer flex items-center gap-1.5"
                      >
                        <ShieldCheck className="size-3.5 text-primary shrink-0" />
                        <span>معفى من الضريبة (إعفاء نظامي)</span>
                      </Label>
                      <p className="text-[11px] text-muted-foreground">
                        إظهار علامة "معفى" في الفاتورة بدلاً من فرض القيمة
                        المالية
                      </p>
                    </div>
                    <Switch
                      id="is-exempt"
                      checked={formData.isExempt}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, isExempt: checked })
                      }
                      className="scale-90 sm:scale-100"
                    />
                  </div>

                  {formData.isExempt && (
                    <div className="space-y-1.5 pt-2 border-t border-border/50">
                      <Label
                        htmlFor="exemption-label"
                        className="text-xs font-medium"
                      >
                        نص علامة الإعفاء
                      </Label>
                      <Input
                        id="exemption-label"
                        value={formData.exemptionLabel}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            exemptionLabel: e.target.value,
                          })
                        }
                        placeholder="مثال: معفى أو 0%"
                        className="h-8 text-xs bg-background"
                      />
                    </div>
                  )}
                </div>

                {/* Active Card */}
                <div className="flex items-center justify-between gap-3 rounded-xl border border-border/80 bg-muted/20 p-3">
                  <div className="space-y-0.5">
                    <Label
                      htmlFor="is-active"
                      className="cursor-pointer font-bold text-xs"
                    >
                      تفعيل البند في النظام
                    </Label>
                    <p className="text-[11px] text-muted-foreground">
                      سريان هذا البند واحتسابه في محاكي الفواتير المعتمدة
                    </p>
                  </div>
                  <Switch
                    id="is-active"
                    checked={formData.isActive}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isActive: checked })
                    }
                    className="scale-90 sm:scale-100"
                  />
                </div>
              </div>

              {/* Section 4: Mini Live Preview Pill */}
              <div className="rounded-xl border border-primary/20 bg-primary-50/40 p-2.5 sm:p-3 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 truncate">
                  <Eye className="size-3.5 text-primary shrink-0" />
                  <span className="font-semibold text-foreground truncate">
                    {formData.nameAr || "اسم الضريبة"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-1.5 py-0.5"
                  >
                    {formData.appliesTo === "residential"
                      ? "سكني"
                      : formData.appliesTo === "commercial"
                        ? "تجاري"
                        : "شامل"}
                  </Badge>
                  {formData.isExempt ? (
                    <Badge className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5">
                      {formData.exemptionLabel || "معفى"}
                    </Badge>
                  ) : (
                    <span className="font-bold text-primary">
                      {formData.calculationType === "percentage"
                        ? `${formData.ratePercent || 0}%`
                        : `${formData.fixedAmount || 0} ﷼`}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-border/70 bg-muted/20 px-4 py-3 sm:px-6 sm:py-3.5 shrink-0">
              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDialogOpen(false)}
                  className="cursor-pointer h-9 text-xs w-full sm:w-auto"
                >
                  إلغاء
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleSave}
                  className="bg-linear-to-r from-primary-800 via-primary to-primary-400 text-primary-foreground shadow-md shadow-inner-primary hover:brightness-105 active:scale-98 cursor-pointer h-9 text-xs font-semibold w-full sm:w-auto"
                >
                  {editingTax ? "حفظ التعديلات" : "إضافة البند الضريبي"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </Card>
    </TooltipProvider>
  );
}
