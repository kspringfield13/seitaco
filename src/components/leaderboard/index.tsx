// Leaderboard.tsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { collectionMapping, CollectionDetailsType } from '../../utils/helpers';

const LeaderboardContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const HeaderRow = styled.div`
  display: grid;
  grid-template-columns: 4.2fr 1.30fr repeat(2, 0.78fr);
  padding: 5px;
  padding-left: 10px;
  padding-right: 10px;
  gap: 10px;
  margin-bottom: 10px;
  background-color: #f0f0f0; // Light gray background for the header
  color: #333; // Dark text color for contrast
  font-weight: bold; // Make header text bold
  border-radius: 5px;

  > :last-child {
    justify-self: end;
  }

  @media (max-width: 1200px) {
    font-size: 12px;
    grid-template-columns: 4.2fr 1.15fr repeat(2, 0.80fr);
  }

  @media (max-width: 768px) {
    & > *:not(:nth-child(1)) {
      display: none;
    }
    padding-left: 10px;
`;

const CollectionRow = styled.div`
  display: grid;
  grid-template-columns: 28px 40px 2fr repeat(3, 1fr);
  align-items: center;
  gap: 10px;
  padding: 5px;
  margin-bottom: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #064133;
  }

  @media (max-width: 768px) {
    grid-template-columns: 28px 40px 1fr repeat(1, 1fr); // Keep only name and floorPrice for mobile view

    & > *:not(:nth-child(1)):not(:nth-child(3)):not(:nth-child(2)):not(:last-child) {
      display: none; // Hide elements except for name and floorPrice
  }
`;

const LogoImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 50%;
`;

const Stat = styled.div`
  text-align: right;
`;

interface LeaderboardData {
  slug: string;
  rank: number;
  logoSrc: string;
  name: string;
  listed: number;
  daySales: number;
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
      const cachedData = localStorage.getItem(cacheKey);
      if (cachedData) {
        setLeaderboardData(JSON.parse(cachedData));
      } else {
        const serverUrl = `https://seitaco-server-1d85377b001f.herokuapp.com/get-leaderboard`;
        const response = await fetch(serverUrl);
        const data = await response.json();
        localStorage.setItem(cacheKey, JSON.stringify(data));
        setLeaderboardData(data);
      }
    };

    fetchLeaderboardData();
  }, []);

  return (
    <LeaderboardContainer>
      <HeaderRow>
        <div style={{ justifyContent: 'start' }}>Collection Rank</div> {/* Adjust text alignment as needed */}
        <div>Listed</div>
        <div>24HR Sales</div>
        <div>Floor</div>
      </HeaderRow>
      {leaderboardData.map((data) => (
        <CollectionRow key={data.slug} onClick={() => onSelectCollection(data.slug)}>
          <Stat>{data.rank}</Stat>
          <LogoImage src={data.logoSrc} alt={`${data.name} logo`} />
          <div>{data.name}</div>
          <Stat>{data.listed}</Stat>
          <Stat>{data.daySales}</Stat>
          <Stat>{data.floorPrice} SEI</Stat>
        </CollectionRow>
      ))}
    </LeaderboardContainer>
  );
};

export default Leaderboard;