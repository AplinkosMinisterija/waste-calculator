import { StyleSheet } from '@react-pdf/renderer';
import { Form } from 'formik';
import styled from 'styled-components';
import Button from './components/buttons/Button';

export const styles = StyleSheet.create({
  page: {
    fontFamily: 'Roboto',
    padding: '0 12px',
  },
  table: {
    width: '100%',
    borderWidth: 2,
    display: 'flex',
    flexDirection: 'column',
  },
  tableRow: {
    display: 'flex',
    flexDirection: 'row',
  },
  nameRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '12px',
  },
  itemRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexDirection: 'row',
  },
  cell: {
    borderWidth: 1,
    flex: '1',
    fontSize: '10px',
    padding: '4px',
  },
  totalCell: {
    fontSize: '10px',
    padding: '4px',
  },
  title: {
    fontSize: '10px',
    fontWeight: 'bold',
    margin: '12px 0 4px 0px',
  },
  mainTitle: {
    fontSize: '14px',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  date: {
    fontSize: '12px',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  selectedDate: {
    fontSize: '12px',
    textAlign: 'left',
  },
  label: {
    fontSize: '12px',
  },
  signature: {
    fontSize: '12px',
    marginRight: '100px',
  },
  name: {
    fontSize: '12px',
  },
});

export const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  flex-basis: 1200px;
`;

export const Row = styled.div`
  display: grid;
  gap: 12px;
  margin-top: 12px;
  grid-template-columns: repeat(1, 1fr);
`;

export const Title = styled.h1`
  font-weight: bold;
  font-size: 3.2rem;
`;

export const NameContainer = styled.p`
  display: flex;
  flex-direction: column;
  margin-top: 16px;
  max-width: 350px;
  gap: 12px;
`;

export const StyledButton = styled(Button)`
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
export const StyledInput = styled.input``;

export const ButtonContainer = styled.div`
  margin: 8px 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const YearFieldContainer = styled(ButtonContainer)`
  & > * {
    min-width: 210px;
    width: fit-content;
  }
  input {
    field-sizing: content;
    min-width: 4ch;
  }
`;

export const InputRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 8px;
  margin: 8px 0;
`;

export const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const MenuButton = styled.div<{ isSelected: boolean }>`
  color: ${({ theme, isSelected }) => (isSelected ? 'white' : theme.colors.primary)};
  font-size: 1.4rem;
  cursor: pointer;
  position: relative;
  padding: 0 0 4px 0;
  background-color: ${({ theme, isSelected }) =>
    isSelected ? theme.colors.secondary : 'transparent'};
  padding: 8px 16px;
  border-radius: 24px;
  text-align: center;
  justify-content: center;
`;

export const TabsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 24px;
`;

export const Description = styled.p`
  margin-top: 6px;
  font-size: 1.3rem;
  color: #697586;
`;
