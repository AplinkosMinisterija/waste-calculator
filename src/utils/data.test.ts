import { stream, waste } from './data';
import { isAvailableForPeriod, removeDeactivatedDangerousRows } from './itemFilters';
import { boldCodes } from '../defaults/boldCodes';
import { TS_06_DEACTIVATION_DATE } from './constants';
import { buildYearOptions, YEAR_PERIOD_LABELS } from './yearOptions';

describe('TS-06 requirements', () => {
  it('contains combined TS-06 entry excluding all highlighted codes', () => {
    const combined = stream.find(
      (item) => typeof item.id === 'string' && item.id.startsWith('TS-06 ('),
    );

    expect(combined).toBeTruthy();
    boldCodes.forEach((code) => {
      if (code !== '20 01 33') expect(combined?.id).toContain(code);
    });
  });

  it('has stream entries for every highlighted code', () => {
    boldCodes.forEach((code) => {
      const id = code.endsWith('*') ? code : `${code}*`;
      expect(stream.some((item) => item.id === `TS-06 (${id})`)).toBe(true);
    });
  });

  it('applies the 0.01 R coefficient to every highlighted code', () => {
    boldCodes.forEach((code) => {
      const id = code.endsWith('*') ? code : `${code}*`;
      const streamItem = stream.find((item) => item.id === `TS-06 (${id})`);

      expect(streamItem?.R).toBe(0.01);
    });
  });

  it('has waste mappings for every highlighted code', () => {
    const normalize = (value: string) => value.replace(/\*/g, '');

    boldCodes.forEach((code) => {
      const id = code.endsWith('*') ? code : `${code}*`;
      expect(
        waste.some(
          (item) => item.streamId === `TS-06 (${id})` && normalize(item.id) === normalize(id),
        ),
      ).toBe(true);
    });
  });

  it('marks 20 01 33 with the shared deactivation date', () => {
    const streamItem = stream.find((item) => item.id === 'TS-06 (20 01 33*)');
    const wasteItem = waste.find((item) => item.streamId === 'TS-06 (20 01 33*)');

    expect(streamItem?.deactivateOn).toBe(TS_06_DEACTIVATION_DATE);
    expect(wasteItem?.deactivateOn).toBe(TS_06_DEACTIVATION_DATE);
  });

  it('offers 20 01 33 before the cutoff period and hides it after', () => {
    const streamItem = stream.find((item) => item.id === 'TS-06 (20 01 33*)')!;
    const wasteItem = waste.find((item) => item.streamId === 'TS-06 (20 01 33*)')!;

    // includeDeactivated === true -> available
    expect(isAvailableForPeriod(streamItem, true)).toBe(true);
    expect(isAvailableForPeriod(wasteItem, true)).toBe(true);

    // includeDeactivated === false -> hidden
    expect(isAvailableForPeriod(streamItem, false)).toBe(false);
    expect(isAvailableForPeriod(wasteItem, false)).toBe(false);
  });

  it('keeps non-deactivated items available regardless of period', () => {
    const plainItem = stream.find((item) => !item.deactivateOn)!;

    expect(isAvailableForPeriod(plainItem, true)).toBe(true);
    expect(isAvailableForPeriod(plainItem, false)).toBe(true);
  });
});

describe('year options', () => {
  const options = buildYearOptions();

  it('splits 2026 into a before- and after-cutoff period', () => {
    const yearOptions2026 = options.filter((option) => option.year === 2026);

    expect(yearOptions2026).toHaveLength(2);
    expect(yearOptions2026.map((option) => option.label)).toEqual([
      YEAR_PERIOD_LABELS.beforeCutoff,
      YEAR_PERIOD_LABELS.afterCutoff,
    ]);
  });

  it('includes deactivated codes only for the before-cutoff 2026 period', () => {
    const before = options.find((option) => option.label === YEAR_PERIOD_LABELS.beforeCutoff);
    const after = options.find((option) => option.label === YEAR_PERIOD_LABELS.afterCutoff);

    expect(before?.includeDeactivated).toBe(true);
    expect(after?.includeDeactivated).toBe(false);
  });

  it('includes deactivated codes for years before the split and excludes them after', () => {
    expect(options.find((option) => option.year === 2025)?.includeDeactivated).toBe(true);
    expect(options.find((option) => option.year === 2027)?.includeDeactivated).toBe(false);
  });
});

describe('removeDeactivatedDangerousRows', () => {
  const deactivatedRow = { streamCode: { id: 'TS-06 (20 01 33*)' } };
  const validRow = { streamCode: { id: 'TS-06 (20 01 42*)' } };

  it('drops deactivated stream codes when the period excludes them', () => {
    const result = removeDeactivatedDangerousRows([validRow, deactivatedRow], false);

    expect(result).toEqual([validRow]);
  });

  it('keeps all rows when the period still includes deactivated codes', () => {
    const rows = [validRow, deactivatedRow];

    expect(removeDeactivatedDangerousRows(rows, true)).toEqual(rows);
  });

  it('returns an empty array for undefined input', () => {
    expect(removeDeactivatedDangerousRows(undefined, false)).toEqual([]);
  });
});
