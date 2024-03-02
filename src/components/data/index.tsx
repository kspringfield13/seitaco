import React, { useEffect, useState } from 'react';
import FloorPriceChart from '../floor'; // Assume this is your modified FloorPrice component
import VolumeChart from '../volume';
import StatsContainer from '../stats';
import DoubleChart from '../doublechart'; // This will be your Volume chart component
import * as C from "./style"

interface ChartDataContainerProps {
  collectionSlug: string; // Define the prop type
}

const ChartDataContainer: React.FC<ChartDataContainerProps> = ({ collectionSlug }) => {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Update serverUrl to use query parameters for collectionSlug
      const cacheBuster = new Date().getTime();
      const serverUrl = `https://seitaco-server-1d85377b001f.herokuapp.com/get-data?collectionSlug=${encodeURIComponent(collectionSlug)}&_=${cacheBuster}`;
      try {
        console.log('Requesting URL:', serverUrl);
        const response = await fetch(serverUrl, { cache: "no-store" });
        const data = await response.json();
        console.log('Received data:', data);
        setChartData(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, [collectionSlug]); // React to changes in collectionSlug

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