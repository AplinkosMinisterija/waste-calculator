import { FieldArray, Formik } from "formik";
import { isEmpty } from "lodash";
import { useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { getDumpSum } from "../../utils/functions";
import { bottomLabels, buttonsTitles, inputLabels } from "../../utils/texts";
import { validateDump } from "../../utils/validation";
import Button from "../buttons/Button";
import SimpleButton from "../buttons/SimpleButton";
import SimpleContainer from "../containers/SimpleContainer";
import NumericTextField from "../fields/NumericTextField";
import TextField from "../fields/TextField";
import Icon from "./Icons";
import Popup from "./Popup";

const DumpWasteContainer = ({
  values,
  name,
  title,
  label,
  sum,
  yearCoeffCient
}) => {
  const [showModal, setShowModal] = useState(false);
  const [current, setCurrent] = useState<any>({});
  const arrayHelperRef = useRef<any>(null);

  const data = useMemo(() => {
    return values?.map((value, index) => {
      const sum = getDumpSum(yearCoeffCient, value?.quantity, value?.delay);

      return (
        <TableRow>
          <Cell>{index + 1}</Cell>
          <Cell>{value?.quantity}</Cell>
          <Cell>{yearCoeffCient}</Cell>
          <Cell>{value?.delay}</Cell>
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
  }, [yearCoeffCient, arrayHelperRef, values]);

  return (
    <SimpleContainer title={title}>
      <FieldArray
        name={`${name}`}
        render={(arrayHelpers) => {
          arrayHelperRef.current = arrayHelpers;

          const handleSubmit = (values) => {
            const params = { ...values, delay: values.delay || "0" };
            if (!isEmpty(current)) {
              arrayHelpers.replace(current?.index, params);
            } else {
              arrayHelpers.push(params);
            }

            setCurrent({});
            setShowModal(false);
          };

          return (
            <div>
              <Table>
                <TableRow>
                  <Cell>Eil nr.</Cell>
                  <Cell>{inputLabels.quantity}</Cell>
                  <Cell>{inputLabels.yearCoeffCient}</Cell>
                  <Cell>{inputLabels.delay}</Cell>
                  <Cell>{inputLabels.totalSum}</Cell>
                  <Cell></Cell>
                </TableRow>
                {data}
                <TableRow>
                  <Cell>Iš viso: {sum}</Cell>
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
                  enableReinitialize={true}
                  validateOnChange={false}
                  validationSchema={validateDump}
                  initialValues={current}
                  onSubmit={handleSubmit}
                >
                  {({ values, errors, setFieldValue, handleSubmit }) => {
                    const sum = getDumpSum(
                      yearCoeffCient,
                      values?.quantity,
                      values?.delay
                    );

                    return (
                      <InnerContainer>
                        <NumericTextField
                          label={label}
                          name="quantity"
                          value={values.quantity}
                          error={errors?.quantity}
                          onChange={(quantity) =>
                            setFieldValue(`quantity`, quantity)
                          }
                        />

                        <StyledTextField
                          label={inputLabels.yearCoeffCient}
                          value={yearCoeffCient || ""}
                          disabled={true}
                          bottomLabel={bottomLabels.yearCoeffiCient}
                          onChange={() => {}}
                        />
                        <NumericTextField
                          label={inputLabels.delay}
                          name="delay"
                          error={errors?.delay}
                          value={values.delay}
                          onChange={(delay) => setFieldValue(`delay`, delay)}
                        />

                        <StyledTextField
                          label={inputLabels.totalSum}
                          disabled={true}
                          bottomLabel={bottomLabels.totalSum}
                          value={sum}
                        />
                        <Button onClick={() => handleSubmit()} type="button">
                          Pridėti
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

const InnerContainer = styled.div`
  display: flex;
  gap: 12px;
  flex-direction: column;
`;
const StyledTextField = styled(TextField)`
  flex: 1;
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
const StyledEditIcon = styled(Icon)`
  font-size: 1.8rem;
  color: #697586;
  cursor: pointer;
`;

const Cell = styled.div`
  border: 1px solid black;
  border-collapse: collapse;
  flex: 1;
  font-size: 1.5rem;
  padding: 4px;
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
export default DumpWasteContainer;
