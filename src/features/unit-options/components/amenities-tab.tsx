import { useState } from "react";
import { toast } from "sonner";
import {
  AirVent,
  Bath,
  BedDouble,
  CookingPot,
  Plus,
  SlidersHorizontal,
  Sofa,
  Wind,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { StaggerContainer, StaggerItem } from "@/components/animations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { AmenityCategory } from "@/features/unit-options/constants";
import { amenityOptionSchema } from "../schemas/unit-options-schema";

interface AmenitiesTabProps {
  amenities: AmenityCategory[];
  onAmenitiesChange: (
    updater: AmenityCategory[] | ((prev: AmenityCategory[]) => AmenityCategory[]),
  ) => void;
  onResetDefaults?: () => void;
}

function getCategoryIcon(field: string) {
  switch (field) {
    case "roomsCount":
      return BedDouble;
    case "livingRoomsCount":
      return Sofa;
    case "kitchensCount":
      return CookingPot;
    case "bathroomsCount":
      return Bath;
    case "windowAcCount":
      return AirVent;
    case "splitAcCount":
      return Wind;
    default:
      return SlidersHorizontal;
  }
}

export default function AmenitiesTab({
  amenities,
  onAmenitiesChange,
}: AmenitiesTabProps) {
  const [newAmenityValue, setNewAmenityValue] = useState<Record<string, string>>({});

  function addOption(categoryField: string) {
    const result = amenityOptionSchema.safeParse({
      value: newAmenityValue[categoryField] || "",
    });

    if (!result.success) {
      toast.error(
        result.error.issues[0]?.message || "يرجى إدخال اسم الخيار أولاً",
      );
      return;
    }

    const value = result.data.value;

    const category = amenities.find((item) => item.field === categoryField);
    if (category?.options.includes(value)) {
      toast.info("هذا الخيار مضاف مسبقاً");
      return;
    }

    onAmenitiesChange((prev) =>
      prev.map((item) =>
        item.field === categoryField
          ? { ...item, options: [...item.options, value] }
          : item,
      ),
    );

    setNewAmenityValue((prev) => ({ ...prev, [categoryField]: "" }));
    toast.success(`تمت إضافة "${value}"`);
  }

  function removeOption(categoryField: string, optionToRemove: string) {
    onAmenitiesChange((prev) =>
      prev.map((category) => {
        if (category.field !== categoryField) return category;
        return {
          ...category,
          options: category.options.filter((option) => option !== optionToRemove),
        };
      }),
    );
    toast.success(`تمت إزالة "${optionToRemove}"`);
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Cards Grid */}
      <StaggerContainer
        staggerDelay={0.04}
        className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        {amenities.map((amenity) => {
          const Icon = getCategoryIcon(amenity.field);
          const inputVal = newAmenityValue[amenity.field] || "";

          return (
            <StaggerItem key={amenity.field} className="h-full">
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ duration: 0.15 }}
                className="flex h-full flex-col justify-between gap-3 rounded-2xl border border-border/70 bg-card p-3.5 shadow-xs transition-colors hover:border-primary/30 sm:p-4"
              >
                {/* Card Header */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 sm:gap-2.5">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary sm:size-8">
                      <Icon className="size-3.5 sm:size-4" />
                    </div>
                    <h4 className="text-xs font-bold text-foreground sm:text-sm">
                      {amenity.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-1 sm:gap-1.5">
                    {amenity.isRequired ? (
                      <Badge
                        variant="outline"
                        className="border-destructive/20 bg-destructive/10 px-1.5 py-0.5 text-[9px] font-medium text-destructive sm:text-[10px]"
                      >
                        إلزامي
                      </Badge>
                    ) : null}
                    <Badge
                      variant="secondary"
                      className="px-1.5 py-0.5 text-[9px] font-medium sm:text-[10px]"
                    >
                      {amenity.options.length}
                    </Badge>
                  </div>
                </div>

                {/* Options Chips Container */}
                <div className="relative flex min-h-12 max-h-36 flex-1 flex-wrap items-center gap-1.5 overflow-y-auto rounded-xl border border-border/50 bg-muted/25 p-2 no-scrollbar sm:min-h-14">
                  {amenity.options.length === 0 ? (
                    <span className="w-full text-center text-xs text-muted-foreground">
                      لا توجد خيارات
                    </span>
                  ) : (
                    <AnimatePresence initial={false} mode="popLayout">
                      {amenity.options.map((option) => (
                        <motion.span
                          key={option}
                          initial={{ opacity: 0, scale: 0.92 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.92 }}
                          transition={{
                            duration: 0.12,
                            ease: [0.21, 0.47, 0.32, 0.98],
                          }}
                          className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-card px-2 py-0.5 text-[11px] font-medium text-foreground shadow-2xs transition-colors hover:border-primary/40 sm:text-xs"
                        >
                          <span>{option}</span>
                          <TooltipProvider delay={150}>
                            <Tooltip>
                              <TooltipTrigger
                                type="button"
                                aria-label={`حذف ${option}`}
                                onClick={() =>
                                  removeOption(amenity.field, option)
                                }
                                className="rounded p-0.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                              >
                                <X className="size-3" />
                              </TooltipTrigger>
                              <TooltipContent side="top" sideOffset={4}>
                                حذف
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </motion.span>
                      ))}
                    </AnimatePresence>
                  )}
                </div>

                {/* Add Input Footer */}
                <div className="flex w-full items-center gap-1.5 pt-0.5">
                  <Input
                    placeholder="إضافة خيار (مثال: 7+)"
                    value={inputVal}
                    onChange={(event) =>
                      setNewAmenityValue((prev) => ({
                        ...prev,
                        [amenity.field]: event.target.value,
                      }))
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addOption(amenity.field);
                      }
                    }}
                    className="h-8 bg-background px-2.5 text-xs placeholder:text-muted-foreground/70 sm:h-8.5 sm:px-3"
                  />
                  <Button
                    size="sm"
                    onClick={() => addOption(amenity.field)}
                    disabled={!inputVal.trim()}
                    className="h-8 shrink-0 gap-1 px-2.5 text-xs sm:h-8.5 sm:px-3 cursor-pointer"
                  >
                    <Plus className="size-3.5" />
                    <span>إضافة</span>
                  </Button>
                </div>
              </motion.div>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </div>
  );
}
