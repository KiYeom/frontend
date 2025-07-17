import React from 'react';
import { Container, SectionTitle } from './AnalysisBlock.style';
type AnalysisBlockProps = {
  title: string;
  children: React.ReactNode;
};

const AnaylsisBlock: React.FC<AnalysisBlockProps> = (props) => {
  const { title, children } = props;

  return (
    <Container>
      <SectionTitle>{title}</SectionTitle>
      {children}
    </Container>
  );
};
export default AnaylsisBlock;
