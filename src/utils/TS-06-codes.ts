// The waste code deactivated on TS_06_DEACTIVATION_DATE. Before the cutoff it is
// listed among the TS-06 exceptions; on/after the cutoff it is no longer a valid
// code, so it is dropped from the "išskyrus" list.
export const TS_06_DEACTIVATED_CODE = '20 01 33*';

// Aggregate TS-06 stream label listing every excepted code. This string is also
// the stream item's `id`, so it stays stable as an identity; use
// `getTs06CodesLabel` to obtain the period-appropriate label for display.
export const TS_06_CODES =
  'TS-06 (visiems, išskyrus 09 01 11*; 16 06 01*; 16 06 02*; 16 06 04*; 16 06 06*; 16 06 07*; 16 06 08*; 16 06 09*; 16 06 10*; 16 06 11*; 16 06 13*; 16 06 14*; 16 06 22*; 16 06 24*; 16 06 26*; 16 06 28*; 16 06 30*; 16 06 32*; 16 06 34*; 19 02 12*; 19 02 13*; 19 14 01*; 19 14 02*; 19 14 03*; 19 14 04*; 19 14 05*; 19 14 06*; 19 14 07*; 20 01 42*; 20 01 43*; 20 01 33*)';

// Label shown for the aggregate TS-06 stream code. When the selected period no
// longer offers deactivated codes (includeDeactivated === false), the deactivated
// code is removed from the exception list.
export const getTs06CodesLabel = (value: string, includeDeactivated: boolean) => {
  if (includeDeactivated || value !== TS_06_CODES) return value;
  return value.replace(`; ${TS_06_DEACTIVATED_CODE}`, '');
};
