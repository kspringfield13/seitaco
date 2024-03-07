import { useState, useEffect } from 'react';

interface NftsBySlug {
  [key: string]: NFT[];
}

interface NFT {
    id: string;
    price: number;
    slug: string;
    image_url?: string;
}

interface LeaderboardItem {
    slug: string;
    name: string;
    listedNfts?: NFT[]; // An array of NFT objects, optional
    // Include other relevant properties as necessary
}

interface ListedNftsResponseItem {
  slug: string;
  listedNfts: NFT[];
}

const useFetchLeaderboardData = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboardAndListedNFTs = async () => {
      setIsLoading(true);
      setError(null);
      const cacheKey = 'leaderboardDataCache';
      const cached = localStorage.getItem(cacheKey);
      const now = new Date().getTime();
      const isMobileDevice = window.innerWidth < 768;

      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (data && now - timestamp < 240000) { // Cache validity 4 minutes
          setLeaderboardData(data);
          setIsLoading(false);
          return;
        }
      }

      try {
        const leaderboardUrl = `https://seitaco-server-1d85377b001f.herokuapp.com/get-leaderboard`;
        const leaderboardResponse = await fetch(leaderboardUrl, { cache: "no-store" });
        if (!leaderboardResponse.ok) throw new Error('Failed to fetch leaderboard data');
        let leaderboardData = await leaderboardResponse.json();

        let nftsBySlug: NftsBySlug = {};

        if (window.innerWidth >= 768) {
          const listedNftsUrl = `https://seitaco-server-1d85377b001f.herokuapp.com/get-listed`;
          const listedNftsResponse = await fetch(listedNftsUrl, { cache: "no-store" });
          if (!listedNftsResponse.ok) throw new Error('Failed to fetch listed NFTs');
          const allListedNfts = await listedNftsResponse.json();

          nftsBySlug = allListedNfts.reduce((acc: NftsBySlug, nft: NFT) => {
            acc[nft.slug] = [...(acc[nft.slug] || []), nft];
            return acc;
          }, {});
        }

        const processedLeaderboardData = leaderboardData.map((item: LeaderboardItem) => {
          const matchedNfts = nftsBySlug[item.slug] || [];
          return { ...item, listedNfts: matchedNfts };
        });

        setLeaderboardData(processedLeaderboardData);
        localStorage.setItem(cacheKey, JSON.stringify({ data: processedLeaderboardData, timestamp: now }));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboardAndListedNFTs();
  }, []);

  return { leaderboardData, isLoading, error };
};

export default useFetchLeaderboardData;