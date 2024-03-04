// Leaderboard.tsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const LeaderboardContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const CollectionRow = styled.div`
  display: grid;
  grid-template-columns: 40px 85px auto; // Space for rank, logo, and the rest of the content
  grid-template-rows: auto auto; // Two rows for content
  grid-template-areas:
    "rank logo name name name name value"
    "rank logo stats stats stats stats stats";
  align-items: center;
  gap: 10px;
  padding: 10px;
  padding-left: 10px;
  margin-bottom: 10px;
  border-radius: 10px;
  background-color: #191919;
  cursor: pointer;

  &:hover {
    background-color: #064133;
  }

  @media (max-width: 768px) {
    // Adjust for mobile view
    font-size: 14px;
    grid-template-columns: 20px 80px auto;
    grid-template-areas:
      "rank logo name value"
      "rank logo stats stats";
  }
`;

const Rank = styled.div`
  grid-area: rank;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  color: #FFF;
  padding: 7px;
  background-color: black;
  border-radius: 20%;
  // Other styles as needed

  @media (max-width: 768px) {
    // Adjust for mobile view
    font-size: 18px;
    padding: 2px;
  }
`;

const LogoImage = styled.img`
  grid-area: logo;
  width: 75px; // Adjust width as needed
  height: 75px; // Adjust height as needed
  border-radius: 20%;
  margin-left: 5px;
`;

const Name = styled.div`
  grid-area: name;
  font-size: 20px; // Adjust font size as needed
  font-weight: bold;
  color: #FFF;
  padding-left: 3px;

  @media (max-width: 768px) {
    // Adjust for mobile view
    font-size: 16px;
    padding: 2px;
  }
`;

const Value = styled.div`
  grid-area: value;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px; // Adjust font size as needed
  color: #FFF;
  // Other styles as needed
`;

const Stats = styled.div`
  grid-area: stats;
  display: flex;
  justify-content: space-between; // Align stats to the start of the area
  gap: 10px; // Space between stats elements
  align-items: center;
  font-size: 18px; // Adjust font size as needed
  color: #FFF;
  @media (max-width: 768px) {
    // Adjust for mobile view
    font-size: 14px;
  }
`;

const FloorPriceImage = styled.img`
  width: 12px;  // Adjust the width as needed
  height: 12px; // Adjust the height as needed
  margin-left: 6px;
`;

const Stat = styled.div`
  // Add your styles for individual stats here
  text-align: left;
  color: white;
  background-color: black;
  padding: 5px;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 20px;
  // any other styles you want to apply to each stat
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, auto); // Three columns for your stats
  justify-content: end; // Align the stats to the end (right side)
  align-items: center;
  gap: 10px; // Adjust the gap to control the spacing between stats
`;

const StaticText = styled.span`
  font-size: 0.9em; // Smaller than the number
  color: #888; // Lighter color for the static text
  margin-left: 5px; // Add a little space between the number and the static text
`;

const DataValue = styled.span`
  font-weight: bold;
  font-size: 1.0em;
  color: #FFF; // Assuming white color for the numbers
`;

interface LeaderboardData {
  slug: string;
  rank: number;
  logoSrc: string;
  name: string;
  listed: number;
  daySales: number;
  dayVolume: number;
  floorPrice: number; // assuming this remains a string
  previousFloorPrice: number; // changed to number
  last_updated: string;
}

interface LeaderboardProps {
  onSelectCollection: (slug: string) => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ onSelectCollection }) => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData[]>([]);

  // Cache structure
  let cache = {
    data: null as LeaderboardData[] | null,
    timestamp: 0, // Epoch time in milliseconds
  };

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      const serverUrl = `https://seitaco-server-1d85377b001f.herokuapp.com/get-leaderboard`;

      // Check if cache is valid (less than 2 minutes old)
      const now = new Date().getTime();
      if (cache.data && now - cache.timestamp < 120000) { // 120000 milliseconds = 2 minutes
        setLeaderboardData(cache.data);
        return; // Use cached data
      }

      try {
        const response = await fetch(serverUrl);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: LeaderboardData[] = await response.json();
        setLeaderboardData(data);

        // Update cache
        cache = {
          data,
          timestamp: new Date().getTime(), // Update timestamp with current time
        };
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
      }
    };

    fetchLeaderboardData();
  }, []);

  const renderFloorPriceWithChange = (floorPrice: number, previousFloorPrice: number) => {
    // If previousFloorPrice is 0.0, do not render the component
    if (previousFloorPrice === 0.0) {
      return (
        <Stat>
          <DataValue>{floorPrice} SEI</DataValue>
          <StaticText>Floor</StaticText>
        </Stat>
      );
    }
  
    // Check if there's no change in floor price
    if (floorPrice === previousFloorPrice) {
      return (
        <Stat>
          <DataValue>{floorPrice} SEI</DataValue>
          <StaticText>Floor</StaticText>
        </Stat>
      );
    }
  
    const percentageChange = ((floorPrice - previousFloorPrice) / previousFloorPrice) * 100;
    const changeDirection = percentageChange >= 0 ? '▲' : '▼';
    const changeColor = percentageChange >= 0 ? 'green' : 'red';
  
    return (
      <Stat>
        <span style={{ color: changeColor }}>{changeDirection} {Math.abs(percentageChange).toFixed(2)}%</span>
        <DataValue> {floorPrice} SEI</DataValue>
        <StaticText>Floor</StaticText>
      </Stat>
    );
  };

  return (
    <LeaderboardContainer>
    {leaderboardData.map((data, index) => (
      <CollectionRow key={index} onClick={() => onSelectCollection(data.slug)}>
        <Rank>{data.rank}</Rank>
        <LogoImage src={data.logoSrc} alt={`${data.name} logo`} />
        <Name>{data.name}</Name>
        <StatsContainer>
        <Stat>
          <DataValue>{data.daySales}</DataValue>
          <StaticText>Sales</StaticText>
        </Stat>
        <Stat>
          <DataValue>{data.dayVolume}</DataValue>
          <StaticText>Volume</StaticText>
        </Stat>
        </StatsContainer>
        <Stats>
        {renderFloorPriceWithChange(data.floorPrice, data.previousFloorPrice)}
          <Stat>
            <DataValue>{data.listed}</DataValue>
            <StaticText>Listed</StaticText>
          </Stat>
        </Stats>
      </CollectionRow>
    ))}
  </LeaderboardContainer>
  );
};

export default Leaderboard;