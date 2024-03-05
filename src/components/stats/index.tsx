// StatsContainer.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Define your styled components for the layout
const StatsContainerDiv = styled.div`
  display: flex;
  flex-wrap: nowrap;
  gap: 0px;
  align-items: stretch;
  padding: 0px 20px 0px 20px;
`;

const StatPillDiv = styled.div`
  flex-basis: 50%;
  background-image: linear-gradient(to top, #000000, #191919);
  color: white;
  padding: 0px 0px 0px 0px;
  margin: 5px 20px 5px 20px;
  border-radius: 8px;
  text-align: center;
  
  @media (max-width: 1200px) {
    flex-basis: 49%;
    gap: 10px;
    margin: 10px;
  }

  @media (max-width: 768px) {
    flex-basis: 49%;
    gap: 10px;
    margin: 10px;
  }
`;

const StatTitle = styled.p`
  margin-bottom: 0px;
  margin-top: 0px;
  font-size: 1.8em;
  color: rgba(128, 128, 128, 0.8);
  font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;

  @media (max-width: 1200px) {
    font-size: 1.8em;
  }

  @media (max-width: 768px) {
    font-size: 1.2em;
  }
`;

const StatValue = styled.span`
  font-size: 2.5em;
  font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;

  @media (max-width: 1200px) {
    font-size: 1.8em;
  }

  @media (max-width: 768px) {
    font-size: 1.2em;
  }
`;

const StatImage = styled.img`
  margin-left: 5px;
  height: 32px;
  
  @media (max-width: 1200px) {
    height: 23px;
  }

  @media (max-width: 768px) {
    height: 15px;
  }
`;

// Define an interface for the state to hold the stats
interface Stats {
  listed: number;
  daySales: number;
  dayVolume: string;
  floorPrice: string;
  totalVolume: string;
  floorPriceImage: string;
  totalVolumeImage: string;
  daySalesImage: string;
  dayVolumeImage: string;
}

// Props interface if you need to pass any props to the StatsContainer
interface StatsContainerProps {
  data: any;
}

function formatNumber(num: number): string {
    return Math.ceil(num).toLocaleString();
}

// Component
const StatsContainer: React.FC<StatsContainerProps> = ({ data }) => {
    // State to store the owners count
    const [ownersCount, setOwnersCount] = useState<number>(0);

    const stats = {
        owners: data?.owners || 0,
        listed: data?.auction_count || 0, // Assuming 'listed' is part of your data structure
        daySales: data?.num_sales_24hr || 0,
        dayVolume: formatNumber(data?.volume_24hr || 0) + ' SEI',
        floor: `${data?.floor || 0} SEI`,
        volume: formatNumber(data?.volume || 0) + ' SEI',
        floorPriceImage: data?.floorPriceImage || 'https://storage.googleapis.com/cryptomonos/monos/sei_logo.png',
        totalVolumeImage: data?.totalVolumeImage || 'https://storage.googleapis.com/cryptomonos/monos/sei_logo.png',
        daySalesImage: data?.daySalesImage || 'https://storage.googleapis.com/cryptomonos/monos/sei_logo.png',
        dayVolumeImage: data?.dayVolumeImage || 'https://storage.googleapis.com/cryptomonos/monos/sei_logo.png',
    };

    return (
        <>
            <StatsContainerDiv>
                <StatPillDiv>
                    <StatTitle>Owners</StatTitle>
                    <StatValue>{stats.owners}</StatValue>
                </StatPillDiv>
                <StatPillDiv>
                    <StatTitle>Listed</StatTitle>
                    <StatValue>{stats.listed}</StatValue>
                </StatPillDiv>
            </StatsContainerDiv>
            <StatsContainerDiv>
                <StatPillDiv>
                    <StatTitle>24HR Sales</StatTitle>
                    <span><StatValue>{stats.daySales}</StatValue></span>
                    <StatImage src={stats.daySalesImage} alt="SEI Logo"/>
                </StatPillDiv>
                <StatPillDiv>
                    <StatTitle>24HR Volume</StatTitle>
                    <span><StatValue>{stats.dayVolume}</StatValue></span>
                    <StatImage src={stats.dayVolumeImage} alt="SEI Logo"/>
                </StatPillDiv>
            </StatsContainerDiv>
            <StatsContainerDiv>
                <StatPillDiv>
                    <StatTitle>Floor Price</StatTitle>
                    <span><StatValue>{stats.floor}</StatValue></span>
                    <StatImage src={stats.floorPriceImage} alt="SEI Logo"/>
                </StatPillDiv>
                <StatPillDiv>
                    <StatTitle>Total Volume</StatTitle>
                    <span><StatValue>{stats.volume}</StatValue></span>
                    <StatImage src={stats.totalVolumeImage} alt="SEI Logo"/>
                </StatPillDiv>
            </StatsContainerDiv>
        </>
    );
};

export default StatsContainer;