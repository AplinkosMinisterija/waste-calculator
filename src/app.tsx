import {
  Document,
  Font,
  Page,
  pdf,
  StyleSheet,
  Text,
  View
} from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import { Form, Formik } from "formik";
import { isEqual } from "lodash";
import { useState } from "react";
import styled from "styled-components";
import Button from "./components/buttons/Button";
import SimpleContainer from "./components/containers/SimpleContainer";
import NumericTextField from "./components/fields/NumericTextField";
import SelectField from "./components/fields/SelectField";
import TextField from "./components/fields/TextField";
import DefaultLayout from "./components/layouts/DefaultLayout";
import DumpDangerousContainer from "./components/other/DumpDangerous";
import DumpInertContainer from "./components/other/DumpInertContainer";
import DumpNotDangerousContainer from "./components/other/DumpNotDangerous";
import DumpPhosphogypsum from "./components/other/DumpPhosphogypsum";
import LoaderComponent from "./components/other/LoaderComponent";
import WasteContainer from "./components/other/WasteContainer";
import { WasteType } from "./utils/constants";
import { yearData } from "./utils/data";
import { formatDateAndTime } from "./utils/format";
import {
  getCoefficient,
  getDumpInertSum,
  getDumpSum,
  getSum,
  roundNumber
} from "./utils/functions";
import { useData } from "./utils/hooks";
import {
  buttonsTitles,
  dangerousLabels,
  descriptions,
  formLabels,
  inputLabels,
  notDangerousLabels
} from "./utils/texts";

export interface Waste {
  type: string;
  name: string;
  company: string;
  pollutionNumber: string;
  companyCode: string;
  companyName: string;
  year?: number;
  notDangerous?: {
    streamCode?: {
      id: string | number;
      RCoefficient: number;
      DCoefficient: number;
      type: string;
    };
    wasteCode?: {
      streamId: string | number;
      id: string | number;
      type: string;
    };
    quantity?: string;
    code?: string;
  }[];
  dangerous?: {
    streamCode?: {
      id: string | number;
      RCoefficient: number;
      DCoefficient: number;
      type: string;
    };
    wasteCode?: {
      streamId: string | number;
      id: string | number;
      type: string;
    };
    quantity?: string;
    code?: string;
  }[];
  dumpNotDangerous?: {
    quantity?: string;
    setAside?: string;
  }[];
  dumpDangerous?: {
    quantity?: string;
    setAside?: string;
  }[];
  dumpInert?: {
    quantity?: string;
    setAside?: string;
  }[];
  phosphogypsum?: {
    quantity?: string;
  }[];
}
Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf"
    },
    {
      src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf",
      fontWeight: 600
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf"
    }
  ]
});

const styles = StyleSheet.create({
  page: {
    fontFamily: "Roboto",
    padding: "0 12px"
  },
  table: {
    width: "100%",
    borderWidth: 2,
    display: "flex",
    flexDirection: "column"
  },
  tableRow: {
    display: "flex",
    flexDirection: "row"
  },
  nameRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "12px"
  },
  itemRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexDirection: "row"
  },
  cell: {
    borderWidth: 1,
    flex: "1",
    fontSize: "10px",
    padding: "4px"
  },
  totalCell: {
    fontSize: "10px",
    padding: "4px"
  },
  title: {
    fontSize: "10px",
    fontWeight: "bold",
    margin: "12px 0 4px 0px"
  },
  mainTitle: {
    fontSize: "14px",
    fontWeight: "bold",
    textAlign: "center"
  },
  date: {
    fontSize: "12px",
    fontWeight: "bold",
    textAlign: "center"
  },
  selectedDate: {
    fontSize: "12px",
    textAlign: "left"
  },
  label: {
    fontSize: "12px"
  },
  signature: {
    fontSize: "12px",
    marginRight: "100px"
  },
  name: {
    fontSize: "12px"
  }
});

const RenderWastePage = ({
  wastes,
  sum,
  labels,
  title,
  renderTitle,
  yearCof
}: any) => {
  return (
    <Page orientation="landscape" size="A4" style={styles.page}>
      {renderTitle && renderTitle}

      <Text style={styles.title}>{title}.</Text>
      <View style={styles.table}>
        <View style={[styles.tableRow]}>
          <Text style={styles.cell}> Eil nr.</Text>
          <Text style={styles.cell}>{labels.streamCode}</Text>
          <Text style={styles.cell}>{labels.wasteCode}</Text>
          <Text style={styles.cell}>{labels.yearCoeffCient}</Text>
          <Text style={styles.cell}>{labels.quantity}</Text>
          <Text style={styles.cell}>{labels.code}</Text>
          <Text style={styles.cell}>{labels.coefficient}</Text>
          <Text style={styles.cell}>{inputLabels.sum}</Text>
        </View>
        {wastes?.map((row, i) => {
          const coefficient = getCoefficient(row?.code, row?.streamCode);
          const sum = getSum(coefficient, row?.quantity, yearCof);
          return (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.cell}>{i + 1}</Text>
              <Text style={styles.cell}>{row?.streamCode?.id}</Text>
              <Text style={styles.cell}>{row?.wasteCode?.id}</Text>
              <Text style={styles.cell}>{yearCof}</Text>
              <Text style={styles.cell}>{row?.quantity}</Text>
              <Text style={styles.cell}>{row?.code}</Text>
              <Text style={styles.cell}>{coefficient}</Text>
              <Text style={styles.cell}>{sum}</Text>
            </View>
          );
        })}
        <View style={styles.tableRow}>
          <Text style={styles.totalCell}>Iš viso: {sum}</Text>
        </View>
      </View>
    </Page>
  );
};

const RenderInertWastePage = ({ wastes, sum, yearCof }) => {
  return (
    <Page orientation="landscape" size="A4" style={styles.page}>
      <Text style={styles.title}>{formLabels.tableDumpInert}.</Text>
      <View style={styles.table}>
        <View style={[styles.tableRow]}>
          <Text style={styles.cell}> Eil nr.</Text>
          <Text style={styles.cell}>{inputLabels.dumpInertQuantity}</Text>
          <Text style={styles.cell}>{inputLabels.yearCoeffCient}</Text>
          <Text style={styles.cell}>{inputLabels.setAside}</Text>
          <Text style={styles.cell}>{inputLabels.totalSum}</Text>
        </View>
        {wastes?.map((row, i) => {
          const sum = getDumpInertSum(yearCof, row?.quantity, row?.setAside);
          return (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.cell}>{i + 1}</Text>
              <Text style={styles.cell}>{row?.quantity}</Text>
              <Text style={styles.cell}>{yearCof}</Text>
              <Text style={styles.cell}>{row?.setAside}</Text>
              <Text style={styles.cell}>{sum}</Text>
            </View>
          );
        })}
        <View style={styles.tableRow}>
          <Text style={styles.totalCell}>Iš viso: {sum}</Text>
        </View>
      </View>
    </Page>
  );
};

const RenderDangerousWastePage = ({ wastes, sum, yearCof }) => {
  return (
    <Page orientation="landscape" size="A4" style={styles.page}>
      <Text style={styles.title}>{formLabels.tableDangerous}.</Text>
      <View style={styles.table}>
        <View style={[styles.tableRow]}>
          <Text style={styles.cell}> Eil nr.</Text>
          <Text style={styles.cell}>
            {inputLabels.expectedToBeRemovedDumpDangerousQuantity}
          </Text>
          <Text style={styles.cell}>
            {inputLabels.removedDumpDangerousQuantity}
          </Text>
          <Text style={styles.cell}>{inputLabels.nk1}</Text>
          <Text style={styles.cell}>{inputLabels.nk2}</Text>
          <Text style={styles.cell}>{inputLabels.setAside}</Text>
          <Text style={styles.cell}>{inputLabels.totalSum}</Text>
        </View>
        {wastes?.map((row, i) => {
          const sum = getDumpSum(yearCof, row?.quantity, row?.setAside);
          return (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.cell}>{i + 1}</Text>
              <Text style={styles.cell}>{row?.quantity.s1}</Text>
              <Text style={styles.cell}>{row?.quantity.s2}</Text>
              <Text style={styles.cell}>{yearCof.s1}</Text>
              <Text style={styles.cell}>{yearCof.s2}</Text>
              <Text style={styles.cell}>{row?.setAside}</Text>
              <Text style={styles.cell}>{sum}</Text>
            </View>
          );
        })}
        <View style={styles.tableRow}>
          <Text style={styles.totalCell}>Iš viso: {sum}</Text>
        </View>
      </View>
    </Page>
  );
};

const RenderPhosphogypsumWastePage = ({ wastes, sum, yearCof }) => {
  return (
    <Page orientation="landscape" size="A4" style={styles.page}>
      <Text style={styles.title}>{formLabels.tablePhosphosGypsum}.</Text>
      <View style={styles.table}>
        <View style={[styles.tableRow]}>
          <Text style={styles.cell}> Eil nr.</Text>
          <Text style={styles.cell}>
            {inputLabels.expectedToBeRemovedDumpPhosphogypsumQuantity}
          </Text>
          <Text style={styles.cell}>
            {inputLabels.removedDumpPhosphogypsumQuantity}
          </Text>
          <Text style={styles.cell}>{inputLabels.nf1}</Text>
          <Text style={styles.cell}>{inputLabels.nf2}</Text>
          <Text style={styles.cell}>{inputLabels.totalSum}</Text>
        </View>
        {wastes?.map((row, i) => {
          const sum = getDumpSum(yearCof, row?.quantity, 0);
          return (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.cell}>{i + 1}</Text>
              <Text style={styles.cell}>{row?.quantity.s1}</Text>
              <Text style={styles.cell}>{row?.quantity.s2}</Text>
              <Text style={styles.cell}>{yearCof.s1}</Text>
              <Text style={styles.cell}>{yearCof.s2}</Text>
              <Text style={styles.cell}>{sum}</Text>
            </View>
          );
        })}
        <View style={styles.tableRow}>
          <Text style={styles.totalCell}>Iš viso: {sum}</Text>
        </View>
      </View>
    </Page>
  );
};

const RenderNotDangerousWastePage = ({ wastes, sum, yearCof }) => {
  return (
    <Page orientation="landscape" size="A4" style={styles.page}>
      <Text style={styles.title}>{formLabels.tableDumpNotDangerous}.</Text>
      <View style={styles.table}>
        <View style={[styles.tableRow]}>
          <Text style={styles.cell}> Eil nr.</Text>
          <Text style={styles.cell}>
            {inputLabels.expectedToBeRemovedDumpNotDangerousQuantity}
          </Text>
          <Text style={styles.cell}>
            {inputLabels.removedDumpNotDangerousQuantity}
          </Text>
          <Text style={styles.cell}>{inputLabels.ns1}</Text>
          <Text style={styles.cell}>{inputLabels.ns2}</Text>
          <Text style={styles.cell}>{inputLabels.setAside}</Text>
          <Text style={styles.cell}>{inputLabels.totalSum}</Text>
        </View>
        {wastes?.map((row, i) => {
          const sum = getDumpSum(yearCof, row?.quantity, row?.setAside);
          return (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.cell}>{i + 1}</Text>
              <Text style={styles.cell}>{row?.quantity.s1}</Text>
              <Text style={styles.cell}>{row?.quantity.s2}</Text>
              <Text style={styles.cell}>{yearCof.s1}</Text>
              <Text style={styles.cell}>{yearCof.s2}</Text>
              <Text style={styles.cell}>{row?.setAside}</Text>
              <Text style={styles.cell}>{sum}</Text>
            </View>
          );
        })}
        <View style={styles.tableRow}>
          <Text style={styles.totalCell}>Iš viso: {sum}</Text>
        </View>
      </View>
    </Page>
  );
};

const DocumentPdf = ({ data }: { data: Waste }) => {
  const {
    notDangerousSum,
    notDangerousSumYearDataCof,
    dumpNotDangerousSumYearDataCof,
    dumpNotDangerousSum,
    dangerousSumYearDataCof,
    dangerousSum,
    dumpDangerousSumYearDataCof,
    dumpDangerousSum,
    dumpInertSumYearDataCof,
    dumpInertSum,
    totalSum,
    maxSum,
    dumpPhosphogypsumSumYearDataCof,
    dumpPhosphogypsumSum
  } = useData(data);

  return (
    <Document>
      <RenderWastePage
        renderTitle={
          <>
            <Text style={styles.mainTitle}>{formLabels.formMainTitle}</Text>
            <Text style={styles.date}>{formatDateAndTime(new Date())}</Text>
            <Text style={styles.selectedDate}>
              Pasirinkti skaičiavimai metams: {data.year}
            </Text>
          </>
        }
        yearCof={notDangerousSumYearDataCof}
        title={formLabels?.tableNotDangerous}
        wastes={data?.notDangerous}
        sum={notDangerousSum}
        labels={notDangerousLabels}
      />
      <RenderWastePage
        title={formLabels?.tableDangerous}
        yearCof={dangerousSumYearDataCof}
        wastes={data?.dangerous}
        sum={dangerousSum}
        labels={dangerousLabels}
      />
      <RenderNotDangerousWastePage
        wastes={data.dumpNotDangerous}
        sum={dumpNotDangerousSum}
        yearCof={dumpNotDangerousSumYearDataCof}
      />
      <RenderDangerousWastePage
        wastes={data.dumpDangerous}
        sum={dumpDangerousSum}
        yearCof={dumpDangerousSumYearDataCof}
      />
      <RenderInertWastePage
        wastes={data.dumpInert}
        sum={dumpInertSum}
        yearCof={dumpInertSumYearDataCof}
      />
      <RenderPhosphogypsumWastePage
        wastes={data.phosphogypsum}
        sum={dumpPhosphogypsumSum}
        yearCof={dumpPhosphogypsumSumYearDataCof}
      />
      <Page orientation="landscape" size="A4" style={styles.page}>
        <Text style={styles.title}>{formLabels.totalSum}</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow]}>
            <Text style={styles.cell}> Eil nr.</Text>
            <Text style={styles.cell}>{formLabels.notDangerous}</Text>
            <Text style={styles.cell}>{formLabels.dangerous}</Text>
            <Text style={styles.cell}>{formLabels.dumpNotDangerous}</Text>
            <Text style={styles.cell}>{formLabels.dumpDangerous}</Text>
            <Text style={styles.cell}>{formLabels.dumpInert}</Text>
            <Text style={styles.cell}>{formLabels.phosphosGypsum}</Text>
            <Text style={styles.cell}>{inputLabels.totalSum}</Text>
            <Text style={styles.cell}>{inputLabels.maxTotalSum}</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.cell}> 1</Text>
            <Text style={styles.cell}>{notDangerousSum}</Text>
            <Text style={styles.cell}>{dangerousSum}</Text>
            <Text style={styles.cell}>{dumpNotDangerousSum}</Text>
            <Text style={styles.cell}>{dumpDangerousSum}</Text>
            <Text style={styles.cell}>{dumpInertSum}</Text>
            <Text style={styles.cell}>{dumpPhosphogypsumSum}</Text>
            <Text style={styles.cell}>{totalSum}</Text>
            <Text style={styles.cell}>{roundNumber(maxSum)}</Text>
          </View>
        </View>
        <View style={styles.nameRow}>
          <View style={styles.itemRow}>
            <Text style={styles.label}>{inputLabels.companyName}:</Text>
            <Text style={styles.name}>{data?.companyName}</Text>
          </View>
        </View>
        <View style={styles.nameRow}>
          <View style={styles.itemRow}>
            <Text style={styles.label}>{inputLabels.companyCode}:</Text>
            <Text style={styles.name}>{data?.companyCode}</Text>
          </View>
        </View>
        <View style={styles.nameRow}>
          <View style={styles.itemRow}>
            <Text style={styles.label}>{inputLabels.company}:</Text>
            <Text style={styles.name}>{data?.company}</Text>
          </View>
        </View>
        <View style={styles.nameRow}>
          <View style={styles.itemRow}>
            <Text style={styles.label}>{inputLabels.pollutionNumber}:</Text>
            <Text style={styles.name}>{data?.pollutionNumber}</Text>
          </View>
        </View>

        <View style={styles.nameRow}>
          <View style={styles.itemRow}>
            <Text style={styles.label}>Vardas, pavardė:</Text>
            <Text style={styles.name}>{data?.name}</Text>
          </View>
          <View>
            <Text style={styles.signature}>Parašas:</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

const WasteForm = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Waste>(
    localStorage?.getItem("items")
      ? JSON.parse(localStorage?.getItem("items") as any)
      : {}
  );

  const handleSubmit = async (data) => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(data)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "duomenys.json";

    link.click();

    const doc = <DocumentPdf data={data} />;
    const asPdf = pdf();
    asPdf.updateContainer(doc);
    const blob = await asPdf.toBlob();
    saveAs(blob, "dokumentas.pdf");
  };

  const handleUpload = (e) => {
    const fileReader = new FileReader();
    setLoading(true);
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = (e: any) => {
      setData(JSON.parse(e.target.result));
      setLoading(false);
    };
  };

  const tabs = [
    {
      value: "stream",
      label: "Pagal srauto kodą"
    },
    {
      value: "waste",
      label: "Pagal atliekų kodą"
    }
  ];

  const emptyObject = {
    type: data.type || tabs[0].value,
    name: "",
    pollutionNumber: "",
    companyCode: "",
    companyName: "",
    TIPKNumber: "",
    company: "",
    year: undefined,
    notDangerous: [],
    dangerous: [],
    dumpNotDangerous: [],
    dumpDangerous: [],
    dumpInert: []
  };

  const wasteLabels = {
    notDangerous: notDangerousLabels,
    dangerous: dangerousLabels
  };

  const initialValues: Waste = {
    type: data.type || tabs[0].value,
    name: data?.name || "",
    companyCode: data?.companyCode || "",
    companyName: data?.companyName || "",
    pollutionNumber: data?.pollutionNumber || "",
    company: data?.company || "",
    year: data?.year || undefined,
    notDangerous: data?.notDangerous || [],
    dangerous: data?.dangerous || [],
    dumpNotDangerous: data?.dumpNotDangerous || [],
    dumpDangerous: data?.dumpDangerous || [],
    dumpInert: data?.dumpInert || []
  };
  if (loading) {
    return <LoaderComponent />;
  }

  const yearOptions = yearData.filter((item) =>
    isEqual(item.type, WasteType.DANGEROUS)
  );

  const Form = ({ values, setFieldValue, setValues }) => {
    localStorage.setItem("items", JSON.stringify(values));

    const {
      notDangerousSum,
      notDangerousSumYearDataCof,
      dumpNotDangerousSumYearDataCof,
      dumpNotDangerousSum,
      dangerousSumYearDataCof,
      dangerousSum,
      dumpDangerousSumYearDataCof,
      dumpDangerousSum,
      dumpInertSumYearDataCof,
      dumpInertSum,
      totalSum,
      maxSum,
      dumpPhosphogypsumSum,
      dumpPhosphogypsumSumYearDataCof
    } = useData(values);

    const handleSelectTab = (tab) => {
      if (isEqual(tab.value, values.type)) return;

      const previousFormData =
        localStorage.getItem("previous") || JSON.stringify(emptyObject);

      setValues(JSON.parse(previousFormData));
      setFieldValue("type", tab.value);
      localStorage.setItem("previous", JSON.stringify(values));
    };

    return (
      <StyledForm>
        <Title>{formLabels.mainTitle}</Title>
        <InnerContainer>
          <ButtonContainer>
            <StyledButton type="button">
              <StyledInput
                value={undefined}
                multiple={true}
                type="file"
                accept="application/JSON"
                onChange={handleUpload}
              />
              {buttonsTitles.upload}
            </StyledButton>
            <Button
              onClick={() => {
                setValues(emptyObject);
              }}
              type="button"
            >
              {buttonsTitles.clearAll}
            </Button>
          </ButtonContainer>
          <TabsContainer>
            {tabs.map((tab) => (
              <MenuButton
                key={tab.label}
                isSelected={isEqual(tab.value, values.type)}
                onClick={() => handleSelectTab(tab)}
              >
                {tab.label}
              </MenuButton>
            ))}
          </TabsContainer>
          <Description>{descriptions[values.type]}</Description>
          <ButtonContainer>
            <SelectField
              label={inputLabels.year}
              name="year"
              value={values.year}
              options={yearOptions}
              onChange={(option) => {
                setFieldValue(`year`, option?.year || option);
              }}
              getOptionLabel={(option) => option?.year || option}
            />
          </ButtonContainer>
          <SimpleContainer title={formLabels.infoAboutCompany}>
            <InputRow>
              <TextField
                label={inputLabels.companyName}
                value={values.companyName}
                onChange={(value) => {
                  setFieldValue(`companyName`, value);
                }}
              />
              <TextField
                label={inputLabels.companyCode}
                value={values.companyCode}
                onChange={(value) => {
                  setFieldValue(`companyCode`, value);
                }}
              />

              <TextField
                label={inputLabels.company}
                value={values.company}
                onChange={(value) => {
                  setFieldValue(`company`, value);
                }}
              />
              <TextField
                label={inputLabels.pollutionNumber}
                value={values.pollutionNumber}
                onChange={(value) => {
                  setFieldValue(`pollutionNumber`, value);
                }}
              />
            </InputRow>
          </SimpleContainer>
          {values.year && (
            <>
              <WasteContainer
                values={values.notDangerous}
                yearCoeffiCient={notDangerousSumYearDataCof}
                wasteType={"NOT_DANGEROUS"}
                formType={values.type}
                name={"notDangerous"}
                labels={wasteLabels.notDangerous}
                sum={notDangerousSum}
                title={formLabels.tableNotDangerous}
              />
              <WasteContainer
                values={values.dangerous}
                formType={values.type}
                yearCoeffiCient={dangerousSumYearDataCof}
                wasteType={"DANGEROUS"}
                labels={wasteLabels.dangerous}
                sum={dangerousSum}
                name={"dangerous"}
                title={formLabels.tableDangerous}
              />
              <DumpNotDangerousContainer
                values={values.dumpNotDangerous}
                yearCoeffCient={dumpNotDangerousSumYearDataCof}
                name={"dumpNotDangerous"}
                sum={dumpNotDangerousSum}
              />
              <DumpDangerousContainer
                values={values.dumpDangerous}
                yearCoeffCient={dumpDangerousSumYearDataCof}
                name={"dumpDangerous"}
                sum={dumpDangerousSum}
              />
              <DumpInertContainer
                values={values.dumpInert}
                yearCoeffCient={dumpInertSumYearDataCof}
                sum={dumpInertSum}
                name={"dumpInert"}
                title={formLabels.tableDumpInert}
                label={inputLabels.dumpInertQuantity}
              />

              <DumpPhosphogypsum
                values={values.phosphogypsum}
                name={"phosphogypsum"}
                sum={dumpPhosphogypsumSum}
                yearCoeffCient={dumpPhosphogypsumSumYearDataCof}
              />

              <SimpleContainer title={formLabels.totalSum}>
                <Row>
                  <NumericTextField
                    label={formLabels.notDangerous}
                    value={notDangerousSum}
                    onChange={() => {}}
                    disabled={true}
                  />
                  <NumericTextField
                    label={formLabels.dangerous}
                    value={dangerousSum}
                    onChange={() => {}}
                    disabled={true}
                  />
                  <NumericTextField
                    label={formLabels.dumpNotDangerous}
                    value={dumpNotDangerousSum}
                    onChange={() => {}}
                    disabled={true}
                  />
                  <NumericTextField
                    label={formLabels.dumpDangerous}
                    value={dumpDangerousSum}
                    onChange={() => {}}
                    disabled={true}
                  />
                  <NumericTextField
                    label={formLabels.dumpInert}
                    value={dumpInertSum}
                    onChange={() => {}}
                    disabled={true}
                  />

                  <NumericTextField
                    label={formLabels.phosphosGypsum}
                    value={dumpPhosphogypsumSum}
                    onChange={() => {}}
                    disabled={true}
                  />

                  <NumericTextField
                    label={inputLabels.totalSum}
                    value={totalSum}
                    onChange={() => {}}
                    disabled={true}
                  />

                  <NumericTextField
                    label={inputLabels.maxTotalSum}
                    value={maxSum?.toFixed(2)?.toString()}
                    onChange={() => {}}
                    disabled={true}
                  />
                </Row>
                <NameContainer>
                  <TextField
                    label={inputLabels.fullName}
                    value={values.name}
                    onChange={(value) => {
                      setFieldValue(`name`, value);
                    }}
                  />
                </NameContainer>
              </SimpleContainer>
            </>
          )}
        </InnerContainer>
        {values.year && (
          <ButtonContainer>
            <Button type="submit">{buttonsTitles.download}</Button>
          </ButtonContainer>
        )}
      </StyledForm>
    );
  };

  return (
    <DefaultLayout>
      <Formik
        enableReinitialize={false}
        initialValues={initialValues}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, setValues }) => (
          <Form
            values={values}
            setFieldValue={setFieldValue}
            setValues={setValues}
          />
        )}
      </Formik>
    </DefaultLayout>
  );
};

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  flex-basis: 1200px;
`;

const Row = styled.div`
  display: grid;
  gap: 12px;
  margin-top: 12px;
  grid-template-columns: repeat(1, 1fr);
`;

const Title = styled.h1`
  font-weight: bold;
  font-size: 3.2rem;
`;

const NameContainer = styled.p`
  display: flex;
  flex-direction: column;
  margin-top: 16px;
  max-width: 350px;
  gap: 12px;
`;

const StyledButton = styled(Button)`
  height: 40px;
  border-radius: 5px;
  background-color: #eeebe53d;
  position: relative;
  input {
    position: absolute;
    top: 0;
    right: 0;
    margin: 0;
    padding: 0;
    cursor: pointer;
    opacity: 0;
    height: 40px;
  }
`;
const StyledInput = styled.input``;

const ButtonContainer = styled.div`
  margin: 8px 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const InputRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 8px;
  margin: 8px 0;
`;

const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const MenuButton = styled.div<{ isSelected: boolean }>`
  color: ${({ theme, isSelected }) =>
    isSelected ? "white" : theme.colors.primary};
  font-size: 1.4rem;
  cursor: pointer;
  position: relative;
  padding: 0 0 4px 0;
  background-color: ${({ theme, isSelected }) =>
    isSelected ? theme.colors.secondary : "transparent"};
  padding: 8px 16px;
  border-radius: 24px;
  text-align: center;
  justify-content: center;
`;

const TabsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 24px;
`;

const Description = styled.p`
  margin-top: 6px;
  font-size: 1.3rem;
  color: #697586;
`;

export default WasteForm;
