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

  @media (max-width: 1200px) {
    flex-wrap: wrap; 
  }

  @media (max-width: 768px) {
    flex-wrap: wrap; 
  }
`;

export const ChartWrapperFull = styled.div`
  flex: 1; /* Allows charts to grow and fill the space */
  max-width: 100%; /* Sets a maximum width for each chart */
  padding-bottom: 25px;
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
    padding: 0 20px;
    height:100%;
    width:100%;
    position:relative;
    z-index:1;
    @media (max-width: 768px) {
        padding: 0 10px;
    }
`

export const Header = styled.div`
    padding-top:20px;
    display:flex;
    justify-content:space-between;
    align-items:center;

    @media (max-width: 768px) {
        flex-direction:column;
        padding-top:24px;
        &>*:nth-child(2){
            margin:8px 0;
        }
    }
`

export const Logo = styled.img`
    width:250px;
`

export const WalletConnect = styled.button`
    background-color:${color.primary};
    color:${color.black};
    padding:0px 24px;
    height:43px;
    display:flex;
    align-items:center;
    border-radius:8px;
    font-size:14px;
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
    background-color:${color.primary};
    padding:8px 16px;
    border-radius:8px;
    font-size:14px;
    display:flex;
    align-items:center;
`

export const WBalance = styled.div`
    padding:8px 16px;
    background-color:${color.secondaryLight};
    border-radius:8px;
    margin-right:16px;
`

export const WAddress = styled.div`
    color:${color.black};
`

export const Launch = styled.div<{showMintedNfts?:string}>`
    margin-top:16px;
    min-height:769px;
    background: linear-gradient(180deg, #15232D 0%, #0A141B 100%);
    box-shadow: 0px 11.8109px 53.1492px rgba(0, 0, 0, 0.35);
    border-radius: 16px;
    padding:70px 56px;
    display:flex;
    position:relative;
    &::before {
        pointer-events: none;
        content: "";
        position: absolute;
        inset: 0;
        border-radius: 16px; 
        padding: 1px; 
        background:linear-gradient(137deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0)); 
        -webkit-mask: 
        linear-gradient(#fff 0 0) content-box, 
        linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
                mask-composite: exclude; 
    }
    overflow:hidden;

    ${props => props.showMintedNfts === 'true' && `
        padding-top:16px;
    `}

    @media (max-width: 768px) {
        flex-direction:column-reverse;
        padding:24px;

        ${props => props.showMintedNfts === 'true' && `
        flex-direction:column;
        `}
    }
`

export const LaunchBg = styled.div`
    background-image:url('/images/mintbg.png');
    background-position: 100% 0%;
    background-repeat: no-repeat;
    background-size: 50%;
    position:absolute;
    top:0;
    right:0;
    z-index:0;
    width:100%;
    height:100%;
    pointer-events:none;
`

export const Mid = styled.div`
    flex:.33;
`

export const Loading = styled.div`
    display:flex;
    justify-content:center;
    align-items:center;
    width:100%;
    font-size:28px;
    color:${color.whiteShade};
` 

export const Title = styled.div`
    font-size:32px;
    font-weight:500;

    @media (max-width: 768px) {
        display:none;
    }
`

export const TitleMobile = styled.div`
    display:none;

    @media (max-width: 768px) {
        display:block;
        font-size:32px;
        font-weight:500;
        margin-bottom:16px;
    }
`

export const Links = styled.div`
    display:flex;
    gap: 1.2rem;
    margin-top: 25px;
`

export const Link = styled.a`
    color:${color.primary};
    font-size: 25px;
    &:hover{
        opacity: 80%;
    }
`

export const Image = styled.div`
    width:100%;

    img {
        width:100%;
        border-radius:16px;
    }
`

export const Nft = styled.div`
    display:flex;
    align-items:center;
    border-radius:8px;
    border:1px solid ${color.primary};
    padding:16px;
    background-color:${color.secondaryLight};
`

export const NftImage = styled.img`
    width:90px;
    height:90px;
    border-radius:8px;
`

export const NftTitle = styled.div`
    margin-left:16px;
`