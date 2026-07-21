import { Document, Font, Page, pdf, Text, View } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { Formik } from 'formik';
import { isEqual } from 'lodash';
import { useState } from 'react';

import Button from './components/buttons/Button';
import SimpleContainer from './components/containers/SimpleContainer';
import NumericTextField from './components/fields/NumericTextField';
import SelectField from './components/fields/SelectField';
import TextField from './components/fields/TextField';
import DefaultLayout from './components/layouts/DefaultLayout';
import DumpDangerousContainer from './components/other/DumpDangerous';
import DumpInertContainer from './components/other/DumpInertContainer';
import DumpNotDangerousContainer from './components/other/DumpNotDangerous';
import DumpPhosphogypsum from './components/other/DumpPhosphogypsum';
import LoaderComponent from './components/other/LoaderComponent';
import WasteContainer from './components/other/WasteContainer';
import { WasteType } from './utils/constants';
import { buildYearOptions } from './utils/yearOptions';
import { removeDeactivatedDangerousRows } from './utils/itemFilters';
import { formatDateAndTime } from './utils/format';

import {
  getCoefficient,
  getDumpInertSum,
  getDumpSum,
  getSum,
  getWasteStreamCode,
  roundNumber,
} from './utils/functions';
import { useData } from './utils/hooks';
import { getTs06CodesLabel } from './utils/TS-06-codes';
import {
  buttonsTitles,
  dangerousLabels,
  descriptions,
  formLabels,
  inputLabels,
  notDangerousLabels,
} from './utils/texts';
import {
  ButtonContainer,
  Description,
  InnerContainer,
  InputRow,
  MenuButton,
  NameContainer,
  Row,
  StyledButton,
  StyledForm,
  StyledInput,
  styles,
  TabsContainer,
  Title,
  YearFieldContainer,
} from './app.styles';
import { WasteI } from './types/wastei';

Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf',
    },
    {
      src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf',
      fontWeight: 600,
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
    },
  ],
});

const RenderWastePage = ({
  wastes,
  sum,
  labels,
  title,
  renderTitle,
  yearCof,
  includeDeactivatedCodes,
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
              <Text style={styles.cell}>
                {getTs06CodesLabel(getWasteStreamCode(row), includeDeactivatedCodes)}
              </Text>
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
              <Text style={styles.cell}>{i + 1}--</Text>
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
      <Text style={styles.title}>{formLabels.tableDumpDangerous}.</Text>
      <View style={styles.table}>
        <View style={[styles.tableRow]}>
          <Text style={styles.cell}> Eil nr.</Text>
          <Text style={styles.cell}>{inputLabels.expectedToBeRemovedDumpDangerousQuantity}</Text>
          <Text style={styles.cell}>{inputLabels.removedDumpDangerousQuantity}</Text>
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
          <Text style={styles.cell}>{inputLabels.removedDumpPhosphogypsumQuantity}</Text>
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
          <Text style={styles.cell}>{inputLabels.expectedToBeRemovedDumpNotDangerousQuantity}</Text>
          <Text style={styles.cell}>{inputLabels.removedDumpNotDangerousQuantity}</Text>
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

const DocumentPdf = ({ data }: { data: WasteI }) => {
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
    dumpPhosphogypsumSum,
  } = useData(data);

  return (
    <Document>
      <RenderWastePage
        renderTitle={
          <>
            <Text style={styles.mainTitle}>{formLabels.formMainTitle}</Text>
            <Text style={styles.date}>{formatDateAndTime(new Date())}</Text>
            <Text style={styles.selectedDate}>
              Pasirinkti skaičiavimai metams: {data.yearLabel || data.year}
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
        includeDeactivatedCodes={data?.includeDeactivatedCodes}
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
  const [data, setData] = useState<WasteI>(
    localStorage?.getItem('items') ? JSON.parse(localStorage?.getItem('items') as any) : {},
  );

  const handleDownloadJson = (data: WasteI) => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data))}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = 'duomenys.json';
    link.click();
  };

  const handleDownloadPdf = async (data: WasteI) => {
    const doc = <DocumentPdf data={data} />;
    const asPdf = pdf();

    asPdf.updateContainer(doc);
    const blob = await asPdf.toBlob();
    saveAs(blob, 'dokumentas.pdf');
  };

  const handleUpload = (e) => {
    const fileReader = new FileReader();
    setLoading(true);
    fileReader.readAsText(e.target.files[0], 'UTF-8');
    fileReader.onload = (e: any) => {
      setData(JSON.parse(e.target.result));
      setLoading(false);
    };
  };

  const tabs = [
    {
      value: 'stream',
      label: 'Pagal srauto kodą',
    },
    {
      value: 'waste',
      label: 'Pagal atliekų kodą',
    },
  ];

  const emptyObject = {
    type: data.type || tabs[0].value,
    name: '',
    pollutionNumber: '',
    companyCode: '',
    companyName: '',
    TIPKNumber: '',
    company: '',
    year: undefined,
    yearLabel: undefined,
    includeDeactivatedCodes: false,
    notDangerous: [],
    dangerous: [],
    dumpNotDangerous: [],
    dumpDangerous: [],
    dumpInert: [],
  };

  const wasteLabels = {
    notDangerous: notDangerousLabels,
    dangerous: dangerousLabels,
  };

  const initialValues: WasteI = {
    type: data.type || tabs[0].value,
    name: data?.name || '',
    companyCode: data?.companyCode || '',
    companyName: data?.companyName || '',
    pollutionNumber: data?.pollutionNumber || '',
    company: data?.company || '',
    year: data?.year || undefined,
    yearLabel: data?.yearLabel || undefined,
    includeDeactivatedCodes: data?.includeDeactivatedCodes || false,
    notDangerous: data?.notDangerous || [],
    dangerous: data?.dangerous || [],
    dumpNotDangerous: data?.dumpNotDangerous || [],
    dumpDangerous: data?.dumpDangerous || [],
    dumpInert: data?.dumpInert || [],
  };
  if (loading) {
    return <LoaderComponent />;
  }

  const yearOptions = buildYearOptions();

  const Form = ({ values, setFieldValue, setValues }) => {
    localStorage.setItem('items', JSON.stringify(values));

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
      dumpPhosphogypsumSumYearDataCof,
    } = useData(values);

    const handleSelectTab = (tab) => {
      if (isEqual(tab.value, values.type)) return;

      const previousFormData = localStorage.getItem('previous') || JSON.stringify(emptyObject);

      setValues(JSON.parse(previousFormData));
      setFieldValue('type', tab.value);
      localStorage.setItem('previous', JSON.stringify(values));
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
          <YearFieldContainer>
            <SelectField
              label={inputLabels.year}
              name="year"
              value={yearOptions.find((option) => option.label === values.yearLabel) || null}
              options={yearOptions}
              onChange={(option) => {
                const includeDeactivated = option?.includeDeactivated ?? false;
                setFieldValue(`year`, option?.year);
                setFieldValue(`yearLabel`, option?.label);
                setFieldValue(`includeDeactivatedCodes`, includeDeactivated);
                setFieldValue(
                  `dangerous`,
                  removeDeactivatedDangerousRows(values.dangerous, includeDeactivated),
                );
              }}
              getOptionLabel={(option) => option?.label}
            />
          </YearFieldContainer>
          <SimpleContainer>
            <div>
              Tvarkos aprašas* - Atliekas naudojančių ar šalinančių įmonių prievolių įvykdymo
              užtikrinimo sumos vienai tonai numatomų naudoti ar šalinti pavojingųjų ar
              nepavojingųjų atliekų dydžio nustatymo ir prievolių įvykdymo užtikrinimo sumos
              apskaičiavimo, atsižvelgiant į numatomų naudoti ar šalinti pavojingųjų ar
              nepavojingųjų atliekų rūšis, kiekį ir tvarkymo būdus, tvarkos aprašas:{' '}
              <a
                rel="noreferrer"
                target="_blank"
                href="https://www.e-tar.lt/portal/lt/legalAct/c24a1a301df611edb4cae1b158f98ea5/asr"
              >
                https://www.e-tar.lt/portal/lt/legalAct/c24a1a301df611edb4cae1b158f98ea5/asr
              </a>
            </div>
          </SimpleContainer>
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
                wasteType={WasteType.NOT_DANGEROUS}
                formType={values.type}
                name={'notDangerous'}
                labels={wasteLabels.notDangerous}
                sum={notDangerousSum}
                includeDeactivatedCodes={values.includeDeactivatedCodes}
                title={formLabels.tableNotDangerous}
              />
              <WasteContainer
                values={values.dangerous}
                formType={values.type}
                yearCoeffiCient={dangerousSumYearDataCof}
                wasteType={WasteType.DANGEROUS}
                labels={wasteLabels.dangerous}
                sum={dangerousSum}
                name={'dangerous'}
                includeDeactivatedCodes={values.includeDeactivatedCodes}
                title={formLabels.tableDangerous}
              />
              <DumpNotDangerousContainer
                values={values.dumpNotDangerous}
                yearCoeffCient={dumpNotDangerousSumYearDataCof}
                name={'dumpNotDangerous'}
                sum={dumpNotDangerousSum}
              />
              <DumpDangerousContainer
                values={values.dumpDangerous}
                yearCoeffCient={dumpDangerousSumYearDataCof}
                name={'dumpDangerous'}
                sum={dumpDangerousSum}
              />
              <DumpInertContainer
                values={values.dumpInert}
                yearCoeffCient={dumpInertSumYearDataCof}
                sum={dumpInertSum}
                name={'dumpInert'}
                title={formLabels.tableDumpInert}
                label={inputLabels.dumpInertQuantity}
              />

              <DumpPhosphogypsum
                values={values.phosphogypsum}
                name={'phosphogypsum'}
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
            <Button type="button" onClick={() => handleDownloadPdf(values)}>
              {buttonsTitles.downloadPdf}
            </Button>
            <Button type="button" onClick={() => handleDownloadJson(values)}>
              {buttonsTitles.downloadJson}
            </Button>
          </ButtonContainer>
        )}
      </StyledForm>
    );
  };

  return (
    <DefaultLayout>
      <Formik enableReinitialize={false} initialValues={initialValues} onSubmit={() => {}}>
        {({ values, setFieldValue, setValues }) => (
          <Form values={values} setFieldValue={setFieldValue} setValues={setValues} />
        )}
      </Formik>
    </DefaultLayout>
  );
};

export default WasteForm;
