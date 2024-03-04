import styled from "styled-components"
import { color } from "styles/theme"
import { Hex2Rgba } from "utils/helpers"

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
  }

  @media (max-width: 768px) {
    flex-wrap: wrap; 
  }
`;

export const ChartWrapper = styled.div`
  flex: 1; /* Allows charts to grow and fill the space */
  max-width: calc(50% - 10px); /* Sets a maximum width for each chart */
  padding-top: 15px;
  border-radius: 8px; /* If your charts have rounded corners */

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
  gap: 20px;
`;

export const ChartWrapperFull = styled.div`
  flex: 1; /* Allows charts to grow and fill the space */
  max-width: 100%; /* Sets a maximum width for each chart */
  padding-bottom: 20px;
  border-radius: 8px; /* If your charts have rounded corners */

  @media (max-width: 1200px) {
    max-height: 400px;
    max-width: 100%;
    padding-top: 15px;
  }

  @media (max-width: 768px) {
    max-height: 400px;
    max-width: 100%;
    padding-top: 15px;
  }
`;

export const Overlay = styled.div`   
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed; // Use fixed to position relative to the viewport
  top: 0;
  left: 0;
  width: 100vw; // Full width
  height: 100vh; // Full height
  background-color: rgba(0, 0, 0, 0.5); // Semi-transparent background
  z-index: 1000; // High index to ensure it's above other content
`;

// Define TokenStatus styled component
export const TokenStatus = styled.div`
  margin-top: 20px; // Adjust styling as needed
  color: #FFFFFF; // Example color, adjust based on your theme
  font-size: 18px; // Adjust font size as needed
  text-align: center; // Center align text
  // Add more styling as per your design requirements
`;

export const AccessDenied = styled.div`
  padding: 20px;
  color: #000; // Adjust color as needed
  background-color: #ff0000; // Green for granted, adjust as needed
  border-radius: 5px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
  z-index: 1001; // Ensure the message is above the overlay background
`;

export const AccessGranted = styled.div`
  padding: 20px;
  color: #000; // Adjust color as needed
  background-color: #00ff00; // Green for granted, adjust as needed
  border-radius: 5px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
  z-index: 1001; // Ensure the message is above the overlay background
`;

export const Home = styled.div`
    background-color: ${color.bg};
    min-height:100vh;
    height:100%;
    margin-top: -30px;
`

export const Bg = styled.div`
    position:absolute;
    top:0;
    left:0;
    z-index:0;
    width:0%;
    height:0%;
    display:flex;
    justify-content:center;
    align-items:flex-start;
    overflow:hidden;
    }
`

export const Container = styled.div`
    max-width: 100%;
    margin: 0 auto;
    padding-right: 10px;
    padding-left: 10px;
    height:100%;
    width:100%;
    position:relative;
    z-index:1;
    @media (max-width: 768px) {
        padding: 0 10px;
    }
`

export const Header = styled.div`
    padding-top:35px;
    display:flex;
    justify-content:space-between;
    align-items:center;

    @media (max-width: 768px) {
        padding-top:35px;
        padding-bottom: 5px;
        &>*:nth-child(2){
            margin:8px 0;
        }
    }
`

export const Logo = styled.img`
    width: 150px;
    margin-bottom: -10px;
    margin-top: -15px;
    padding-left: 4px;

    @media (max-width: 768px) {
        width: 100px;
        margin-bottom: 0px;
        margin-top: -15px;
        padding-left: 0px;
        padding-top: 7px;
    }
`

export const WalletConnect = styled.button`
    font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    background-color:${color.primary};
    color:${color.black};
    padding:0px 24px;
    height:43px;
    display:flex;
    align-items:center;
    border-radius:8px;
    font-size:18px;
    font-weight:500;
    cursor:pointer;
    transition:all .1s ease-in-out;
    &:hover{
        background-color:${Hex2Rgba(color.primary, .8)};
    }
    outline:none;
    border:none;
    &:active{
        outline:none;
        border:none;
        background-color:${Hex2Rgba(color.primary, .5)};
    }
`

export const WalletConnected = styled.div`
    font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    background-color:${color.primary};
    padding:8px 16px;
    border-radius:8px;
    font-size:14px;
    display:flex;
    align-items:center;
`

export const WBalance = styled.div`
    font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; 
    padding:8px 16px;
    background-color:${color.secondaryLight};
    border-radius:8px;
    margin-right:16px;
`

export const WAddress = styled.div`
    font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    color:${color.black};
`