import { toast } from "react-toastify";
import { yearData } from "./data";
import { validationTexts } from "./texts";

export const handleAlert = (responseError: string) => {
  toast.error(
    validationTexts[responseError as keyof typeof validationTexts] ||
      validationTexts.error,
    {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true
    }
  );
};

export const handleSuccess = (message: string) => {
  toast.success(message, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true
  });
};
export const roundNumber = (number) =>
  parseFloat((Math.round(number * 100) / 100).toFixed(2));

export const getSum = (coefficient, quantity, yearCoefficient) => {
  const canCalculate = coefficient && quantity && yearCoefficient;
  if (!canCalculate) return "";

  const product = coefficient * quantity * yearCoefficient;
  return product > 0 ? roundNumber(product) : 0;
};

export const getDumpSum = (yearCoefficient, quantity, delay) => {
  const canCalculate = yearCoefficient && quantity && delay;

  if (!canCalculate) return "";

  const product = yearCoefficient * quantity - delay;
  return product > 0 ? roundNumber(product) : 0;
};

export const getCoefficient = (code, streamCode) => {
  if (code && streamCode) return streamCode[code];

  return "";
};

export const getTotalSum = (data, yearCof) =>
  roundNumber(
    data?.reduce(
      (sum, current) =>
        sum +
        getSum(
          getCoefficient(current?.code, current?.streamCode),
          current?.quantity,
          yearCof
        ),
      0
    ) || 0
  );

export const getDumpTotalSum = (data, yearCof) =>
  roundNumber(
    data?.reduce((sum, current) => {
      return sum + getDumpSum(yearCof, current?.quantity, current?.delay);
    }, 0) || 0
  );

export const getMaxSum = (totalSum) => {
  if (totalSum <= 100000) return totalSum * 1.1;

  if (totalSum > 100000 && totalSum <= 200000) return totalSum * 1.05;

  return totalSum * 1.01;
};

export const getYearCof = (type, year) =>
  yearData.find((item) => item.type === type && item?.year === year)
    ?.coefficient;
