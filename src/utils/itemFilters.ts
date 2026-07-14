import {StreamItem, WasteItem} from "../types/waste";

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

export const sortByCode = <T extends { id: string | number }>(
  a: T,
  b: T
) =>
  String(a?.id).localeCompare(String(b?.id), undefined, {
    numeric: true,
    sensitivity: "base"
  });
