import { useState } from "react";
import {
  Building2,
  Edit2,
  Home,
  Layers,
  Percent,
  Plus,
  RotateCcw,
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
  DialogFooter,
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
import type { TaxSetting } from "@/features/taxes/constants";

interface TaxRulesTableProps {
  taxes: TaxSetting[];
  onTaxesChange: (taxes: TaxSetting[]) => void;
  onResetDefaults: () => void;
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
    const updated = taxes.map((t) =>
      t.id === id ? { ...t, isActive: nextChecked } : t
    );
    onTaxesChange(updated);
  };

  const handleDelete = (id: string) => {
    const updated = taxes.filter((t) => t.id !== id);
    onTaxesChange(updated);
  };

  const handleSave = () => {
    if (!formData.nameAr?.trim()) return;

    if (editingTax) {
      const updated = taxes.map((t) =>
        t.id === editingTax.id
          ? ({
              ...t,
              ...formData,
              ratePercent: Number(formData.ratePercent) || 0,
              fixedAmount: Number(formData.fixedAmount) || 0,
            } as TaxSetting)
          : t
      );
      onTaxesChange(updated);
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
    }

    setIsDialogOpen(false);
  };

  return (
    <Card className="border-border/80 shadow-xs">
      <CardHeader className="flex flex-col gap-4 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <CardTitle className="text-lg font-bold">
            قواعد ونسب الضرائب والرسوم
          </CardTitle>
          <CardDescription>
            التحكم في نسبة ضريبة القيمة المضافة، شروط الإعفاء السكني والتجاري، ورسوم الخدمة
          </CardDescription>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            onClick={onResetDefaults}
          >
            <RotateCcw className="size-3.5" />
            <span>استعادة الافتراضي</span>
          </Button>

          <Button
            type="button"
            size="sm"
            className="h-8 gap-1.5 text-xs"
            onClick={handleOpenAdd}
          >
            <Plus className="size-3.5" />
            <span>إضافة ضريبة / رسم</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="w-12 text-center font-bold">الحالة</TableHead>
                <TableHead className="font-bold">اسم الضريبة / الرسم</TableHead>
                <TableHead className="font-bold">الوصف والتطبيق</TableHead>
                <TableHead className="font-bold">نطاق السريان</TableHead>
                <TableHead className="font-bold">النسبة / القيمة</TableHead>
                <TableHead className="font-bold">الإعفاء الضريبي</TableHead>
                <TableHead className="w-24 text-end font-bold">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {taxes.map((tax) => {
                const isVat = tax.category === "vat";
                return (
                  <TableRow key={tax.id} className="transition-colors hover:bg-muted/20">
                    {/* Active Switch */}
                    <TableCell className="text-center">
                      <Switch
                        checked={tax.isActive}
                        onCheckedChange={(checked) => handleToggleActive(tax.id, checked)}
                        aria-label={`تفعيل ${tax.nameAr}`}
                      />
                    </TableCell>

                    {/* Tax Name */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary">
                          <Percent className="size-4" />
                        </div>
                        <div>
                          <span className="font-bold text-foreground">{tax.nameAr}</span>
                          {isVat && (
                            <Badge
                              variant="outline"
                              className="ms-2 border-primary/30 text-[10px] text-primary"
                            >
                              أساسي
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* Description */}
                    <TableCell>
                      <span className="text-xs text-muted-foreground">
                        {tax.description}
                      </span>
                    </TableCell>

                    {/* Applies To */}
                    <TableCell>
                      {tax.appliesTo === "all" && (
                        <Badge variant="secondary" className="gap-1 text-xs">
                          <Layers className="size-3" />
                          <span>جميع العقود</span>
                        </Badge>
                      )}
                      {tax.appliesTo === "residential" && (
                        <Badge variant="outline" className="gap-1 border-primary/30 text-xs text-primary">
                          <Home className="size-3" />
                          <span>عقود سكنية فقط</span>
                        </Badge>
                      )}
                      {tax.appliesTo === "commercial" && (
                        <Badge variant="outline" className="gap-1 border-accent/40 text-xs text-accent">
                          <Building2 className="size-3" />
                          <span>عقود تجارية فقط</span>
                        </Badge>
                      )}
                    </TableCell>

                    {/* Rate / Amount */}
                    <TableCell>
                      {tax.calculationType === "percentage" ? (
                        <span className="font-bold text-foreground">
                          {tax.ratePercent}%
                        </span>
                      ) : (
                        <span className="font-bold text-foreground">
                          {tax.fixedAmount} ﷼
                        </span>
                      )}
                    </TableCell>

                    {/* Exemption Status */}
                    <TableCell>
                      {tax.isExempt ? (
                        <Badge className="bg-primary-50 text-primary border border-primary/30 text-xs font-semibold">
                          <ShieldCheck className="me-1 size-3" />
                          <span>{tax.exemptionLabel || "معفى"}</span>
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">خاضع للضريبة</span>
                      )}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-end">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-8 text-muted-foreground hover:text-foreground"
                          onClick={() => handleOpenEdit(tax)}
                          title="تعديل"
                        >
                          <Edit2 className="size-3.5" />
                        </Button>

                        {!tax.isMandatory && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-8 text-destructive/70 hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => handleDelete(tax.id)}
                            title="حذف"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Edit / Add Tax Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {editingTax ? "تعديل إعدادات الضريبة" : "إضافة ضريبة أو رسم جديد"}
            </DialogTitle>
            <DialogDescription>
              حدد النسبة وطريقة الاحتساب وسريان الضريبة على العقود الإلكترونية
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Tax Name */}
            <div className="space-y-1.5">
              <Label htmlFor="tax-name">اسم الضريبة / الرسم (يظهر في الفاتورة)</Label>
              <Input
                id="tax-name"
                value={formData.nameAr}
                onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                placeholder="مثال: ضريبة القيمة المضافة أو ضريبة العقد السكني"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="tax-desc">الوصف التوضيحي</Label>
              <Input
                id="tax-desc"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="مثال: ضريبة القيمة المضافة الحكومية أو معفى للوحدات والمنشآت السكنية"
              />
            </div>

            {/* Applies To & Calculation Type */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="tax-applies">نطاق التطبيق</Label>
                <Select
                  value={formData.appliesTo}
                  onValueChange={(val) => {
                    if (val) {
                      setFormData((prev) => ({
                        ...prev,
                        appliesTo: val as "all" | "residential" | "commercial",
                      }));
                    }
                  }}
                >
                  <SelectTrigger id="tax-applies">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع العقود</SelectItem>
                    <SelectItem value="residential">العقود السكنية فقط</SelectItem>
                    <SelectItem value="commercial">العقود التجارية فقط</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="calc-type">طريقة الاحتساب</Label>
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
                  <SelectTrigger id="calc-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">نسبة مئوية (%)</SelectItem>
                    <SelectItem value="fixed">مبلغ ثابت (﷼)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Value / Percentage */}
            {formData.calculationType === "percentage" ? (
              <div className="space-y-1.5">
                <Label htmlFor="tax-rate">النسبة المئوية (%)</Label>
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
                  />
                  <div className="pointer-events-none absolute inset-y-0 end-3 flex items-center text-xs text-muted-foreground">
                    %
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <Label htmlFor="tax-fixed">المبلغ الثابت (﷼)</Label>
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
                  />
                  <div className="pointer-events-none absolute inset-y-0 end-3 flex items-center text-xs text-muted-foreground">
                    ﷼
                  </div>
                </div>
              </div>
            )}

            {/* Exemption Toggle & Exemption Label */}
            <div className="rounded-xl border border-border/80 bg-muted/30 p-3 space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="is-exempt" className="font-bold">
                    معفى من الضريبة (إعفاء نظامي)
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    تطبيق إعفاء نظامي وإظهار علامة "معفى" بدلاً من احتساب المبلغ
                  </p>
                </div>
                <Switch
                  id="is-exempt"
                  checked={formData.isExempt}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isExempt: checked })
                  }
                />
              </div>

              {formData.isExempt && (
                <div className="space-y-1.5 pt-1">
                  <Label htmlFor="exemption-label" className="text-xs">
                    نص علامة الإعفاء (يظهر بجانب المبلغ)
                  </Label>
                  <Input
                    id="exemption-label"
                    value={formData.exemptionLabel}
                    onChange={(e) =>
                      setFormData({ ...formData, exemptionLabel: e.target.value })
                    }
                    placeholder="مثال: معفى أو 0%"
                  />
                </div>
              )}
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between py-1">
              <Label htmlFor="is-active" className="cursor-pointer">
                تفعيل الضريبة في النظام
              </Label>
              <Switch
                id="is-active"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked })
                }
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button type="button" onClick={handleSave}>
              حفظ الإعدادات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
