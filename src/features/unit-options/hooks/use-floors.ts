import {
  fetchFloors,
  createFloor,
  updateFloor,
  deleteFloor,
} from "../api/floors-api";
import { useUnitOptionCrud } from "./use-unit-option-crud";

export function useFloors() {
  return useUnitOptionCrud({
    api: {
      fetchAll: fetchFloors,
      create: createFloor,
      update: updateFloor,
      remove: deleteFloor,
    },
    entityLabel: "الدور / الطابق",
  });
}
