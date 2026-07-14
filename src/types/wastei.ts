export interface WasteI {
  type: string;
  name: string;
  company: string;
  pollutionNumber: string;
  companyCode: string;
  companyName: string;
  year?: number;
  // Label of the selected year period (distinguishes the two 2026 halves).
  yearLabel?: string;
  // Whether the selected period still offers codes marked with `deactivateOn`.
  includeDeactivatedCodes?: boolean;
  notDangerous?: {
    streamCode?: {
      id: string | number;
      RCoefficient: number;
      DCoefficient: number;
      type: string;
    };
    wasteCode?: {
      streamId: string | number;
      id: string | number;
      type: string;
    };
    quantity?: string;
    code?: string;
  }[];
  dangerous?: {
    streamCode?: {
      id: string | number;
      RCoefficient: number;
      DCoefficient: number;
      type: string;
    };
    wasteCode?: {
      streamId: string | number;
      id: string | number;
      type: string;
    };
    quantity?: string;
    code?: string;
  }[];
  dumpNotDangerous?: {
    quantity?: string;
    setAside?: string;
  }[];
  dumpDangerous?: {
    quantity?: string;
    setAside?: string;
  }[];
  dumpInert?: {
    quantity?: string;
    setAside?: string;
  }[];
  phosphogypsum?: {
    quantity?: string;
  }[];
}
