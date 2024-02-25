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
  background-color: #121212;
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
  // Define any props here
}

function formatNumber(num: number): string {
    return Math.ceil(num).toLocaleString();
}

// Component
const StatsContainer: React.FC = () => {
    // State to store the owners count
    const [ownersCount, setOwnersCount] = useState<number>(0);

    const [stats, setStats] = useState<Stats>({
        listed: 0,
        daySales: 0,
        dayVolume: '0',
        floorPrice: '0 SEI',
        totalVolume: '0 SEI',
        floorPriceImage: 'https://storage.googleapis.com/cryptomonos/monos/sei_logo.png',
        totalVolumeImage: 'https://storage.googleapis.com/cryptomonos/monos/sei_logo.png',
        daySalesImage: 'https://storage.googleapis.com/cryptomonos/monos/sei_logo.png',
        dayVolumeImage: 'https://storage.googleapis.com/cryptomonos/monos/sei_logo.png',
        });

    useEffect(() => {
        const apiKey = 'AIzaSyBOfUsNid2OYs-ChLUw3lNG15GXiKnY59I';
        const spreadsheetId = '1o1jIzmka7PPL_08NBP5x9_7jgUpdJrwXL3_sDflS0ic';
        const range = 'Sheet1!A:N';
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;
    
        fetch(url)
            .then(response => response.json())
            .then(data => {
            // Assuming the last row contains the latest stats
            const latestRow = data.values[data.values.length - 1];
            
            // Parse the data and update the state
            setStats(prevStats => ({
                ...prevStats,
                listed: latestRow[7], // Replace with the correct index
                daySales: latestRow[10], // Replace with the correct index
                dayVolume: formatNumber(parseFloat(latestRow[11])),  // Replace with the correct index
                floorPrice: latestRow[8] + ' SEI', // Replace with the correct index and add ' SEI'
                totalVolume: formatNumber(parseFloat(latestRow[9])) + ' SEI', // Replace with the correct index and add ' SEI'
            }));
            })
            .catch(error => {
            console.error('Error:', error);
            });
    
        }, []);

    useEffect(() => {
        // Define your API key and spreadsheet details
        const apiKey = 'AIzaSyBOfUsNid2OYs-ChLUw3lNG15GXiKnY59I';
        const spreadsheetId = '1x28vxBRTeP9h-STSsjQlJSzk-qpzADiPtHoQPoL82_c';
        const range = 'Sheet1!B:B';

        // Construct the API URL
        const ownersUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;

        // Fetch the data from Google Sheets API
        fetch(ownersUrl)
        .then(response => {
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.values) {
            // Assuming each row in the specified range contains an owner
            const uniqueOwners = new Set(data.values.map((row: string[]) => row[0]));
            const uniqueOwnersCount = uniqueOwners.size;
            setOwnersCount(uniqueOwnersCount); // Update the state with the owners count
            }
        })
        .catch(error => {
            console.error('Error fetching owners count:', error);
        });
    }, []); // Empty dependency array means this effect runs once on mount

    return (
        <>
            <StatsContainerDiv>
                <StatPillDiv>
                    <StatTitle>Owners</StatTitle>
                    <StatValue>{ownersCount}</StatValue>
                </StatPillDiv>
                <StatPillDiv>
                    <StatTitle>Listed</StatTitle>
                    <StatValue>{stats.listed}</StatValue>
                </StatPillDiv>
            </StatsContainerDiv>
            <StatsContainerDiv>
                <StatPillDiv>
                    <StatTitle>24HR Sales</StatTitle>
                    <StatValue>{stats.daySales}</StatValue>
                </StatPillDiv>
                <StatPillDiv>
                    <StatTitle>24HR Volume</StatTitle>
                    <StatValue>{stats.dayVolume}</StatValue>
                </StatPillDiv>
            </StatsContainerDiv>
            <StatsContainerDiv>
                <StatPillDiv>
                    <StatTitle>Floor Price</StatTitle>
                    <span><StatValue>{stats.floorPrice}</StatValue></span>
                    <StatImage src={stats.floorPriceImage} alt="SEI Logo"/>
                </StatPillDiv>
                <StatPillDiv>
                    <StatTitle>Total Volume</StatTitle>
                    <span><StatValue>{stats.totalVolume}</StatValue></span>
                    <StatImage src={stats.totalVolumeImage} alt="SEI Logo"/>
                </StatPillDiv>
            </StatsContainerDiv>
        </>
    );
};

export default StatsContainer;