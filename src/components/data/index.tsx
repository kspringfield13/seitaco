import React, { useEffect, useState } from 'react';
import { CollectionDetailsType, collectionMapping } from '../../utils/helpers';
import FloorPriceChart from '../floor'; // Assume this is your modified FloorPrice component
import VolumeChart from '../volume';
import StatsContainer from '../stats';
import DoubleChart from '../doublechart'; // This will be your Volume chart component
import * as C from "./style"

interface CollectionDetailsProps {
  slug: string;
}

interface ChartDataContainerProps {
  collectionSlug: string; // Define the prop type
}


const cleanSlug = (slug: string) => {
  return slug.toLowerCase().replace(/[^a-z_]/g, '');
};

const useChartData = (collectionSlug: string) => {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const cleanedSlug = cleanSlug(collectionSlug);
      const cacheKey = `chartData-${cleanedSlug}`;
      const cached = localStorage.getItem(cacheKey);
      const now = new Date().getTime(); // Use getTime() for consistency
  
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
  
        // Check if the cached data is less than 2 minutes old
        if (now - timestamp < 120000) { // 120000 milliseconds = 2 minutes
          setChartData(data);
          return; // Use cached data and return early
        }
        // If the cached data is older than 2 minutes, proceed to fetch new data
      }
  
      // Append a cache buster to the URL to prevent caching at the HTTP level
      const cacheBuster = now;
      const serverUrl = `https://seitaco-server-1d85377b001f.herokuapp.com/get-data?collectionSlug=${encodeURIComponent(cleanedSlug)}&_=${cacheBuster}`;
  
      try {
        console.log('Requesting URL:', serverUrl); // Consider removing console logs for production
        const response = await fetch(serverUrl, { cache: "no-store" });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Received data:', data); // Consider removing console logs for production
        setChartData(data);
  
        // Update the cache with the new data and current timestamp
        localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: now }));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, [collectionSlug]);

  return chartData;
};

// ChartDataContainer component
const ChartDataContainer: React.FC<ChartDataContainerProps> = ({ collectionSlug }) => {
  const chartData = useChartData(collectionSlug);
  const collectionDetails: CollectionDetailsType | undefined = collectionMapping[collectionSlug];

  if (!collectionDetails || !chartData.length) {
    return <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh', // This assumes the parent container allows for 100% height usage
      width: '100vw',
      fontSize: '20px', // Optional: Adjust the font size as needed
      color: '#555' // Optional: Adjust the color as needed
  }}>
      Loading...
  </div>; // You might want to handle loading state
  }

  // Assuming the latest row is the last item in the array
  const latestRow = chartData[chartData.length - 1];

  return (
    <>
      <StatsContainer data={latestRow}/>
      <C.ChartsContainer>
        <C.ChartWrapper>
          <FloorPriceChart data={chartData} mintPrice={collectionDetails.mintPrice} chartId="floorPriceChart" chartTitle="Floor Price" label="Floor Price" />
        </C.ChartWrapper>
        <C.ChartWrapper>
          <VolumeChart data={chartData} chartId="volumeChart" chartTitle="Volume" label="Volume" />
        </C.ChartWrapper>
      </C.ChartsContainer>
      <C.ChartsContainerFull>
        <C.ChartWrapperFull>
          <DoubleChart data={chartData} chartId="doubleChart"/>
        </C.ChartWrapperFull>
      </C.ChartsContainerFull>
    </>
  );
}

export default ChartDataContainer;