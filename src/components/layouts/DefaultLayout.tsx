import styled from "styled-components";
import { device } from "../../styles";
import { ChildrenType } from "../../types";

export interface DefaultLayoutProps {
  children?: ChildrenType;
}

const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  return (
    <Container>
      <Content>{children}</Content>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  background-color: white;
  flex-direction: column;
  overflow-y: auto;
  @media ${device.mobileL} {
    overflow-y: auto;
  }
`;

const Content = styled.div`
  display: flex;
  padding: 20px;
  max-width: 1200px;
  margin: auto;

  @media ${device.mobileL} {
    padding: 20px 16px;
  }
`;

export default DefaultLayout;
