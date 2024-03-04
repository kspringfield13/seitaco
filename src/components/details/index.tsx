// CollectionDetails.tsx
import React from 'react';
import styled from 'styled-components';
import { CollectionDetailsType } from '../../utils/helpers'; // Import the type

// Import icon images
import websiteIcon from './icons/websiteIcon.png'; // Replace with actual path to icon
import twitterIcon from './icons/twitterIcon.png'; // Replace with actual path to icon
import discordIcon from './icons/discordIcon.png'; // Replace with actual path to icon

interface CollectionDetailsProps {
    logoSrc: string;
    collectionName: string;
    supply: string;
    website?: string;
    twitter?: string;
    discord?: string;
    backgroundImageSrc: string;
    mintDate: string;
    mintPrice: string;
    address: string;
  }  

  const CollectionDetails: React.FC<CollectionDetailsProps> = ({
    logoSrc,
    collectionName,
    supply,
    website,
    twitter,
    discord,
    backgroundImageSrc,
    mintDate,
    mintPrice,
    address,
  }) => {
    const resolvedLogoSrc = logoSrc.startsWith('http') ? logoSrc : `${process.env.PUBLIC_URL}${logoSrc}`;
    const logoLink = `https://beta.mrkt.exchange/collection/${address}`;

    return (
        <DetailsWrapper backgroundImageSrc={backgroundImageSrc}>
            <TopBar>
                <a href={logoLink} target="_blank" rel="noopener noreferrer">
                    <Logo src={resolvedLogoSrc} alt={`${collectionName} logo`} />
                </a>
                <InfoContainer>
                    <InfoRow>
                        <Name>{collectionName}</Name>
                    </InfoRow>
                    <InfoRow>
                        <SocialLinks>
                        <SupplyInfo>{supply}</SupplyInfo>
                            {website && (
                                <a href={website} target="_blank" rel="noopener noreferrer">
                                    <Icon src={websiteIcon} alt="Website" />
                                </a>
                            )}
                            {twitter && (
                                <a href={twitter} target="_blank" rel="noopener noreferrer">
                                    <Icon src={twitterIcon} alt="Twitter" />
                                </a>
                            )}
                            {discord && (
                                <a href={discord} target="_blank" rel="noopener noreferrer">
                                    <Icon src={discordIcon} alt="Discord" />
                                </a>
                            )}
                        </SocialLinks>
                    </InfoRow>
                    <AddressInfo href={`https://www.seiscan.app/pacific-1/accounts/${address}`} target="_blank" rel="noopener noreferrer">
                        {shortenAddress(address)}
                    </AddressInfo>
                </InfoContainer>
            </TopBar>
            <InfoRow>
            <AdditionalInfo>Mint Price: {mintPrice}</AdditionalInfo>
            <AdditionalInfo>Mint Date: {mintDate}</AdditionalInfo>
            </InfoRow>
        </DetailsWrapper>
    );
};

const shortenAddress = (address: string) => {
    return `${address.slice(0, 3)}...${address.slice(-5)}`;
};

const DetailsWrapper = styled.div<{ backgroundImageSrc: string }>`
  position: relative; // This enables the absolute positioning of the ::before pseudo-element
  background-color: #fff;
  background-image: url(${props => props.backgroundImageSrc.startsWith('http') ? props.backgroundImageSrc : process.env.PUBLIC_URL + props.backgroundImageSrc});
  border-radius: 20px;
  padding: 10px;
  margin: 15px;
  padding-top: 5px;
  background-size: cover;
  background-position: center;
  overflow: hidden; // This keeps the ::before pseudo-element within the border-radius

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.75); // This is the semi-transparent overlay. Adjust the rgba alpha value as needed for opacity
    z-index: 1; // Ensure it's above the background image but below the content
  }

  // Ensure all children that need to be "clickable" are above the ::before overlay
  > * {
    position: relative;
    z-index: 2;
  }
`;

const TopBar = styled.div`
display: flex;
align-items: center;
justify-content: start;
padding-left: 10px;
`;

const Logo = styled.img`
width: 120px; // Smaller logo for the thin bar
height: auto;
margin-right: 20px;
margin-left: 0px;
margin-bottom: -5px;
border-radius: 20px;
padding-top: 0px;
`;

const InfoContainer = styled.div`
display: flex;
padding-left: 10px;
flex-direction: column;
font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
`;

const InfoRow = styled.div`
display: flex;
justify-content: space-between;
align-items: center;
padding-top: 5px;
font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
`;

const Name = styled.h2`
font-size: 1.8em; // Smaller font size for the top bar
margin: 0px;
margin-bottom: -5px;
font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
`;

const AdditionalInfo = styled.span`
// Styles for additional info like mint date and price
padding-left: 10px;
padding-right: 10px;
font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
`;

const SocialLinks = styled.div`
display: flex;
padding-top: 5px;
`;

const Icon = styled.img`
width: 45px;
height: 45px;
margin-right: 15px;

@media (max-width: 768px) {
    width: 30px;
    height: 30px;
  }
`;

const AddressInfo = styled.a`
  display: block; // Make it a block to allow for margin and padding
  font-size: 1.2em; // Smaller font size
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  padding-top: 7px;
  padding-left: 5px;
  margin: 0;
  color: #fff; // Set the text color
  text-decoration: none; // Remove underline from links
  &:hover {
    text-decoration: underline; // Underline on hover
  }

  @media (max-width: 768px) {
    padding-left: 0px;
  }
`;

const SupplyInfo = styled.p`
font-size: 1.9em;
font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
padding-top: 0px;
padding-left: 0px;
padding-right: 15px;
padding-bottom: 0px;
margin: 0px;
margin-top: -3px;

@media (max-width: 768px) {
    font-size: 1.4em;
}
`;

export default CollectionDetails;