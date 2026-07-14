export enum AnimalActivity {
  FAECES = "FAECES",
  CUD = "CUD",
  HABITATION = "HABITATION",
  OBSERVED_FOOTPRINT = "OBSERVED_FOOTPRINT",
  OBSERVED_ALIVE = "OBSERVED_ALIVE",
  OTHER = "OTHER"
}

export enum WasteType {
  NOT_DANGEROUS = "NOT_DANGEROUS",
  DANGEROUS = "DANGEROUS",
  DUMP_NOT_DANGEROUS = "DUMP_NOT_DANGEROUS",
  DUMP_DANGEROUS = "DUMP_DANGEROUS",
  DUMP_INERT = "DUMP_INERT",
  DUMP_PHOSPHOGYPSUM = "DUMP_PHOSPHOGYPSUM"
}

// Cutoff date on which the "20 01 33*" waste code is deactivated. The 2026 year
// option in the form is split around this date: selections before it still offer
// the code, selections on/after it do not.
export const TS_06_DEACTIVATION_DATE = "2026-11-09";
