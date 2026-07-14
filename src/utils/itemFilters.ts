import {StreamItem, WasteItem} from "../types/waste";
import {stream} from "./data";

type ActiveAware = Pick<StreamItem, "activeFrom" | "deactivateOn"> |
  Pick<WasteItem, "activeFrom" | "deactivateOn">;

export const isActiveItem = (item: ActiveAware, now: Date = new Date()) => {
  const activeFrom = item?.activeFrom ? new Date(item.activeFrom) : null;
  const deactivateOn = item?.deactivateOn
    ? new Date(item.deactivateOn)
    : null;

  if (activeFrom && now < activeFrom) return false;
  return !(deactivateOn && now >= deactivateOn);


};

// Availability is driven by the selected year period, not the current date.
// Items carrying a `deactivateOn` marker are only offered when the chosen
// period is before that deactivation (includeDeactivated === true).
export const isAvailableForPeriod = (
  item: ActiveAware,
  includeDeactivated: boolean
) => (item?.deactivateOn ? includeDeactivated : true);

// Stream-code ids that carry a `deactivateOn` marker (e.g. "TS-06 (20 01 33*)").
// These are no longer valid once the chosen period is on/after the cutoff.
const deactivatedStreamIds = new Set(
  stream.filter(item => item.deactivateOn).map(item => String(item.id))
);

// Drop dangerous rows whose selected stream code has been deactivated. Applied
// when the chosen year period no longer offers deactivated codes
// (includeDeactivated === false); otherwise the list is returned unchanged.
export const removeDeactivatedDangerousRows = <
  T extends { streamCode?: { id?: string | number } }
>(
  rows: T[] | undefined,
  includeDeactivated: boolean
): T[] => {
  if (!rows || includeDeactivated) return rows ?? [];
  return rows.filter(
    row => !deactivatedStreamIds.has(String(row?.streamCode?.id))
  );
};

export const sortByCode = <T extends { id: string | number }>(
  a: T,
  b: T
) =>
  String(a?.id).localeCompare(String(b?.id), undefined, {
    numeric: true,
    sensitivity: "base"
  });
