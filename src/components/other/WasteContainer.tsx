import { FieldArray, Formik } from "formik";
import { isEmpty, isEqual } from "lodash";
import { useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { stream, waste } from "../../utils/data";
import { getCoefficient, getSum } from "../../utils/functions";
import { bottomLabels, buttonsTitles } from "../../utils/texts";
import { validateWaste } from "../../utils/validation";
import Button from "../buttons/Button";
import SimpleButton from "../buttons/SimpleButton";
import SimpleContainer from "../containers/SimpleContainer";
import NumericTextField from "../fields/NumericTextField";
import SelectField from "../fields/SelectField";
import TextField from "../fields/TextField";
import Icon from "./Icons";
import Popup from "./Popup";

const WasteContainer = ({
  values,
  labels,
  type,
  name,
  title,
  sum,
  yearCoeffiCient
}) => {
  const isWasteFormType = values?.type === "waste";
  const [showModal, setShowModal] = useState(false);
  const [current, setCurrent] = useState<any>({});
  const arrayHelperRef = useRef<any>(null);

  const data = useMemo(() => {
    return values?.map((value, index) => {
      const coefficient = getCoefficient(value?.code, value?.streamCode);
      const sum = getSum(coefficient, value?.quantity, yearCoeffiCient);

      return (
        <TableRow>
          <Cell>{index + 1}</Cell>
          <Cell>{value?.streamCode?.id}</Cell>
          <Cell>{value?.wasteCode?.id}</Cell>
          <Cell>{yearCoeffiCient}</Cell>
          <Cell>{value?.quantity}</Cell>
          <Cell>{value?.code}</Cell>
          <Cell>{coefficient}</Cell>
          <Cell>{sum}</Cell>
          <Cell>
            <IconsContainer>
              <IconContainer
                onClick={() => {
                  setCurrent({ index, ...value });
                  setShowModal(true);
                }}
              >
                <StyledEditIcon name="edit" />
              </IconContainer>
              <IconContainer
                onClick={() => {
                  arrayHelperRef?.current &&
                    arrayHelperRef?.current?.remove(values);
                }}
              >
                <StyledDeleteIcon name="deleteItem" />
              </IconContainer>
            </IconsContainer>
          </Cell>
        </TableRow>
      );
    });
  }, [yearCoeffiCient, arrayHelperRef, values]);

  return (
    <SimpleContainer title={title}>
      <FieldArray
        name={`${name}`}
        render={(arrayHelpers) => {
          arrayHelperRef.current = arrayHelpers;

          const handleSubmit = (values) => {
            if (!isEmpty(current)) {
              arrayHelpers.replace(current?.index, values);
            } else {
              arrayHelpers.push(values);
            }

            setCurrent({});
            setShowModal(false);
          };

          return (
            <div>
              <Table>
                <TableRow>
                  <Cell>{buttonsTitles.row}</Cell>
                  <Cell>{labels.streamCode}</Cell>
                  <Cell>{labels.wasteCode}</Cell>
                  <Cell>{labels.yearCoeffCient}</Cell>
                  <Cell>{labels.quantity}</Cell>
                  <Cell>{labels.code}</Cell>
                  <Cell>{labels.coefficient}</Cell>
                  <Cell>{labels.totalSum}</Cell>
                  <Cell></Cell>
                </TableRow>
                {data}
                <TableRow>
                  <Cell>
                    {buttonsTitles.total}
                    {sum}
                  </Cell>
                </TableRow>
              </Table>
              <SimpleButton
                onClick={() => {
                  setCurrent({});
                  setShowModal(true);
                }}
              >
                {buttonsTitles.addNew}
              </SimpleButton>

              <Popup
                onClose={() => {
                  setCurrent({});
                  setShowModal(false);
                }}
                visible={showModal}
              >
                <Formik
                  validateOnChange={false}
                  enableReinitialize={true}
                  validationSchema={validateWaste}
                  initialValues={current}
                  onSubmit={handleSubmit}
                >
                  {({ values, errors, setFieldValue, handleSubmit }) => {
                    const streams = stream.filter((item) =>
                      isEqual(item.type, type)
                    );

                    const coefficient = getCoefficient(
                      values?.code,
                      values?.streamCode
                    );

                    const sum = getSum(
                      coefficient,
                      values?.quantity,
                      yearCoeffiCient
                    );

                    const wastes = waste.filter((item) =>
                      isEqual(item.type, type)
                    );

                    const handleSetWasteCode = (wasteCode) => {
                      setFieldValue(`wasteCode`, wasteCode);

                      if (!wasteCode)
                        return setFieldValue(`streamCode`, undefined);

                      const stream = streams.find(
                        (item) =>
                          item.type === type && item.id === wasteCode.streamId
                      );

                      setFieldValue(`streamCode`, stream);
                    };

                    return (
                      <InnerContainer>
                        <StyledSelectField
                          label={labels.streamCode}
                          value={values.streamCode}
                          error={errors?.streamCode}
                          options={streams}
                          getOptionLabel={(option) => option.id}
                          disabled={isWasteFormType}
                          name="streamCode"
                          onChange={(streamCode) => {
                            setFieldValue(`streamCode`, streamCode);
                            setFieldValue(`wasteCode`, undefined);
                          }}
                        />
                        <StyledSelectField
                          label={labels.wasteCode}
                          name="wasteCode"
                          disabled={!isWasteFormType}
                          value={values.wasteCode}
                          error={errors?.wasteCode}
                          options={wastes || []}
                          getOptionLabel={(option) => option.id}
                          bottomLabel={
                            !isWasteFormType ? bottomLabels.disabled : ""
                          }
                          onChange={handleSetWasteCode}
                        />
                        <StyledTextField
                          label={labels.yearCoeffCient}
                          value={yearCoeffiCient || ""}
                          disabled={true}
                          onChange={() => {}}
                          bottomLabel={bottomLabels.yearCoeffiCient}
                        />
                        <NumericTextField
                          label={labels.quantity}
                          name="quantity"
                          value={values.quantity}
                          error={errors?.quantity}
                          onChange={(quantity) =>
                            setFieldValue(`quantity`, quantity)
                          }
                        />
                        <StyledSelectField
                          label={labels.code}
                          name="code"
                          value={values.code}
                          options={["R", "D", "S"]}
                          error={errors?.code}
                          bottomLabel={bottomLabels.code}
                          onChange={(code) => setFieldValue(`code`, code)}
                          getOptionLabel={(option) => option}
                        />
                        <StyledTextField
                          label={labels.coefficient}
                          name="coefficient"
                          disabled={true}
                          value={coefficient}
                          bottomLabel={bottomLabels.coeffiCient}
                        />
                        <StyledTextField
                          disabled={true}
                          bottomLabel={bottomLabels.totalSum}
                          label={labels.totalSum}
                          value={sum}
                        />
                        <Button onClick={() => handleSubmit()} type="button">
                          {buttonsTitles.add}
                        </Button>
                      </InnerContainer>
                    );
                  }}
                </Formik>
              </Popup>
            </div>
          );
        }}
      />
    </SimpleContainer>
  );
};

const StyledTextField = styled(TextField)`
  flex: 1;
`;

const StyledSelectField = styled(SelectField)`
  flex: 1;
`;

const InnerContainer = styled.div`
  display: flex;
  gap: 12px;
  flex-direction: column;
`;

const Table = styled.div`
  width: 100%;
  border-width: 2px;
  display: flex;
  flex-direction: column;
`;

const TableRow = styled.div`
  display: flex;
  flex-direction: row;
`;

const Cell = styled.div`
  border: 1px solid black;
  border-collapse: collapse;
  flex: 1;
  font-size: 1.5rem;
  padding: 4px;
`;

const StyledEditIcon = styled(Icon)`
  font-size: 1.8rem;
  color: #697586;
  cursor: pointer;
`;

const StyledDeleteIcon = styled(Icon)`
  cursor: pointer;
  font-size: 1.8rem;
  color: ${({ theme }) => theme.colors.danger};
`;
const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const IconsContainer = styled.div`
  display: flex;
  align-items: center;
  align-items: center;
  justify-content: center;
  gap: 20px;
`;

export default WasteContainer;
