// Leaderboard.tsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const LeaderboardContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const CollectionRow = styled.div`
  display: grid;
  grid-template-columns: 35px 85px auto; // Space for rank, logo, and the rest of the content
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
    grid-template-columns: 25px 75px auto;
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
`;

const LogoImage = styled.img`
  grid-area: logo;
  width: 75px; // Adjust width as needed
  height: 75px; // Adjust height as needed
  border-radius: 20%;
  // Other styles as needed
`;

const Name = styled.div`
  grid-area: name;
  font-size: 20px; // Adjust font size as needed
  font-weight: bold;
  color: #FFF;
  padding-left: 3px;
  // Other styles as needed
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
  floorPrice: string;
}

interface LeaderboardProps {
  onSelectCollection: (slug: string) => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ onSelectCollection }) => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData[]>([]);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      const cacheKey = 'leaderboardData';
      const cached = localStorage.getItem(cacheKey);
      const now = new Date();

      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const cachedTime = new Date(timestamp);
        const differenceInMinutes = (now.getTime() - cachedTime.getTime()) / (1000 * 60);

        if (differenceInMinutes < 3) {
          // Use cached data if it's less than 3 minutes old
          setLeaderboardData(data);
          return;
        }
        // If cached data is older than 3 minutes, fetch new data
      }

      const serverUrl = `https://seitaco-server-1d85377b001f.herokuapp.com/get-leaderboard`;
      try {
        const response = await fetch(serverUrl);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: LeaderboardData[] = await response.json();
        setLeaderboardData(data);
        localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: now }));
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
      }
    };

    fetchLeaderboardData();
  }, []);

  return (
    <LeaderboardContainer>
    {leaderboardData.map((data) => (
      <CollectionRow key={data.slug} onClick={() => onSelectCollection(data.slug)}>
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
          <Stat>
              <DataValue>{data.floorPrice} SEI</DataValue>
              <FloorPriceImage src="https://storage.googleapis.com/cryptomonos/monos/sei_logo.png" alt="sei" />
              <StaticText>Floor</StaticText>
          </Stat>
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