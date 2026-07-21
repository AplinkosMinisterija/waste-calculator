import {TS_06_DEACTIVATION_DATE, WasteType} from './constants';
import {yearData} from './data';

export interface YearOption {
  year: number;
  label: string;
  includeDeactivated: boolean;
}

// The year on which the "20 01 33*" code is deactivated. Selections in this year
// are split into a "before cutoff" and an "on/after cutoff" period.
const SPLIT_YEAR = new Date(TS_06_DEACTIVATION_DATE).getUTCFullYear();

// Labels for the two halves of the split year. Day numbers bracket the cutoff:
// the last available day and the first deactivated day.
export const YEAR_PERIOD_LABELS = {
  beforeCutoff: 'Iki 2026 lapkričio 8 d.',
  afterCutoff: 'Nuo 2026 lapkričio 9 d.',
};

// Build the year dropdown options. Every year maps to a single option except the
// split year, which produces two options carrying the include/exclude flag for
// deactivated codes. Non-split years include deactivated codes only when they
// fall before the split year.
export const buildYearOptions = (): YearOption[] =>
  yearData
    .filter((item) => item.type === WasteType.DANGEROUS)
    .flatMap<YearOption>((item) => {
      if (item.year === SPLIT_YEAR) {
        return [
          {
            year: item.year,
            label: YEAR_PERIOD_LABELS.beforeCutoff,
            includeDeactivated: true,
          },
          {
            year: item.year,
            label: YEAR_PERIOD_LABELS.afterCutoff,
            includeDeactivated: false,
          },
        ];
      }

      return [
        {
          year: item.year,
          label: String(item.year),
          includeDeactivated: item.year < SPLIT_YEAR,
        },
      ];
    });
