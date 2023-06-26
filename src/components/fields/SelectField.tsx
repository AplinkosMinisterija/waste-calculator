import styled from "styled-components";
import { inputLabels } from "../../utils/texts";
import Icon from "../other/Icons";
import FieldWrapper from "./components/FieldWrapper";
import OptionsContainer from "./components/OptionsContainer";
import TextFieldInput from "./components/TextFieldInput";
import { useSelectData } from "./utils/hooks";

export interface SelectFieldProps {
  id?: string;
  name?: string;
  label?: string;
  value?: any;
  placeholder?: string;
  error?: any;
  showError?: boolean;
  options?: any[];
  left?: JSX.Element;
  padding?: string;
  onChange: (option: any) => void;
  disabled?: boolean;
  getOptionLabel: (option: any) => string;
  className?: string;
  bottomLabel?: string;
}

const SelectField = ({
  label,
  value,
  name,
  error,
  showError = true,
  options,
  className,
  left,
  padding,
  placeholder = inputLabels.chooseOption,
  getOptionLabel,
  onChange,
  bottomLabel,
  disabled
}: SelectFieldProps) => {
  const {
    suggestions,
    input,
    handleToggleSelect,
    showSelect,
    handleBlur,
    handleClick,
    handleOnChange
  } = useSelectData({ options, disabled, onChange, getOptionLabel });

  return (
    <FieldWrapper
      onClick={handleToggleSelect}
      handleBlur={handleBlur}
      padding={padding}
      className={className}
      label={label}
      error={error}
      showError={showError}
      bottomLabel={bottomLabel}
    >
      <TextFieldInput
        value={input}
        name={name}
        error={error}
        leftIcon={left}
        rightIcon={
          <>
            {value && !disabled && (
              <IconContainer
                onClick={() => !disabled && handleClick(undefined)}
              >
                <ClearIcon disabled={disabled!} name="close" />
              </IconContainer>
            )}
            <StyledIcon name={"dropdownArrow"} />
          </>
        }
        onChange={handleOnChange}
        disabled={disabled}
        placeholder={(value && getOptionLabel(value)) || placeholder}
        selectedValue={value}
      />
      <OptionsContainer
        values={suggestions}
        getOptionLabel={getOptionLabel}
        showSelect={showSelect}
        handleClick={handleClick}
      />
    </FieldWrapper>
  );
};

const ClearIcon = styled(Icon)<{ disabled: boolean }>`
  color: #cdd5df;
  font-size: 2.4rem;
  margin-right: 12px;

  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledIcon = styled(Icon)`
  color: #cdd5df;
  font-size: 2.4rem;
  margin-right: 12px;
`;

export default SelectField;
