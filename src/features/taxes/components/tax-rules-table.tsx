import { useState } from "react";
import { toast } from "sonner";
import {
  Building2,
  Coins,
  Edit2,
  FileText,
  Home,
  Layers,
  Percent,
  Receipt,
  SaudiRiyal,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/animations";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import WarningDialog from "@/components/warning-dialog";
import type { TaxSetting } from "@/features/taxes/constants";

interface TaxRulesTableProps {
  taxes: TaxSetting[];
  onTaxesChange: (taxes: TaxSetting[]) => void;
  onEdit: (tax: TaxSetting) => void;
  onResetDefaults?: () => void;
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
  onEdit,
}: TaxRulesTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const activeCount = taxes.filter((t) => t.isActive).length;
  const exemptCount = taxes.filter((t) => t.isExempt).length;

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

  const confirmDelete = () => {
    if (deleteId) {
      const target = taxes.find((t) => t.id === deleteId);
      if (target?.isMandatory) {
        toast.error("لا يمكن حذف بند ضريبي إلزامي أساسي في النظام");
        setDeleteId(null);
        return;
      }
      const updated = taxes.filter((t) => t.id !== deleteId);
      onTaxesChange(updated);
      toast.success("تم حذف البند الضريبي بنجاح");
      setDeleteId(null);
    }
  };

  return (
    <TooltipProvider>
      <FadeIn duration={0.3} delay={0.05}>
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
                  قم بإضافة بند ضريبي جديد من أعلى الصفحة أو استعادة القواعد والإعدادات الضريبية الافتراضية
                </p>
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
                                    onClick={() => onEdit(tax)}
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
                                      onClick={() => setDeleteId(tax.id)}
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
        </Card>
      </FadeIn>

      <WarningDialog
        open={!!deleteId}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
        title="تأكيد الحذف"
        description="هل أنت متأكد من رغبتك في حذف هذا البند الضريبي؟ لا يمكن التراجع عن هذا الإجراء."
        confirmLabel="حذف"
        onConfirm={confirmDelete}
      />
    </TooltipProvider>
  );
}
