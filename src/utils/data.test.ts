import { stream, waste } from './data';
import { isActiveItem } from './itemFilters';
import { boldCodes } from '../defaults/boldCodes';

describe('TS-06 requirements', () => {
  it('contains combined TS-06 entry excluding all highlighted codes', () => {
    const combined = stream.find(
      item => typeof item.id === 'string' && item.id.startsWith('TS-06 (')
    );

    expect(combined).toBeTruthy();
    boldCodes.forEach(code => {
      if (code === '20 01 33') expect(combined?.id).toContain(code);
    });
  });

  it('has stream entries for every highlighted code', () => {
    boldCodes.forEach(code => {
      const id = code.endsWith('*') ? code : `${code}*`;
      expect(stream.some(item => item.id === `TS-06 (${id})`)).toBe(true);
    });
  });

  it('has waste mappings for every highlighted code', () => {
    const normalize = (value: string) => value.replace(/\*/g, '');

    boldCodes.forEach(code => {
      const id = code.endsWith('*') ? code : `${code}*`;
      expect(
        waste.some(
          item => item.streamId === `TS-06 (${id})` && normalize(item.id) === normalize(id)
        )
      ).toBe(true);
    });
  });

  it('deactivates 20 01 33 after 2026-11-09', () => {
    const streamItem = stream.find(item => item.id === 'TS-06 (20 01 33*)');
    const wasteItem = waste.find(item => item.streamId === 'TS-06 (20 01 33*)');

    expect(streamItem?.deactivateOn).toBe('2026-11-09');
    expect(wasteItem?.deactivateOn).toBe('2026-11-09');

    const before = new Date('2026-11-08T12:00:00Z');
    const onCutoff = new Date('2026-11-09T00:00:00Z');

    expect(isActiveItem(streamItem!, before)).toBe(true);
    expect(isActiveItem(streamItem!, onCutoff)).toBe(false);
  });
});
