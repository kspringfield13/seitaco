// Leaderboard.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
  background-image: linear-gradient(to top, #000000, #191919);
  cursor: pointer;

  &:hover {
    background-color: #064133;
  }

  @media (max-width: 768px) {
    padding-left: 7px;
    font-size: 14px;
    grid-template-columns: 20px 40px auto;
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
    font-size: 12px;
    padding: 2px;
  }
`;

const LogoImage = styled.img`
  grid-area: logo;
  width: 75px; // Adjust width as needed
  height: 75px; // Adjust height as needed
  border-radius: 20%;
  margin-left: 5px;
  @media (max-width: 768px) {
    margin-left: 0px;
    width: 42px;
    height: 42px;
  }
`;

const Name = styled.div`
  grid-area: name;
  font-size: 24px; // Adjust font size as needed
  font-weight: bold;
  color: #FFF;
  padding-left: 5px;

  @media (max-width: 768px) {
    // Adjust for mobile view
    font-size: 11px;
    padding: 5px;
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
  font-size: 20px; // Adjust font size as needed
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
  @media (max-width: 768px) {
    font-size: 0.8em;
  }
`;

const DataValue = styled.span`
  font-weight: bold;
  font-size: 1.0em;
  color: #FFF;
  @media (max-width: 768px) {
    font-size: 0.9em;
  }
`;

const changeText = styled.div`
  font-size: 16px;
  @media (max-width: 768px) {
    font-size: 10px;
  }
`;

const NFTContainer = styled.div`
  display: grid;
  gap: 10px;
  justify-content: center;
  grid-template-columns: repeat(10, 1fr);
  padding-left: 250px;

  @media (max-width: 1500px) {
    display: none;
  }

  /* Optionally hide on smaller screens */
  @media (max-width: 767px) {
    display: none;
  }
`;

const NFTDisplay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  margin-top: -35px;
  margin-bottom: -75px;
`;

const NFTImage = styled.img`
  width: 70px;
  height: 70px;
  border-radius: 50%; /* Circle overlay */
  object-fit: cover;
`;

const NFTLabel = styled.div`
  color: #FFF;
  margin-top: -5px;
  font-size: 12px; /* Adjust font size as needed */
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
  listedNfts?: NFT[];
}

interface LeaderboardProps {
  onSelectCollection: (slug: string) => void;
}

interface LeaderboardItem {
  slug: string;
  name: string;
  listedNfts?: NFT[]; // An array of NFT objects, optional
  // Include other relevant properties as necessary
}

interface NFT {
  id: string;
  price: number;
  slug: string;
  image_url?: string;
}

const cleanSlug = (slug: string) => {
  return slug.toLowerCase().replace(/[^a-z_]/g, '');
};

const Leaderboard: React.FC<LeaderboardProps> = ({ onSelectCollection }) => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData[]>([]);

  // Cache structure
  let cache = {
    data: null as LeaderboardData[] | null,
    timestamp: 0, // Epoch time in milliseconds
  };

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      const cleanedSlug = cleanSlug("cryptomonos");

      const leaderboardUrl = `https://seitaco-server-1d85377b001f.herokuapp.com/get-leaderboard`;
      const listedNftsUrl = `https://seitaco-server-1d85377b001f.herokuapp.com/get-listed?collectionSlug=${encodeURIComponent(cleanedSlug)}`; // New URL for fetching listed NFTs
      const cacheKey = 'leaderboardDataCache'; // Key for localStorage
      const cached = localStorage.getItem(cacheKey);
      const now = new Date().getTime();
  
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
  
        // Use cached data if it's less than 2 minutes old
        if (data && now - timestamp < 120000) {
          setLeaderboardData(data);
          return;
        }
      }
  
      try {
        // Fetch both datasets concurrently
        const responses = await Promise.all([
          fetch(leaderboardUrl),
          fetch(listedNftsUrl),
        ]);
  
        if (!responses[0].ok || !responses[1].ok) {
          throw new Error('Network response was not ok');
        }
  
        const leaderboardData = await responses[0].json();
        const listedNftsData = await responses[1].json();
  
        const mergedData = leaderboardData.map((leaderboardItem: LeaderboardItem) => {
          const matchingListedNfts: NFT[] = listedNftsData.filter((nft: NFT) => nft.slug === leaderboardItem.slug);
          return {
            ...leaderboardItem,
            listedNfts: matchingListedNfts, // Adds the listed NFTs to the corresponding leaderboard item
          };
        });
  
        setLeaderboardData(mergedData);
  
        // Update cache in localStorage
        localStorage.setItem(cacheKey, JSON.stringify({ data: mergedData, timestamp: now }));
      } catch (error) {
        console.error('Error fetching data:', error);
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
        <span style={{ color: changeColor, fontSize: 12 }}>{changeDirection} {Math.abs(percentageChange).toFixed(1)}%</span>
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
        <Name>
          {data.name}
          <NFTContainer>
          {data.listedNfts && data.listedNfts.map((nft, nftIndex) => (
            <NFTDisplay key={nftIndex} onClick={(e) => e.stopPropagation()}>
              <a href={`https://pallet.exchange/collection/cryptomonos/${nft.id}`} target="_blank" rel="noopener noreferrer">
                <NFTImage src={nft.image_url} alt={`NFT ${nft.id}`} />
              </a>
              <NFTLabel>{nft.price} SEI</NFTLabel>
            </NFTDisplay>
          ))}
          </NFTContainer>
        </Name>
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