import { TS_06_CODES, TS_06_DEACTIVATED_CODE, getTs06CodesLabel } from './TS-06-codes';
import { getWasteStreamCode } from './functions';

describe('getWasteStreamCode', () => {
  it("shows the waste item's streamId instead of the stream item id", () => {
    expect(
      getWasteStreamCode({
        wasteCode: { id: '16 06 04', streamId: TS_06_CODES },
        streamCode: { id: 'TS-06 (16 06 04*)' },
      }),
    ).toBe(TS_06_CODES);
  });

  it('falls back to the selected stream item id', () => {
    expect(getWasteStreamCode({ streamCode: { id: 'TS-03' } })).toBe('TS-03');
  });
});

describe('getTs06CodesLabel', () => {
  it('keeps the deactivated code before the cutoff period', () => {
    expect(getTs06CodesLabel(TS_06_CODES, true)).toBe(TS_06_CODES);
    expect(getTs06CodesLabel(TS_06_CODES, true)).toContain(TS_06_DEACTIVATED_CODE);
  });

  it('drops the deactivated code on/after the cutoff period', () => {
    const label = getTs06CodesLabel(TS_06_CODES, false);

    expect(label).not.toContain(TS_06_DEACTIVATED_CODE);
    expect(label).toContain('20 01 43*');
    expect(label.endsWith('20 01 43*)')).toBe(true);
  });

  it('leaves non-TS-06 labels untouched', () => {
    expect(getTs06CodesLabel('TS-03', false)).toBe('TS-03');
  });
});
