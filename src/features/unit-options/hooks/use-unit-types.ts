import {
  fetchUnitTypes,
  createUnitType,
  updateUnitType,
  deleteUnitType,
} from "../api/unit-types-api";
import { useUnitOptionCrud } from "./use-unit-option-crud";

export function useUnitTypes() {
  return useUnitOptionCrud({
    api: {
      fetchAll: fetchUnitTypes,
      create: createUnitType,
      update: updateUnitType,
      remove: deleteUnitType,
    },
    entityLabel: "نوع الوحدة",
  });
}
