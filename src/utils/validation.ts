import * as Yup from "yup";
import { validationTexts } from "./texts";

export const validateFileSizes = (files: File[]) => {
  const maxSize = 20;
  for (let i = 0; i < files.length; i++) {
    const fileSizeIntoMb = files[i].size / 1024 / 1024;
    if (fileSizeIntoMb > maxSize) {
      return false;
    }
  }

  return true;
};

export const validateWaste = Yup.object().shape(
  {
    quantity: Yup.string().required(validationTexts.requireText),
    code: Yup.string().required(validationTexts.requireText),
    streamCode: Yup.object().when("wasteCode", {
      is: (wasteCode) => !wasteCode || wasteCode.length === 0,
      then: Yup.object().required(validationTexts.requireText).nullable(),
      otherwise: Yup.object().nullable()
    }),
    wasteCode: Yup.object().when("streamCode", {
      is: (streamCode) => !streamCode || streamCode.length === 0,
      then: Yup.object().required(validationTexts.requireText).nullable(),
      otherwise: Yup.object().nullable()
    })
  },
  [["streamCode", "wasteCode"]]
);

export const validateInnertDump = Yup.object().shape({
  quantity: Yup.string().required(validationTexts.requireText)
});

export const validateDump = Yup.object().shape({
  quantity: Yup.object().shape({
    s1: Yup.string().required(validationTexts.requireText),
    s2: Yup.string().required(validationTexts.requireText)
  })
});
