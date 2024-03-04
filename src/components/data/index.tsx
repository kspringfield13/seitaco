import React, { useEffect, useState } from 'react';
import FloorPriceChart from '../floor'; // Assume this is your modified FloorPrice component
import VolumeChart from '../volume';
import StatsContainer from '../stats';
import DoubleChart from '../doublechart'; // This will be your Volume chart component
import * as C from "./style"

interface ChartDataContainerProps {
  collectionSlug: string; // Define the prop type
}

const cleanSlug = (slug: string) => {
  return slug.toLowerCase().replace(/[^a-z_]/g, '');
};

const ChartDataContainer: React.FC<ChartDataContainerProps> = ({ collectionSlug }) => {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const cleanedSlug = cleanSlug(collectionSlug);
      const cacheKey = `chartData-${cleanedSlug}`;
      const cached = localStorage.getItem(cacheKey);
      const now = new Date();

      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const cachedTime = new Date(timestamp);
        const differenceInMinutes = (now.getTime() - cachedTime.getTime()) / (1000 * 60);

        if (differenceInMinutes < 2) {
          // Use cached data if it's less than 3 minutes old
          setChartData(data);
          return;
        }
        // If cached data is older than 3 minutes, fetch new data
      }

      const cacheBuster = now.getTime();
      const serverUrl = `https://seitaco-server-1d85377b001f.herokuapp.com/get-data?collectionSlug=${encodeURIComponent(cleanedSlug)}&_=${cacheBuster}`;

      try {
        console.log('Requesting URL:', serverUrl);
        const response = await fetch(serverUrl, { cache: "no-store" });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Received data:', data);
        setChartData(data);
        localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: now }));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [collectionSlug]);

  // Assuming the latest row is the last item in the array
  const latestRow = chartData[chartData.length - 1];

  return (
    <>
      <StatsContainer data={latestRow}/>
      <C.ChartsContainer>
        <C.ChartWrapper>
          <FloorPriceChart data={chartData} chartId="floorPriceChart" chartTitle="Floor Price" label="Floor Price" />
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
};

export default ChartDataContainer;