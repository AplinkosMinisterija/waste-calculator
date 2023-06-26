import { isEmpty } from "lodash";
import styled from "styled-components";
import LoaderComponent from "../../other/LoaderComponent";

export interface SelectOption {
  id?: string;
  label?: string;
  [key: string]: any;
}

export interface OptionsContainerProps {
  values?: any[];
  disabled?: boolean;
  getOptionLabel: (option: any) => string;
  handleScroll?: (option: any) => any;
  loading?: boolean;
  showSelect: boolean;
  handleClick: (option: any) => any;
}

const OptionsContainer = ({
  values = [],
  disabled = false,
  getOptionLabel,
  handleClick,
  handleScroll,
  showSelect,
  loading
}: OptionsContainerProps) => {
  if (!showSelect || disabled || isEmpty(values)) {
    return <></>;
  }

  return (
    <OptionContainer
      onClick={(e) => e.stopPropagation()}
      className="optionContainer"
      onScroll={handleScroll}
    >
      {values.map((option, index) => {
        return (
          <Option
            key={index}
            onClick={() => {
              handleClick(option);
            }}
          >
            {getOptionLabel && getOptionLabel(option)}
          </Option>
        );
      })}
      {loading && <LoaderComponent />}
    </OptionContainer>
  );
};

const OptionContainer = styled.div`
  position: absolute;
  z-index: 9;
  width: 100%;
  padding: 10px 0px;
  display: block;
  max-height: 200px;
  overflow-y: auto;
  overflow-x: hidden;
  border: none;
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: 0px 2px 16px #121a5529;

  > * {
    &:first-child {
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
    }
  }
  > * {
    &:last-child {
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
    }
  }
`;

const Option = styled.div`
  cursor: pointer;
  padding: 0 12px;
  font-size: 1.6rem;
  line-height: 36px;
  &:hover {
    background: #f3f3f7 0% 0% no-repeat padding-box;
  }
`;

export default OptionsContainer;
