import { Waste } from "../app";
import { WasteType } from "./constants";
import {
  getDumpInertTotalSum,
  getDumpTotalSum,
  getMaxSum,
  getTotalSum,
  getYearCof,
  roundNumber
} from "./functions";

export const useData = (data: Waste) => {
  const notDangerousSumYearDataCof = getYearCof(
    WasteType.NOT_DANGEROUS,
    data.year
  );

  const notDangerousSum = getTotalSum(
    data.notDangerous,
    notDangerousSumYearDataCof
  );
  const dangerousSumYearDataCof = getYearCof(WasteType.DANGEROUS, data.year);

  const dangerousSum = getTotalSum(data.dangerous, dangerousSumYearDataCof);

  const dumpNotDangerousSumYearDataCof = getYearCof(
    WasteType.DUMP_NOT_DANGEROUS,
    data.year
  );

  const dumpDangerousSumYearDataCof = getYearCof(
    WasteType.DUMP_DANGEROUS,
    data.year
  );

  const dumpPhosphogypsumSumYearDataCof = getYearCof(
    WasteType.DUMP_PHOSPHOGYPSUM,
    data.year
  );

  const dumpNotDangerousSum = getDumpTotalSum(
    data.dumpNotDangerous,
    dumpNotDangerousSumYearDataCof
  );

  const dumpDangerousSum = getDumpTotalSum(
    data.dumpDangerous,
    dumpDangerousSumYearDataCof
  );

  const dumpPhosphogypsumSum = getDumpTotalSum(
    data.phosphogypsum,
    dumpPhosphogypsumSumYearDataCof
  );

  const dumpInertSumYearDataCof = getYearCof(WasteType.DUMP_INERT, data.year);

  const dumpInertSum = getDumpInertTotalSum(
    data.dumpInert,
    dumpInertSumYearDataCof
  );
  const totalSum = roundNumber(
    [
      dumpInertSum,
      dumpDangerousSum,
      dumpNotDangerousSum,
      dangerousSum,
      dumpPhosphogypsumSum,
      notDangerousSum
    ]?.reduce((totalSum, sum) => totalSum + sum, 0)
  );

  const maxSum = getMaxSum(totalSum);

  return {
    notDangerousSumYearDataCof,
    notDangerousSum,
    dangerousSumYearDataCof,
    dangerousSum,
    dumpNotDangerousSumYearDataCof,
    dumpNotDangerousSum,
    dumpDangerousSumYearDataCof,
    dumpDangerousSum,
    dumpInertSumYearDataCof,
    dumpInertSum,
    totalSum,
    dumpPhosphogypsumSumYearDataCof,
    dumpPhosphogypsumSum,
    maxSum
  };
};
