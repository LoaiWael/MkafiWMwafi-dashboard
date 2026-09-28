import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Building,
  Building2,
  Check,
  Edit2,
  Home,
  Layers,
  ListOrdered,
  Plus,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Trash2,
  X,
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
  INITIAL_AMENITIES_CONFIG,
  INITIAL_FLOOR_OPTIONS,
  INITIAL_PROPERTY_TYPES,
  INITIAL_UNIT_TYPES,
  type AmenityCategory,
  type OptionItem,
} from "@/features/unit-options/constants";

const STORAGE_KEYS = {
  unitTypes: "makfiwamufi.unit-options.unit-types",
  propertyTypes: "makfiwamufi.unit-options.property-types",
  floors: "makfiwamufi.unit-options.floors",
  amenities: "makfiwamufi.unit-options.amenities",
};

type OptionCollection = "unitTypes" | "propertyTypes" | "floors";

export default function UnitOptionsSection() {
  const [activeTab, setActiveTab] = useState<string>("unit-types");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Load from localStorage or defaults
  const [unitTypes, setUnitTypes] = useState<OptionItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.unitTypes);
    return saved ? JSON.parse(saved) : INITIAL_UNIT_TYPES;
  });

  const [propertyTypes, setPropertyTypes] = useState<OptionItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.propertyTypes);
    return saved ? JSON.parse(saved) : INITIAL_PROPERTY_TYPES;
  });

  const [floors, setFloors] = useState<OptionItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.floors);
    return saved ? JSON.parse(saved) : INITIAL_FLOOR_OPTIONS;
  });

  const [amenities, setAmenities] = useState<AmenityCategory[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.amenities);
    return saved ? JSON.parse(saved) : INITIAL_AMENITIES_CONFIG;
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.unitTypes, JSON.stringify(unitTypes));
  }, [unitTypes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.propertyTypes, JSON.stringify(propertyTypes));
  }, [propertyTypes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.floors, JSON.stringify(floors));
  }, [floors]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.amenities, JSON.stringify(amenities));
  }, [amenities]);

  // Modal Dialog States
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<OptionItem | null>(null);
  const [targetCollection, setTargetCollection] = useState<OptionCollection>("unitTypes");
  const [formData, setFormData] = useState<{ nameAr: string; category: string; description: string; isActive: boolean }>({
    nameAr: "",
    category: "سكني",
    description: "",
    isActive: true,
  });

  // Amenity Option Input State
  const [newAmenityValue, setNewAmenityValue] = useState<{ [key: string]: string }>({});

  const handleOpenAdd = (collection: OptionCollection) => {
    setTargetCollection(collection);
    setEditingItem(null);
    setFormData({
      nameAr: "",
      category: collection === "propertyTypes" ? "تجاري" : "سكني",
      description: "",
      isActive: true,
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (item: OptionItem, collection: OptionCollection) => {
    setTargetCollection(collection);
    setEditingItem(item);
    setFormData({
      nameAr: item.nameAr,
      category: item.category || "سكني",
      description: item.description || "",
      isActive: item.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleSaveOption = () => {
    if (!formData.nameAr.trim()) {
      toast.error("يرجى إدخال مسمى الخيار");
      return;
    }

    if (editingItem) {
      // Edit
      const updated: OptionItem = {
        ...editingItem,
        nameAr: formData.nameAr.trim(),
        category: formData.category,
        description: formData.description.trim(),
        isActive: formData.isActive,
      };

      if (targetCollection === "unitTypes") {
        setUnitTypes((prev) => prev.map((it) => (it.id === editingItem.id ? updated : it)));
      } else if (targetCollection === "propertyTypes") {
        setPropertyTypes((prev) => prev.map((it) => (it.id === editingItem.id ? updated : it)));
      } else {
        setFloors((prev) => prev.map((it) => (it.id === editingItem.id ? updated : it)));
      }
      toast.success("تم تحديث بيانات الخيار بنجاح");
    } else {
      // Add
      const newItem: OptionItem = {
        id: `custom_${Date.now()}`,
        nameAr: formData.nameAr.trim(),
        category: formData.category,
        description: formData.description.trim(),
        isActive: formData.isActive,
      };

      if (targetCollection === "unitTypes") {
        setUnitTypes((prev) => [...prev, newItem]);
      } else if (targetCollection === "propertyTypes") {
        setPropertyTypes((prev) => [...prev, newItem]);
      } else {
        setFloors((prev) => [...prev, newItem]);
      }
      toast.success("تمت إضافة الخيار الجديد بنجاح");
    }

    setIsDialogOpen(false);
  };

  const handleDeleteOption = (id: string, collection: OptionCollection) => {
    if (collection === "unitTypes") {
      setUnitTypes((prev) => prev.filter((it) => it.id !== id));
    } else if (collection === "propertyTypes") {
      setPropertyTypes((prev) => prev.filter((it) => it.id !== id));
    } else {
      setFloors((prev) => prev.filter((it) => it.id !== id));
    }
    toast.success("تم حذف الخيار بنجاح");
  };

  const handleToggleActive = (id: string, collection: OptionCollection) => {
    if (collection === "unitTypes") {
      setUnitTypes((prev) => prev.map((it) => (it.id === id ? { ...it, isActive: !it.isActive } : it)));
    } else if (collection === "propertyTypes") {
      setPropertyTypes((prev) => prev.map((it) => (it.id === id ? { ...it, isActive: !it.isActive } : it)));
    } else {
      setFloors((prev) => prev.map((it) => (it.id === id ? { ...it, isActive: !it.isActive } : it)));
    }
    toast.success("تم تحديث حالة تفعيل الخيار");
  };

  const handleAddAmenityOption = (categoryField: string) => {
    const val = (newAmenityValue[categoryField] || "").trim();
    if (!val) {
      toast.error("يرجى إدخال اسم الميزة أو التجهيز");
      return;
    }

    setAmenities((prev) =>
      prev.map((cat) => {
        if (cat.field === categoryField) {
          if (cat.options.includes(val)) {
            toast.info("هذه الميزة مضافة مسبقاً");
            return cat;
          }
          return { ...cat, options: [...cat.options, val] };
        }
        return cat;
      })
    );

    setNewAmenityValue((prev) => ({ ...prev, [categoryField]: "" }));
    toast.success(`تمت إضافة الميزة "${val}" بنجاح`);
  };

  const handleRemoveAmenityOption = (categoryField: string, optionToRemove: string) => {
    setAmenities((prev) =>
      prev.map((cat) => {
        if (cat.field === categoryField) {
          return { ...cat, options: cat.options.filter((opt) => opt !== optionToRemove) };
        }
        return cat;
      })
    );
    toast.success(`تمت إزالة "${optionToRemove}"`);
  };

  const handleResetDefaults = () => {
    if (window.confirm("هل ترغب بإعادة تعيين كافة خيارات الوحدات إلى البيانات الافتراضية؟")) {
      setUnitTypes(INITIAL_UNIT_TYPES);
      setPropertyTypes(INITIAL_PROPERTY_TYPES);
      setFloors(INITIAL_FLOOR_OPTIONS);
      setAmenities(INITIAL_AMENITIES_CONFIG);
      localStorage.removeItem(STORAGE_KEYS.unitTypes);
      localStorage.removeItem(STORAGE_KEYS.propertyTypes);
      localStorage.removeItem(STORAGE_KEYS.floors);
      localStorage.removeItem(STORAGE_KEYS.amenities);
      toast.success("تمت استعادة خيارات الوحدات الافتراضية بنجاح");
    }
  };

  const filteredUnitTypes = !searchQuery.trim()
    ? unitTypes
    : unitTypes.filter(
        (item) =>
          item.nameAr.includes(searchQuery) ||
          (item.category && item.category.includes(searchQuery)) ||
          (item.description && item.description.includes(searchQuery))
      );

  const filteredPropertyTypes = !searchQuery.trim()
    ? propertyTypes
    : propertyTypes.filter(
        (item) =>
          item.nameAr.includes(searchQuery) ||
          (item.category && item.category.includes(searchQuery)) ||
          (item.description && item.description.includes(searchQuery))
      );

  const filteredFloors = !searchQuery.trim()
    ? floors
    : floors.filter(
        (item) =>
          item.nameAr.includes(searchQuery) ||
          (item.description && item.description.includes(searchQuery))
      );

  return (
    <div className="page-shell space-y-6 py-8">
      <PageHeader
        title="تخصيص بيانات وقوائم الوحدات"
        description="إدارة وتعديل وإضافة الخيارات المنسدلة التي تظهر للمستخدمين عند تسجيل الوحدات في الموقع الرئيسي."
        badge={
          <Badge variant="secondary" className="gap-1.5 font-medium">
            <Layers className="size-3.5" />
            بيانات الوحدات
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

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/60 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              أنواع الوحدات
            </CardTitle>
            <div className="rounded-md bg-primary/10 p-2 text-primary">
              <Home className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{unitTypes.length}</span>
              <span className="text-xs text-muted-foreground">
                ({unitTypes.filter((u) => u.isActive).length} مفعّل)
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              الخيارات المتاحة لاختيار نوع الوحدة
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              أنواع العقارات والمباني
            </CardTitle>
            <div className="rounded-md bg-primary/10 p-2 text-primary">
              <Building2 className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{propertyTypes.length}</span>
              <span className="text-xs text-muted-foreground">
                ({propertyTypes.filter((p) => p.isActive).length} مفعّل)
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              خيارات نوع المبنى والعقار
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              الأدوار والطوابق
            </CardTitle>
            <div className="rounded-md bg-primary/10 p-2 text-primary">
              <ListOrdered className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{floors.length}</span>
              <span className="text-xs text-muted-foreground">
                ({floors.filter((f) => f.isActive).length} مفعّل)
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              قائمة أرقام الطوابق والأدوار
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              قوائم المرافق والتكييف
            </CardTitle>
            <div className="rounded-md bg-primary/10 p-2 text-primary">
              <SlidersHorizontal className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{amenities.length} قوائم</div>
            <p className="mt-1 text-xs text-muted-foreground">
              الغرف، الصالات، المطابخ، دورات المياه والتكييف
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList className="h-auto flex-wrap gap-1 p-1">
            <TabsTrigger value="unit-types" className="gap-2 px-3 py-2 text-sm">
              <Home className="size-4" />
              أنواع الوحدات ({unitTypes.length})
            </TabsTrigger>
            <TabsTrigger value="property-types" className="gap-2 px-3 py-2 text-sm">
              <Building className="size-4" />
              أنواع المباني ({propertyTypes.length})
            </TabsTrigger>
            <TabsTrigger value="floors" className="gap-2 px-3 py-2 text-sm">
              <ListOrdered className="size-4" />
              الأدوار والطوابق ({floors.length})
            </TabsTrigger>
            <TabsTrigger value="amenities" className="gap-2 px-3 py-2 text-sm">
              <SlidersHorizontal className="size-4" />
              المرافق والتجهيزات ({amenities.length})
            </TabsTrigger>
          </TabsList>

          {activeTab !== "amenities" && (
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

        {/* Tab 1: Unit Types */}
        <TabsContent value="unit-types" className="space-y-4">
          <Card className="border-border/60">
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>أنواع الوحدات العقارية</CardTitle>
                <CardDescription>
                  يمكنك تفعيل أو تعطيل أو إضافة أنواع وحدات جديدة لتظهر في القائمة المنسدلة بالموقع
                </CardDescription>
              </div>
              <Button onClick={() => handleOpenAdd("unitTypes")} className="gap-1.5">
                <Plus className="size-4" />
                إضافة نوع وحدة جديد
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12 text-center">#</TableHead>
                    <TableHead>اسم الوحدة</TableHead>
                    <TableHead>التصنيف</TableHead>
                    <TableHead>الوصف والتفاصيل</TableHead>
                    <TableHead className="w-28 text-center">الظهور بالموقع</TableHead>
                    <TableHead className="w-24 text-center">إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUnitTypes.map((item, index) => (
                    <TableRow key={item.id} className={!item.isActive ? "opacity-60 bg-muted/20" : ""}>
                      <TableCell className="text-center font-medium text-muted-foreground">
                        {index + 1}
                      </TableCell>
                      <TableCell className="font-semibold text-foreground">
                        {item.nameAr}
                      </TableCell>
                      <TableCell>
                        <Badge variant={item.category === "سكني" ? "default" : "secondary"}>
                          {item.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {item.description || "—"}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Switch
                            checked={item.isActive}
                            onCheckedChange={() => handleToggleActive(item.id, "unitTypes")}
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
                            onClick={() => handleOpenEdit(item, "unitTypes")}
                            title="تعديل"
                          >
                            <Edit2 className="size-3.5 text-muted-foreground" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleDeleteOption(item.id, "unitTypes")}
                            className="text-destructive hover:bg-destructive/10"
                            title="حذف"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredUnitTypes.length === 0 && (
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

        {/* Tab 2: Property Types */}
        <TabsContent value="property-types" className="space-y-4">
          <Card className="border-border/60">
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>أنواع العقارات والمباني</CardTitle>
                <CardDescription>
                  الخيارات المتاحة لحقل (نوع العقار / المبنى) في استمارة بيانات العقار والوحدات
                </CardDescription>
              </div>
              <Button onClick={() => handleOpenAdd("propertyTypes")} className="gap-1.5">
                <Plus className="size-4" />
                إضافة نوع مبنى جديد
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12 text-center">#</TableHead>
                    <TableHead>نوع العقار / المبنى</TableHead>
                    <TableHead>التصنيف</TableHead>
                    <TableHead>الوصف</TableHead>
                    <TableHead className="w-28 text-center">الظهور بالموقع</TableHead>
                    <TableHead className="w-24 text-center">إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPropertyTypes.map((item, index) => (
                    <TableRow key={item.id} className={!item.isActive ? "opacity-60 bg-muted/20" : ""}>
                      <TableCell className="text-center font-medium text-muted-foreground">
                        {index + 1}
                      </TableCell>
                      <TableCell className="font-semibold text-foreground">
                        {item.nameAr}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.category === "سكني"
                              ? "default"
                              : item.category === "تجاري"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {item.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {item.description || "—"}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Switch
                            checked={item.isActive}
                            onCheckedChange={() => handleToggleActive(item.id, "propertyTypes")}
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
                            onClick={() => handleOpenEdit(item, "propertyTypes")}
                            title="تعديل"
                          >
                            <Edit2 className="size-3.5 text-muted-foreground" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleDeleteOption(item.id, "propertyTypes")}
                            className="text-destructive hover:bg-destructive/10"
                            title="حذف"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredPropertyTypes.length === 0 && (
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

        {/* Tab 3: Floor Options */}
        <TabsContent value="floors" className="space-y-4">
          <Card className="border-border/60">
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>خيارات الأدوار والطوابق</CardTitle>
                <CardDescription>
                  الخيارات المتاحة لاختيار (رقم الطابق) في تفاصيل الوحدات
                </CardDescription>
              </div>
              <Button onClick={() => handleOpenAdd("floors")} className="gap-1.5">
                <Plus className="size-4" />
                إضافة طابق / دور جديد
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12 text-center">#</TableHead>
                    <TableHead>اسم الطابق / الدور</TableHead>
                    <TableHead>التوضيح</TableHead>
                    <TableHead className="w-28 text-center">الظهور بالموقع</TableHead>
                    <TableHead className="w-24 text-center">إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFloors.map((item, index) => (
                    <TableRow key={item.id} className={!item.isActive ? "opacity-60 bg-muted/20" : ""}>
                      <TableCell className="text-center font-medium text-muted-foreground">
                        {index + 1}
                      </TableCell>
                      <TableCell className="font-semibold text-foreground">
                        {item.nameAr}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {item.description || "—"}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Switch
                            checked={item.isActive}
                            onCheckedChange={() => handleToggleActive(item.id, "floors")}
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
                            onClick={() => handleOpenEdit(item, "floors")}
                            title="تعديل"
                          >
                            <Edit2 className="size-3.5 text-muted-foreground" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleDeleteOption(item.id, "floors")}
                            className="text-destructive hover:bg-destructive/10"
                            title="حذف"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredFloors.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                        لا توجد نتائج مطابقة لبحثك
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Amenities & Counts */}
        <TabsContent value="amenities" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {amenities.map((amenity) => (
              <Card key={amenity.field} className="border-border/60">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-bold">
                      {amenity.title}
                    </CardTitle>
                    {amenity.isRequired && (
                      <Badge variant="outline" className="text-xs text-rose-600 border-rose-200 dark:text-rose-400">
                        حقل إلزامي *
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-xs">
                    تخصيص الخيارات العددية في القائمة المنسدلة
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-1.5">
                    {amenity.options.map((opt) => (
                      <div
                        key={opt}
                        className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground"
                      >
                        <span>{opt}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveAmenityOption(amenity.field, opt)}
                          className="text-muted-foreground hover:text-destructive"
                          title="حذف الخيار"
                        >
                          <X className="size-3" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 pt-2 border-t border-border/50">
                    <Input
                      placeholder="إضافة خيار (مثال: 7+)"
                      value={newAmenityValue[amenity.field] || ""}
                      onChange={(e) =>
                        setNewAmenityValue((prev) => ({
                          ...prev,
                          [amenity.field]: e.target.value,
                        }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddAmenityOption(amenity.field);
                        }
                      }}
                      className="h-8 text-xs"
                    />
                    <Button
                      size="sm"
                      onClick={() => handleAddAmenityOption(amenity.field)}
                      className="shrink-0 gap-1 h-8 text-xs"
                    >
                      <Plus className="size-3" />
                      إضافة
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog for Add / Edit */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingItem
                ? "تعديل خيار القائمة المنسدلة"
                : targetCollection === "unitTypes"
                ? "إضافة نوع وحدة جديد"
                : targetCollection === "propertyTypes"
                ? "إضافة نوع مبنى / عقار جديد"
                : "إضافة دور / طابق جديد"}
            </DialogTitle>
            <DialogDescription>
              سيظهر هذا الخيار في القوائم المنسدلة للمستخدمين بالموقع الرئيسي عند التفعيل.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="optionName">الاسم بالعربية *</Label>
              <Input
                id="optionName"
                value={formData.nameAr}
                onChange={(e) => setFormData((prev) => ({ ...prev, nameAr: e.target.value }))}
                placeholder="أدخل اسم الخيار (مثال: استوديو مفروش)"
              />
            </div>

            {targetCollection !== "floors" && (
              <div className="space-y-1.5">
                <Label htmlFor="optionCategory">التصنيف</Label>
                <select
                  id="optionCategory"
                  value={formData.category}
                  onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="سكني">سكني</option>
                  <option value="تجاري">تجاري</option>
                  <option value="صناعي/لوجستي">صناعي/لوجستي</option>
                  <option value="مختلط">مختلط</option>
                </select>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="optionDesc">الوصف والتوضيح</Label>
              <Input
                id="optionDesc"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="وصف مختصر للوحدة أو العقار"
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border/60 p-3">
              <div>
                <Label className="text-sm font-medium">تفعيل الخيار مباشرة</Label>
                <p className="text-xs text-muted-foreground">
                  إتاحة هذا الخيار فوراً في القوائم المنسدلة بالموقع الرئيسي
                </p>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isActive: checked }))}
              />
            </div>
          </div>

          <DialogFooter className="gap-2.5 sm:gap-3">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleSaveOption} disabled={!formData.nameAr.trim()} className="gap-1.5">
              <Check className="size-4" />
              {editingItem ? "حفظ التعديلات" : "إضافة الخيار"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
