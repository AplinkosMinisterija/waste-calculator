import { WasteType } from '../utils/constants';

export type ActiveItem = {
  activeFrom?: string;
  deactivateOn?: string;
};

export type StreamItem = ActiveItem & {
  id: string | number;
  R: number;
  D: number;
  S: number;
  type: WasteType;
  streamId?: string | number;
};

export type WasteItem = ActiveItem & {
  streamId: string | number;
  id: string;
  type: WasteType;
};
