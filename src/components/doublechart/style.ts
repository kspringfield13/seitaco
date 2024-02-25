import styled from 'styled-components';

export const ChartsContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: stretch;
  background-color: #000000;
  padding: 0px;
  padding-top: 20px !important;
  font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  
  @media (max-width: 1200px) {
    padding: 0px;
  }

  @media (max-width: 768px) {
    padding: 0px;
  }
`;

export const ChartWrapper = styled.div`
  max-height: 2000px;
  max-width: 100%;
  margin: auto;
  padding: 10px;
  height: 400px;
  flex: 1;
  background-color: #121212;
  border-radius: 8px;
  font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  // Further media queries can be added for smaller devices
`;