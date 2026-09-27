import { useMemo, useState, useEffect } from "react";
import {
  Check,
  CreditCard,
  Edit2,
  FileCheck2,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  User,
  Users,
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
  INITIAL_AUTHORIZATION_TYPES,
  INITIAL_IDENTITY_TYPES,
  INITIAL_PARTY_CAPACITIES,
  type OptionItem,
} from "@/features/party-options/constants";

const STORAGE_KEYS = {
  authorizations: "makfiwamufi.party-options.authorizations",
  capacities: "makfiwamufi.party-options.capacities",
  identities: "makfiwamufi.party-options.identities",
};

type OptionCollection = "authorizations" | "capacities" | "identities";

export default function PartyOptionsSection() {
  const [activeTab, setActiveTab] = useState<string>("authorizations");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Load from localStorage or defaults
  const [authorizations, setAuthorizations] = useState<OptionItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.authorizations);
    return saved ? JSON.parse(saved) : INITIAL_AUTHORIZATION_TYPES;
  });

  const [capacities, setCapacities] = useState<OptionItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.capacities);
    return saved ? JSON.parse(saved) : INITIAL_PARTY_CAPACITIES;
  });

  const [identities, setIdentities] = useState<OptionItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.identities);
    return saved ? JSON.parse(saved) : INITIAL_IDENTITY_TYPES;
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.authorizations, JSON.stringify(authorizations));
  }, [authorizations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.capacities, JSON.stringify(capacities));
  }, [capacities]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.identities, JSON.stringify(identities));
  }, [identities]);

  // Modal Dialog States
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<OptionItem | null>(null);
  const [targetCollection, setTargetCollection] = useState<OptionCollection>("authorizations");
  const [formData, setFormData] = useState<{ nameAr: string; category: string; description: string; isActive: boolean }>({
    nameAr: "",
    category: "تجاري",
    description: "",
    isActive: true,
  });

  const handleOpenAdd = (collection: OptionCollection) => {
    setTargetCollection(collection);
    setEditingItem(null);
    setFormData({
      nameAr: "",
      category: collection === "authorizations" ? "تجاري" : collection === "capacities" ? "قطاع أعمال" : "أفراد",
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
      category: item.category || "عام",
      description: item.description || "",
      isActive: item.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleSaveOption = () => {
    if (!formData.nameAr.trim()) return;

    if (editingItem) {
      // Edit
      const updated: OptionItem = {
        ...editingItem,
        nameAr: formData.nameAr.trim(),
        category: formData.category,
        description: formData.description.trim(),
        isActive: formData.isActive,
      };

      if (targetCollection === "authorizations") {
        setAuthorizations((prev) => prev.map((it) => (it.id === editingItem.id ? updated : it)));
      } else if (targetCollection === "capacities") {
        setCapacities((prev) => prev.map((it) => (it.id === editingItem.id ? updated : it)));
      } else {
        setIdentities((prev) => prev.map((it) => (it.id === editingItem.id ? updated : it)));
      }
    } else {
      // Add
      const newItem: OptionItem = {
        id: `custom_${Date.now()}`,
        nameAr: formData.nameAr.trim(),
        category: formData.category,
        description: formData.description.trim(),
        isActive: formData.isActive,
      };

      if (targetCollection === "authorizations") {
        setAuthorizations((prev) => [...prev, newItem]);
      } else if (targetCollection === "capacities") {
        setCapacities((prev) => [...prev, newItem]);
      } else {
        setIdentities((prev) => [...prev, newItem]);
      }
    }

    setIsDialogOpen(false);
  };

  const handleDeleteOption = (id: string, collection: OptionCollection) => {
    if (collection === "authorizations") {
      setAuthorizations((prev) => prev.filter((it) => it.id !== id));
    } else if (collection === "capacities") {
      setCapacities((prev) => prev.filter((it) => it.id !== id));
    } else {
      setIdentities((prev) => prev.filter((it) => it.id !== id));
    }
  };

  const handleToggleActive = (id: string, collection: OptionCollection) => {
    if (collection === "authorizations") {
      setAuthorizations((prev) => prev.map((it) => (it.id === id ? { ...it, isActive: !it.isActive } : it)));
    } else if (collection === "capacities") {
      setCapacities((prev) => prev.map((it) => (it.id === id ? { ...it, isActive: !it.isActive } : it)));
    } else {
      setIdentities((prev) => prev.map((it) => (it.id === id ? { ...it, isActive: !it.isActive } : it)));
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm("هل ترغب بإعادة تعيين كافة خيارات التفويض والصفة إلى البيانات الافتراضية؟")) {
      setAuthorizations(INITIAL_AUTHORIZATION_TYPES);
      setCapacities(INITIAL_PARTY_CAPACITIES);
      setIdentities(INITIAL_IDENTITY_TYPES);
      localStorage.removeItem(STORAGE_KEYS.authorizations);
      localStorage.removeItem(STORAGE_KEYS.capacities);
      localStorage.removeItem(STORAGE_KEYS.identities);
    }
  };

  const filteredAuthorizations = useMemo(() => {
    if (!searchQuery.trim()) return authorizations;
    return authorizations.filter(
      (item) =>
        item.nameAr.includes(searchQuery) ||
        (item.category && item.category.includes(searchQuery)) ||
        (item.description && item.description.includes(searchQuery))
    );
  }, [searchQuery, authorizations]);

  const filteredCapacities = useMemo(() => {
    if (!searchQuery.trim()) return capacities;
    return capacities.filter(
      (item) =>
        item.nameAr.includes(searchQuery) ||
        (item.category && item.category.includes(searchQuery)) ||
        (item.description && item.description.includes(searchQuery))
    );
  }, [searchQuery, capacities]);

  const filteredIdentities = useMemo(() => {
    if (!searchQuery.trim()) return identities;
    return identities.filter(
      (item) =>
        item.nameAr.includes(searchQuery) ||
        (item.category && item.category.includes(searchQuery)) ||
        (item.description && item.description.includes(searchQuery))
    );
  }, [searchQuery, identities]);

  return (
    <div className="page-shell space-y-6 py-8">
      <PageHeader
        title="تخصيص بيانات أطراف العقد والتفويض"
        description="إدارة الخيارات المنسدلة لبيانات المستأجر والمؤجر (نوع التفويض، صفة الطرف، وأنواع الوثائق والهويات)."
        badge={
          <Badge variant="secondary" className="gap-1.5 font-medium">
            <FileCheck2 className="size-3.5" />
            بيانات المستأجر والمؤجر
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-border/60 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              أنواع التفويض والتمثيل
            </CardTitle>
            <div className="rounded-md bg-primary/10 p-2 text-primary">
              <FileCheck2 className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{authorizations.length}</span>
              <span className="text-xs text-muted-foreground">
                ({authorizations.filter((a) => a.isActive).length} مفعّل)
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              مدير منشأة، مفوض، وكيل شرعي، رئيس مجلس إدارة
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              صفات أطراف العقد
            </CardTitle>
            <div className="rounded-md bg-primary/10 p-2 text-primary">
              <Users className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{capacities.length}</span>
              <span className="text-xs text-muted-foreground">
                ({capacities.filter((c) => c.isActive).length} مفعّل)
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              فرد، مؤسسة، شركة، جهة حكومية
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              أنواع الهويات والوثائق
            </CardTitle>
            <div className="rounded-md bg-primary/10 p-2 text-primary">
              <CreditCard className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{identities.length}</span>
              <span className="text-xs text-muted-foreground">
                ({identities.filter((i) => i.isActive).length} مفعّل)
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              هوية وطنية، إقامة، الرقم 700، سجل تجاري
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList className="h-auto flex-wrap gap-1 p-1">
            <TabsTrigger value="authorizations" className="gap-2 px-3 py-2 text-sm">
              <FileCheck2 className="size-4" />
              أنواع التفويض والتمثيل ({authorizations.length})
            </TabsTrigger>
            <TabsTrigger value="capacities" className="gap-2 px-3 py-2 text-sm">
              <User className="size-4" />
              صفة المستأجر / المؤجر ({capacities.length})
            </TabsTrigger>
            <TabsTrigger value="identities" className="gap-2 px-3 py-2 text-sm">
              <CreditCard className="size-4" />
              أنواع الهويات والوثائق ({identities.length})
            </TabsTrigger>
          </TabsList>

          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث في الخيارات..."
              className="ps-9"
            />
          </div>
        </div>

        {/* Tab 1: Authorization Types */}
        <TabsContent value="authorizations" className="space-y-4">
          <Card className="border-border/60">
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>أنواع التفويض والتمثيل (نوع التفويض)</CardTitle>
                <CardDescription>
                  الخيارات المتاحة لحقل (نوع التفويض) في الخطوة 5 لمعلومات المستأجر / المؤجر التجاري بالموقع
                </CardDescription>
              </div>
              <Button onClick={() => handleOpenAdd("authorizations")} className="gap-1.5">
                <Plus className="size-4" />
                إضافة نوع تفويض جديد
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12 text-center">#</TableHead>
                    <TableHead>نوع التفويض</TableHead>
                    <TableHead>التصنيف</TableHead>
                    <TableHead>الوصف ومستند الإثبات</TableHead>
                    <TableHead className="w-28 text-center">الظهور بالموقع</TableHead>
                    <TableHead className="w-24 text-center">إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAuthorizations.map((item, index) => (
                    <TableRow key={item.id} className={!item.isActive ? "opacity-60 bg-muted/20" : ""}>
                      <TableCell className="text-center font-medium text-muted-foreground">
                        {index + 1}
                      </TableCell>
                      <TableCell className="font-semibold text-foreground">
                        {item.nameAr}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.category || "عام"}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {item.description || "—"}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Switch
                            checked={item.isActive}
                            onCheckedChange={() => handleToggleActive(item.id, "authorizations")}
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
                            onClick={() => handleOpenEdit(item, "authorizations")}
                            title="تعديل"
                          >
                            <Edit2 className="size-3.5 text-muted-foreground" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleDeleteOption(item.id, "authorizations")}
                            className="text-destructive hover:bg-destructive/10"
                            title="حذف"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredAuthorizations.length === 0 && (
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

        {/* Tab 2: Party Capacities */}
        <TabsContent value="capacities" className="space-y-4">
          <Card className="border-border/60">
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>صفة المستأجر والمؤجر</CardTitle>
                <CardDescription>
                  خيارات تحديد صفة الطرف (فرد - مؤسسة / شركة - جهة حكومية - جهة غير ربحية)
                </CardDescription>
              </div>
              <Button onClick={() => handleOpenAdd("capacities")} className="gap-1.5">
                <Plus className="size-4" />
                إضافة صفة جديدة
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12 text-center">#</TableHead>
                    <TableHead>صفة الطرف</TableHead>
                    <TableHead>التصنيف</TableHead>
                    <TableHead>الوصف</TableHead>
                    <TableHead className="w-28 text-center">الظهور بالموقع</TableHead>
                    <TableHead className="w-24 text-center">إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCapacities.map((item, index) => (
                    <TableRow key={item.id} className={!item.isActive ? "opacity-60 bg-muted/20" : ""}>
                      <TableCell className="text-center font-medium text-muted-foreground">
                        {index + 1}
                      </TableCell>
                      <TableCell className="font-semibold text-foreground">
                        {item.nameAr}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{item.category}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {item.description || "—"}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Switch
                            checked={item.isActive}
                            onCheckedChange={() => handleToggleActive(item.id, "capacities")}
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
                            onClick={() => handleOpenEdit(item, "capacities")}
                            title="تعديل"
                          >
                            <Edit2 className="size-3.5 text-muted-foreground" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleDeleteOption(item.id, "capacities")}
                            className="text-destructive hover:bg-destructive/10"
                            title="حذف"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredCapacities.length === 0 && (
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

        {/* Tab 3: Identity Types */}
        <TabsContent value="identities" className="space-y-4">
          <Card className="border-border/60">
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>أنواع الهويات والوثائق الثبوتية</CardTitle>
                <CardDescription>
                  الوثائق المقبولة لإثبات هوية المستأجر، المؤجر، والمفوضين
                </CardDescription>
              </div>
              <Button onClick={() => handleOpenAdd("identities")} className="gap-1.5">
                <Plus className="size-4" />
                إضافة نوع وثيقة جديد
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12 text-center">#</TableHead>
                    <TableHead>نوع الهوية / الوثيقة</TableHead>
                    <TableHead>التصنيف</TableHead>
                    <TableHead>التوضيح</TableHead>
                    <TableHead className="w-28 text-center">الظهور بالموقع</TableHead>
                    <TableHead className="w-24 text-center">إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIdentities.map((item, index) => (
                    <TableRow key={item.id} className={!item.isActive ? "opacity-60 bg-muted/20" : ""}>
                      <TableCell className="text-center font-medium text-muted-foreground">
                        {index + 1}
                      </TableCell>
                      <TableCell className="font-semibold text-foreground">
                        {item.nameAr}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.category}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {item.description || "—"}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Switch
                            checked={item.isActive}
                            onCheckedChange={() => handleToggleActive(item.id, "identities")}
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
                            onClick={() => handleOpenEdit(item, "identities")}
                            title="تعديل"
                          >
                            <Edit2 className="size-3.5 text-muted-foreground" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleDeleteOption(item.id, "identities")}
                            className="text-destructive hover:bg-destructive/10"
                            title="حذف"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredIdentities.length === 0 && (
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
      </Tabs>

      {/* Dialog for Add / Edit */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingItem
                ? "تعديل خيار القائمة"
                : targetCollection === "authorizations"
                ? "إضافة نوع تفويض جديد"
                : targetCollection === "capacities"
                ? "إضافة صفة طرف جديدة"
                : "إضافة نوع وثيقة / هوية جديدة"}
            </DialogTitle>
            <DialogDescription>
              سيظهر هذا الخيار في القوائم المنسدلة لمعلومات المستأجر والمؤجر في الموقع الرئيسي.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="partyOptionName">الاسم بالعربية *</Label>
              <Input
                id="partyOptionName"
                value={formData.nameAr}
                onChange={(e) => setFormData((prev) => ({ ...prev, nameAr: e.target.value }))}
                placeholder="أدخل اسم الخيار (مثال: مفوض تنفيذي)"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="partyOptionCategory">التصنيف</Label>
              <select
                id="partyOptionCategory"
                value={formData.category}
                onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="تجاري">تجاري</option>
                <option value="شركات">شركات</option>
                <option value="مؤسسات فردية">مؤسسات فردية</option>
                <option value="أفراد">أفراد</option>
                <option value="قطاع أعمال">قطاع أعمال</option>
                <option value="قطاع عام">قطاع عام</option>
                <option value="عام">عام</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="partyOptionDesc">الوصف ومستند الإثبات المطلوب</Label>
              <Input
                id="partyOptionDesc"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="توضيح الصفة أو مستند الوكالة/التفويض المطلوب"
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

          <DialogFooter className="gap-2 sm:gap-0">
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
