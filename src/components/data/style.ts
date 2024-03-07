import styled from 'styled-components';

export const ChartsContainer = styled.div`
  display: flex;
  flex-wrap: nowrap; /* Ensures flex items don't wrap */
  justify-content: space-between; /* Puts space between the flex items */
  align-items: stretch; /* Stretches items to fill the container height */
  padding-right: 15px; /* Padding around the container */
  gap: 20px;
  padding-left: 15px;

  @media (max-width: 1200px) {
    flex-wrap: wrap;
    padding: 5px;
    gap: 10px;
  }

  @media (max-width: 768px) {
    flex-wrap: wrap;
    padding: 5px;
    gap: 10px;
  }
`;

export const ChartWrapper = styled.div`
  flex: 1; /* Allows charts to grow and fill the space */
  max-height: 2000px;
  height: 400px;
  max-width: calc(50% - 10px); /* Sets a maximum width for each chart */
  padding: 20px;
  padding-top: 1px !important;
  margin-top: 15px;
  background-color: #121212;
  border-radius: 8px; /* If your charts have rounded corners */
  font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;

  @media (max-width: 1200px) {
    max-height: 400px;
    max-width: 100%;
  }

  @media (max-width: 768px) {
    max-height: 400px;
    max-width: 100%;
  }
`;

export const ChartsContainerFull = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: stretch;
  background-color: #000000;
  padding: 15px;
  padding-top: 20px !important;
  padding-bottom: 20px !important;
  font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  
  @media (max-width: 1200px) {
    padding: 5px;
  }

  @media (max-width: 768px) {
    padding: 5px;
  }
`;

export const ChartWrapperFull = styled.div`
  max-height: 2000px;
  max-width: 100%;
  margin: auto;
  padding: 20px;
  padding-top: 1px !important;
  height: 400px;
  flex: 1;
  background-color: #121212;
  border-radius: 8px;
  font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  // Further media queries can be added for smaller devices
`;