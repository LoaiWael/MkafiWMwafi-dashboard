import {
  fetchUnitAmenities,
  createUnitAmenity,
  updateUnitAmenity,
  deleteUnitAmenity,
} from "../api/unit-amenities-api";
import { useUnitOptionCrud } from "./use-unit-option-crud";

export function useUnitAmenities() {
  return useUnitOptionCrud({
    api: {
      fetchAll: fetchUnitAmenities,
      create: createUnitAmenity,
      update: updateUnitAmenity,
      remove: deleteUnitAmenity,
    },
    entityLabel: "مرفق الوحدة",
  });
}
