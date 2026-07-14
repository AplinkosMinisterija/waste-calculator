import { TS_06_CODES } from './TS-06-codes';
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
