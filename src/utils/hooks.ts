import { Waste } from "../app";
import { WasteType } from "./constants";
import {
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

  const dumpNotDangerousSum = getDumpTotalSum(
    data.dumpNotDangerous,
    dumpNotDangerousSumYearDataCof
  );

  const dumpDangerousSumYearDataCof = getYearCof(
    WasteType.DUMP_DANGEROUS,
    data.year
  );

  const dumpDangerousSum = getDumpTotalSum(
    data.dumpDangerous,
    dumpDangerousSumYearDataCof
  );

  const dumpInertSumYearDataCof = getYearCof(WasteType.DUMP_INERT, data.year);

  const dumpInertSum = getDumpTotalSum(data.dumpInert, dumpInertSumYearDataCof);
  const totalSum = roundNumber(
    [
      dumpInertSum,
      dumpDangerousSum,
      dumpNotDangerousSum,
      dangerousSum,
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
    maxSum
  };
};
